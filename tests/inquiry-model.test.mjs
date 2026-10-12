import test from 'node:test';
import assert from 'node:assert/strict';
import {inquiryDraftBody} from '../src/inquiry-model.js';
const form = overrides =>
  new Map(
    Object.entries({
      name: 'Example homeowner',
      email: 'example@example.com',
      interest: 'Selling a home',
      sellerGoal: 'Preparing to list',
      propertyType: 'Land or acreage',
      propertyFeatures: 'Updated outbuilding\nOutdoor space',
      message: 'Please discuss the listing plan.',
      ...overrides
    })
  );
test('Seller and assessment drafts retain optional context and multiline property facts', () => {
  for (const interest of ['Selling a home', 'A home assessment']) {
    const body = inquiryDraftBody(form({interest}));
    assert.match(body, /Conversation focus: Preparing to list/);
    assert.match(body, /Property type: Land or acreage/);
    assert.match(body, /Updated outbuilding\nOutdoor space/);
    assert.match(body, /Please discuss the listing plan\./);
  }
});
test('Switching to buying or other topics excludes all previously entered seller context', () => {
  for (const interest of ['Buying a home', 'Request a showing', 'Other questions']) {
    const body = inquiryDraftBody(form({interest}));
    assert.doesNotMatch(body, /Conversation focus|Property type|Property features|outbuilding/);
  }
});
test('Optional context is bounded, enum-checked, and unrelated form data is excluded', () => {
  const body = inquiryDraftBody(
    form({
      sellerGoal: 'Unexpected goal',
      propertyType: 'Unexpected type',
      propertyFeatures: 'x'.repeat(700),
      internalNote: 'PRIVATE',
      phone: ''
    })
  );
  assert.doesNotMatch(body, /Unexpected|PRIVATE/);
  assert.match(body, /Phone: Not supplied/);
  assert.match(body, /Timing: Just exploring/);
  assert.ok(body.includes('x'.repeat(600)));
  assert.ok(!body.includes('x'.repeat(601)));
});
