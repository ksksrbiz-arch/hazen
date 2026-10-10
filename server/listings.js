import {listingErrors} from '../src/listing-model.js';
export const idPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export const filePattern=/^listing-[0-9a-f-]{36}\.(jpg|png|webp)$/;
const fields=['slug','title','address','mlsId','price','status','description','attribution','permissionNote','updatedAt','beds','baths','squareFeet','featured','videoUrl'];
export function cleanDraft(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Invalid listing');
 const item={published:false};
 for(const name of fields){const value=input[name];if(value!==undefined){if(typeof value==='string'){if(value.length>(name==='description'?6000:500))throw Error('Listing text is too long');item[name]=value.trim();}else if(typeof value==='boolean'||value===null||typeof value==='number'&&Number.isFinite(value))item[name]=value;else throw Error('Invalid listing field');}}
 if(!Array.isArray(input.images)||input.images.length>20)throw Error('Maximum 20 photos');
 item.images=input.images.map(image=>{if(!filePattern.test(image.file)||typeof image.alt!=='string'||image.alt.length>200)throw Error('Invalid photo');return {file:image.file,alt:image.alt.trim()};});
 return item;
}
export function publicListing(item){const {permissionNote,...publicItem}=item;return {...publicItem,published:true};}
export function rowRecord(row){return {id:row.id,revision:row.revision,listing:JSON.parse(row.draft_json),published:row.published_json!==null,publicSlug:row.published_json?JSON.parse(row.published_json).slug:null,savedAt:row.updated_at,archived:Boolean(row.archived),hasUnpublishedChanges:row.published_json!==null&&JSON.stringify(publicListing(JSON.parse(row.draft_json)))!==row.published_json};}
export async function publishErrors(item,id,env){
 const errors=listingErrors(item);
 for(const image of item.images){const key=id+'/'+image.file;const row=await env.DB.prepare('SELECT key FROM photos WHERE key = ? AND listing_id = ?').bind(key,id).first();if(!row||!await env.PHOTOS.head(key))errors.push('Save all listing photos before publishing');}
 return [...new Set(errors)];
}
export async function change(env,id,revision,actor,action,listing){
 const now=new Date().toISOString();let statement;
 if(action==='restore')statement=env.DB.prepare('UPDATE listings SET archived=0,published_json=NULL,revision=revision+1,updated_at=?,updated_by=? WHERE id=? AND revision=? AND archived=1').bind(now,actor,id,revision);
 else if(action==='save')statement=env.DB.prepare('UPDATE listings SET draft_json=?,revision=revision+1,updated_at=?,updated_by=? WHERE id=? AND revision=? AND archived=0').bind(JSON.stringify(listing),now,actor,id,revision);
 else if(action==='publish')statement=env.DB.prepare('UPDATE listings SET published_json=?,revision=revision+1,updated_at=?,updated_by=? WHERE id=? AND revision=? AND archived=0').bind(JSON.stringify(publicListing(listing)),now,actor,id,revision);
 else statement=env.DB.prepare(`UPDATE listings SET published_json=NULL,archived=${action==='archive'?1:0},revision=revision+1,updated_at=?,updated_by=? WHERE id=? AND revision=? AND archived=0`).bind(now,actor,id,revision);
 // D1 batch is transactional. changes() records an event only if the revision matched.
 const result=await env.DB.batch([statement,env.DB.prepare('INSERT INTO listing_events(listing_id,action,revision,actor,happened_at) SELECT ?,?,?,?,? WHERE changes() = 1').bind(id,action,revision+1,actor,now)]);
 return result[0].meta.changes===1;
}
export function imageType(bytes){const b=new Uint8Array(bytes);if(b.length>3&&b[0]===255&&b[1]===216&&b[2]===255)return 'image/jpeg';if(b.length>8&&[137,80,78,71,13,10,26,10].every((v,i)=>b[i]===v))return 'image/png';if(b.length>12&&String.fromCharCode(...b.slice(0,4))==='RIFF'&&String.fromCharCode(...b.slice(8,12))==='WEBP')return 'image/webp';return null;}
