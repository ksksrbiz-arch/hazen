import test from 'node:test';
import assert from 'node:assert/strict';
import {publicRecoveryContent,publicRecoveryResponse,homepageListingFallback} from '../server/public-recovery.js';
test('Recovery states offer direct navigation and never echo arbitrary URLs or private details',()=>{
 const html=publicRecoveryContent('<script>private-request-path</script>');
 assert.doesNotMatch(html,/<script|private-request-path/);assert.ok(html.includes('Page not found'));assert.equal((html.match(/<h1/g)||[]).length,1);
 for(const href of ['/buy/','/sell/','/resources/','/contact/#inquiry','tel:+13609219484'])assert.ok(html.includes(href));
 assert.ok(publicRecoveryContent('property').includes('Property page unavailable'));assert.ok(homepageListingFallback().includes('could not load'));
});
test('Unstyled fallback retains truthful statuses and useful links if assets fail',async()=>{
 for(const [kind,status] of [['property',404],['listings',503]]){
  const response=await publicRecoveryResponse({request:new Request('https://preview.invalid/properties/private-path/'),env:{ASSETS:{fetch:async()=>{throw Error('Unavailable');}}}},kind);
  assert.equal(response.status,status);assert.equal(response.headers.get('cache-control'),'no-store');assert.ok(response.headers.get('content-type').includes('text/html'));assert.equal(response.headers.get('x-robots-tag'),'noindex, nofollow');
  const html=await response.text();assert.ok(html.includes('tel:+13609219484'));assert.doesNotMatch(html,/private-path/);
 }
});
