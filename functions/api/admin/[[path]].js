import {editor,mutationAllowed} from '../../../server/auth.js';
import {idPattern,filePattern,cleanDraft,rowRecord,publishErrors,change,imageType} from '../../../server/listings.js';
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export async function onRequest({request,env}){
 let actor;try{actor=await editor(request,env);}catch{return json({error:'Sign in to the listing studio.'},401);}
 if(!['GET','HEAD'].includes(request.method)&&!mutationAllowed(request))return json({error:'Same-origin request required'},403);
 if(!env.DB||!env.PHOTOS)return json({error:'Cloud storage unavailable'},503);
 const path=new URL(request.url).pathname.split('/').filter(Boolean).slice(2);
 try{
  if(path[0]==='session')return json({email:actor});
  if(path[0]!=='listings')return json({error:'Not found'},404);
  const id=path[1];
  if(!id&&request.method==='GET'){
   const archived=new URL(request.url).searchParams.get('archived')==='1';
   const rows=await env.DB.prepare('SELECT * FROM listings WHERE archived=? ORDER BY updated_at DESC LIMIT 200').bind(archived?1:0).all();
   const counts=await env.DB.prepare('SELECT count(*) AS total,coalesce(sum(archived=1),0) AS archived,coalesce(sum(archived=0 AND published_json IS NULL),0) AS drafts,coalesce(sum(archived=0 AND published_json IS NOT NULL),0) AS published FROM listings').first();
   return json({listings:rows.results.map(rowRecord),counts});
  }
  if(!id&&request.method==='POST'){
   const input=await body(request),listing=cleanDraft(input.listing),newId=crypto.randomUUID(),now=new Date().toISOString();
   await env.DB.prepare('INSERT INTO listings(id,draft_json,updated_at,updated_by) VALUES(?,?,?,?)').bind(newId,JSON.stringify(listing),now,actor).run();
   return json({id:newId,revision:1,listing,published:false,savedAt:now},201);
  }
  if(!idPattern.test(id||''))return json({error:'Not found'},404);
  const row=await env.DB.prepare('SELECT * FROM listings WHERE id=?').bind(id).first();if(!row)return json({error:'Not found'},404);
  if(path[2]==='history'&&request.method==='GET'){const events=await env.DB.prepare('SELECT action,revision,actor,happened_at FROM listing_events WHERE listing_id=? ORDER BY id DESC LIMIT 20').bind(id).all();return json({events:events.results});}
  if(path[2]==='photos'){
   const file=path[3];if(!filePattern.test(file||''))return json({error:'Invalid photo name'},400);const key=id+'/'+file;
   if(request.method==='GET'){const photo=await env.PHOTOS.get(key);if(!photo)return json({error:'Not found'},404);return new Response(photo.body,{headers:{'Content-Type':photo.httpMetadata.contentType,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});}
   if(row.archived)return json({error:'Restore the archived draft before adding photos'},409);
   if(request.method!=='PUT')return json({error:'Method not allowed'},405);
   const existing=await env.DB.prepare('SELECT key FROM photos WHERE key=?').bind(key).first();if(existing)return json({error:'Photo names are immutable. Add the photo with a new name.'},409);
   if(Number(request.headers.get('content-length'))>=400000)return json({error:'Photo must be under 400 KB'},413);
   const bytes=await request.arrayBuffer();if(bytes.byteLength>=400000)return json({error:'Photo must be under 400 KB'},413);
   const type=imageType(bytes),expected=file.endsWith('.jpg')?'image/jpeg':file.endsWith('.png')?'image/png':'image/webp';
   if(type!==expected||request.headers.get('content-type')!==type)return json({error:'Invalid image file'},400);
   const count=await env.DB.prepare('SELECT count(*) AS n FROM photos WHERE listing_id=?').bind(id).first();if(count.n>=200)return json({error:'Photo history limit reached. Contact the developer.'},400);
   await env.PHOTOS.put(key,bytes,{httpMetadata:{contentType:type}});
   await env.DB.prepare('INSERT INTO photos(key,listing_id,content_type,bytes,uploaded_at) VALUES(?,?,?,?,?)').bind(key,id,type,bytes.byteLength,new Date().toISOString()).run();return json({file});
  }
  if(request.method==='GET')return json(rowRecord(row));
  if(request.method!=='POST')return json({error:'Method not allowed'},405);
  const input=await body(request),revision=input.revision;if(!Number.isInteger(revision)||revision!==row.revision)return json({error:'This listing changed in another session. Reload it before saving.'},409);
  const action=path[2]||'save';if(!['save','publish','unpublish','archive','restore'].includes(action))return json({error:'Not found'},404);
  if(Boolean(row.archived)!==(action==='restore'))return json({error:row.archived?'Restore the archived draft before editing':'This listing is not archived'},409);
  const listing=action==='save'?cleanDraft(input.listing):JSON.parse(row.draft_json);
  if(action==='publish'){const errors=await publishErrors(listing,id,env);if(errors.length)return json({error:errors.join('. ')},400);}
  let changed;try{changed=await change(env,id,revision,actor,action,listing);}catch(error){if(String(error).includes('UNIQUE'))return json({error:'Another published listing already uses this page slug.'},409);throw error;}
  if(!changed)return json({error:'Listing changed. Reload before saving.'},409);
  if(action==='archive')return json({archived:true});return json(rowRecord(await env.DB.prepare('SELECT * FROM listings WHERE id=?').bind(id).first()));
 }catch(error){console.error('Listing operation failed',error.name);return json({error:error instanceof RangeError?'Request too large':'Unable to process the listing. Check the details and try again.'},400);}
}
async function body(request){if(Number(request.headers.get('content-length'))>40000)throw new RangeError();const text=await request.text();if(text.length>40000)throw new RangeError();return JSON.parse(text);}
