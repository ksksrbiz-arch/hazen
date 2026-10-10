import {editor} from '../server/auth.js';
import {cards,detail,published,collection} from '../server/public.js';
import {idPattern} from '../server/listings.js';
export async function onRequest(context){
 const {request,env}=context,url=new URL(request.url),path=url.pathname;
 if(path==='/studio'||path.startsWith('/studio/')){
  try{await editor(request,env);}catch{return new Response('Sign in to the private listing studio.',{status:401,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex'}});}
  if(path.startsWith('/studio/preview/')){
   const id=path.slice('/studio/preview/'.length).replace(/\/$/,'');
   const headers={'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
   if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers});
   if(!idPattern.test(id))return new Response('Draft not found.',{status:404,headers});
   if(!env.DB)return new Response('Draft preview is temporarily unavailable.',{status:503,headers});
   let row;try{row=await env.DB.prepare('SELECT draft_json FROM listings WHERE id=?').bind(id).first();}catch{return new Response('Draft preview is temporarily unavailable.',{status:503,headers});}
   if(!row)return new Response('Draft not found.',{status:404,headers});
   const item=JSON.parse(row.draft_json),shell=await env.ASSETS.fetch(new Request(url.origin+'/properties/'));
   const response=new Response(shell.body,{status:shell.status,headers:{...Object.fromEntries(shell.headers),...headers}});
   return new HTMLRewriter().on('main',{element(el){el.setInnerContent(detail(id,item,{preview:true}),{html:true});}}).on('title',{element(el){el.setInnerContent('Private preview: '+(item.title||'Untitled listing')+' | Brad Hazen');}}).on('meta[property^="og:"]',{element(el){el.remove();}}).on('meta[name="description"]',{element(el){el.remove();}}).on('link[rel="canonical"]',{element(el){el.remove();}}).on('.mobile-contact',{element(el){el.remove();}}).transform(response);
  }
  const response=await context.next(),headers=new Headers(response.headers);headers.set('Cache-Control','private, no-store');return new Response(response.body,{status:response.status,headers});
 }
 if(path!=='/'&&path!=='/properties'&&!path.startsWith('/properties/'))return context.next();
 if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method not allowed',{status:405});
 let items;try{items=await published(env);}catch{return new Response('Listings are temporarily unavailable. Please contact Brad at (360) 921-9484.',{status:503,headers:{'Cache-Control':'no-store'}});}
 let response,rewriter=new HTMLRewriter();
 if(path==='/'){
  response=await context.next();const featured=items.filter(({item})=>item.featured!==false&&item.status!=='Sold').slice(0,4);
  if(featured.length)rewriter.on('#featured-listings',{element(el){el.setInnerContent('<p class="eyebrow">Presented by Brad Hazen</p><h2>FEATURED LISTINGS</h2>'+cards(featured,'h3')+'<a class="button" href="/properties/">View All Properties</a>',{html:true});}});
 }else if(path==='/properties/'||path==='/properties'){
  response=await context.next();rewriter.on('.inner-content',{element(el){el.setInnerContent(collection(items,url),{html:true});}});
 }else{
  const slug=path.replace(/^\/properties\//,'').replace(/\/$/,'');const record=items.find(({item})=>item.slug===slug);
  if(!record)return new Response('Property not found. View current listings at /properties/.',{status:404,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex'}});
  response=await env.ASSETS.fetch(new Request(url.origin+'/properties/'));rewriter.on('main',{element(el){el.setInnerContent(detail(record.id,record.item),{html:true});}}).on('title',{element(el){el.setInnerContent(record.item.title+' | Brad Hazen');}}).on('link[rel="canonical"]',{element(el){el.setAttribute('href',url.origin+'/properties/'+record.item.slug+'/');}}).on('meta[property="og:title"]',{element(el){el.setAttribute('content',record.item.title+' | Brad Hazen');}}).on('meta[property="og:description"]',{element(el){el.setAttribute('content',record.item.description.slice(0,160));}}).on('meta[property="og:url"]',{element(el){el.setAttribute('content',url.origin+'/properties/'+record.item.slug+'/');}}).on('meta[property="og:image"]',{element(el){el.setAttribute('content',url.origin+'/media/'+record.id+'/'+record.item.images[0].file);}}).on('meta[name="description"]',{element(el){el.setAttribute('content',record.item.description.slice(0,160));}});
 }
 const headers=new Headers(response.headers);headers.set('Cache-Control','no-store');headers.set('X-Robots-Tag','noindex, nofollow');headers.set('X-Content-Type-Options','nosniff');return rewriter.transform(new Response(response.body,{status:response.status,headers}));
}
