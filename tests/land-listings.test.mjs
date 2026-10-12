import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanDraft} from '../server/listings.js';
import {listingErrors} from '../src/listing-model.js';
import {cards, propertyBody} from '../server/public.js';
import {listingPromotion} from '../src/listing-promotion.js';
import {listingWorkingNotes} from '../src/studio-recovery.js';
const land = {
  slug: 'land-fixture',
  title: 'Land fixture',
  address: 'Fixture address',
  status: 'Active',
  price: 100,
  description: 'Fixture description',
  attribution: 'Fixture attribution',
  permissionNote: 'Private fixture',
  updatedAt: '2026-10-11',
  propertyType: 'Land',
  lotAcres: 11.35,
  sourceUrl: 'https://example.com/listing?x=1&y=2',
  images: [{file: 'listing-12345678-1234-4123-8123-123456789012.webp', alt: 'Fixture land'}]
};
test('Land facts survive save normalization, rendering, promotion and recovery without invented home counts', () => {
  const saved = cleanDraft(land);
  assert.deepEqual(listingErrors(saved), []);
  assert.equal(saved.lotAcres, 11.35);
  assert.equal(saved.propertyType, 'Land');
  assert.equal(saved.sourceUrl, land.sourceUrl);
  for (const html of [cards([{id: 'fixture', item: saved}]), propertyBody(saved)]) {
    assert.match(html, /Land · 11.35 acres/);
    assert.doesNotMatch(html, /0 beds|0 baths|0 sq ft/);
    assert.doesNotMatch(html, /Private fixture/);
  }
  assert.match(propertyBody(saved), /https:\/\/example.com\/listing\?x=1&amp;y=2/);
  assert.match(listingPromotion(saved).caption, /Land · 11.35 acres/);
  assert.match(listingWorkingNotes(saved), /Lot size in acres: 11.35/);
});
test('Invalid acreage and source links cannot be published or rendered as active links', () => {
  assert.ok(listingErrors({...land, lotAcres: -1}).includes('Invalid lotAcres'));
  assert.ok(listingErrors({...land, lotAcres: Infinity}).includes('Invalid lotAcres'));
  assert.deepEqual(listingErrors({...land, lotAcres: 0}), []);
  for (const sourceUrl of ['javascript:alert(1)', 'http://example.com', 'https://user:secret@example.com']) {
    assert.match(listingErrors({...land, sourceUrl}).join(' '), /Listing source/);
    assert.doesNotMatch(propertyBody({...land, sourceUrl}), /View listing source/);
  }
  assert.match(listingErrors({...land, propertyType: 'x'.repeat(81)}).join(' '), /Property type/);
});
