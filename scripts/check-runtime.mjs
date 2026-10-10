// Runs compiled Pages Functions against isolated local D1/R2 and static assets.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {generateKeyPair,exportJWK,SignJWT} from 'jose';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {publicListing} from '../server/listings.js';
const root=process.cwd(),bundle=path.join(root,'.wrangler/runtime-check');
const {privateKey,publicKey}=await generateKeyPair('RS256'),jwk=await exportJWK(publicKey);jwk.kid='runtime-qa';
const auth={ACCESS_TEAM_DOMAIN:'https://isolated-auth.example',ACCESS_AUD:'isolated-qa',EDITOR_EMAILS:'qa@example.com'};
const token=await new SignJWT({email:'qa@example.com'}).setProtectedHeader({alg:'RS256',kid:'runtime-qa'}).setSubject('qa').setIssuer(auth.ACCESS_TEAM_DOMAIN).setAudience(auth.ACCESS_AUD).setExpirationTime('5m').sign(privateKey);
const mf=new Miniflare(convertV4MiniflareOptions({rootPath:bundle,modules:true,scriptPath:path.join(bundle,'index.js'),compatibilityDate:'2026-10-10',bindings:auth,outboundService:async request=>new URL(request.url).origin===auth.ACCESS_TEAM_DOMAIN?Response.json({keys:[jwk]}):new Response('No external network in QA',{status:403}),d1Databases:['DB'],r2Buckets:['PHOTOS'],serviceBindings:{ASSETS:async request=>{const pathname=new URL(request.url).pathname;try{return new Response(readFileSync(path.join(root,'dist',pathname,pathname.endsWith('/')?'index.html':'')),{headers:{'Content-Type':'text/html'}});}catch{return new Response('Not found',{status:404});}}}}));
try{
 const DB=await mf.getD1Database('DB');
 for(const sql of readFileSync(path.join(root,'database/cloudflare/001_listings.sql'),'utf8').split(';').filter(s=>s.trim()))await DB.prepare(sql).run();
 const id='8caa1a53-05bd-4212-9c9c-a487cc334550',file='listing-8caa1a53-05bd-4212-9c9c-a487cc334551.webp';
 const draft={slug:'isolated-runtime-qa',title:'QA house <test>',address:'Test data only',price:100,beds:3,status:'Active',description:'Test description',attribution:'QA',permissionNote:'INTERNAL_QA_NOTE',updatedAt:'2026-10-10',images:[{file,alt:'Test photo'}],featured:true,published:false};
 await DB.prepare('INSERT INTO listings(id,draft_json,published_json,updated_at,updated_by) VALUES(?,?,?,?,?)').bind(id,JSON.stringify(draft),JSON.stringify(publicListing(draft)),'now','QA').run();
 const PHOTOS=await mf.getR2Bucket('PHOTOS');await PHOTOS.put(id+'/'+file,readFileSync(path.join(root,'src/assets/river-hero-mobile.webp')),{httpMetadata:{contentType:'image/webp'}});
 for(const route of ['/','/properties/','/properties/isolated-runtime-qa/']){
  const response=await mf.dispatchFetch('https://qa.example'+route),html=await response.text();assert.equal(response.status,200);assert.ok(html.includes('QA house &lt;test&gt;'));assert.ok(!html.includes('INTERNAL_QA_NOTE'));assert.equal(response.headers.get('cache-control'),'no-store');
 }
 const filtered=await (await mf.dispatchFetch('https://qa.example/properties/?min=100&max=100&beds=3')).text();assert.ok(filtered.includes('QA house &lt;test&gt;'));assert.ok(filtered.includes('1 of 1 property shown'));assert.ok(filtered.includes('3+ bedrooms'));
 const unmatched=await (await mf.dispatchFetch('https://qa.example/properties/?max=99')).text();assert.ok(!unmatched.includes('QA house &lt;test&gt;'));assert.ok(unmatched.includes('No listings match your filters'));
 for(const route of ['/studio/','/studio/preview/'+id+'/','/api/admin/listings'])assert.equal((await mf.dispatchFetch('https://qa.example'+route)).status,401);
 const previewURL='https://qa.example/studio/preview/'+id+'/';
 const preview=await mf.dispatchFetch(previewURL,{headers:{'cf-access-jwt-assertion':token}}),previewHTML=await preview.text();
 assert.equal(preview.status,200);assert.equal(preview.headers.get('cache-control'),'private, no-store');assert.equal(preview.headers.get('referrer-policy'),'no-referrer');assert.ok(previewHTML.includes('Private saved-draft preview'));assert.ok(previewHTML.includes('/api/admin/listings/'+id+'/photos/'+file));assert.ok(!previewHTML.includes('INTERNAL_QA_NOTE'));assert.ok(!previewHTML.includes('og:image'));assert.ok(!previewHTML.includes('data-share-property'));
 const invalidPreview=await mf.dispatchFetch('https://qa.example/studio/preview/not-an-id/',{headers:{'cf-access-jwt-assertion':token}});assert.equal(invalidPreview.status,404);
 const nonEditor=await new SignJWT({email:'outsider@example.com'}).setProtectedHeader({alg:'RS256',kid:'runtime-qa'}).setSubject('outsider').setIssuer(auth.ACCESS_TEAM_DOMAIN).setAudience(auth.ACCESS_AUD).setExpirationTime('5m').sign(privateKey);
 assert.equal((await mf.dispatchFetch(previewURL,{headers:{'cf-access-jwt-assertion':nonEditor}})).status,401);
 const privatePhoto=await mf.dispatchFetch('https://qa.example/api/admin/listings/'+id+'/photos/'+file,{headers:{'cf-access-jwt-assertion':token}});assert.equal(privatePhoto.status,200);
 const mediaURL='https://qa.example/media/'+id+'/'+file;
 assert.equal((await mf.dispatchFetch(mediaURL)).status,200);
 await DB.prepare('UPDATE listings SET published_json=NULL WHERE id=?').bind(id).run();
 assert.equal((await mf.dispatchFetch(mediaURL)).status,404);
 assert.equal((await mf.dispatchFetch('https://qa.example/properties/isolated-runtime-qa/')).status,404);
 const emptyCollection=await (await mf.dispatchFetch('https://qa.example/properties/')).text();assert.ok(emptyCollection.includes('New listings will appear here.'));assert.ok(emptyCollection.includes('0 of 0 properties shown'));
 const homepage=await (await mf.dispatchFetch('https://qa.example/')).text();assert.ok(!homepage.includes('QA house'));
 console.log('Compiled runtime verified: featured cards, collection/detail pages, private notes, auth rejection, media, unpublication and authenticated saved-draft previews.');
}finally{await mf.dispose();}
