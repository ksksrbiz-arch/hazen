import {idPattern,filePattern} from '../../server/listings.js';
export async function onRequest({request,env}){
 if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method not allowed',{status:405});
 const parts=new URL(request.url).pathname.split('/').filter(Boolean),id=parts[1],file=parts[2];
 if(parts.length!==3||!idPattern.test(id||'')||!filePattern.test(file||''))return new Response('Not found',{status:404});
 const row=await env.DB.prepare("SELECT id FROM listings WHERE id=? AND archived=0 AND published_json IS NOT NULL AND EXISTS (SELECT 1 FROM json_each(json_extract(published_json,'$.images')) WHERE json_extract(value,'$.file')=?)").bind(id,file).first();
 if(!row)return new Response('Not found',{status:404,headers:{'Cache-Control':'no-store'}});
 const photo=await env.PHOTOS.get(id+'/'+file);if(!photo)return new Response('Not found',{status:404});
 return new Response(request.method==='HEAD'?null:photo.body,{headers:{'Content-Type':photo.httpMetadata.contentType,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex'}});
}
