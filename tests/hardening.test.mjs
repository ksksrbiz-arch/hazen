import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync, readdirSync} from 'node:fs';
import {generateKeyPair, SignJWT, exportJWK} from 'jose';
import {cleanDraft, publishErrors, ListingInputError, photoMaxBytes} from '../server/listings.js';
import {published} from '../server/public.js';
import {editor, ConfigError} from '../server/auth.js';
import {photoLimits} from '../src/photo-preparation.js';
import {onRequest} from '../functions/api/admin/[[path]].js';
function db() {
  const sqlite = new DatabaseSync(':memory:');
  for (const name of readdirSync('database/cloudflare').sort())
    sqlite.exec(readFileSync('database/cloudflare/' + name, 'utf8'));
  const prepare = sql => {
    let params = [];
    const stmt = {
      bind(...args) {
        params = args;
        return stmt;
      },
      async first() {
        return sqlite.prepare(sql).get(...params) || null;
      },
      async all() {
        return {results: sqlite.prepare(sql).all(...params)};
      },
      async run() {
        return {meta: sqlite.prepare(sql).run(...params)};
      }
    };
    return stmt;
  };
  return {
    prepare,
    sqlite,
    async batch(statements) {
      const results = [];
      for (const s of statements) results.push(await s.run());
      return results;
    }
  };
}
const id = '8caa1a53-05bd-4212-9c9c-a487cc334550',
  file = n => `listing-8caa1a53-05bd-4212-9c9c-a487cc3345${String(n).padStart(2, '0')}.jpg`;
const base = {
  slug: 'a',
  title: 't',
  address: 'a',
  price: 1,
  status: 'Active',
  description: 'd',
  attribution: 'b',
  permissionNote: 'n',
  updatedAt: '2026-10-10',
  images: []
};
test('Server and browser share one photo size limit', () => {
  assert.equal(photoLimits.outputBytes, photoMaxBytes);
});
test('Draft fields are type-checked when saved', () => {
  for (const bad of [{price: 'abc'}, {beds: '3'}, {featured: 'yes'}, {title: 5}, {lotAcres: Infinity}])
    assert.throws(() => cleanDraft({...base, ...bad}), ListingInputError);
  assert.throws(() => cleanDraft({...base, images: [null]}), ListingInputError);
  assert.equal(cleanDraft({...base, price: null, beds: 2, featured: false}).price, null);
});
test('Missing Access configuration is distinguishable from a sign-in failure', async () => {
  await assert.rejects(editor(new Request('https://x.example/'), {}), ConfigError);
  await assert.rejects(
    editor(new Request('https://x.example/'), {
      ACCESS_AUD: 'a',
      ACCESS_TEAM_DOMAIN: 'https://t.example',
      EDITOR_EMAILS: 'e@x.example'
    }),
    error => !(error instanceof ConfigError)
  );
  assert.equal((await onRequest({request: new Request('https://x.example/api/admin/session'), env: {}})).status, 503);
});
test('Publish checks verify every photo with one registration query', async () => {
  const DB = db();
  DB.sqlite.exec("INSERT INTO listings(id,draft_json,updated_at,updated_by) VALUES('" + id + "','{}','n','e')");
  for (const n of [1, 2]) DB.sqlite.exec(`INSERT INTO photos VALUES('${id}/${file(n)}','${id}','image/jpeg',1,'n')`);
  let queries = 0;
  const counting = {
    prepare: sql => {
      queries++;
      return DB.prepare(sql);
    }
  };
  const heads = [];
  const PHOTOS = {
    head: async key => {
      heads.push(key);
      return {};
    }
  };
  const item = {...base, images: [1, 2].map(n => ({file: file(n), alt: 'x'}))};
  assert.deepEqual(await publishErrors(item, id, {DB: counting, PHOTOS}), []);
  assert.equal(queries, 1);
  assert.equal(heads.length, 2);
  const missing = {...item, images: [...item.images, {file: file(3), alt: 'x'}]};
  assert.ok((await publishErrors(missing, id, {DB, PHOTOS})).includes('Save all listing photos before publishing'));
  assert.ok(
    (await publishErrors(item, id, {DB, PHOTOS: {head: async () => null}})).includes(
      'Save all listing photos before publishing'
    )
  );
});
test('One unreadable published snapshot does not hide other listings', async () => {
  const DB = db(),
    good = JSON.stringify({...base, images: [{file: file(1), alt: 'x'}]});
  for (const [n, json] of [
    [1, good],
    [2, '{"slug":"y"}'],
    [3, '{"slug":"x","images":[]}']
  ])
    await DB.prepare('INSERT INTO listings(id,draft_json,published_json,updated_at,updated_by) VALUES(?,?,?,?,?)')
      .bind('8caa1a53-05bd-4212-9c9c-a487cc33455' + n, '{}', json, 'n', 'e')
      .run();
  const originalError = console.error;
  console.error = () => {};
  try {
    const items = await published({DB});
    assert.equal(items.length, 1);
  } finally {
    console.error = originalError;
  }
});
test('Photo uploads: atomic name and cap, bounded reads, rollback and honest failures', async () => {
  const {privateKey, publicKey} = await generateKeyPair('RS256');
  const jwk = await exportJWK(publicKey);
  jwk.kid = 'h';
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({keys: [jwk]});
  const DB = db(),
    objects = new Map();
  let failPut = false;
  const env = {
    DB,
    PHOTOS: {
      async put(key, bytes, o) {
        if (failPut) throw Error('r2 down');
        objects.set(key, bytes);
      },
      async head(key) {
        return objects.get(key) || null;
      }
    },
    ACCESS_TEAM_DOMAIN: 'https://h.example',
    ACCESS_AUD: 'h',
    EDITOR_EMAILS: 'editor@example.com'
  };
  const originalError = console.error;
  console.error = () => {};
  try {
    const token = await new SignJWT({email: 'editor@example.com'})
      .setProtectedHeader({alg: 'RS256', kid: 'h'})
      .setSubject('q')
      .setIssuer(env.ACCESS_TEAM_DOMAIN)
      .setAudience('h')
      .setExpirationTime('5m')
      .sign(privateKey);
    const call = (path, method, body, headers = {}) =>
      onRequest({
        env,
        request: new Request('https://h.example/api/admin/' + path, {
          method,
          headers: {
            'cf-access-jwt-assertion': token,
            origin: 'https://h.example',
            'content-type': 'application/json',
            ...headers
          },
          body
        })
      });
    DB.sqlite.exec("INSERT INTO listings(id,draft_json,updated_at,updated_by) VALUES('" + id + "','{}','n','e')");
    const jpeg = new Uint8Array([255, 216, 255, 1]);
    // Streamed body with no usable Content-Length is still bounded.
    const big = new Uint8Array(photoMaxBytes);
    big.set([255, 216, 255]);
    assert.equal(
      (await call(`listings/${id}/photos/${file(1)}`, 'PUT', big, {'content-type': 'image/jpeg'})).status,
      413
    );
    assert.equal(objects.size, 0);
    // R2 failure rolls back the reservation and reports a server error.
    failPut = true;
    assert.equal(
      (await call(`listings/${id}/photos/${file(1)}`, 'PUT', jpeg, {'content-type': 'image/jpeg'})).status,
      500
    );
    failPut = false;
    assert.equal(DB.sqlite.prepare('SELECT count(*) AS n FROM photos').get().n, 0);
    assert.equal(
      (await call(`listings/${id}/photos/${file(1)}`, 'PUT', jpeg, {'content-type': 'image/jpeg'})).status,
      200
    );
    // The history cap is enforced inside the insert.
    for (let n = 2; n <= 200; n++)
      DB.sqlite.exec(`INSERT INTO photos VALUES('${id}/${file(100 + n)}','${id}','image/jpeg',1,'n')`);
    const capped = await call(`listings/${id}/photos/${file(2)}`, 'PUT', jpeg, {'content-type': 'image/jpeg'});
    assert.equal(capped.status, 400);
    assert.match((await capped.json()).error, /limit/);
    // Infrastructure failures are 500, not "check your details".
    env.DB = {
      ...DB,
      prepare: () => {
        throw Error('d1 down');
      }
    };
    assert.equal((await call('listings', 'GET')).status, 500);
    env.DB = DB;
    assert.equal((await call('listings', 'POST', '{bad json')).status, 400);
  } finally {
    console.error = originalError;
    globalThis.fetch = originalFetch;
  }
});
test('Library list reports when more than 200 listings exist', async () => {
  const {privateKey, publicKey} = await generateKeyPair('RS256');
  const jwk = await exportJWK(publicKey);
  jwk.kid = 'h';
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({keys: [jwk]});
  try {
    const DB = db();
    for (let n = 0; n < 201; n++)
      DB.sqlite.exec(`INSERT INTO listings(id,draft_json,updated_at,updated_by) VALUES('l${n}','{}','n','e')`);
    const env = {
      DB,
      PHOTOS: {},
      ACCESS_TEAM_DOMAIN: 'https://l.example',
      ACCESS_AUD: 'l',
      EDITOR_EMAILS: 'editor@example.com'
    };
    const token = await new SignJWT({email: 'editor@example.com'})
      .setProtectedHeader({alg: 'RS256', kid: 'h'})
      .setSubject('q')
      .setIssuer(env.ACCESS_TEAM_DOMAIN)
      .setAudience('l')
      .setExpirationTime('5m')
      .sign(privateKey);
    const data = await (
      await onRequest({
        env,
        request: new Request('https://l.example/api/admin/listings', {headers: {'cf-access-jwt-assertion': token}})
      })
    ).json();
    assert.equal(data.listings.length, 200);
    assert.equal(data.hasMore, true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
test('Admin JSON streams and route shapes reject safely before mutations', async () => {
  const {privateKey, publicKey} = await generateKeyPair('RS256');
  const jwk = await exportJWK(publicKey);
  jwk.kid = 'bounded';
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({keys: [jwk]});
  const DB = db();
  const env = {
    DB,
    PHOTOS: {},
    ACCESS_TEAM_DOMAIN: 'https://bounded.example',
    ACCESS_AUD: 'bounded',
    EDITOR_EMAILS: 'editor@example.com'
  };
  try {
    const token = await new SignJWT({email: 'editor@example.com'})
      .setProtectedHeader({alg: 'RS256', kid: 'bounded'})
      .setSubject('q')
      .setIssuer(env.ACCESS_TEAM_DOMAIN)
      .setAudience('bounded')
      .setExpirationTime('5m')
      .sign(privateKey);
    const call = (path, method = 'GET', body) =>
      onRequest({
        env,
        request: new Request('https://bounded.example/api/admin/' + path, {
          method,
          headers: {
            'cf-access-jwt-assertion': token,
            origin: 'https://bounded.example',
            'content-type': 'application/json'
          },
          body,
          ...(body instanceof ReadableStream ? {duplex: 'half'} : {})
        })
      });
    const created = await call('listings', 'POST', JSON.stringify({listing: base}));
    assert.equal(created.status, 201);
    const {id: recordId} = await created.json();
    const snapshot = () =>
      JSON.stringify({
        rows: DB.sqlite.prepare('SELECT * FROM listings').all(),
        events: DB.sqlite.prepare('SELECT * FROM listing_events').all()
      });
    const before = snapshot();
    for (const input of ['null', '[]', '42', '"text"', '{bad'])
      assert.equal((await call('listings', 'POST', input)).status, 400);
    // Byte limit, not JS character count; no Content-Length is supplied.
    assert.equal((await call('listings', 'POST', JSON.stringify({padding: 'é'.repeat(21000)}))).status, 413);
    let cancelled = false,
      pulls = 0;
    const stream = new ReadableStream({
      pull(controller) {
        pulls++;
        controller.enqueue(new Uint8Array(10000));
      },
      cancel() {
        cancelled = true;
      }
    });
    assert.equal((await call('listings', 'POST', stream)).status, 413);
    assert.equal(cancelled, true);
    assert.ok(pulls <= 6, 'stop reading at the limit, allowing one queued chunk');
    for (const path of [
      'session/extra',
      `listings/${recordId}/unknown`,
      `listings/${recordId}/photos/${file(1)}/extra`
    ])
      assert.equal((await call(path)).status, 404);
    assert.equal((await call(`listings/${recordId}/archive/extra`, 'POST', '{"revision":1}')).status, 404);
    const wrongMethod = await call(`listings/${recordId}/publish`);
    assert.equal(wrongMethod.status, 405);
    assert.equal(wrongMethod.headers.get('allow'), 'POST');
    assert.equal((await call('session', 'POST', '{}')).status, 405);
    const head = await call('session', 'HEAD');
    assert.equal(head.status, 200);
    assert.equal(await head.text(), '');
    assert.equal(snapshot(), before);
    // A legitimate bounded save still works at exactly 40,000 bytes.
    const payload = JSON.stringify({revision: 1, listing: base});
    assert.equal(
      (await call(`listings/${recordId}/save`, 'POST', payload + ' '.repeat(40000 - Buffer.byteLength(payload))))
        .status,
      200
    );
  } finally {
    globalThis.fetch = originalFetch;
    DB.sqlite.close();
  }
});
