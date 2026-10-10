import test from 'node:test';
import assert from 'node:assert/strict';
import {getCollections,propertyCards,propertyDetail,reviewCards} from '../scripts/collections.mjs';
const listing=()=>({published:true,slug:'test-fixture',title:'Fixture <script>',address:'Test-only address',description:'Test-only description',attribution:'Test attribution',permissionNote:'Test-only authorization fixture',updatedAt:'2026-10-10',status:'Pending',price:100,beds:0,baths:1,squareFeet:100,images:[{file:'hero.webp',alt:'Fixture <image>'}]});
test('Unpublished drafts are omitted even when incomplete',()=>assert.deepEqual(getCollections({properties:[{published:false}],testimonials:[{}]}),{properties:[],testimonials:[]}));
test('Published entries require authorization and valid local asset paths',()=>{
 const item=listing();delete item.permissionNote;assert.throws(()=>getCollections({properties:[item]}),/permissionNote/);
 item.permissionNote='Fixture permission';item.images[0].file='../secret.jpg';assert.throws(()=>getCollections({properties:[item]}),/local asset/);
});
test('Duplicate and unsafe property slugs cannot create conflicting routes',()=>{
 const item=listing();assert.throws(()=>getCollections({properties:[item,item]}),/unique/);
 item.slug='../contact';assert.throws(()=>getCollections({properties:[item]}),/slug/);
});
test('Listing output escapes supplied text and retains status and zero-valued facts',()=>{
 const item=listing();const cards=propertyCards([item]);assert(!cards.includes('<script>'));assert(cards.includes('Fixture &lt;script&gt;'));assert(cards.includes('0 beds'));assert(cards.includes('Pending'));
 const detail=propertyDetail(item);assert(detail.includes('Fixture &lt;image&gt;'));assert(detail.includes('2026-10-10'));assert(detail.includes('Test attribution'));
});
test('Review content is escaped and unsafe source protocols are rejected',()=>{
 const item={published:true,quote:'<script>alert(1)</script>',attribution:'Fixture author',permissionNote:'Test consent'};
 assert(!reviewCards([item]).includes('<script>'));assert(reviewCards([item]).includes('&lt;script&gt;'));
 item.sourceUrl='javascript:alert(1)';assert.throws(()=>getCollections({testimonials:[item]}),/HTTPS/);
});
test('Bad prices, statuses and review authorization fail the build',()=>{
 const item=listing();item.price=-1;assert.throws(()=>getCollections({properties:[item]}),/price/);item.price=100;item.status='Maybe';assert.throws(()=>getCollections({properties:[item]}),/status/);
 assert.throws(()=>getCollections({testimonials:[{published:true,quote:'Fixture',attribution:'Fixture'}]}),/permissionNote/);
});

test('Review date cannot silently normalize an invalid calendar date',()=>{const item=listing();item.updatedAt='2026-02-31';assert.throws(()=>getCollections({properties:[item]}),/update date/);});

test('Optional tour link must use HTTPS and is escaped in public output',()=>{
 const item=listing();item.videoUrl='javascript:alert(1)';assert.throws(()=>getCollections({properties:[item]}),/HTTPS/);
 item.videoUrl='https://example.com/tour?x=1&y=2';getCollections({properties:[item]});assert(propertyDetail(item).includes('https://example.com/tour?x=1&amp;y=2'));
});
