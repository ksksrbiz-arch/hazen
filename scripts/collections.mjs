import assert from 'node:assert/strict';
import {propertyBody} from '../server/public.js';
import {listingErrors} from '../src/listing-model.js';
export const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=(value,label)=>assert(typeof value==='string'&&value.trim(),`${label} must be non-empty text`);
export function getCollections(content){
 const properties=(content.properties||[]).filter(item=>item.published===true);
 const testimonials=(content.testimonials||[]).filter(item=>item.published===true);
 const seen=new Set();
 for(const item of properties){
  const errors=listingErrors(item);assert(!errors.length,errors.join('; '));
  assert(!seen.has(item.slug),'Property slugs must be unique');seen.add(item.slug);
 }
 for(const item of testimonials){for(const field of ['quote','attribution','permissionNote'])text(item[field],`Testimonial ${field}`);if(item.sourceUrl)assert(/^https:\/\//.test(item.sourceUrl),'Review source must use HTTPS');}
 return {properties,testimonials};
}
export const priceLabel=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);
export function propertyCards(items,heading='h2'){
 assert(['h2','h3'].includes(heading));
 return `<div class="property-grid">${items.map(item=>`<article class="property-card"><a href="/properties/${item.slug}/"><div class="property-photo"><img src="/assets/${escapeHTML(item.images[0].file)}" alt="${escapeHTML(item.images[0].alt)}" width="800" height="530" loading="lazy" decoding="async"><span class="property-status">${escapeHTML(item.status)}</span></div><div class="property-card-body"><p class="property-price">${priceLabel(item.price)}</p><${heading}>${escapeHTML(item.title)}</${heading}><p>${escapeHTML(item.address)}</p><p class="property-facts">${facts(item).map(([label,value])=>`${escapeHTML(value)} ${label}`).join(' · ')}</p><span class="property-link">View Property →</span></div></a></article>`).join('')}</div><p class="collection-note">Manually maintained featured properties. Availability and details may change; confirm with Brad.</p>`;
}
function facts(item){return [['beds',item.beds],['baths',item.baths],['sq ft',item.squareFeet]].filter(([,value])=>value!=null);}
export function propertyDetail(item){return propertyBody(item);}
export function reviewCards(items){return `<div class="review-grid">${items.map(item=>`<figure class="review-card"><blockquote><p>${escapeHTML(item.quote)}</p></blockquote><figcaption>${escapeHTML(item.attribution)}${item.sourceUrl?`<a href="${escapeHTML(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">Read original review ↗</a>`:''}</figcaption></figure>`).join('')}</div>`;}
