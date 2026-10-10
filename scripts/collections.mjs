import assert from 'node:assert/strict';
export const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=(value,label)=>assert(typeof value==='string'&&value.trim(),`${label} must be non-empty text`);
export function getCollections(content){
 const properties=(content.properties||[]).filter(item=>item.published===true);
 const testimonials=(content.testimonials||[]).filter(item=>item.published===true);
 const seen=new Set();
 for(const item of properties){
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug),'Property slug must use lowercase words and hyphens');
  assert(!seen.has(item.slug),'Property slugs must be unique');seen.add(item.slug);
  for(const field of ['title','address','description','attribution','permissionNote','updatedAt'])text(item[field],`Property ${item.slug}: ${field}`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(item.updatedAt)&&!Number.isNaN(Date.parse(item.updatedAt))&&new Date(item.updatedAt).toISOString().slice(0,10)===item.updatedAt,`Property ${item.slug}: valid update date required`);
  assert(['Active','Pending','Sold'].includes(item.status),'Property status must be Active, Pending, or Sold');
  assert(Number.isFinite(item.price)&&item.price>=0,'Property price must be a nonnegative number');
  for(const field of ['beds','baths','squareFeet'])if(item[field]!=null)assert(Number.isFinite(item[field])&&item[field]>=0,`Invalid ${field}`);
  assert(Array.isArray(item.images)&&item.images.length,'Property needs an authorized image');
  for(const image of item.images){assert(/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:webp|png|jpg|jpeg)$/.test(image.file),'Image must be a local asset filename');text(image.alt,'Image alt');}
 }
 for(const item of testimonials){for(const field of ['quote','attribution','permissionNote'])text(item[field],`Testimonial ${field}`);if(item.sourceUrl)assert(/^https:\/\//.test(item.sourceUrl),'Review source must use HTTPS');}
 return {properties,testimonials};
}
export const priceLabel=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);
export function propertyCards(items){
 return `<div class="property-grid">${items.map(item=>`<article class="property-card"><a href="/properties/${item.slug}/"><div class="property-photo"><img src="/assets/${escapeHTML(item.images[0].file)}" alt="${escapeHTML(item.images[0].alt)}" width="800" height="530" loading="lazy" decoding="async"><span class="property-status">${escapeHTML(item.status)}</span></div><div class="property-card-body"><p class="property-price">${priceLabel(item.price)}</p><h2>${escapeHTML(item.title)}</h2><p>${escapeHTML(item.address)}</p><p class="property-facts">${facts(item).map(([label,value])=>`${escapeHTML(value)} ${label}`).join(' · ')}</p><span class="property-link">View Property →</span></div></a></article>`).join('')}</div><p class="collection-note">Manually maintained featured properties. Availability and details may change; confirm with Brad.</p>`;
}
function facts(item){return [['beds',item.beds],['baths',item.baths],['sq ft',item.squareFeet]].filter(([,value])=>value!=null);}
export function propertyDetail(item){
 return `<div class="property-overview"><div><span class="status-tag">${escapeHTML(item.status)}</span><p class="property-price">${priceLabel(item.price)}</p><p>${escapeHTML(item.address)}</p></div><dl class="property-specs">${facts(item).map(([label,value])=>`<div><dt>${label}</dt><dd>${escapeHTML(value)}</dd></div>`).join('')}</dl></div><div class="property-gallery">${item.images.map((image,i)=>`<figure><img src="/assets/${escapeHTML(image.file)}" alt="${escapeHTML(image.alt)}" width="800" height="530" ${i?'loading="lazy"':'fetchpriority="high"'} decoding="async"><figcaption>${escapeHTML(image.alt)}</figcaption></figure>`).join('')}</div><article class="content-section"><h2>About this property</h2><p>${escapeHTML(item.description)}</p></article><aside class="listing-attribution"><p>${escapeHTML(item.attribution)}</p><p>Last reviewed: <time datetime="${item.updatedAt}">${item.updatedAt}</time>. This is a manually maintained listing; ask Brad to confirm current details and availability.</p></aside>`;
}
export function reviewCards(items){return `<div class="review-grid">${items.map(item=>`<figure class="review-card"><blockquote><p>${escapeHTML(item.quote)}</p></blockquote><figcaption>${escapeHTML(item.attribution)}${item.sourceUrl?`<a href="${escapeHTML(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">Read original review ↗</a>`:''}</figcaption></figure>`).join('')}</div>`;}
