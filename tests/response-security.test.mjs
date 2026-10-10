import test from 'node:test';
import assert from 'node:assert/strict';
import {secureResponse} from '../server/response-security.js';
test('Security headers retain private caching, referrer restrictions, status and body',async()=>{
 const response=secureResponse(new Response('private',{status:401,headers:{'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'}}));
 assert.equal(response.status,401);assert.equal(await response.text(),'private');assert.equal(response.headers.get('cache-control'),'private, no-store');assert.equal(response.headers.get('referrer-policy'),'no-referrer');assert.equal(response.headers.get('x-frame-options'),'DENY');assert.ok(response.headers.get('content-security-policy').includes("img-src 'self' blob:"));assert.ok(!response.headers.get('content-security-policy').includes('unsafe-inline'));
});
