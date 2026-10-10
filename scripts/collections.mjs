import assert from 'node:assert/strict';
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
export function propertyDetail(item){
 return `<div class="page-actions"><a class="button" href="#inquiry">Request a Showing</a><a href="tel:+13609219484">Call Brad About This Property</a></div><div class="property-overview"><div><span class="status-tag">${escapeHTML(item.status)}</span><p class="property-price">${priceLabel(item.price)}</p><p>${escapeHTML(item.address)}</p></div><dl class="property-specs">${facts(item).map(([label,value])=>`<div><dt>${label}</dt><dd>${escapeHTML(value)}</dd></div>`).join('')}</dl></div><div class="property-gallery">${item.images.map((image,i)=>`<figure><img src="/assets/${escapeHTML(image.file)}" alt="${escapeHTML(image.alt)}" width="800" height="530" ${i?'loading="lazy"':'fetchpriority="high"'} decoding="async"><figcaption>${escapeHTML(image.alt)}</figcaption></figure>`).join('')}</div>${item.videoUrl?`<p class="page-actions"><a class="button" href="${escapeHTML(item.videoUrl)}" target="_blank" rel="noopener noreferrer">View Tour / Video ↗</a></p>`:''}<article class="content-section"><h2>About this property</h2><p>${escapeHTML(item.description)}</p></article><aside class="listing-attribution"><p>${escapeHTML(item.attribution)}</p><p>Last reviewed: <time datetime="${item.updatedAt}">${item.updatedAt}</time>. This is a manually maintained listing; ask Brad to confirm current details and availability.</p></aside>`;
}
export function reviewCards(items){return `<div class="review-grid">${items.map(item=>`<figure class="review-card"><blockquote><p>${escapeHTML(item.quote)}</p></blockquote><figcaption>${escapeHTML(item.attribution)}${item.sourceUrl?`<a href="${escapeHTML(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">Read original review ↗</a>`:''}</figcaption></figure>`).join('')}</div>`;}
