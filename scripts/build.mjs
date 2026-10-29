import {communityGuides} from './community-guides.mjs';
import {pageSeo} from './seo.mjs';
import {galleryMarkup} from '../server/ylopo-gallery.js';
import {publishedPosts, blogPages, latestNotes} from './blog.mjs';
import {searchPage, searchOverview} from './property-search.mjs';
import {contact as agentContact} from '../src/contact.js';
import {securityHeaders} from '../server/response-security.js';
import {publicRecoveryContent} from '../server/public-recovery.js';
import {readFile, mkdir, writeFile, rm, readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {getCollections, propertyCards, propertyDetail, reviewCards} from './collections.mjs';
import {photoGuide} from './photo-guide.mjs';
import {sellerWorksheet} from './seller-worksheet.mjs';
import {buyerWorksheetPage, buyerWorksheet, buyerChecklistText} from './buyer-worksheet.mjs';
import {studioPage} from './studio-page.mjs';
import {agentLogin} from './agent-login.mjs';
import {studioGuide, studioGuideText} from './studio-guide.mjs';
import {inquiry} from './inquiry.mjs';
import {communityCompare} from './community-compare.mjs';
import {resourcesPage, resourceHub, relatedResources, resourceOverview} from './resources.mjs';
import {
  sellerHomepage,
  sellerPreparation,
  sellerMarketingPage,
  sellerChecklistText,
  sellerConversationChoices
} from './seller-marketing.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const content = JSON.parse(await readFile(path.join(root, 'src/content.json'), 'utf8'));
for (const community of content.communities) {
  community.sections = communityGuides[community.slug.split('/')[1]];
  community.reviewedOn = '2026-10-29';
  community.intro = `Explore ${community.title}, Washington, through local places and the practical questions that matter when comparing homes or land.`;
  community.sources = [
    ...new Map(community.sections.filter(section => section[2]).map(([title, , url]) => [url, [title, url]])).values()
  ];
  community.faqs = [
    [
      `How do I find current properties in ${community.title}?`,
      `Open Property Search and enter ${community.title} on Brad’s Realty Pro search site. Review the map and individual listing details; this guide does not describe current inventory.`
    ],
    [
      'How do I check school assignments and services?',
      'Confirm school assignment with the district and service availability with the relevant providers using the exact property address. Community names and mailing addresses are not a substitute for those checks.'
    ]
  ];
}
const {properties, testimonials} = getCollections(content);
const posts = publishedPosts(JSON.parse(await readFile(path.join(root, 'src/posts.json'), 'utf8')));
const e = s =>
  String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]);
const button = (href, text) => `<a class="button" href="${href}">${text}</a>`;
const navigation = [
  ['buy', 'Buy'],
  ['sell', 'Sell'],
  ['communities', 'Communities'],
  ['search', 'Search'],
  ['brads-listings', 'Brad’s Listings'],
  ...(posts.length ? [['blog', 'Notes']] : []),
  ['testimonials', 'Testimonials'],
  ['about', 'Meet Brad'],
  ['contact', 'Contact Us']
];
const header = current =>
  `<a class="skip" href="#main">Skip to content</a><header><a class="identity" href="/"><span class="agent-name">BRAD HAZEN</span><span class="brokerage">REAL ESTATE BROKER · REALTY PRO, INC.</span></a><details class="mobile-nav"><summary aria-controls="mobile-menu">Menu</summary><nav id="mobile-menu" aria-label="Mobile navigation"><a href="/" ${current === '' ? 'aria-current="page"' : ''}>Home</a>${navigation.map(([slug, label]) => `<a href="/${slug}/" ${current === slug || current.startsWith(slug + '/') || (slug === 'buy' && current === 'buyer-checklist') || (slug === 'sell' && ['listing-marketing', 'listing-photos', 'seller-checklist'].includes(current)) ? 'aria-current="page"' : ''}>${label}</a>`).join('')}<a href="/resources/" ${current === 'resources' ? 'aria-current="page"' : ''}>Guides and Tools</a><a class="mobile-menu-contact" href="${agentContact.phoneHref}">Call Brad · ${agentContact.phone}</a></nav></details><nav class="desktop-nav" aria-label="Main navigation">${navigation.map(([slug, label]) => `<a href="/${slug}/" ${current === slug || current.startsWith(slug + '/') || (slug === 'buy' && current === 'buyer-checklist') || (slug === 'sell' && ['listing-marketing', 'listing-photos', 'seller-checklist'].includes(current)) ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</nav></header>`;
const contactLinks = `<a href="${agentContact.phoneHref}">${agentContact.phone}</a><a href="${agentContact.emailHref}">${agentContact.email}</a>`;
const areas = ['Vancouver', 'Ridgefield', 'Camas', 'Battle Ground', 'Brush Prairie', 'Washougal'];
const guideImages = [
  'guide-waterfront.webp',
  'guide-neighborhood.webp',
  'guide-trail.webp',
  'guide-home.webp',
  'guide-prairie.webp',
  'guide-riverwalk.webp'
];
const areaGrid = `<div class="area-grid">${areas.map((name, i) => `<a class="area-card" href="/communities/${name.toLowerCase().replaceAll(' ', '-')}/"><img src="/assets/${guideImages[i]}" alt="" loading="lazy" decoding="async" width="500" height="320"><span>${name}<small>View community guide <b aria-hidden="true">→</b></small></span></a>`).join('')}</div><p class="imagery-note">AI-generated Pacific Northwest illustrations; these images do not depict the named communities.</p>`;
const contact = `<section class="contact-banner"><div><h2>Still Have Questions?</h2><p>Talk with Brad about buying, selling, or planning your next move.</p>${button('/contact/', 'Contact Brad')}</div></section>`;
const footer = `<footer><div class="footer-grid"><div><h3>Brad Hazen</h3><p>Real Estate Broker<br>Realty Pro, Inc.</p><div class="contact-links">${contactLinks}</div></div><div><h3>Popular Pages</h3>${navigation.map(([slug, label]) => `<a href="/${slug}/">${label}</a>`).join('')}</div><div><h3>Your Next Move</h3><a href="/resources/">Guides and Preparation Tools →</a><p>Personal guidance for your buying and selling decisions.</p>${button('/home-valuation/', 'Home Assessment')}<p class="brokerage-wordmark">REALTY PRO, INC.<small>Brad Hazen · Real Estate Broker</small></p></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Brad Hazen · Realty Pro, Inc.</span><div class="footer-account-links"><a href="/privacy/">Privacy</a><a href="/agent-login/">Agent Sign In</a></div></div><p class="preview-note">Design preview · Community selection, asset permissions, biography and license details await final confirmation. Inquiry forms prepare an email draft; you send it from your email application.</p><p class="imagery-note">Scenic and neighborhood images are AI-generated illustrations. They do not depict Brad’s listings or specific communities.</p></footer>`;
const mobileContact = `<nav class="mobile-contact" aria-label="Quick contact"><a href="${agentContact.phoneHref}">Call Brad</a><a href="/contact/#inquiry">Start an Inquiry</a></nav>`;
const agentPortrait = `<img class="agent-portrait" src="/assets/brad-hazen-portrait-400.webp" srcset="/assets/brad-hazen-portrait-400.webp 400w, /assets/brad-hazen-portrait-800.webp 800w" sizes="(max-width:600px) calc(100vw - 40px), (max-width:1000px) 250px, 300px" alt="Brad Hazen, Real Estate Broker with Realty Pro, Inc." width="800" height="800" loading="lazy" decoding="async">`;
const profile = `<div class="agent-card profile-card">${agentPortrait}<div><p class="eyebrow">Real Estate Broker</p><h2>Brad Hazen</h2><p>Realty Pro, Inc.</p><p>Homes, land and investment property. Bring your questions to a broker whose background includes Clark County review engineering and land surveying.</p><div class="contact-links">${contactLinks}</div>${button('/contact/#inquiry', 'Connect With Brad')}</div></div>`;
const publicProfileLinks = `<aside class="agent-public-profiles" aria-labelledby="agent-profiles-heading"><div><p class="eyebrow">Around the web</p><h2 id="agent-profiles-heading">Brad’s public agent profiles</h2><p>Explore his directory profiles for additional background and property information. Contact Brad directly to confirm current details.</p></div><nav aria-label="Brad’s public profiles">${content.agentDetails.publicProfiles.map(item => `<a href="${e(item.url)}" target="_blank" rel="noopener noreferrer">${e(item.label)} <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>`).join('')}</nav></aside>`;
const breadcrumbs = page =>
  `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span>${page.slug.startsWith('properties/') ? '<a href="/properties/">Properties</a><span aria-hidden="true">/</span>' : ''}${page.slug.startsWith('communities/') ? '<a href="/communities/">Communities</a><span aria-hidden="true">/</span>' : ''}<span aria-current="page">${e(page.title)}</span></nav>`;
const faqs = page =>
  page.faqs?.length
    ? `<section class="faq-section" aria-labelledby="faq-heading"><div class="faq-heading-row"><div><p class="eyebrow">Good to know</p><h2 id="faq-heading" tabindex="-1">Common questions</h2></div><button type="button" data-toggle-faq hidden aria-controls="faq-answers">Show All Answers</button></div><p class="faq-intro">A few useful starting points. Talk with Brad about the details of your move.</p><div id="faq-answers">${page.faqs.map(([question, answer]) => `<details><summary><span class="faq-question">${e(question)}</span><span class="faq-indicator" aria-hidden="true"></span></summary><p>${e(answer)}</p></details>`).join('')}</div></section>`
    : '';
const communityLinks = page =>
  page.slug.startsWith('communities/')
    ? `<nav class="related-communities" aria-label="Other communities"><h2>Keep exploring</h2><div>${content.communities
        .filter(item => item.slug !== page.slug)
        .map(item => `<a href="/${item.slug}/">${e(item.title)} <span aria-hidden="true">↗</span></a>`)
        .join('')}</div></nav>`
    : '';
const processPages = new Set(['buy', 'sell', 'home-valuation']);
const pageSections = page =>
  processPages.has(page.slug)
    ? `<section class="process-guide" id="guide"><p class="eyebrow">A place to begin</p><h2>${page.slug === 'buy' ? 'Your path to a home purchase' : page.slug === 'sell' ? 'Plan your home sale' : 'Prepare for your assessment'}</h2><div class="process-grid">${page.sections.map(([title, text], i) => `<article><span class="process-number" aria-hidden="true">0${i + 1}</span><h3>${e(title)}</h3><p>${e(text)}</p></article>`).join('')}</div></section>`
    : page.sections.length
      ? `<div class="reading-sections">${page.sections.map(([title, text, source], i) => `<article class="content-section" id="guide-section-${i + 1}"><h2>${e(title)}</h2><p>${e(text)}</p>${source ? `<p class="guide-citation"><a href="${e(source)}" target="_blank" rel="noopener noreferrer">Official source for this section ↗</a></p>` : ''}</article>`).join('')}</div>`
      : '';
const pageLinks = page =>
  page.slug === 'listing-marketing'
    ? '<nav class="page-sections" aria-label="On this page"><span>On this page</span><a href="#marketing-plan">The approach</a><a href="#showcase">Property presentation</a><a href="#seller-ready">Seller checklist</a><a href="#inquiry">Talk with Brad</a></nav>'
    : processPages.has(page.slug)
      ? `<nav class="page-sections" aria-label="On this page"><span>On this page</span><a href="#guide">The process</a>${page.slug === 'sell' ? '<a href="#seller-ready">Seller checklist</a><a href="/listing-marketing/">Listing approach</a>' : ''}<a href="#faq-heading">Common questions</a><a href="#inquiry">Connect with Brad</a></nav>`
      : page.slug.startsWith('communities/')
        ? `<div class="page-actions community-actions"><a class="button" href="/contact/?community=${e(page.slug.split('/')[1])}#inquiry">Talk About This Community</a><a href="/communities/">View All Communities</a></div>`
        : '';
const featured = properties.filter(item => item.featured !== false && item.status !== 'Sold').slice(0, 4);
const featuredSection = `<section class="section featured-listings" id="brad-mls-listings"><p class="eyebrow">Presented by Brad Hazen</p><h2>A closer look at Brad’s listings.</h2><p class="section-lead">Explore the property, study the details, and bring your questions directly to Brad.</p>${galleryMarkup}</section>`;
const home = `<section class="hero"><picture class="hero-image"><source media="(max-width: 600px)" srcset="/assets/river-hero-mobile.webp"><img src="/assets/river-hero.webp" alt="" width="1500" height="668" fetchpriority="high" decoding="async"></picture><div class="hero-content"><h1>Your next move deserves a clear plan.</h1><p>Buy, sell, and explore property with Brad Hazen · Realty Pro, Inc.</p><div class="hero-panel"><span>What’s your next move?</span><div class="hero-actions">${button('/sell/', 'List My Home With Brad')}${button('/search/', 'Search Properties')}${button('/home-valuation/', 'What’s My Home Worth?')}</div></div><div class="hero-chips"><a href="/communities/">Explore Communities</a><a href="/about/">Meet Brad</a><a href="${agentContact.phoneHref}">${agentContact.phone}</a></div></div></section><section class="intro-band"><p><strong>Brad Hazen brings personal guidance to your real estate decisions.</strong></p><p>From your first conversation to your next move, start with your goals. Learn about buying and selling, explore local communities, and connect directly with Brad.</p></section>${searchOverview}${featuredSection}${sellerHomepage()}${latestNotes(posts)}<section class="section listings"><h2>YOUR REAL ESTATE JOURNEY</h2><p class="section-lead">Choose where you’d like to begin.</p><div class="journey-grid"><a href="/buy/"><span>01</span><h3>Find Your Next Home</h3><p>Talk through your priorities and plan your purchase.</p></a><a href="/sell/"><span>02</span><h3>Plan Your Home Sale</h3><p>Discuss your property, timing, and next steps.</p></a><a href="/properties/"><span>03</span><h3>Featured Properties</h3><p>Ask about current listings and homes you are considering.</p></a></div></section>${resourceOverview()}<section class="inspiration"><div class="inspiration-grid">${[
  [
    'buyer-thumbnail.webp',
    'Buying a Home?',
    'Start with your goals and get guidance on your next move.',
    '/buy/',
    'Explore Buying'
  ],
  [
    'assessment-thumbnail.webp',
    'What’s Your Home Worth?',
    'Request a personal property assessment from Brad.',
    '/home-valuation/',
    'Find Out How'
  ],
  [
    'seller-thumbnail.webp',
    'Why List With Brad?',
    'Get to know Brad and discuss a plan for selling your property.',
    '/sell/',
    'Explore Selling'
  ]
]
  .map(
    ([image, title, text, href, cta]) =>
      `<article class="inspiration-card"><img src="/assets/${image}" alt="" class="round-icon" loading="lazy" decoding="async" width="240" height="240"><h2>${title}</h2><p>${text}</p>${button(href, cta)}</article>`
  )
  .join(
    ''
  )}</div></section><section class="section areas"><p class="eyebrow">Discover</p><h2>EXPLORE LOCAL COMMUNITIES</h2><p class="section-lead">Get to know the places you’re considering for your next move.</p>${areaGrid}</section><section class="section meet"><h2>MEET BRAD HAZEN</h2><div class="agent-card">${agentPortrait}<div><p class="eyebrow">Real Estate Broker</p><h3>Brad Hazen</h3><p>Realty Pro, Inc.</p><p>A real estate broker with a background in Clark County review engineering and land surveying. Talk with Brad about residential property, commercial property, lots and acreage.</p><div class="contact-links">${contactLinks}</div>${button('/about/', 'More About Brad')}</div></div></section>${contact}`;
await rm(path.join(root, 'dist'), {recursive: true, force: true});
await mkdir(path.join(root, 'dist/assets'), {recursive: true});
const assetMap = new Map();
for (const name of await readdir(path.join(root, 'src/assets'))) {
  const bytes = await readFile(path.join(root, 'src/assets', name));
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
  const target = hash + '-' + name;
  assetMap.set('/assets/' + name, '/assets/' + target);
  await writeFile(path.join(root, 'dist/assets', target), bytes);
}
const fingerprint = text => [...assetMap].reduce((result, [from, to]) => result.replaceAll(from, to), text);
const css = fingerprint(
  (await readFile(path.join(root, 'src/styles.css'), 'utf8')) +
    '\n' +
    (await readFile(path.join(root, 'src/resources.css'), 'utf8')) +
    '\n' +
    (await readFile(path.join(root, 'src/typography.css'), 'utf8')) +
    '\n' +
    (await readFile(path.join(root, 'src/listings.css'), 'utf8')) +
    '\n' +
    (await readFile(path.join(root, 'src/polish.css'), 'utf8')) +
    '\n' +
    (await readFile(path.join(root, 'src/editorial.css'), 'utf8'))
);
const cssName = 'styles.' + createHash('sha256').update(css).digest('hex').slice(0, 12) + '.css';
await writeFile(path.join(root, 'dist', cssName), css);
const inquiryModel = (await readFile(path.join(root, 'src/inquiry-model.js'), 'utf8')).replaceAll('export ', '');
const inquiryCommunities = Object.fromEntries(content.communities.map(page => [page.slug.split('/')[1], page.title]));
const stripModule = source => source.replace(/^import .*$/gm, '').replaceAll('export ', '');
const contactModel = stripModule(await readFile(path.join(root, 'src/contact.js'), 'utf8'));
const worksheetModel = stripModule(await readFile(path.join(root, 'src/worksheet-model.js'), 'utf8'));
const js =
  contactModel +
  '\n' +
  worksheetModel +
  '\n' +
  'const inquiryCommunities=' +
  JSON.stringify(inquiryCommunities) +
  ';\n' +
  inquiryModel +
  '\n' +
  (await readFile(path.join(root, 'src/site.js'), 'utf8'));
const jsName = 'site.' + createHash('sha256').update(js).digest('hex').slice(0, 12) + '.js';
await writeFile(path.join(root, 'dist', jsName), js);
await writeFile(
  path.join(root, 'dist/favicon.svg'),
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="10" fill="#182b40"/><text x="32" y="42" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="30" fill="#e3b957">BH</text></svg>'
);
const pages = [
  ...content.pages,
  resourcesPage,
  searchPage,
  {
    slug: 'listing-widget',
    title: 'Brad’s property listings',
    intro: 'Open Brad’s Realty Pro search site to view current property details.',
    sections: [],
    customBody: '<a href="https://bradhazen.realtypronw.net/" target="_blank" rel="noopener">Open Property Search</a>'
  },
  {
    slug: 'brads-listings',
    title: 'Brad’s listings',
    intro: 'Explore selected listings presented by Brad Hazen.',
    sections: [],
    customBody: galleryMarkup
  },
  ...blogPages(posts),
  buyerWorksheetPage,
  ...content.communities,
  ...properties.map(property => ({
    slug: 'properties/' + property.slug,
    title: property.title,
    intro: property.address,
    sections: [],
    property
  }))
];

for (const page of pages) {
  const isHome = page.slug === '';
  const description = page.property
    ? page.property.description
    : page.slug === 'properties' && properties.length
      ? 'Explore Brad’s featured properties and ask about current details and availability.'
      : page.slug === 'testimonials' && testimonials.length
        ? 'Read experiences shared by Brad’s clients.'
        : page.intro;
  const seo = pageSeo(page, description);
  const body = isHome
    ? home
    : `<section class="inner-hero"><h1>${e(page.title)}</h1></section><section class="section inner-content ${page.slug === 'contact' ? 'contact-page' : ''}">${breadcrumbs(page)}<p class="section-lead">${e(page.slug === 'properties' && properties.length ? 'Explore Brad’s featured properties. Contact him to confirm details or ask about a showing.' : page.slug === 'testimonials' && testimonials.length ? 'Read experiences shared by Brad’s clients.' : page.intro)}</p>${pageLinks(page)}${page.slug === 'listing-marketing' ? `<div class="page-actions">${button('#inquiry', 'Discuss My Listing Plan')}<a href="/home-valuation/">Request a Home Assessment</a></div>` : ''}${page.slug === 'about' ? profile : ''}${['buy', 'sell', 'home-valuation'].includes(page.slug) ? `<div class="page-actions">${button('#inquiry', page.slug === 'home-valuation' ? 'Request an Assessment' : 'Start a Conversation')}${page.slug === 'buy' ? '<a href="/search/">Search Properties</a><a href="/buyer-checklist/">Prepare With the Buyer Checklist</a><a href="/communities/">Explore Communities</a>' : page.slug === 'sell' ? '<a href="/home-valuation/">Request a Home Assessment</a>' : page.slug === 'home-valuation' ? '<a href="/seller-checklist/">Organize Your Property Details</a>' : ''}</div>` : ''}${page.slug === 'communities' ? '<div class="page-actions"><a href="#compare" data-compare-jump hidden>Compare Communities →</a></div>' + areaGrid + communityCompare(content.communities) + '<p class="collection-note">Not sure where to start? Compare the places you visit every day, your preferred home features, and your moving timeline.</p>' : ''}${page.slug === 'properties' && properties.length ? propertyCards(properties) : ''}${page.property ? propertyDetail(page.property) : ''}${page.slug === 'properties' && !properties.length ? `<div class="empty-state"><p class="eyebrow">Your property search</p><h2>Let’s talk about the homes on your mind</h2><p>Share a property address or listing link with Brad, or tell him what you are looking for.</p>${button('/contact/#inquiry', 'Ask About a Property')}<a href="/communities/">Explore Local Communities</a></div>` : ''}${page.slug === 'testimonials' && testimonials.length ? reviewCards(testimonials) : ''}${page.slug === 'testimonials' && !testimonials.length ? `<div class="empty-state"><p class="eyebrow">Get to know Brad</p><h2>A conversation is a good place to start</h2><p>Read Brad’s introduction and bring your questions about your next move.</p>${button('/about/', 'Meet Brad')}</div>` : ''}${page.image ? `<figure class="community-figure"><img loading="lazy" class="community-hero" src="/assets/${e(page.image)}" alt="Illustrative Pacific Northwest scene" width="600" height="338" decoding="async"><figcaption class="imagery-note">AI-generated illustration of a Pacific Northwest setting, not a photograph of ${e(page.title)}.</figcaption></figure>` : ''}${['sell', 'listing-marketing'].includes(page.slug) ? sellerConversationChoices() : ''}${page.slug === 'seller-checklist' ? sellerWorksheet() : page.slug === 'buyer-checklist' ? buyerWorksheet() : ''}${page.slug === 'listing-photos' ? photoGuide() : ''}${page.slug === 'resources' ? resourceHub() : ''}${page.customBody || ''}${page.reviewedOn ? `<div class="community-guide-tools"><p>Local resources reviewed <time datetime="${page.reviewedOn}">October 29, 2026</time></p><nav aria-label="In this community guide">${page.sections.map(([title], i) => `<a href="#guide-section-${i + 1}">${e(title)}</a>`).join('')}</nav></div>` : ''}${pageSections(page)}${page.reviewedOn ? '<aside class="community-next-step"><h2>Put your community research to work</h2><p>Compare your shortlisted areas, organize your questions, and explore current properties.</p><div class="page-actions"><a class="button" href="/search/">Open Property Search</a><a href="/buyer-checklist/">Use the buyer checklist</a><a href="/communities/">Compare communities</a></div></aside>' : ''}${page.slug === 'about' ? publicProfileLinks : ''}${page.slug === 'sell' ? `<aside class="seller-marketing-link"><p class="eyebrow">Your listing presentation</p><h2>See how a property page fits into the plan.</h2><p>Explore the presentation, outreach questions, and decisions to discuss before launching your listing.</p>${button('/listing-marketing/', 'Explore the Listing Approach')}</aside>` + sellerPreparation() : page.slug === 'listing-marketing' ? sellerMarketingPage() : ''}${page.sources ? `<aside class="community-resources"><h2>Explore official local resources</h2>${page.sources.map(([label, url]) => `<a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(label)} ↗</a>`).join('')}<p>Community information is a starting point. Check official sources for current access and amenities.</p></aside>` : ''}${communityLinks(page)}${faqs(page)}${relatedResources(page)}${['seller-checklist', 'buyer-checklist', 'listing-photos', 'resources'].includes(page.slug) ? '' : page.property ? inquiry('property', page.property) : ['contact', 'buy', 'sell', 'home-valuation', 'listing-marketing'].includes(page.slug) ? inquiry(page.slug === 'home-valuation' ? 'assessment' : page.slug === 'listing-marketing' ? 'sell' : page.slug) : button('/contact/', 'Talk With Brad')}</section>${['contact', 'seller-checklist', 'buyer-checklist', 'listing-photos', 'resources'].includes(page.slug) ? '' : contact}`;
  let html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${e(seo.title)}</title><meta name="description" content="${e(seo.description)}"><link rel="preload" href="/assets/montserrat-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta name="theme-color" content="#182b40"><meta property="og:type" content="website"><meta property="og:url" content="${e(seo.url)}"><meta name="twitter:card" content="summary_large_image"><meta property="og:title" content="${e(seo.title)}"><meta property="og:description" content="${e(seo.description)}"><meta property="og:image" content="https://hazen-ci5.pages.dev/assets/river-hero.webp"><link rel="stylesheet" href="/${cssName}"></head><body${['seller-checklist', 'buyer-checklist'].includes(page.slug) ? ' class="worksheet-page"' : page.slug === 'listing-photos' ? ' class="photo-guide-page"' : ''}>${header(page.slug)}<main id="main">${body}</main>${footer}${mobileContact}<script src="/${jsName}" defer></script></body></html>`;
  const dir = path.join(root, 'dist', page.slug);
  await mkdir(dir, {recursive: true});
  await writeFile(path.join(dir, 'index.html'), fingerprint(html));
}
await mkdir(path.join(root, 'dist/resources'), {recursive: true});
await writeFile(path.join(root, 'dist/resources/seller-conversation-checklist.txt'), sellerChecklistText);
await writeFile(path.join(root, 'dist/resources/buyer-conversation-checklist.txt'), buyerChecklistText);
await writeFile(path.join(root, 'dist/robots.txt'), 'User-agent: *\nDisallow: /\n');
await writeFile(
  path.join(root, 'dist/_headers'),
  '/*\n' +
    Object.entries(securityHeaders)
      .map(([name, value]) => '  ' + name + ': ' + value + '\n')
      .join('') +
    '  X-Robots-Tag: noindex, nofollow\n  Referrer-Policy: strict-origin-when-cross-origin\n  Cache-Control: public, max-age=0, must-revalidate\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/styles.*.css\n  Cache-Control: public, max-age=31536000, immutable\n/site.*.js\n  Cache-Control: public, max-age=31536000, immutable\n'
);
console.log(`Built ${pages.length} public routes and a draft listing studio.`);

await writeFile(
  path.join(root, 'dist/404.html'),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Page not found | Brad Hazen</title><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/${cssName}"></head><body class="recovery-body"><a class="skip" href="#main">Skip to recovery options</a><header class="recovery-header"><a class="identity" href="/"><span class="agent-name">BRAD HAZEN</span><span class="brokerage">REAL ESTATE BROKER · REALTY PRO, INC.</span></a><a href="/">Back to Website</a></header><main id="main" data-recovery-shell>${publicRecoveryContent('page')}</main><footer class="recovery-footer"><span>Brad Hazen · Realty Pro, Inc.</span><a href="/privacy/">Privacy</a></footer></body></html>`
);

// Isolated prototype: no data from local drafts is included in the public build.
const model = await readFile(path.join(root, 'src/listing-model.js'), 'utf8');
const modelName = 'listing-model.' + createHash('sha256').update(model).digest('hex').slice(0, 12) + '.js';
const photoPreparation = (await readFile(path.join(root, 'src/photo-preparation.js'), 'utf8')).replace(
  './listing-model.js',
  './' + modelName
);
const photoPreparationName =
  'photo-preparation.' + createHash('sha256').update(photoPreparation).digest('hex').slice(0, 12) + '.js';
const contactSource = await readFile(path.join(root, 'src/contact.js'), 'utf8');
const contactName = 'contact.' + createHash('sha256').update(contactSource).digest('hex').slice(0, 12) + '.js';
const promotion = (await readFile(path.join(root, 'src/listing-promotion.js'), 'utf8')).replace(
  './contact.js',
  './' + contactName
);
const promotionName = 'listing-promotion.' + createHash('sha256').update(promotion).digest('hex').slice(0, 12) + '.js';
const recovery = await readFile(path.join(root, 'src/studio-recovery.js'), 'utf8');
const recoveryName = 'studio-recovery.' + createHash('sha256').update(recovery).digest('hex').slice(0, 12) + '.js';
const studio = (await readFile(path.join(root, 'src/studio.js'), 'utf8'))
  .replace('./listing-model.js', './' + modelName)
  .replace('./photo-preparation.js', './' + photoPreparationName)
  .replace('./listing-promotion.js', './' + promotionName)
  .replace('./studio-recovery.js', './' + recoveryName);
const studioName = 'studio.' + createHash('sha256').update(studio).digest('hex').slice(0, 12) + '.js';
await mkdir(path.join(root, 'dist/studio'), {recursive: true});
await writeFile(path.join(root, 'dist/studio', modelName), model);
await writeFile(path.join(root, 'dist/studio', recoveryName), recovery);
await writeFile(path.join(root, 'dist/studio', photoPreparationName), photoPreparation);
await writeFile(path.join(root, 'dist/studio', promotionName), promotion);
await writeFile(path.join(root, 'dist/studio', contactName), contactSource);
await writeFile(path.join(root, 'dist/studio', studioName), studio);
await writeFile(
  path.join(root, 'dist/studio/index.html'),
  studioPage(cssName).replace('/studio/studio.js', '/studio/' + studioName)
);
await mkdir(path.join(root, 'dist/studio/guide'), {recursive: true});
await writeFile(path.join(root, 'dist/studio/guide/index.html'), studioGuide(cssName));
await writeFile(path.join(root, 'dist/studio/guide/listing-studio-guide.txt'), studioGuideText);
await mkdir(path.join(root, 'dist/agent-login'), {recursive: true});
await writeFile(path.join(root, 'dist/agent-login/index.html'), fingerprint(agentLogin(cssName)));
// Restrict Function invocation to dynamic routes; marketing assets remain static.
await writeFile(
  path.join(root, 'dist/_routes.json'),
  JSON.stringify({
    version: 1,
    include: [
      '/listing-widget',
      '/listing-widget/*',
      '/',
      '/properties',
      '/properties/*',
      '/studio',
      '/studio/*',
      '/api/admin/*',
      '/media/*'
    ],
    exclude: []
  })
);
