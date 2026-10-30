const titles = {
  '': 'Brad Hazen | Clark County, WA Real Estate',
  buy: 'Buying a Home in Clark County, WA | Brad Hazen',
  sell: 'Sell Your Clark County Property | Brad Hazen',
  about: 'Meet Brad Hazen | Realty Pro Real Estate Broker',
  communities: 'Clark County, WA Community Guides | Brad Hazen',
  search: 'Search Clark County Homes & Property | Brad Hazen',
  'brads-listings': 'Brad Hazen Listings | Clark County, WA Real Estate',
  'home-valuation': 'Request a Property Assessment | Brad Hazen',
  contact: 'Contact Brad Hazen | Realty Pro, Inc.',
  resources: 'Home Buyer & Seller Planning Guides | Brad Hazen',
  'buyer-checklist': 'Home Buyer Conversation Checklist | Brad Hazen',
  'seller-checklist': 'Home Seller Preparation Checklist | Brad Hazen',
  'listing-marketing': 'Property Presentation & Selling Plan | Brad Hazen',
  'listing-photos': 'Prepare Your Home for Listing Photos | Brad Hazen'
};
export function pageSeo(page, description) {
  const community = page.slug.startsWith('communities/');
  return {
    title: community
      ? `${page.title}, WA Community Guide | Brad Hazen`
      : titles[page.slug] || `${page.title} | Brad Hazen`,
    description: community
      ? `Explore ${page.title}, Washington: local places, property-search questions and official resources. Plan your next move with Brad Hazen.`
      : description,
    url: `https://bradhazen.com/${page.slug}${page.slug ? '/' : ''}`,
    image: `https://bradhazen.com/assets/${community && page.photo ? page.photo.file : 'river-hero.webp'}`,
    imageAlt: community && page.photo ? page.photo.caption : 'Illustrative Pacific Northwest river landscape'
  };
}

export function structuredData(page, seo) {
  const origin = 'https://bradhazen.com';
  const person = {
    '@type': 'Person',
    '@id': origin + '/#brad',
    name: 'Brad Hazen',
    jobTitle: 'Real Estate Broker',
    url: origin + '/about/',
    telephone: '+1-360-921-9484',
    email: 'b.hazen@hotmail.com',
    sameAs: ['https://www.realtypronw.net/team/brad-hazen'],
    worksFor: {'@type': 'Organization', name: 'Realty Pro, Inc.', url: 'https://www.realtypronw.net/'}
  };
  const website = {
    '@type': 'WebSite',
    '@id': origin + '/#website',
    url: origin + '/',
    name: 'Brad Hazen Real Estate',
    publisher: {'@id': person['@id']},
    inLanguage: 'en-US'
  };
  const webpage = {
    '@type': page.slug === 'about' ? 'AboutPage' : page.slug === 'contact' ? 'ContactPage' : 'WebPage',
    '@id': seo.url + '#webpage',
    url: seo.url,
    name: seo.title,
    description: seo.description,
    isPartOf: {'@id': website['@id']},
    about: {'@id': person['@id']},
    inLanguage: 'en-US'
  };
  const graph = [person, website, webpage];
  if (page.slug) {
    const items = [{'@type': 'ListItem', position: 1, name: 'Home', item: origin + '/'}];
    if (page.slug.startsWith('communities/'))
      items.push({'@type': 'ListItem', position: 2, name: 'Communities', item: origin + '/communities/'});
    items.push({'@type': 'ListItem', position: items.length + 1, name: page.title, item: seo.url});
    graph.push({'@type': 'BreadcrumbList', '@id': seo.url + '#breadcrumb', itemListElement: items});
    webpage.breadcrumb = {'@id': seo.url + '#breadcrumb'};
  }
  return (
    '<script type="application/ld+json">' +
    JSON.stringify({'@context': 'https://schema.org', '@graph': graph}).replaceAll('<', '\\u003c') +
    '</script>'
  );
}
