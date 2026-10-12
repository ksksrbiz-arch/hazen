export class StudioRequestError extends Error{
 constructor(kind,message){super(message);this.name='StudioRequestError';this.kind=kind;}
}
export async function studioRequest(url,options={},fetcher=fetch,timeoutMs=25000){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);
 try{
  let response;try{response=await fetcher(url,{...options,signal:controller.signal});}catch{throw new StudioRequestError('connection','No confirmation was received from the website. Keep this tab open, download your working notes and check the connection before trying again. A save may have completed; review the saved version before repeating it.');}
  if(response.status===401||response.status===403)throw new StudioRequestError('session','Your editor session needs attention. Keep this tab open and sign in separately before checking the connection again.');
  if(response.status===409)throw new StudioRequestError('conflict','A newer saved version of this listing exists. Download your working notes, then reopen the listing and compare the saved version before reapplying changes.');
  let data;try{data=await response.json();}catch{
   if(response.ok&&response.redirected)throw new StudioRequestError('session','The request reached a sign-in screen. Keep this tab open and sign in separately before checking the connection again.');
   throw new StudioRequestError('server','The website returned an unreadable response. Keep your working notes and try checking the connection again.');
  }
  if(!response.ok)throw new StudioRequestError('server',typeof data?.error==='string'?data.error:'The website could not complete this request. Keep your working notes and check the connection.');
  return data;
 }finally{clearTimeout(timer);}
}

// A deliberately incomplete recovery aid: text only, never photo bytes or credentials.
export function listingWorkingNotes(item={}){
 const text=(key,max)=>String(item[key]??'').slice(0,max);
 const number=key=>typeof item[key]==='number'&&Number.isFinite(item[key])?String(item[key]):'Not supplied';
 const fields=[['Listing title','title',120],['Public address','address',200],['Page address','slug',120],['MLS reference','mlsId',60],['Status','status',20],['Review date','updatedAt',20],['Tour URL','videoUrl',2000],['Property type','propertyType',80],['Listing source URL','sourceUrl',500],['Public attribution','attribution',300],['Description','description',6000],['Internal authorization note','permissionNote',500]];
 const photos=Array.isArray(item.images)?item.images.slice(0,20):[];
 return ['PRIVATE WORKING NOTES - BRAD HAZEN LISTING STUDIO','Contains current editor text, including any internal authorization note. Keep this copy private.','This download does not save or publish a listing. Photo files are NOT included. Keep originals separately; there is no automatic import or restore from this text file.',...fields.map(([label,key,max])=>label+':\n'+(text(key,max)||'Not supplied')), ...[['Price','price'],['Bedrooms','beds'],['Bathrooms','baths'],['Square feet','squareFeet'],['Lot size in acres','lotAcres']].map(([label,key])=>label+': '+number(key)),'Feature on homepage: '+(item.featured===true?'Yes':'No'),'PHOTO DESCRIPTIONS (FILES NOT INCLUDED)',...(photos.length?photos.map((photo,i)=>(i===0?'Cover':('Photo '+(i+1)))+': '+String(photo.alt??'').slice(0,200)):['No photo descriptions supplied.'])].join('\n\n')+'\n';
}
