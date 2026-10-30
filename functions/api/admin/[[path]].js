import {editor, mutationAllowed, ConfigError} from '../../../server/auth.js';
import {
  idPattern,
  filePattern,
  cleanDraft,
  rowRecord,
  publishErrors,
  change,
  imageType,
  photoMaxBytes,
  photoHistoryLimit,
  ListingInputError
} from '../../../server/listings.js';
const json = (data, status = 200) =>
  Response.json(data, {status, headers: {'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'}});
export async function onRequest({request, env}) {
  let actor;
  try {
    actor = await editor(request, env);
  } catch (error) {
    if (error instanceof ConfigError) {
      console.error('Editor authentication is not configured');
      return json({error: 'The listing studio is not configured. Contact the developer.'}, 503);
    }
    return json({error: 'Sign in to the listing studio.'}, 401);
  }
  if (!['GET', 'HEAD'].includes(request.method) && !mutationAllowed(request))
    return json({error: 'Same-origin request required'}, 403);
  if (!env.DB || !env.PHOTOS) return json({error: 'Cloud storage unavailable'}, 503);
  const path = new URL(request.url).pathname.split('/').filter(Boolean).slice(2);
  // Reject unknown shapes before any storage access or mutation.
  const actionMethods = {
    history: ['GET'],
    save: ['POST'],
    publish: ['POST'],
    unpublish: ['POST'],
    archive: ['POST'],
    restore: ['POST']
  };
  let methods;
  if (path.length === 1 && path[0] === 'session') methods = ['GET', 'HEAD'];
  else if (path[0] === 'listings') {
    if (path.length === 1) methods = ['GET', 'POST'];
    else if (idPattern.test(path[1] || '')) {
      if (path.length === 2) methods = ['GET', 'POST'];
      else if (path.length === 3 && Object.hasOwn(actionMethods, path[2])) methods = actionMethods[path[2]];
      else if (path.length === 4 && path[2] === 'photos' && filePattern.test(path[3] || '')) methods = ['GET', 'PUT'];
    }
  }
  if (!methods) return json({error: 'Not found'}, 404);
  if (!methods.includes(request.method))
    return new Response(JSON.stringify({error: 'Method not allowed'}), {
      status: 405,
      headers: {'Content-Type': 'application/json', 'Cache-Control': 'no-store', Allow: methods.join(', ')}
    });
  if (path[0] === 'session' && request.method === 'HEAD')
    return new Response(null, {headers: {'Content-Type': 'application/json', 'Cache-Control': 'no-store'}});
  try {
    if (path[0] === 'session') return json({email: actor});
    if (path[0] !== 'listings') return json({error: 'Not found'}, 404);
    const id = path[1];
    if (!id && request.method === 'GET') {
      const archived = new URL(request.url).searchParams.get('archived') === '1';
      const rows = await env.DB.prepare('SELECT * FROM listings WHERE archived=? ORDER BY updated_at DESC LIMIT 201')
        .bind(archived ? 1 : 0)
        .all();
      const counts = await env.DB.prepare(
        'SELECT count(*) AS total,coalesce(sum(archived=1),0) AS archived,coalesce(sum(archived=0 AND published_json IS NULL),0) AS drafts,coalesce(sum(archived=0 AND published_json IS NOT NULL),0) AS published FROM listings'
      ).first();
      const hasMore = rows.results.length > 200;
      return json({listings: rows.results.slice(0, 200).map(rowRecord), counts, hasMore});
    }
    if (!id && request.method === 'POST') {
      const input = await body(request),
        listing = cleanDraft(input.listing),
        newId = crypto.randomUUID(),
        now = new Date().toISOString();
      await env.DB.prepare('INSERT INTO listings(id,draft_json,updated_at,updated_by) VALUES(?,?,?,?)')
        .bind(newId, JSON.stringify(listing), now, actor)
        .run();
      return json({id: newId, revision: 1, listing, published: false, savedAt: now}, 201);
    }
    if (!idPattern.test(id || '')) return json({error: 'Not found'}, 404);
    const row = await env.DB.prepare('SELECT * FROM listings WHERE id=?').bind(id).first();
    if (!row) return json({error: 'Not found'}, 404);
    if (path[2] === 'history' && request.method === 'GET') {
      const events = await env.DB.prepare(
        'SELECT action,revision,actor,happened_at FROM listing_events WHERE listing_id=? ORDER BY id DESC LIMIT 20'
      )
        .bind(id)
        .all();
      return json({events: events.results});
    }
    if (path[2] === 'photos') {
      const file = path[3];
      if (!filePattern.test(file || '')) return json({error: 'Invalid photo name'}, 400);
      const key = id + '/' + file;
      if (request.method === 'GET') {
        const photo = await env.PHOTOS.get(key);
        if (!photo) return json({error: 'Not found'}, 404);
        return new Response(photo.body, {
          headers: {
            'Content-Type': photo.httpMetadata.contentType,
            'Cache-Control': 'private, no-store',
            'X-Content-Type-Options': 'nosniff'
          }
        });
      }
      if (row.archived) return json({error: 'Restore the archived draft before adding photos'}, 409);
      if (request.method !== 'PUT') return json({error: 'Method not allowed'}, 405);
      const existing = await env.DB.prepare('SELECT key FROM photos WHERE key=?').bind(key).first();
      if (existing) return json({error: 'Photo names are immutable. Add the photo with a new name.'}, 409);
      const bytes = await readLimited(request, photoMaxBytes);
      if (!bytes) return json({error: 'Photo must be under 400 KB'}, 413);
      const type = imageType(bytes),
        expected = file.endsWith('.jpg') ? 'image/jpeg' : file.endsWith('.png') ? 'image/png' : 'image/webp';
      if (type !== expected || request.headers.get('content-type') !== type)
        return json({error: 'Invalid image file'}, 400);
      // Reserve the name and enforce the history cap in one atomic statement, then store the bytes.
      const reserved = await env.DB.prepare(
        'INSERT INTO photos(key,listing_id,content_type,bytes,uploaded_at) SELECT ?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM photos WHERE key=?) AND (SELECT count(*) FROM photos WHERE listing_id=?)<?'
      )
        .bind(key, id, type, bytes.byteLength, new Date().toISOString(), key, id, photoHistoryLimit)
        .run();
      if (reserved.meta.changes !== 1) {
        const taken = await env.DB.prepare('SELECT key FROM photos WHERE key=?').bind(key).first();
        return taken
          ? json({error: 'Photo names are immutable. Add the photo with a new name.'}, 409)
          : json({error: 'Photo history limit reached. Contact the developer.'}, 400);
      }
      try {
        await env.PHOTOS.put(key, bytes, {httpMetadata: {contentType: type}});
      } catch (error) {
        await env.DB.prepare('DELETE FROM photos WHERE key=?')
          .bind(key)
          .run()
          .catch(() => {});
        throw error;
      }
      return json({file});
    }
    if (request.method === 'GET') return json(rowRecord(row));
    if (request.method !== 'POST') return json({error: 'Method not allowed'}, 405);
    const input = await body(request),
      revision = input.revision;
    if (!Number.isInteger(revision) || revision !== row.revision)
      return json({error: 'This listing changed in another session. Reload it before saving.'}, 409);
    const action = path[2] || 'save';
    if (!['save', 'publish', 'unpublish', 'archive', 'restore'].includes(action))
      return json({error: 'Not found'}, 404);
    if (Boolean(row.archived) !== (action === 'restore'))
      return json(
        {error: row.archived ? 'Restore the archived draft before editing' : 'This listing is not archived'},
        409
      );
    const listing = action === 'save' ? cleanDraft(input.listing) : JSON.parse(row.draft_json);
    if (action === 'publish') {
      const errors = await publishErrors(listing, id, env);
      if (errors.length) return json({error: errors.join('. ')}, 400);
    }
    let changed;
    try {
      changed = await change(env, id, revision, actor, action, listing);
    } catch (error) {
      if (String(error).includes('UNIQUE'))
        return json({error: 'Another published listing already uses this page slug.'}, 409);
      throw error;
    }
    if (!changed) return json({error: 'Listing changed. Reload before saving.'}, 409);
    if (action === 'archive') return json({archived: true});
    return json(rowRecord(await env.DB.prepare('SELECT * FROM listings WHERE id=?').bind(id).first()));
  } catch (error) {
    if (error instanceof RangeError) return json({error: 'Request too large'}, 413);
    if (error instanceof ListingInputError || error instanceof SyntaxError)
      return json({error: 'Unable to process the listing. Check the details and try again.'}, 400);
    // Storage and unexpected failures are not the editor's mistake: report 500 and log the cause.
    console.error('Listing operation failed', error?.name, error?.message);
    return json({error: 'The listing service had a problem. Your entries were not lost; try again shortly.'}, 500);
  }
}
async function body(request) {
  const bytes = await readLimited(request, 40001);
  if (!bytes) throw new RangeError();
  const input = JSON.parse(new TextDecoder().decode(bytes));
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new ListingInputError('Expected an object');
  return input;
}
// Reads at most limit-1 bytes; returns null when the body is that large or larger.
async function readLimited(request, limit) {
  if (Number(request.headers.get('content-length')) >= limit) return null;
  if (!request.body) return new ArrayBuffer(0);
  const reader = request.body.getReader(),
    chunks = [];
  let total = 0;
  for (;;) {
    const {done, value} = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total >= limit) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out.buffer;
}
