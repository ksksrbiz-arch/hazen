// Explicit selection approved by Keith; add future MLS numbers here.
export const bradMlsNumbers = ['24202394', '24434415'];
export const galleryMarkup = `<iframe class="brad-listings-frame" src="/listing-widget/" title="Brad Hazen listings from Realty Pro" loading="lazy" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"></iframe><p>Selected listings presented by Brad. Details open on Brad’s Realty Pro search site in a new tab.</p><p><a href="https://bradhazen.realtypronw.net/search/detail/210989090">East Yacolt Road · MLS 24202394</a> · <a href="https://bradhazen.realtypronw.net/search/detail/205684283">NE Hazen Avenue · MLS 24434415</a></p><p>Confirm availability with Brad. <a href="/search/">Search the full market</a>.</p>`;
export function galleryResponse() {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Brad Hazen listings</title><style>body{margin:0;font:16px system-ui;background:white}a{color:#17566c}</style></head><body><h1 style="font-size:18px">Featured properties</h1><div class="YLOPO_resultsWidget" data-search='${JSON.stringify({mlsId: bradMlsNumbers, limit: 6})}'></div><script>window.YLOPO_WIDGETS={domain:'bradhazen.realtypronw.net',openInNewTab:true};document.addEventListener('click',function(event){const link=event.target.closest('a[href]');if(link && new URL(link.href).hostname==='bradhazen.realtypronw.net'){event.preventDefault();event.stopImmediatePropagation();window.open(link.href,'_blank','noopener');}},true);</script><script defer src="https://bradhazen.realtypronw.net/build/js/widgets-1.0.0.js"></script></body></html>`,
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
