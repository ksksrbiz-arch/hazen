import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanDraft} from '../server/listings.js';
import {listingErrors, detailPairs, listLines} from '../src/listing-model.js';
import {cards, propertyBody} from '../server/public.js';
const base = {
  slug: 'detail-fixture',
  title: 'Detail fixture',
  address: '1 Fixture Way, Yacolt, WA',
  status: 'Active',
  price: 2000000,
  description:
    'First paragraph about the parcel.\n\nDisclosure: The listing agent owns this parcel.\n\nLast paragraph.',
  attribution: 'Fixture attribution',
  permissionNote: 'Private fixture',
  updatedAt: '2026-10-11',
  propertyType: 'Land',
  lotAcres: 1.5,
  images: [
    {file: 'listing-12345678-1234-4123-8123-123456789012.webp', alt: 'One'},
    {file: 'listing-12345678-1234-4123-8123-123456789013.webp', alt: 'Two'}
  ]
};
test('Highlights and key details are parsed, validated and kept through draft cleaning', () => {
  assert.deepEqual(listLines(' a \n\n b\r\nc '), ['a', 'b', 'c']);
  assert.deepEqual(detailPairs('Zoning: C-1\nbad line'), [['Zoning', 'C-1'], null]);
  const saved = cleanDraft({
    ...base,
    highlights: 'Level parcel\nCorner lot',
    keyDetails: 'Zoning: C-1\nParcel: 067100000'
  });
  assert.equal(saved.highlights, 'Level parcel\nCorner lot');
  assert.deepEqual(listingErrors(saved), []);
  assert.match(listingErrors({...base, highlights: Array(9).fill('x').join('\n')}).join(' '), /Highlights/);
  assert.match(listingErrors({...base, highlights: 'x'.repeat(121)}).join(' '), /Highlights/);
  assert.match(listingErrors({...base, keyDetails: 'No colon here'}).join(' '), /Key details/);
  assert.match(listingErrors({...base, keyDetails: Array(13).fill('A: b').join('\n')}).join(' '), /Key details/);
  assert.deepEqual(listingErrors({...base, highlights: '', keyDetails: ''}), []);
});
test('Detail page shows facts, highlights, disclosure callout and calculated rates without inventing data', () => {
  const html = propertyBody({...base, highlights: 'Level parcel', keyDetails: 'Zoning: C-1'});
  assert.match(html, /<h2 id="property-glance-heading">At a glance/);
  assert.match(html, /Price per acre<\/dt><dd>\$1,333,333/);
  assert.match(html, /not an appraisal/);
  assert.match(html, /<li>Level parcel<\/li>/);
  assert.match(html, /<dt>Zoning<\/dt><dd>C-1<\/dd>/);
  assert.match(html, /about 65,340 sq ft/);
  assert.match(
    html,
    /<aside class="property-disclosure"><strong>Disclosure<\/strong><p>The listing agent owns this parcel\.<\/p>/
  );
  assert.equal(html.match(/<p>First paragraph/g).length, 1);
  assert.match(html, /google\.com\/maps\/search\/\?api=1&amp;query=1%20Fixture%20Way/);
  assert.doesNotMatch(html, /Private fixture/);
});
test('Missing optional facts produce no empty sections, rates or placeholders', () => {
  const html = propertyBody({...base, lotAcres: undefined, propertyType: undefined, price: 100});
  assert.doesNotMatch(html, /Price per acre|Price per sq ft|property-highlights|undefined|NaN/);
});
test('Listing text is escaped everywhere it is rendered', () => {
  const evil = {
    ...base,
    highlights: '<img src=x onerror=alert(1)>',
    keyDetails: '<b>Label</b>: <i>v</i>',
    title: '<script>x</script>'
  };
  for (const html of [propertyBody(evil), cards([{id: 'x', item: evil}])]) {
    assert.doesNotMatch(html, /<script>x|<img src=x|<b>Label|<i>v<\/i>/);
  }
});
test('Cards show chips, photo count, a calculated rate and a trimmed excerpt', () => {
  const long = {...base, description: 'Word '.repeat(80)};
  const html = cards([{id: 'x', item: long}]);
  assert.match(html, /<li>Land<\/li><li>1.5 acres<\/li>/);
  assert.match(html, /2 photos/);
  assert.match(html, /About \$1,333,333 per acre/);
  assert.match(html, /property-excerpt">Word[^<]*…</);
});
test('A confirmed higher earlier price shows as a reduction, and never on a sold or invalid listing', () => {
  const reduced = {...base, price: 2000000, originalPrice: 10000000};
  assert.deepEqual(listingErrors(reduced), []);
  assert.match(propertyBody(reduced), /Price reduced<\/span> Was <s>\$10,000,000<\/s> · down \$8,000,000/);
  assert.match(cards([{id: 'x', item: reduced}]), /Price reduced<\/span> Was <s>\$10,000,000/);
  assert.doesNotMatch(propertyBody({...reduced, status: 'Sold'}), /Price reduced/);
  assert.doesNotMatch(propertyBody(base), /Price reduced/);
  assert.match(listingErrors({...base, originalPrice: 1}).join(' '), /originalPrice/);
  assert.equal(cleanDraft(reduced).originalPrice, 10000000);
});
