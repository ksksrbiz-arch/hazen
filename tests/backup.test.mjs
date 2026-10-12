import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, writeFile, readFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {backupPhotos, parsePhotoRows, verifyBackup, writeManifest} from '../scripts/backup-lib.mjs';

const id = '8caa1a53-05bd-4212-9c9c-a487cc334550';
const key = n => `${id}/listing-8caa1a53-05bd-4212-9c9c-a487cc3345${String(n).padStart(2, '0')}.jpg`;

test('Photo rows are parsed strictly from wrangler JSON output', () => {
  const output = JSON.stringify([{results: [{key: key(1), bytes: 4}], success: true}]);
  assert.deepEqual(parsePhotoRows(output), [{key: key(1), bytes: 4}]);
  assert.deepEqual(parsePhotoRows('[]'), []);
  for (const bad of [
    {key: '../etc/passwd', bytes: 1},
    {key: key(1), bytes: '4'},
    {key: key(1), bytes: -1}
  ]) {
    assert.throws(() => parsePhotoRows(JSON.stringify([{results: [bad]}])));
  }
});

async function makeBackup({shortFor, failFor} = {}) {
  const outDir = await mkdtemp(path.join(os.tmpdir(), 'hazen-backup-'));
  await writeFile(path.join(outDir, 'database.sql'), 'CREATE TABLE listings(id);');
  const photos = [
    {key: key(1), bytes: 4},
    {key: key(2), bytes: 4}
  ];
  const download = async (photoKey, target) => {
    if (photoKey === failFor) throw new Error('r2 unavailable');
    await writeFile(target, photoKey === shortFor ? 'ab' : 'abcd');
  };
  const {results, problems} = await backupPhotos({photos, outDir, download});
  const manifest = await writeManifest({
    outDir,
    databaseFile: 'database.sql',
    photos: results,
    problems,
    now: new Date('2026-10-12T00:00:00Z')
  });
  return {outDir, manifest};
}

test('A complete backup records hashes and verifies cleanly', async () => {
  const {outDir, manifest} = await makeBackup();
  assert.equal(manifest.complete, true);
  assert.equal(manifest.photoCount, 2);
  assert.equal(manifest.createdAt, '2026-10-12T00:00:00.000Z');
  assert.deepEqual(await verifyBackup(outDir), []);
});

test('Truncated or failed downloads make the backup incomplete instead of silently passing', async () => {
  for (const options of [{shortFor: key(2)}, {failFor: key(2)}]) {
    const {outDir, manifest} = await makeBackup(options);
    assert.equal(manifest.complete, false);
    assert.equal(manifest.problems.length, 1);
    assert.match(manifest.problems[0], new RegExp(key(2)));
    assert.ok((await verifyBackup(outDir)).length > 0);
  }
});

test('Verification detects changed or missing files after the backup was made', async () => {
  const {outDir} = await makeBackup();
  await writeFile(path.join(outDir, 'photos', key(1)), 'XXXX');
  assert.deepEqual(await verifyBackup(outDir), ['Photo missing or changed: ' + key(1)]);
  await writeFile(path.join(outDir, 'database.sql'), 'tampered');
  assert.ok((await verifyBackup(outDir)).includes('Database export missing or changed'));
  assert.ok(JSON.parse(await readFile(path.join(outDir, 'manifest.json'), 'utf8')).complete);
});
