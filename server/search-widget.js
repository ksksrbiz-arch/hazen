import {galleryResponse, widgetStyle} from './ylopo-gallery.js';
import {searchWidgetClient} from '../src/search-widget-client.js';

export function searchWidgetResponse() {
  const cities = [
    'Vancouver',
    'Camas',
    'Ridgefield',
    'Battle Ground',
    'Brush Prairie',
    'Washougal',
    'Yacolt',
    'La Center'
  ];
  const styles = `
  body{padding:8px;margin:0}h1{font:600 26px/1.3 system-ui;color:#173f47;margin:0 0 8px}.intro{color:#526269;margin:0 0 24px}
  .filters{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;padding:24px;background:#fff;border:1px solid #dce3df;border-radius:14px}
  label{display:flex;flex-direction:column;gap:8px;font-weight:600;font-size:14px}input,select,button{font:inherit;min-height:48px;border:1px solid #a4b5b5;border-radius:6px;padding:10px 12px;width:100%;background:#fff;color:#173f47;min-width:0}button{cursor:pointer;font-weight:700}.primary{background:#173f47;color:#fff;border-color:#173f47}button:hover{filter:brightness(.94)}.actions{display:flex;align-items:end;gap:10px}.actions button{width:auto;flex:1}input:focus-visible,select:focus-visible,button:focus-visible{outline:3px solid #967323;outline-offset:3px}
  #search-status{font-weight:600;font-size:18px;margin:28px 0 8px}#search-summary,.provider-note{font-size:14px;color:#526269}.result-actions{display:flex;gap:12px;flex-wrap:wrap;margin:24px 0}.result-actions button{width:auto}.provider-links{padding:20px;background:#eaf0ed;border-radius:10px;margin-top:20px}.provider-links a{font-weight:600}.YLOPO-widget .gallery-card-b-image-container img{object-fit:cover;width:100%!important}.YLOPO-widget .gallery-card-b-image-container>div{width:100%!important}
  .YLOPO-widget .locality span{color:#526269!important}
  .YLOPO-widget .gallery-card-b-image-container{width:100%!important}
  .YLOPO-widget .gallery-card-b-image-container>a{display:block;height:100%}
  .YLOPO-widget .listing-image-with-map-image-layout,.YLOPO-widget .listin-image-with-map-compliance-bin,.YLOPO-widget .full-background-img,.YLOPO-widget .full-background-img .img{width:100%!important;height:100%!important}
  .YLOPO-widget .listing-status-flag{background:#173f47!important;color:#fff!important}
  .YLOPO-widget .favorite-icon-wrapper{display:none!important}
  [hidden]{display:none!important}@media(max-width:700px){.filters{grid-template-columns:repeat(2,minmax(0,1fr));padding:16px;gap:14px}.actions{grid-column:1/-1}}@media(max-width:380px){.filters{grid-template-columns:1fr}.actions{flex-wrap:wrap}}
  `;
  const query = {locations: [{city: 'Vancouver', state: 'WA'}], propertyTypes: [], limit: 6};
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Property search filters | Brad Hazen</title><style>${widgetStyle}${styles}</style></head><body>
  <h1>Find a place that fits</h1><p class="intro">Search local properties from across the market. Start with a city, then narrow your options.</p>
  <form id="search-filters" class="filters">
  <label>City<select name="city" aria-label="City">${cities.map(city => `<option>${city}</option>`).join('')}</select></label>
  <label>Minimum price ($)<input name="min" type="number" inputmode="numeric" min="0" max="1000000000" step="1" placeholder="No minimum"></label>
  <label>Maximum price ($)<input name="max" type="number" inputmode="numeric" min="0" max="1000000000" step="1" placeholder="No maximum"></label>
  <label>Property type<select name="type" aria-label="Property type"><option value="">All types, including land</option><option value="house">Single-family home</option><option value="condo">Condo</option><option value="townhouse">Townhouse</option><option value="manuf">Manufactured home</option><option value="apt">Multi-family</option></select></label>
  <label>Bedrooms<select name="beds" aria-label="Bedrooms"><option value="">Any</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option><option value="5">5+</option></select></label>
  <div class="actions"><button type="submit" class="primary">Search properties</button><button type="reset">Reset</button></div></form>
  <p id="search-status" role="status" aria-live="polite">Loading property search…</p><p id="search-summary"></p>
  <div id="search-results" class="YLOPO_resultsWidget" aria-busy="true" data-search='${JSON.stringify(query)}'></div>
  <div class="result-actions"><button id="search-more" class="primary" hidden>Show more properties</button><button id="search-retry" hidden>Try again</button></div>
  <div class="provider-links"><a href="https://bradhazen.realtypronw.net/" target="_blank" rel="noopener">Open full map search &amp; account tools ↗</a><p class="provider-note">Property details, saved searches and registration open on Brad’s Realty Pro search site in a new tab. Listing information and brokerage attribution are supplied by Realty Pro.</p></div>
  <noscript><p>Enable JavaScript to use these filters, or open the full-search link above.</p></noscript>
  <script>${searchWidgetClient}</script><script defer src="https://bradhazen.realtypronw.net/build/js/widgets-1.0.0.js"></script></body></html>`,
    {headers: galleryResponse().headers}
  );
}
