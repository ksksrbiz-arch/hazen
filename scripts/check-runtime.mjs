// Runs compiled Pages Functions against isolated local D1/R2 and static assets.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {publicListing} from '../server/listings.js';
const root=process.cwd(),bundle=path.join(root,'.wrangler/runtime-check');
const mf=new Miniflare(convertV4MiniflareOptions({rootPath:bundle,modules:true,scriptPath:path.join(bundle,'index.js'),compatibilityDate:'2026-10-10',d1Databases:['DB'],r2Buckets:['PHOTOS'],serviceBindings:{ASSETS:async request=>{const pathname=new URL(request.url).pathname;try{return new Response(readFileSync(path.join(root,'dist',pathname,pathname.endsWith('/')?'index.html':'')),{headers:{'Content-Type':'text/html'}});}catch{return new Response('Not found',{status:404});}}}}));
try{
 const DB=await mf.getD1Database('DB');
 for(const sql of readFileSync(path.join(root,'database/cloudflare/001_listings.sql'),'utf8').split(';').filter(s=>s.trim()))await DB.prepare(sql).run();
 const id='8caa1a53-05bd-4212-9c9c-a487cc334550',file='listing-8caa1a53-05bd-4212-9c9c-a487cc334551.webp';
 const draft={slug:'isolated-runtime-qa',title:'QA house <test>',address:'Test data only',price:100,status:'Active',description:'Test description',attribution:'QA',permissionNote:'INTERNAL_QA_NOTE',updatedAt:'2026-10-10',images:[{file,alt:'Test photo'}],featured:true,published:false};
 await DB.prepare('INSERT INTO listings(id,draft_json,published_json,updated_at,updated_by) VALUES(?,?,?,?,?)').bind(id,JSON.stringify(draft),JSON.stringify(publicListing(draft)),'now','QA').run();
 const PHOTOS=await mf.getR2Bucket('PHOTOS');await PHOTOS.put(id+'/'+file,readFileSync(path.join(root,'src/assets/hero-mobile.webp')),{httpMetadata:{contentType:'image/webp'}});
 for(const route of ['/','/properties/','/properties/isolated-runtime-qa/']){
  const response=await mf.dispatchFetch('https://qa.example'+route),html=await response.text();assert.equal(response.status,200);assert.ok(html.includes('QA house &lt;test&gt;'));assert.ok(!html.includes('INTERNAL_QA_NOTE'));assert.equal(response.headers.get('cache-control'),'no-store');
 }
 for(const route of ['/studio/','/api/admin/listings'])assert.equal((await mf.dispatchFetch('https://qa.example'+route)).status,401);
 const mediaURL='https://qa.example/media/'+id+'/'+file;
 assert.equal((await mf.dispatchFetch(mediaURL)).status,200);
 await DB.prepare('UPDATE listings SET published_json=NULL WHERE id=?').bind(id).run();
 assert.equal((await mf.dispatchFetch(mediaURL)).status,404);
 assert.equal((await mf.dispatchFetch('https://qa.example/properties/isolated-runtime-qa/')).status,404);
 const homepage=await (await mf.dispatchFetch('https://qa.example/')).text();assert.ok(!homepage.includes('QA house'));
 console.log('Compiled runtime verified: featured cards, collection/detail pages, private notes, auth rejection, media and unpublication.');
}finally{await mf.dispose();}
