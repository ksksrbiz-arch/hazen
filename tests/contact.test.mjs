import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {contact} from '../src/contact.js';
import {worksheetText} from '../src/worksheet-model.js';
import {listingPromotion} from '../src/listing-promotion.js';
import {publicRecoveryContent} from '../server/public-recovery.js';
import {propertyBody} from '../server/public.js';
import {buyerChecklistText} from '../scripts/buyer-worksheet.mjs';
import {sellerChecklistText} from '../scripts/seller-marketing.mjs';
const content = JSON.parse(readFileSync('src/content.json', 'utf8'));
test('content.json agent details match the single contact source', () => {
  assert.equal(content.agentDetails.phone, contact.phone);
  assert.equal(content.agentDetails.phoneHref, contact.phoneHref);
  assert.equal(content.agentDetails.email, contact.email);
  assert.equal(contact.emailHref, 'mailto:' + contact.email);
});
test('Every generated surface renders the contact source and no unrendered placeholders', () => {
  const item = {
    slug: 'a',
    title: 'T',
    address: '1 Main',
    price: 1,
    status: 'Active',
    description: 'd',
    attribution: 'Brad',
    images: [{file: 'x.webp', alt: 'x'}]
  };
  const surfaces = [
    worksheetText({title: 't', items: [], notes: ''}),
    buyerChecklistText,
    sellerChecklistText,
    publicRecoveryContent('page'),
    propertyBody(item),
    JSON.stringify(listingPromotion(item, {}))
  ];
  for (const text of surfaces) {
    assert.ok(text.includes(contact.phone) || text.includes(contact.phoneHref));
    assert.ok(text.includes(contact.email));
    assert.doesNotMatch(text, /\$\{|undefined/);
  }
});
