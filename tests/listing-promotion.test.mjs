import test from 'node:test';
import assert from 'node:assert/strict';
import {listingPromotion} from '../src/listing-promotion.js';
const item={title:'Country home',slug:'country-home',address:'Illustrative property',price:1200000,status:'Active',beds:3,baths:2.5,squareFeet:2500,description:'Entered description.\nSecond paragraph.',attribution:'Brad Hazen · Realty Pro, Inc.',permissionNote:'PRIVATE CLIENT NOTE',images:[{file:'private-photo.jpg'}],updatedAt:'2026-10-10',mlsId:'EXAMPLE'};
const state={origin:'https://example.com',published:true,dirty:false,hasUnpublishedChanges:false,publicSlug:'country-home'};
test('Promotion copies public facts while excluding private fields and media paths',()=>{
 const kit=listingPromotion(item,state);
 assert.match(kit.social,/\$1,200,000/);assert.match(kit.social,/3 bedrooms · 2.5 bathrooms · 2,500 sq ft/);
 assert.match(kit.summary,/MLS reference: EXAMPLE/);assert.match(kit.email,/^Subject: Country home — Active/);
 assert.match(kit.social,/Entered description\.\nSecond paragraph\./);
 for(const copy of [kit.social,kit.email,kit.summary]){assert.doesNotMatch(copy,/PRIVATE CLIENT NOTE|private-photo|studio\/preview/);}
 assert.deepEqual(kit.missing,[]);
});
test('Only a matching published snapshot can produce a public page link',()=>{
 assert.equal(listingPromotion(item,state).publicUrl,'https://example.com/properties/country-home/');
 for(const changes of [{published:false},{dirty:true},{hasUnpublishedChanges:true},{publicSlug:'old-address'},{origin:'http://example.com'},{origin:'https://user:secret@example.com'}]){
  const kit=listingPromotion(item,{...state,...changes});assert.equal(kit.publicUrl,'');assert.doesNotMatch(kit.social,/Property page:/);
 }
});
test('Pending and Sold copy never offers the property as available or calls a listed price a sale price',()=>{
 const pending=listingPromotion({...item,status:'Pending'}).social,sold=listingPromotion({...item,status:'Sold'}).social;
 assert.match(pending,/property is pending/);assert.doesNotMatch(pending,/viewing arrangements/);
 assert.match(sold,/Listed price: \$1,200,000/);assert.match(sold,/finding similar homes/);assert.doesNotMatch(sold,/viewing arrangements|sale price/i);
});
test('Missing details remain missing; zero facts are retained; unsafe tours are omitted',()=>{
 const kit=listingPromotion({beds:0,baths:0,price:null,videoUrl:'javascript:alert(1)'});
 assert.deepEqual(kit.missing,['listing title','address','price','description']);assert.match(kit.summary,/0 bedrooms · 0 bathrooms/);assert.doesNotMatch(kit.summary,/Tour:|NaN|undefined/);
 assert.doesNotMatch(listingPromotion({...item,videoUrl:'https://user:secret@example.com'}).social,/Tour:/);
 assert.match(listingPromotion({...item,videoUrl:'https://example.com/tour'}).social,/Tour: https:\/\/example.com\/tour/);
 assert.match(listingPromotion({...item,title:'Home\nBcc: unexpected@example.com'}).email,/^Subject: Home Bcc: unexpected@example.com — Active\n/);
});
