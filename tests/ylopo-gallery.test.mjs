import {test} from 'node:test';
import assert from 'node:assert/strict';
import {galleryResponse, bradGallerySearch} from '../server/ylopo-gallery.js';
import {onRequest} from '../functions/_middleware.js';
import {securityHeaders} from '../server/response-security.js';
test('automatic agent gallery retains all property types and stays isolated from the private editor', async () => {
  assert.equal(bradGallerySearch.agentId, 24820243);
  assert.deepEqual(bradGallerySearch.propertyTypes, []);
  assert.ok(!('mlsId' in bradGallerySearch));
  const response = await onRequest({request: new Request('https://qa.example/listing-widget/')});
  const html = await response.text();
  assert.ok(html.includes(JSON.stringify(bradGallerySearch)));
  assert.ok(html.includes('openInNewTab:true'));
  assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN');
  assert.ok(response.headers.get('content-security-policy').includes("frame-ancestors 'self'"));
  assert.ok(!securityHeaders['Content-Security-Policy'].includes('unsafe-inline'));
  assert.equal(securityHeaders['X-Frame-Options'], 'DENY');
  assert.equal(galleryResponse().status, 200);
});
test('homepage serves the static gallery shell without reading D1', async () => {
  const response = await onRequest({
    request: new Request('https://qa.example/'),
    env: {},
    next: async () => new Response('<main id="brad-mls-listings"></main>', {headers: {'Cache-Control': 'public'}})
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.ok((await response.text()).includes('brad-mls-listings'));
});
test('gallery loading note starts hidden and the no-script text points to the visible fallback links', async () => {
  const {galleryMarkup} = await import('../server/ylopo-gallery.js');
  assert.match(galleryMarkup, /data-gallery-status hidden>/);
  assert.match(galleryMarkup, /<noscript>.*Having trouble viewing the listings\?.*<\/noscript>/);
});
