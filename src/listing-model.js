// Shared by the build and draft studio. No credentials or provider calls.
export const listingStatuses=['Active','Pending','Sold'];
// Photo limits shared by the browser preparer and the server. Uploads must be strictly smaller.
export const photoMaxBytes=400000;
export const photoHistoryLimit=200;
export function blankListing(){return {published:false,featured:true,slug:'',title:'',address:'',price:null,status:'Active',description:'',attribution:'Brad Hazen · Realty Pro, Inc.',permissionNote:'',updatedAt:new Date().toISOString().slice(0,10),images:[]};}
export function listingErrors(item){
 const errors=[];
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug||''))errors.push('Property slug must use lowercase words and hyphens');
 for(const field of ['title','address','description','attribution','permissionNote','updatedAt'])if(typeof item[field]!=='string'||!item[field].trim())errors.push(`Property ${item.slug||'draft'}: ${field} must be non-empty text`);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(item.updatedAt||'')||Number.isNaN(Date.parse(item.updatedAt))||new Date(item.updatedAt).toISOString().slice(0,10)!==item.updatedAt)errors.push('Property: valid update date required');
 if(!listingStatuses.includes(item.status))errors.push('Property status must be Active, Pending, or Sold');
 if(!Number.isFinite(item.price)||item.price<0)errors.push('Property price must be a nonnegative number');
 for(const field of ['beds','baths','squareFeet','lotAcres'])if(item[field]!=null&&(!Number.isFinite(item[field])||item[field]<0))errors.push(`Invalid ${field}`);
 if(!Array.isArray(item.images)||!item.images.length)errors.push('Property needs an authorized image');
 for(const image of Array.isArray(item.images)?item.images:[]){
  if(!/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:webp|png|jpg|jpeg)$/.test(image.file||''))errors.push('Image must be a local asset filename');
  if(typeof image.alt!=='string'||!image.alt.trim())errors.push('Image alt must be non-empty text');
 }
 if(item.propertyType!=null&&(typeof item.propertyType!=='string'||item.propertyType.length>80))errors.push('Property type must be text under 80 characters');
 if(item.sourceUrl){try{const url=new URL(item.sourceUrl);if(url.protocol!=='https:'||url.username||url.password)throw Error();}catch{errors.push('Listing source must use an HTTPS link without credentials');}}
 if(item.videoUrl){try{if(new URL(item.videoUrl).protocol!=='https:')throw Error();}catch{errors.push('Tour/video link must use HTTPS');}}
 return [...new Set(errors)];
}

export function listingSlug(value){return String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/['’]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,120).replace(/-$/,'');}
