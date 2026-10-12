export const sellerGoals = ['Pricing guidance', 'Preparing to list', 'Marketing my property'];
export const sellerPropertyTypes = ['House', 'Condo or townhome', 'Land or acreage', 'Other or not sure'];

// Only known public community slugs can seed the general inquiry form.
export function communityInquiryContext(search, communities) {
  const params = new URLSearchParams(search),
    values = params.getAll('community');
  const lists = params.getAll('communities');
  if (values.length) {
    if (values.length !== 1 || lists.length || !Object.hasOwn(communities, values[0])) return null;
    return {interest: 'Buying a home', location: communities[values[0]]};
  }
  if (lists.length !== 1) return null;
  const slugs = lists[0].split(',');
  if (
    slugs.length < 1 ||
    slugs.length > 3 ||
    new Set(slugs).size !== slugs.length ||
    slugs.some(slug => !Object.hasOwn(communities, slug))
  )
    return null;
  return {interest: 'Buying a home', location: slugs.map(slug => communities[slug]).join(', ')};
}

export function inquiryDraftBody(data) {
  const value = key => String(data.get(key) || '').trim();
  const lines = [
    `Name: ${value('name')}`,
    `Email: ${value('email')}`,
    `Phone: ${value('phone') || 'Not supplied'}`,
    `Interest: ${value('interest')}`,
    `Location / property: ${value('location') || 'Not supplied'}`,
    `Timing: ${value('timing') || 'Just exploring'}`
  ];
  if (['Selling a home', 'A home assessment'].includes(value('interest'))) {
    if (sellerGoals.includes(value('sellerGoal'))) lines.push('Conversation focus: ' + value('sellerGoal'));
    if (sellerPropertyTypes.includes(value('propertyType'))) lines.push('Property type: ' + value('propertyType'));
    if (value('propertyFeatures'))
      lines.push('Property features / updates: ' + value('propertyFeatures').slice(0, 600));
  }
  return [...lines, '', value('message')].join('\n');
}
