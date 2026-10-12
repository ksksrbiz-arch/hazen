import {contact} from '../src/contact.js';
const states = {
  page: {
    status: 404,
    title: 'Let’s get you back on track.',
    eyebrow: 'Page not found',
    description:
      'This page could not be found. The link may have changed. Choose a place to continue or contact Brad directly.',
    primary: ['/', 'Return Home']
  },
  property: {
    status: 404,
    title: 'Let’s find your next step.',
    eyebrow: 'Property page unavailable',
    description:
      'This property page is not available. Its link may have changed or the page may have been removed. Contact Brad to confirm current details and availability.',
    primary: ['/properties/', 'Explore Properties']
  },
  listings: {
    status: 503,
    title: 'You can still connect with Brad.',
    eyebrow: 'Listings temporarily unavailable',
    description:
      'We could not load the property collection right now. Try again later, explore the buying and selling guides, or contact Brad directly.',
    primary: ['/properties/', 'Try Properties Again']
  }
};
const state = kind => (Object.hasOwn(states, kind) ? states[kind] : states.page);
export function publicRecoveryContent(kind = 'page') {
  const s = state(kind);
  return `<section class="section recovery-page" aria-labelledby="recovery-heading"><p class="eyebrow">${s.eyebrow}</p><h1 id="recovery-heading">${s.title}</h1><p class="recovery-description">${s.description}</p><div class="recovery-actions"><a class="button" href="${s.primary[0]}">${s.primary[1]}</a><a href="/contact/#inquiry">Talk With Brad →</a></div><nav class="recovery-paths" aria-label="Places to continue"><a href="/buy/"><span>Planning a purchase</span><strong>Explore Buying</strong><small>Clarify your priorities and next steps →</small></a><a href="/sell/"><span>Considering a sale</span><strong>Plan Your Listing</strong><small>Learn about the listing approach →</small></a><a href="/resources/"><span>Preparing your questions</span><strong>Guides and Tools</strong><small>Find checklists and local guides →</small></a></nav><aside class="recovery-contact"><p>Prefer to connect directly?</p><a href="${contact.phoneHref}">Call ${contact.phone}</a><a href="${contact.emailHref}">Email Brad</a><small>Email links open your email application; you send the message.</small></aside></section>`;
}
export function homepageListingFallback() {
  return '<p class="eyebrow">Presented by Brad Hazen</p><h2>FEATURED LISTINGS</h2><div class="listing-start"><p class="collection-availability" role="status">Listings could not load right now.</p><p>You can still explore the website or contact Brad to ask about current opportunities.</p><div class="page-actions"><a class="button" href="/contact/#inquiry">Ask About a Property</a><a href="/sell/">Plan Your Home Sale →</a></div></div>';
}
export async function publicRecoveryResponse(context, kind) {
  const s = state(kind),
    headers = {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow'
    },
    body = publicRecoveryContent(kind);
  try {
    const shell = await context.env.ASSETS.fetch(new Request(new URL('/404.html', context.request.url)));
    const html = await shell.text();
    if (!html.includes('data-recovery-shell')) throw Error('No recovery shell');
    return new HTMLRewriter()
      .on('main', {
        element(el) {
          el.setInnerContent(body, {html: true});
        }
      })
      .on('title', {
        element(el) {
          el.setInnerContent(s.eyebrow + ' | Brad Hazen');
        }
      })
      .transform(new Response(html, {status: s.status, headers}));
  } catch {
    // If static assets also fail, keep links and direct contact usable without styling.
    return new Response(
      '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>' +
        s.eyebrow +
        ' | Brad Hazen</title></head><body><main>' +
        body +
        '</main></body></html>',
      {status: s.status, headers}
    );
  }
}
