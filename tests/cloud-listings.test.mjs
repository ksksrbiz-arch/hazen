import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {generateKeyPair,SignJWT,createLocalJWKSet,exportJWK} from 'jose';
import {editor,mutationAllowed} from '../server/auth.js';
import {cleanDraft,publicListing,change,imageType,publishErrors,rowRecord} from '../server/listings.js';
import {detail,cards,collection} from '../server/public.js';
import {onRequest} from '../functions/api/admin/[[path]].js';
import {onRequest as media} from '../functions/media/[[path]].js';
function db(){const sqlite=new DatabaseSync(':memory:');sqlite.exec(readFileSync('database/cloudflare/001_listings.sql','utf8'));const prepare=sql=>{let params=[];const stmt={bind(...args){params=args;return stmt;},async first(){return sqlite.prepare(sql).get(...params)||null;},async all(){return {results:sqlite.prepare(sql).all(...params)};},async run(){return {meta:sqlite.prepare(sql).run(...params)};}};return stmt;};return {prepare,async batch(statements){sqlite.exec('BEGIN');try{const results=[];for(const s of statements)results.push(await s.run());sqlite.exec('COMMIT');return results;}catch(e){sqlite.exec('ROLLBACK');throw e;}}};}
const id='8caa1a53-05bd-4212-9c9c-a487cc334550',filename='listing-8caa1a53-05bd-4212-9c9c-a487cc334551.jpg';
const listing={slug:'test-house',title:'Test <house>',address:'QA only',price:100,status:'Active',description:'Description',attribution:'Brad',permissionNote:'Private permission note',updatedAt:'2026-10-10',images:[{file:filename,alt:'House'}]};
async function seed(DB){await DB.prepare('INSERT INTO listings(id,draft_json,updated_at,updated_by) VALUES(?,?,?,?)').bind(id,JSON.stringify(listing),'2026-10-10','editor').run();}
test('Only verified Access identity with matching issuer, audience and email can edit',async()=>{
 const {privateKey,publicKey}=await generateKeyPair('RS256');const jwk=await exportJWK(publicKey);jwk.kid='qa';const keys=createLocalJWKSet({keys:[jwk]});const env={ACCESS_AUD:'hazen',ACCESS_TEAM_DOMAIN:'https://team.cloudflareaccess.com',EDITOR_EMAILS:'editor@example.com'};
 const token=await new SignJWT({email:'editor@example.com'}).setProtectedHeader({alg:'RS256',kid:'qa'}).setSubject('editor').setIssuer(env.ACCESS_TEAM_DOMAIN).setAudience('hazen').setExpirationTime('5m').sign(privateKey);
 const request=new Request('https://hazen.example/api/admin/session',{headers:{'cf-access-jwt-assertion':token}});assert.equal(await editor(request,env,keys),'editor@example.com');
 await assert.rejects(editor(request,{...env,ACCESS_AUD:'another-app'},keys));await assert.rejects(editor(request,{...env,EDITOR_EMAILS:'outsider@example.com'},keys));await assert.rejects(editor(new Request(request.url),env,keys));
 const expired=await new SignJWT({email:'editor@example.com'}).setProtectedHeader({alg:'RS256',kid:'qa'}).setSubject('editor').setIssuer(env.ACCESS_TEAM_DOMAIN).setAudience('hazen').setExpirationTime(1).sign(privateKey);await assert.rejects(editor(new Request(request.url,{headers:{'cf-access-jwt-assertion':expired}}),env,keys));
});
test('Admin API fails closed and mutations require same-origin',async()=>{
 assert.equal((await onRequest({request:new Request('https://hazen.example/api/admin/listings'),env:{}})).status,401);
 assert.equal(mutationAllowed(new Request('https://hazen.example/api/admin/listings',{headers:{origin:'https://evil.example'}})),false);
 assert.equal(mutationAllowed(new Request('https://hazen.example/api/admin/listings',{headers:{origin:'https://hazen.example'}})),true);
});
test('Saving never publishes; stale writes cannot overwrite newer drafts',async()=>{
 const DB=db();await seed(DB);const env={DB};assert.equal(await change(env,id,1,'editor','save',{...listing,title:'New draft'}),true);assert.equal(await change(env,id,1,'editor','save',listing),false);
 const row=await DB.prepare('SELECT * FROM listings WHERE id=?').bind(id).first();assert.equal(row.revision,2);assert.equal(row.published_json,null);assert.equal(JSON.parse(row.draft_json).title,'New draft');assert.equal((await DB.prepare('SELECT * FROM listing_events').all()).results.length,1);
});
test('Published snapshot excludes internal notes and remains stable across draft edits',async()=>{
 const DB=db();await seed(DB);const env={DB};await change(env,id,1,'editor','publish',listing);await change(env,id,2,'editor','save',{...listing,title:'Unpublished edit'});let row=await DB.prepare('SELECT * FROM listings WHERE id=?').bind(id).first();assert.equal(JSON.parse(row.published_json).title,listing.title);assert.ok(!row.published_json.includes('permissionNote'));await change(env,id,3,'editor','unpublish');row=await DB.prepare('SELECT * FROM listings WHERE id=?').bind(id).first();assert.equal(row.published_json,null);assert.equal(JSON.parse(row.draft_json).title,'Unpublished edit');
});
test('Archive removes public listing and duplicate published slugs are rejected',async()=>{
 const DB=db();await seed(DB);const other='8caa1a53-05bd-4212-9c9c-a487cc334552';await DB.prepare('INSERT INTO listings(id,draft_json,updated_at,updated_by) VALUES(?,?,?,?)').bind(other,JSON.stringify(listing),'now','editor').run();await change({DB},id,1,'editor','publish',listing);await assert.rejects(change({DB},other,1,'editor','publish',listing));assert.equal(await change({DB},id,2,'editor','archive'),true);const row=await DB.prepare('SELECT * FROM listings WHERE id=?').bind(id).first();assert.equal(row.archived,1);assert.equal(row.published_json,null);
});
test('Publication requires owned photos; private media cannot be retrieved publicly',async()=>{
 const DB=db();await seed(DB);const env={DB,PHOTOS:{head:async()=>null,get:async()=>{throw Error('Must not fetch private photo');}}};assert.ok((await publishErrors(listing,id,env)).includes('Save all listing photos before publishing'));assert.equal((await media({request:new Request('https://hazen.example/media/'+id+'/'+filename),env})).status,404);
});
test('Public media exposes only photos from the current published snapshot',async()=>{
 const DB=db();await seed(DB);await change({DB},id,1,'editor','publish',listing);const env={DB,PHOTOS:{get:async()=>({body:'image',httpMetadata:{contentType:'image/jpeg'}})}};const url='https://hazen.example/media/'+id+'/';assert.equal((await media({request:new Request(url+filename),env})).status,200);assert.equal((await media({request:new Request(url+'listing-8caa1a53-05bd-4212-9c9c-a487cc334599.jpg'),env})).status,404);await change({DB},id,2,'editor','unpublish');assert.equal((await media({request:new Request(url+filename),env})).status,404);
});
test('Draft fields are bounded and public HTML escapes listing text',()=>{
 assert.throws(()=>cleanDraft({...listing,images:[{file:'../secret.jpg',alt:'test'}]}));assert.throws(()=>cleanDraft({...listing,description:'a'.repeat(6001)}));const cleaned=cleanDraft({...listing,published:true,password:'secret'});assert.equal(cleaned.published,false);assert.equal(cleaned.password,undefined);assert.equal(publicListing(cleaned).permissionNote,undefined);assert.ok(detail(id,publicListing(cleaned)).includes('Test &lt;house&gt;'));assert.ok(cards([{id,item:listing}]).includes('Test &lt;house&gt;'));assert.equal(imageType(new TextEncoder().encode('<svg>')),null);
});
test('Authenticated API round trip: create, upload, save, publish, conflict and unpublish',async()=>{
 const {privateKey,publicKey}=await generateKeyPair('RS256');const jwk=await exportJWK(publicKey);jwk.kid='api-qa';const originalFetch=globalThis.fetch;globalThis.fetch=async()=>Response.json({keys:[jwk]});
 const objects=new Map(),env={DB:db(),PHOTOS:{async head(key){return objects.get(key)||null;},async put(key,bytes,options){objects.set(key,{bytes,body:bytes,httpMetadata:options.httpMetadata});},async get(key){return objects.get(key)||null;}},ACCESS_TEAM_DOMAIN:'https://api-qa.example',ACCESS_AUD:'api-qa',EDITOR_EMAILS:'editor@example.com'};
 try{
  const token=await new SignJWT({email:'editor@example.com'}).setProtectedHeader({alg:'RS256',kid:'api-qa'}).setSubject('qa').setIssuer(env.ACCESS_TEAM_DOMAIN).setAudience(env.ACCESS_AUD).setExpirationTime('5m').sign(privateKey);
  const call=(path,method='GET',body,contentType='application/json')=>onRequest({env,request:new Request('https://hazen.example/api/admin/'+path,{method,headers:{'cf-access-jwt-assertion':token,origin:'https://hazen.example','content-type':contentType},body:body===undefined?undefined:contentType==='application/json'?JSON.stringify(body):body})});
  const created=await call('listings','POST',{listing});assert.equal(created.status,201);let saved=await created.json();const base='listings/'+saved.id;
  assert.equal((await call(base+'/publish','POST',{revision:1})).status,400);
  assert.equal((await call(base+'/photos/'+filename,'PUT','<svg>','image/jpeg')).status,400);
  assert.equal((await call(base+'/photos/'+filename,'PUT',new Uint8Array([255,216,255,1]),'image/jpeg')).status,200);
  assert.equal((await call(base+'/photos/'+filename,'PUT',new Uint8Array([255,216,255,1]),'image/jpeg')).status,409);
  saved=await (await call(base,'POST',{revision:1,listing})).json();assert.equal(saved.revision,2);
  saved=await (await call(base+'/publish','POST',{revision:2})).json();assert.equal(saved.published,true);assert.equal(saved.revision,3);
  assert.equal((await call(base,'POST',{revision:2,listing})).status,409);
  saved=await (await call(base+'/unpublish','POST',{revision:3})).json();assert.equal(saved.published,false);
  assert.equal((await (await call('listings')).json()).listings.length,1);
  assert.equal((await call(base+'/archive','POST',{revision:4})).status,200);
  const archived=await (await call('listings?archived=1')).json();assert.equal(archived.listings.length,1);assert.equal(archived.counts.archived,1);assert.equal(archived.listings[0].archived,true);
  assert.equal((await call(base,'POST',{revision:5,listing})).status,409);
  assert.equal((await call(base+'/restore','POST',{revision:4})).status,409);
  saved=await (await call(base+'/restore','POST',{revision:5})).json();assert.equal(saved.archived,false);assert.equal(saved.published,false);assert.equal(saved.revision,6);
  assert.equal((await call(base+'/restore','POST',{revision:6})).status,409);
  const history=await (await call(base+'/history')).json();assert.equal(history.events[0].action,'restore');assert.equal(history.events[0].revision,6);assert.equal(history.events[1].action,'archive');
  assert.equal((await (await call('listings?archived=1')).json()).listings.length,0);
 }finally{globalThis.fetch=originalFetch;}
});

test('Unpublished-change indicator ignores internal notes but detects public changes',async()=>{
 const DB=db();await seed(DB);await change({DB},id,1,'editor','publish',listing);
 let row=await DB.prepare('SELECT * FROM listings WHERE id=?').bind(id).first();assert.equal(rowRecord(row).hasUnpublishedChanges,false);
 await change({DB},id,2,'editor','save',{...listing,permissionNote:'Updated internal note'});row=await DB.prepare('SELECT * FROM listings WHERE id=?').bind(id).first();assert.equal(rowRecord(row).hasUnpublishedChanges,false);
 await change({DB},id,3,'editor','save',{...listing,price:200});row=await DB.prepare('SELECT * FROM listings WHERE id=?').bind(id).first();assert.equal(rowRecord(row).hasUnpublishedChanges,true);
});

test('Public listing filters support status, address search and price ordering without leaking query markup',()=>{
 const items=[{id,item:{...listing,title:'First property',price:300}},{id:id+'2',item:{...listing,title:'Second property',status:'Sold',price:100}}];
 const sorted=collection(items,new URL('https://qa.example/properties/?sort=price-low'));assert.ok(sorted.indexOf('Second property</h2>')<sorted.indexOf('First property</h2>'));
 const sold=collection(items,new URL('https://qa.example/properties/?status=Sold'));assert.ok(sold.includes('Second property</h2>'));assert.ok(!sold.includes('First property</h2>'));
 const none=collection(items,new URL('https://qa.example/properties/?q=%22%3E%3Cscript%3E'));assert.ok(none.includes('No listings match your filters'));assert.ok(!none.includes('<script>'));assert.ok(none.includes('&quot;&gt;&lt;script&gt;'));
 const found=collection(items,new URL('https://qa.example/properties/?q=QA'));assert.ok(found.includes('2 properties shown'));
});


test('Private page previews use editor photo routes and omit sharing and authorization notes',()=>{
 const html=detail(id,{...listing,mlsId:'RMLS <number>'},{preview:true});assert.ok(html.includes('Private saved-draft preview'));assert.ok(html.includes('/api/admin/listings/'+id+'/photos/'));assert.ok(!html.includes('/media/'));assert.ok(!html.includes('data-share-property'));assert.ok(!html.includes(listing.permissionNote));assert.ok(html.includes('RMLS &lt;number&gt;'));
 const empty=detail(id,{images:[]},{preview:true});assert.ok(empty.includes('Untitled listing'));assert.ok(empty.includes('Listing photos have not been added yet.'));assert.ok(!empty.includes('$0'));
 assert.ok(!detail(id,{...listing,videoUrl:'javascript:alert(1)'},{preview:true}).includes('javascript:'));
 assert.ok(!detail(id,{...listing,videoUrl:'httpsx://fake'},{preview:true}).includes('property-tour')); 
});
test('Public property pages retain progressive photo links, sharing, printing and multiline descriptions',()=>{
 const html=detail(id,{...listing,description:'First line\nSecond line',images:[{file:filename,alt:'<Photo>'},{file:filename,alt:'Second photo'}]});assert.ok(html.includes('data-gallery-photo'));assert.ok(html.includes('View photo 2 / 2'));assert.ok(html.includes('View photo 1: &lt;Photo&gt;'));assert.ok(html.includes('data-share-property hidden'));assert.ok(html.includes('data-print-property hidden'));assert.ok(html.includes('property-print-contact'));assert.ok(html.includes('First line\nSecond line'));
});
