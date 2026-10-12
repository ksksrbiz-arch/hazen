import {contact} from './contact.js';
const text = value => (typeof value === 'string' ? value.trim() : '');
const oneLine = value => text(value).replace(/\s+/g, ' ');
const money = value =>
  Number.isFinite(value) && value >= 0
    ? new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(value)
    : null;
const number = value => (Number.isFinite(value) && value >= 0 ? new Intl.NumberFormat('en-US').format(value) : null);
const contactBlock = `Brad Hazen · Realty Pro, Inc.\n${contact.phone} · ${contact.email}`;

// Templates use entered public facts only. Never serialize the listing object.
export function listingPromotion(
  item,
  {origin = '', published = false, dirty = true, hasUnpublishedChanges = true, publicSlug = ''} = {}
) {
  const title = oneLine(item.title) || 'Property details',
    address = oneLine(item.address),
    status = ['Active', 'Pending', 'Sold'].includes(item.status) ? item.status : 'Status not provided';
  const price = money(item.price),
    facts = [];
  if (oneLine(item.propertyType)) facts.push(oneLine(item.propertyType));
  for (const [key, label] of [
    ['beds', 'bedrooms'],
    ['baths', 'bathrooms'],
    ['squareFeet', 'sq ft'],
    ['lotAcres', 'acres']
  ]) {
    const value = number(item[key]);
    if (value != null) facts.push(value + ' ' + label);
  }
  let publicUrl = '',
    tourUrl = '';
  try {
    const base = new URL(origin);
    if (
      published &&
      !dirty &&
      !hasUnpublishedChanges &&
      publicSlug === item.slug &&
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(publicSlug) &&
      base.protocol === 'https:' &&
      !base.username &&
      !base.password
    ) {
      publicUrl = base.origin + '/properties/' + publicSlug + '/';
    }
  } catch {}
  try {
    const url = new URL(item.videoUrl);
    if (url.protocol === 'https:' && !url.username && !url.password) tourUrl = url.href;
  } catch {}
  const heading = [
    title,
    address,
    `Status: ${status}`,
    price ? `${status === 'Sold' ? 'Listed price' : 'Price'}: ${price}` : '',
    facts.join(' · ')
  ]
    .filter(Boolean)
    .join('\n');
  const action =
    status === 'Sold'
      ? 'Contact Brad about selling your property or finding similar homes.'
      : status === 'Pending'
        ? 'This property is pending. Contact Brad for its current status and similar properties.'
        : 'Contact Brad for current availability, property details, and viewing arrangements.';
  const links = [publicUrl ? 'Property page: ' + publicUrl : '', tourUrl ? 'Tour: ' + tourUrl : '']
    .filter(Boolean)
    .join('\n');
  const attribution = text(item.attribution),
    description = text(item.description),
    details = [
      heading,
      description,
      links,
      action,
      contactBlock,
      attribution && attribution !== 'Brad Hazen · Realty Pro, Inc.' ? 'Listing attribution: ' + attribution : ''
    ]
      .filter(Boolean)
      .join('\n\n');
  const reviewed = /^\d{4}-\d{2}-\d{2}$/.test(item.updatedAt || '') ? 'Details reviewed: ' + item.updatedAt : '';
  const summary = [
    heading,
    oneLine(item.mlsId) ? 'MLS reference: ' + oneLine(item.mlsId) : '',
    description,
    links,
    reviewed,
    contactBlock,
    attribution ? 'Listing attribution: ' + attribution : ''
  ]
    .filter(Boolean)
    .join('\n\n');
  const caption = [
    heading,
    publicUrl ? 'Explore this property: ' + publicUrl : '',
    action,
    contactBlock,
    attribution && attribution !== 'Brad Hazen · Realty Pro, Inc.' ? 'Listing attribution: ' + attribution : ''
  ]
    .filter(Boolean)
    .join('\n\n');
  const reviewLabel = publicUrl
    ? 'Review current details and permissions before use.'
    : 'WORKING DRAFT — no published property page link. Review and publish before promoting as live.';
  const launch = [
    reviewLabel,
    'CAMPAIGN LAUNCH BRIEF',
    summary,
    'Complete before launch:\nApproved launch date: [add date]\nSeller approval: [confirm]\nPhoto and description rights: [confirm]\nFinal property facts and status: [confirm]\nPublic page and tour: [check links after publication]',
    'Proposed channels — confirm each with Brad:\nProperty page: [owner and date]\nSocial post: [channel, owner and date]\nAgent outreach: [approved recipients and date]\nOpen house, photography or paid advertising: [include only if agreed]\nBudget: [agreed amount or not applicable]',
    'Follow-up plan:\nNext seller update: [date]\nPerson tracking inquiries and feedback: [name]\nNext review and changes: [date and questions]'
  ].join('\n\n');
  const outreach = [
    'Subject: ' + title + ' — ' + status + ' property information',
    reviewLabel,
    heading,
    description,
    links,
    action,
    contactBlock,
    attribution ? 'Listing attribution: ' + attribution : ''
  ]
    .filter(Boolean)
    .join('\n\n');
  const update = [
    reviewLabel,
    'SELLER UPDATE OUTLINE',
    heading,
    'Reporting period: [start date] to [end date]\nNext conversation: [date]',
    'Verified activity — enter records for this period; leave unknown values unreported:\nProperty inquiries: [count and source]\nShowings: [count and source]\nMarketing completed: [actual channel, date and action]\nAdvertising spend: [actual amount and source, or not applicable]',
    'Feedback:\nBuyer or agent feedback: [summarize recorded feedback without personal contact details]\nQuestions awaiting an answer: [add questions]',
    'Next steps to discuss:\nProperty presentation: [proposed change or no change]\nPricing discussion: [questions for Brad and seller]\nNext actions, owner and date: [confirm together]',
    contact
  ].join('\n\n');
  return {
    caption,
    launch,
    outreach,
    update,
    sheet: {
      title,
      address,
      status,
      priceLabel: price ? `${status === 'Sold' ? 'Listed price' : 'Price'}: ${price}` : 'Price to be confirmed',
      facts: facts.join(' · '),
      description,
      attribution,
      reviewed,
      contact: contactBlock,
      action,
      publicUrl,
      tourUrl
    },
    social: details,
    email: 'Subject: ' + title + ' — ' + status + '\n\n' + details,
    summary,
    publicUrl,
    missing: [
      !text(item.title) && 'listing title',
      !address && 'address',
      !price && 'price',
      !description && 'description'
    ].filter(Boolean)
  };
}
