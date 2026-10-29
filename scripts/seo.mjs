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
    // This is the verified preview host, not an invented production domain.
    url: `https://hazen-ci5.pages.dev/${page.slug}${page.slug ? '/' : ''}`
  };
}
