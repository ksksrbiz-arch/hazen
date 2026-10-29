import {test} from 'node:test';
import assert from 'node:assert/strict';
import {galleryResponse, bradMlsNumbers} from '../server/ylopo-gallery.js';
import {onRequest} from '../functions/_middleware.js';
import {securityHeaders} from '../server/response-security.js';
test('selected MLS gallery is isolated from the site and private editor policy', async () => {
  assert.deepEqual(bradMlsNumbers, ['24202394', '24434415']);
  const response = await onRequest({request: new Request('https://qa.example/listing-widget/')});
  const html = await response.text();
  assert.ok(html.includes(JSON.stringify({mlsId: bradMlsNumbers, limit: 6})));
  assert.ok(!html.includes('agentId') && !html.includes('featured'));
  assert.ok(html.includes('openInNewTab:true'));
  assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN');
  assert.ok(response.headers.get('content-security-policy').includes("frame-ancestors 'self'"));
  assert.ok(!securityHeaders['Content-Security-Policy'].includes('unsafe-inline'));
  assert.equal(securityHeaders['X-Frame-Options'], 'DENY');
  assert.equal(galleryResponse().status, 200);
});
