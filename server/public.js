import {contact} from '../src/contact.js';
import {listLines, detailPairs} from '../src/listing-model.js';
export const escapeHTML = value =>
  String(value ?? '').replace(
    /[&<>"']/g,
    c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]
  );
const e = escapeHTML;
const price = value =>
  new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(value);
const facts = item =>
  [
    ['beds', item.beds],
    ['baths', item.baths],
    ['sq ft', item.squareFeet],
    ['acres', item.lotAcres]
  ]
    .filter(([, v]) => v != null)
    .map(([label, v]) => e(v) + ' ' + label)
    .join(' · ');
const photo = (id, file) => '/media/' + id + '/' + e(file);
const number = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2});
// Calculated from the asking price and recorded size only; never stored, never an appraisal.
const perAcre = item => (item.lotAcres > 0 && item.price > 0 ? price(Math.round(item.price / item.lotAcres)) : null);
const perSqft = item =>
  item.squareFeet > 0 && item.price > 0 ? price(Math.round(item.price / item.squareFeet)) : null;
// Only an Active or Pending listing with a confirmed higher earlier price reads as reduced.
const reduction = item =>
  item.status !== 'Sold' && item.originalPrice > item.price && item.price >= 0
    ? {was: price(item.originalPrice), drop: price(item.originalPrice - item.price)}
    : null;
const excerpt = text => {
  const first = String(text ?? '')
    .split(/\n\s*\n/)[0]
    .replace(/\s+/g, ' ')
    .trim();
  return first.length > 150 ? first.slice(0, 147).replace(/\s+\S*$/, '') + '…' : first;
};
const chips = item =>
  [
    item.propertyType,
    item.lotAcres != null && number.format(item.lotAcres) + ' acres',
    item.beds != null && number.format(item.beds) + ' beds',
    item.baths != null && number.format(item.baths) + ' baths',
    item.squareFeet != null && number.format(item.squareFeet) + ' sq ft'
  ]
    .filter(Boolean)
    .map(label => `<li>${e(label)}</li>`)
    .join('');
export function cardMarkup({href, src, item, heading = 'h2'}) {
  const image = item.images[0];
  const count = item.images.length;
  const rate = perAcre(item);
  return `<article class="property-card"><a href="${href}"><div class="property-photo"><img src="${src}" alt="${e(image.alt)}" width="800" height="530" loading="lazy" decoding="async"><span class="property-status" data-status="${e(item.status)}">${e(item.status)}</span>${count > 1 ? `<span class="property-photo-count">${count} photos</span>` : ''}</div><div class="property-card-body"><p class="property-price">${price(item.price)}</p>${reduction(item) ? `<p class="property-reduced"><span class="reduced-tag">Price reduced</span> Was <s>${reduction(item).was}</s></p>` : ''}<${heading}>${e(item.title)}</${heading}><p class="property-address">${e(item.address)}</p><ul class="property-chips" aria-label="Key facts">${chips(item)}</ul>${rate ? `<p class="property-rate">About ${rate} per acre</p>` : ''}${excerpt(item.description) ? `<p class="property-excerpt">${e(excerpt(item.description))}</p>` : ''}<span class="property-link">View details <span aria-hidden="true">→</span></span></div></a></article>`;
}
export function cards(items, heading = 'h2') {
  return `<div class="property-grid">${items.map(({id, item}) => cardMarkup({href: '/properties/' + e(item.slug) + '/', src: photo(id, item.images[0].file), item, heading})).join('')}</div><p class="collection-note">Manually maintained listings. Confirm availability and details with Brad.</p>`;
}
const sourceLink = item => {
  try {
    const url = new URL(item.sourceUrl);
    if (url.protocol === 'https:' && !url.username && !url.password)
      return `<p><a href="${e(url.href)}" target="_blank" rel="noopener noreferrer">View listing source <span aria-hidden="true">↗</span></a></p>`;
  } catch {}
  return '';
};
const mapLink = item =>
  item.address
    ? `<a class="property-map" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(item.address)}" target="_blank" rel="noopener noreferrer">View on map <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>`
    : '';
const glance = item => {
  const tiles = [
    ['Type', item.propertyType],
    ['Lot size', item.lotAcres != null && number.format(item.lotAcres) + ' acres'],
    ['Bedrooms', item.beds != null && number.format(item.beds)],
    ['Bathrooms', item.baths != null && number.format(item.baths)],
    ['Interior', item.squareFeet != null && number.format(item.squareFeet) + ' sq ft'],
    ['Price per acre', perAcre(item)],
    ['Price per sq ft', perSqft(item)]
  ].filter(([, value]) => value);
  return tiles.length
    ? `<section class="property-glance" aria-labelledby="property-glance-heading"><h2 id="property-glance-heading">At a glance</h2><dl>${tiles.map(([label, value]) => `<div><dt>${e(label)}</dt><dd>${e(value)}</dd></div>`).join('')}</dl>${perAcre(item) || perSqft(item) ? '<p class="property-note">Per-unit prices are calculated from the asking price and are not an appraisal.</p>' : ''}</section>`
    : '';
};
const highlightList = item => {
  const lines = listLines(item.highlights);
  return lines.length
    ? `<section class="property-highlights" aria-labelledby="property-highlights-heading"><h2 id="property-highlights-heading">Highlights</h2><ul>${lines.map(line => `<li>${e(line)}</li>`).join('')}</ul></section>`
    : '';
};
const detailTable = item => {
  const rows = [
    ['Status', item.status],
    ['Asking price', item.price == null ? null : price(item.price)],
    ['Property type', item.propertyType],
    ['MLS #', item.mlsId],
    [
      'Lot size',
      item.lotAcres != null &&
        number.format(item.lotAcres) + ' acres (about ' + number.format(Math.round(item.lotAcres * 43560)) + ' sq ft)'
    ],
    ...detailPairs(item.keyDetails).filter(Boolean),
    ['Details reviewed', item.updatedAt]
  ].filter(([, value]) => value);
  return `<section class="property-details" aria-labelledby="property-details-heading"><h2 id="property-details-heading">Property details</h2><dl>${rows.map(([label, value]) => `<div><dt>${e(label)}</dt><dd>${e(value)}</dd></div>`).join('')}</dl></section>`;
};
// Paragraphs read as paragraphs; a paragraph that starts "Disclosure:" becomes a visible callout.
const descriptionBlocks = text => {
  const blocks = String(text || 'Description to be added')
    .split(/\n\s*\n/)
    .map(block => block.trim())
    .filter(Boolean);
  return blocks
    .map(block =>
      /^disclosure\s*:/i.test(block)
        ? `<aside class="property-disclosure"><strong>Disclosure</strong><p>${e(block.replace(/^disclosure\s*:\s*/i, ''))}</p></aside>`
        : `<p>${e(block)}</p>`
    )
    .join('');
};
export function propertyBody(item, {imageBase = '/assets/', preview = false} = {}) {
  const images = item.images || [];
  let tour = false;
  try {
    tour = new URL(item.videoUrl).protocol === 'https:';
  } catch {}
  const showing = `<a class="button" data-showing-email href="${contact.emailHref}?subject=${encodeURIComponent((item.status === 'Active' ? 'Showing inquiry: ' : 'Property inquiry: ') + item.address)}">${item.status === 'Active' ? 'Request a Showing by Email' : 'Ask Brad About This Property'}</a>`;
  const gallery = images.length
    ? `<p class="gallery-note">Select a photo to view it larger.</p><div id="property-photos" class="property-gallery" aria-label="Property photos">${images.map((image, i) => `<figure><a href="${e(imageBase + image.file)}" data-gallery-photo aria-label="View photo ${i + 1}: ${e(image.alt || 'Property photo')}"><img src="${e(imageBase + image.file)}" alt="${e(image.alt)}" width="800" height="530" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async"><span class="photo-enlarge" aria-hidden="true">View photo ${i + 1} / ${images.length}</span></a><figcaption>${e(image.alt)}</figcaption></figure>`).join('')}</div>`
    : '<p id="property-photos" class="empty-state">Listing photos have not been added yet.</p>';
  return `<div data-property data-preview="${preview}" class="property-detail"><nav class="property-jumps" aria-label="Property sections"><a href="#property-photos">Photos</a><a href="#property-description">Details</a>${preview ? '' : '<a href="#property-contact">Contact Brad</a>'}</nav>${preview ? '<aside class="private-preview"><strong>Private saved-draft preview · not published</strong><p>This shows the last saved draft. Unsaved editor changes are excluded. Only enrolled editors can open this page.</p><a href="/studio/">Return to Listing Studio</a></aside>' : ''}<div class="property-overview"><div><span class="status-tag" data-status="${e(item.status || 'Draft')}">${e(item.status || 'Draft')}</span><p class="property-price">${item.price == null ? 'Price to be added' : price(item.price)}</p>${reduction(item) ? `<p class="property-reduced"><span class="reduced-tag">Price reduced</span> Was <s>${reduction(item).was}</s> · down ${reduction(item).drop}</p>` : ''}<p class="property-address">${e(item.address || 'Address to be added')}</p><p class="property-meta">${item.mlsId ? `<span class="property-mls">MLS # ${e(item.mlsId)}</span>` : ''}${mapLink(item)}</p></div><p class="property-facts">${item.propertyType ? e(item.propertyType) + ' · ' : ''}${facts(item)}</p></div>${!preview && item.status !== 'Active' ? `<p class="availability-note">${item.status === 'Sold' ? 'This property is marked Sold. Ask Brad about similar homes.' : 'This property is marked Pending. Ask Brad about current availability.'}</p>` : ''}<div class="property-layout"><div class="property-main">${gallery}${glance(item)}${highlightList(item)}<article id="property-description" class="content-section property-description"><h2>About this property</h2>${descriptionBlocks(item.description)}</article>${detailTable(item)}${tour ? `<p class="property-tour"><a class="button" href="${e(item.videoUrl)}" target="_blank" rel="noopener noreferrer">View Tour / Video ↗</a></p>` : ''}<aside class="listing-attribution"><p>${e(item.attribution)}</p>${sourceLink(item)}<p>Last reviewed: ${e(item.updatedAt || 'Not recorded')}. Contact Brad to confirm details and availability.</p></aside></div><aside class="property-side"><div class="property-side-card">${preview ? '' : `<p class="eyebrow">Interested?</p><div class="page-actions">${showing}<a href="${contact.phoneHref}">Call Brad: ${contact.phone}</a></div>`}<div class="property-tools">${preview ? '' : '<button type="button" data-share-property hidden>Share Listing</button>'}<button type="button" data-print-property hidden>Print Property Sheet</button><p data-share-status role="status" aria-live="polite"></p><label data-share-fallback hidden>Listing link<input readonly aria-label="Listing link"></label></div></div></aside></div>${preview ? '' : `<aside id="property-contact" class="property-contact-panel"><div><p class="eyebrow">Your next move</p><h2>Talk with Brad about this property</h2><p>Confirm the details, discuss your plans, or find a time to visit.</p></div><div><a class="button" href="${contact.phoneHref}">Call ${contact.phone}</a><a href="${contact.emailHref}">Email ${contact.email}</a><p>Email links open your email application; you send the message.</p></div></aside>`}<div class="property-print-contact"><strong>Brad Hazen · Realty Pro, Inc.</strong><p>${contact.phone} · ${contact.email}</p></div></div>`;
}
export function detail(id, item, {preview = false} = {}) {
  return `<section class="inner-hero"><h1>${e(item.title || 'Untitled listing')}</h1></section><section class="section inner-content"><nav class="breadcrumbs" aria-label="Breadcrumb">${preview ? '<a href="/studio/">Listing Studio</a>' : '<a href="/">Home</a><span>/</span><a href="/properties/">Properties</a>'}</nav>${propertyBody(item, {imageBase: preview ? '/api/admin/listings/' + id + '/photos/' : '/media/' + id + '/', preview})}</section>`;
}
export async function published(env) {
  if (!env.DB) return [];
  const rows = await env.DB.prepare(
    'SELECT id,published_json FROM listings WHERE archived=0 AND published_json IS NOT NULL ORDER BY updated_at DESC'
  ).all();
  const items = [];
  for (const row of rows.results) {
    // One unreadable snapshot must not take the whole collection down.
    try {
      const item = JSON.parse(row.published_json);
      if (!item || !Array.isArray(item.images) || !item.images.length || typeof item.slug !== 'string')
        throw Error('Incomplete snapshot');
      items.push({id: row.id, item});
    } catch (error) {
      console.error('Skipping unreadable published listing', row.id, error?.message);
    }
  }
  return items;
}

export function collection(items, url) {
  if (!items.length)
    return `<div class="collection-welcome"><p class="eyebrow">Presented by Brad Hazen</p><h2>Your next property conversation starts here.</h2><p>Brad’s approved listings will appear here as they are published. Ask about current opportunities or explore how your own property could be presented.</p><p class="collection-availability" role="status">No listings published yet</p><div class="collection-next-steps"><a href="/contact/#inquiry"><span class="eyebrow">Looking for a property</span><h3>Ask about current opportunities</h3><p>Tell Brad the location, property features, and timing you have in mind.</p><span class="collection-next-action">Start a conversation →</span></a><a href="/listing-marketing/"><span class="eyebrow">Considering a sale</span><h3>Explore the listing approach</h3><p>See how a dedicated property page can support your listing presentation.</p><span class="collection-next-action">Plan your presentation →</span></a></div><a class="collection-community-link" href="/communities/">Explore Local Communities →</a></div>`;
  const query = (url.searchParams.get('q') || '').trim().slice(0, 120),
    status = ['Active', 'Pending', 'Sold'].includes(url.searchParams.get('status'))
      ? url.searchParams.get('status')
      : 'all',
    sort = ['price-low', 'price-high'].includes(url.searchParams.get('sort')) ? url.searchParams.get('sort') : 'newest';
  const readPrice = key => {
    const value = (url.searchParams.get(key) || '').trim();
    return !value ? null : /^\d{1,11}$/.test(value) && Number(value) <= 10000000000 ? Number(value) : NaN;
  };
  let min = readPrice('min'),
    max = readPrice('max');
  const invalidRange = Number.isNaN(min) || Number.isNaN(max) || (min != null && max != null && min > max);
  if (invalidRange) min = max = null;
  const beds = ['1', '2', '3', '4', '5'].includes(url.searchParams.get('beds'))
    ? Number(url.searchParams.get('beds'))
    : 0;
  const matches = items.filter(
    ({item}) =>
      (status === 'all' || item.status === status) &&
      (!query || (item.title + ' ' + item.address).toLowerCase().includes(query.toLowerCase())) &&
      (min == null || item.price >= min) &&
      (max == null || item.price <= max) &&
      (!beds || (Number.isFinite(item.beds) && item.beds >= beds))
  );
  if (sort !== 'newest')
    matches.sort((a, b) => (sort === 'price-low' ? a.item.price - b.item.price : b.item.price - a.item.price));
  const active = [
    query && 'Address/name: ' + query,
    status !== 'all' && status,
    min != null && 'From ' + price(min),
    max != null && 'Up to ' + price(max),
    beds && beds + '+ bedrooms'
  ].filter(Boolean);
  return `<p class="section-lead">Explore properties presented by Brad. These listings are maintained here individually; this is not a live MLS search.</p><form class="property-filters" action="/properties/" method="get"><div class="property-filter-primary"><label>Find a property<input name="q" type="search" maxlength="120" value="${e(query)}" placeholder="Address or property name"></label><label>Status<select name="status">${['all', 'Active', 'Pending', 'Sold'].map(value => `<option value="${value}" ${value === status ? 'selected' : ''}>${value === 'all' ? 'All statuses' : value}</option>`).join('')}</select></label><label>Sort by<select name="sort">${[
    ['newest', 'Recently updated'],
    ['price-low', 'Price: low to high'],
    ['price-high', 'Price: high to low']
  ]
    .map(([value, label]) => `<option value="${value}" ${value === sort ? 'selected' : ''}>${label}</option>`)
    .join(
      ''
    )}</select></label></div><details class="property-filter-more" ${min != null || max != null || beds || invalidRange ? 'open' : ''}><summary>Price and bedrooms${min != null || max != null || beds ? ' · filters applied' : ''}</summary><div><label>Minimum price ($)<input name="min" type="number" inputmode="numeric" min="0" max="10000000000" step="1" value="${min ?? ''}" placeholder="No minimum"></label><label>Maximum price ($)<input name="max" type="number" inputmode="numeric" min="0" max="10000000000" step="1" value="${max ?? ''}" placeholder="No maximum"></label><label>Bedrooms<select name="beds"><option value="" ${!beds ? 'selected' : ''}>Any / include land</option>${[1, 2, 3, 4, 5].map(value => `<option value="${value}" ${value === beds ? 'selected' : ''}>${value}+ bedrooms</option>`).join('')}</select></label></div><p>Bedroom filters exclude listings without a bedroom count, including land.</p></details><div class="property-filter-actions"><button class="button" type="submit">Apply Filters</button><a href="/properties/">Clear All Filters</a></div></form>${invalidRange ? '<p class="property-filter-warning" role="alert">The price range was not applied. Enter whole dollar amounts with the minimum no higher than the maximum, then apply your filters again.</p>' : ''}<div class="property-results-summary"><p role="status">${matches.length} of ${items.length} ${items.length === 1 ? 'property' : 'properties'} shown</p>${active.length ? `<ul aria-label="Applied filters">${active.map(label => `<li>${e(label)}</li>`).join('')}</ul>` : '<p>All published listings in Brad’s collection</p>'}</div>${matches.length ? cards(matches) : items.length ? '<div class="empty-state"><h2>No listings match your filters</h2><p>Broaden your price range, choose any bedroom count, or try another address or status.</p><a class="button" href="/properties/">Reset Filters</a> <a href="/contact/#inquiry">Tell Brad What You’re Looking For</a></div>' : '<div class="empty-state"><p class="eyebrow">Brad’s property collection</p><h2>New listings will appear here.</h2><p>Contact Brad for current opportunities, or discuss a plan for presenting your own property.</p><div class="page-actions"><a class="button" href="/contact/#inquiry">Ask About Current Listings</a><a href="/listing-marketing/">Explore the Listing Approach →</a></div></div>'}`;
}
