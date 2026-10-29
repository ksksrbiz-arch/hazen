// Explicit selection approved by Keith; add future MLS numbers here.
export const bradMlsNumbers = ['24202394', '24434415'];
export const galleryMarkup = `<div class="listing-experience"><div class="listing-toolbar"><p><span class="listing-provider-dot" aria-hidden="true"></span>Property details from Realty Pro</p><a href="/contact/#inquiry">Ask Brad about a property <span aria-hidden="true">↗</span></a></div><p class="listing-load-status" role="status" data-gallery-status hidden>Loading selected listings…</p><iframe class="brad-listings-frame" src="/listing-widget/" title="Brad Hazen listings from Realty Pro" loading="lazy" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"></iframe><div class="listing-footnote"><p>Explore the photos and current details on Brad’s Realty Pro site. Property links open in a new tab.</p><details><summary>Having trouble viewing the listings?</summary><p>Open a listing directly: <a href="https://bradhazen.realtypronw.net/search/detail/210989090">East Yacolt Road · MLS 24202394</a> or <a href="https://bradhazen.realtypronw.net/search/detail/205684283">NE Hazen Avenue · MLS 24434415</a>.</p></details><noscript><p>The gallery requires JavaScript. Open a listing directly using the links under “Having trouble viewing the listings?” above.</p></noscript></div></div>`;
const widgetStyle = `
*{box-sizing:border-box}body{margin:0;padding:8px;font:16px/1.5 system-ui;background:#f7f8f5;color:#172e33}a{color:#173f47}h1{font:600 16px system-ui;margin:4px 0 18px;color:#526269}
.YLOPO-widget .widget-gallery-container{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
.YLOPO-widget .grid-view-item{width:auto!important;float:none!important;padding:0!important;margin:0!important}
.YLOPO-widget .gallery-card-b,.YLOPO-widget .gallery-card-b-main-card{width:100%!important;height:auto!important;min-height:0!important}.YLOPO-widget .gallery-card-b-details-container{height:auto!important;min-height:0!important}.YLOPO-widget .gallery-card-b{border:1px solid #dce3df!important;border-radius:14px;overflow:hidden;background:#fff;box-shadow:0 8px 22px #142f3510}
.YLOPO-widget .gallery-card-b-image-container{height:260px!important}
.YLOPO-widget .gallery-card-b-address-block{padding:20px 16px 12px!important;font:600 23px/1.35 system-ui!important;text-align:left}
.YLOPO-widget .locality{font:400 15px/1.6 system-ui!important;color:#526269}
.YLOPO-widget .summary-info{padding:10px 16px!important;font-family:system-ui!important}
.YLOPO-widget .info-block{font-size:16px!important}.YLOPO-widget .info-block .label{color:#526269!important;font-size:12px!important}
.YLOPO-widget .gallery-card-b-generate-sort-block{padding:12px!important;font:14px system-ui!important}
.YLOPO-widget .idx-compliance{display:flex!important;align-items:center;justify-content:center;gap:14px;padding:14px!important;font:14px system-ui!important;border-top:1px solid #e5e9e6}
.YLOPO-widget .idx-compliance img{width:90px!important;max-width:90px!important;height:auto!important;object-fit:contain}
body .YLOPO-widget a.gallery-detail-link{display:block;padding:15px 20px;background:#173f47;color:white!important;text-decoration:none;font-weight:600;text-align:center}body .YLOPO-widget a.gallery-detail-link:hover{background:#27565f}a:focus-visible,button:focus-visible{outline:3px solid #967323;outline-offset:-4px}
@media(max-width:620px){.YLOPO-widget .widget-gallery-container{grid-template-columns:1fr;gap:20px}.YLOPO-widget .gallery-card-b-image-container{height:230px!important}}
`;
const widgetClient = `
window.YLOPO_WIDGETS={domain:'bradhazen.realtypronw.net',openInNewTab:true};
const send=(state)=>parent.postMessage({type:'brad-listing-gallery',height:document.body.offsetHeight+16,state},'*');
let ready=false;
new ResizeObserver(()=>send(ready?'ready':'loading')).observe(document.body);
new MutationObserver(()=>{
 const cards=[...document.querySelectorAll('.grid-view-item')];
 for(const card of cards){
  const link=card.querySelector('a[href]'),address=card.querySelector('.gallery-card-b-address-block');
  if(!link || !address)continue;
  link.setAttribute('aria-label','View '+address.textContent.trim()+' property details (opens in a new tab)');
  const map=card.querySelector('button.card-icon');if(map)map.setAttribute('aria-label','Switch property photo and map');
  if(!card.querySelector('.gallery-detail-link')){const detail=document.createElement('a');detail.href=link.href;detail.className='gallery-detail-link';detail.textContent='View property details ↗';detail.setAttribute('aria-label',link.getAttribute('aria-label'));card.querySelector('.gallery-card-b').append(detail);}
 }
 if(cards.length && !ready){ready=true;send('ready');}
}).observe(document.querySelector('.YLOPO_resultsWidget'),{childList:true,subtree:true});
setTimeout(()=>{if(!ready)send('unavailable');},15000);
document.addEventListener('click',function(event){const link=event.target.closest('a[href]');if(link && new URL(link.href).hostname==='bradhazen.realtypronw.net'){event.preventDefault();event.stopImmediatePropagation();window.open(link.href,'_blank','noopener');}},true);
`;
export function galleryResponse() {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Brad Hazen listings</title><style>${widgetStyle}</style></head><body><h1 style="font-size:18px">Featured properties</h1><div class="YLOPO_resultsWidget" data-search='${JSON.stringify({mlsId: bradMlsNumbers, limit: 6})}'></div><script>${widgetClient}</script><script defer src="https://bradhazen.realtypronw.net/build/js/widgets-1.0.0.js"></script></body></html>`,
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-store',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Security-Policy':
          "default-src 'none'; script-src 'unsafe-inline' https://bradhazen.realtypronw.net https://portal.ylopo.com/api/1.0/widget/content https://portal.ylopo.com/api/1.0/listings https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js; style-src 'unsafe-inline' https://bradhazen.realtypronw.net https://fonts.googleapis.com; img-src https: data:; font-src https://bradhazen.realtypronw.net https://d2hnwe88wt837l.cloudfront.net https://fonts.gstatic.com data:; connect-src https://bradhazen.realtypronw.net; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'self'; upgrade-insecure-requests"
      }
    }
  );
}
