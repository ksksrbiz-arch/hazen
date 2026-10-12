import {idPattern, filePattern} from '../../server/listings.js';
export async function onRequest({request, env}) {
  const fail = (message, status) => new Response(message, {status, headers: {'Cache-Control': 'no-store'}});
  if (request.method !== 'GET' && request.method !== 'HEAD') return fail('Method not allowed', 405);
  const parts = new URL(request.url).pathname.split('/').filter(Boolean),
    id = parts[1],
    file = parts[2];
  if (parts.length !== 3 || !idPattern.test(id || '') || !filePattern.test(file || '')) return fail('Not found', 404);
  if (!env.DB || !env.PHOTOS) return fail('Listing photos are temporarily unavailable.', 503);
  try {
    const row = await env.DB.prepare(
      "SELECT id FROM listings WHERE id=? AND archived=0 AND published_json IS NOT NULL AND EXISTS (SELECT 1 FROM json_each(json_extract(published_json,'$.images')) WHERE json_extract(value,'$.file')=?)"
    )
      .bind(id, file)
      .first();
    if (!row) return fail('Not found', 404);
    // Publication is checked before every conditional read. Never edge-cache media.
    const conditional = new Headers();
    if (request.headers.has('If-None-Match')) conditional.set('If-None-Match', request.headers.get('If-None-Match'));
    const photo =
      request.method === 'HEAD'
        ? await env.PHOTOS.head(id + '/' + file)
        : await env.PHOTOS.get(id + '/' + file, {onlyIf: conditional});
    if (!photo) return fail('Not found', 404);
    const headers = new Headers({
      'Content-Type': photo.httpMetadata.contentType,
      'Cache-Control': 'private, no-cache, max-age=0, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex'
    });
    if (photo.httpEtag) headers.set('ETag', photo.httpEtag);
    if (request.method === 'GET' && !('body' in photo)) return new Response(null, {status: 304, headers});
    if (Number.isFinite(photo.size)) headers.set('Content-Length', String(photo.size));
    return new Response(request.method === 'HEAD' ? null : photo.body, {headers});
  } catch {
    return fail('Listing photos are temporarily unavailable.', 503);
  }
}
