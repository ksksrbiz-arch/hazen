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
 for(const copy of [kit.caption,kit.social,kit.email,kit.summary,kit.launch,kit.outreach,kit.update,JSON.stringify(kit.sheet)]){assert.doesNotMatch(copy,/PRIVATE CLIENT NOTE|private-photo|studio\/preview/);}
 assert.deepEqual(kit.missing,[]);
});
test('Only a matching published snapshot can produce a public page link',()=>{
 assert.equal(listingPromotion(item,state).publicUrl,'https://example.com/properties/country-home/');
 for(const changes of [{published:false},{dirty:true},{hasUnpublishedChanges:true},{publicSlug:'old-address'},{origin:'http://example.com'},{origin:'https://user:secret@example.com'}]){
  const kit=listingPromotion(item,{...state,...changes});assert.equal(kit.publicUrl,'');for(const copy of [kit.social,kit.launch,kit.outreach,kit.update])assert.doesNotMatch(copy,/https:\/\/example.com\/properties\//);
 }
});

test('Planning and follow-up use blank prompts and status-aware public facts',()=>{
 const kit=listingPromotion(item,state);assert.match(kit.launch,/Approved launch date: \[add date\]/);assert.match(kit.launch,/Budget: \[agreed amount or not applicable\]/);assert.match(kit.launch,/Property page: https:\/\/example.com\/properties\/country-home\//);
 assert.match(kit.update,/Property inquiries: \[count and source\]/);assert.match(kit.update,/Advertising spend: \[actual amount and source, or not applicable\]/);assert.doesNotMatch(kit.update,/inquiries: \d|Showings: \d/);
 for(const status of ['Pending','Sold']){const k=listingPromotion({...item,status});assert.doesNotMatch(k.outreach,/viewing arrangements/);assert.match(k.launch,/WORKING DRAFT/);assert.match(k.update,/WORKING DRAFT/);if(status==='Sold')assert.match(k.outreach,/Listed price: \$1,200,000/);}
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

test('Short captions and printable sheets retain attribution and only verified public links',()=>{
 const kit=listingPromotion(item,state);assert.match(kit.caption,/Explore this property: https:\/\/example.com\/properties\/country-home\//);assert.doesNotMatch(kit.caption,/Entered description/);assert.equal(kit.sheet.description,item.description);assert.equal(kit.sheet.publicUrl,kit.publicUrl);assert.equal(kit.sheet.attribution,item.attribution);assert.equal(kit.sheet.contact,'Brad Hazen · Realty Pro, Inc.\n(360) 921-9484 · b.hazen@hotmail.com');
 const draft=listingPromotion(item,{...state,dirty:true});assert.equal(draft.sheet.publicUrl,'');assert.doesNotMatch(draft.caption,/Explore this property:/);
 const sold=listingPromotion({...item,status:'Sold'},state);assert.equal(sold.sheet.priceLabel,'Listed price: $1,200,000');assert.doesNotMatch(sold.caption,/viewing arrangements/);
 assert.equal(listingPromotion({}).sheet.priceLabel,'Price to be confirmed');
});
