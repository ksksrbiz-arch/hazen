import test from 'node:test';
import assert from 'node:assert/strict';
import {studioRequest, listingWorkingNotes} from '../src/studio-recovery.js';
test('Studio requests retain successful data and identify authorization and conflicts', async () => {
  assert.deepEqual(await studioRequest('/test', {}, async () => Response.json({revision: 7})), {revision: 7});
  for (const [status, kind] of [
    [401, 'session'],
    [403, 'session'],
    [409, 'conflict']
  ])
    await assert.rejects(
      studioRequest('/test', {}, async () => new Response('', {status})),
      e => e.kind === kind
    );
});
test('Server and parsing failures are not misreported as session expiration', async () => {
  await assert.rejects(
    studioRequest('/test', {}, async () => new Response('Down', {status: 503})),
    e => e.kind === 'server'
  );
  await assert.rejects(
    studioRequest('/test', {}, async () => Response.json({error: 'Photo is too large'}, {status: 400})),
    e => e.kind === 'server' && e.message === 'Photo is too large'
  );
  await assert.rejects(
    studioRequest('/test', {}, async () => ({
      ok: true,
      redirected: true,
      status: 200,
      json: async () => {
        throw Error('HTML');
      }
    })),
    e => e.kind === 'session'
  );
});
test('Lost responses and timed out mutations never retry or claim that nothing saved', async () => {
  let calls = 0;
  await assert.rejects(
    studioRequest('/test', {method: 'POST'}, async () => {
      calls++;
      throw Error('Offline');
    }),
    e => e.kind === 'connection' && e.message.includes('may have completed')
  );
  assert.equal(calls, 1);
  await assert.rejects(
    studioRequest(
      '/test',
      {method: 'POST'},
      async (_url, {signal}) =>
        new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(Error('Timeout')))),
      5
    ),
    e => e.kind === 'connection'
  );
});
test('Working notes preserve incomplete text, zero facts and private notes without unrelated fields', () => {
  const notes = listingWorkingNotes({
    title: 'Incomplete draft',
    price: 0,
    beds: 0,
    description: 'Line one\nLine two',
    permissionNote: 'Internal approval reminder',
    images: [{alt: 'Kitchen', file: 'PRIVATE_MEDIA_PATH'}],
    accessToken: 'SECRET_TOKEN',
    featured: true
  });
  assert.ok(notes.includes('Incomplete draft'));
  assert.ok(notes.includes('Line one\nLine two'));
  assert.ok(notes.includes('Price: 0'));
  assert.ok(notes.includes('Internal approval reminder'));
  assert.ok(notes.includes('Cover: Kitchen'));
  assert.doesNotMatch(notes, /PRIVATE_MEDIA_PATH|SECRET_TOKEN/);
  assert.match(notes, /Photo files are NOT included/);
  assert.match(listingWorkingNotes(), /Not supplied/);
});
