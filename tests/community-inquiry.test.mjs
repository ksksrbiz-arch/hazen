import test from 'node:test';
import assert from 'node:assert/strict';
import {communityInquiryContext, inquiryDraftBody} from '../src/inquiry-model.js';

test('A known public community carries into a buyer inquiry and its prepared email', () => {
  const context = communityInquiryContext('?community=brush-prairie', {
    camas: 'Camas',
    'brush-prairie': 'Brush Prairie'
  });
  assert.deepEqual(context, {interest: 'Buying a home', location: 'Brush Prairie'});
  const data = new FormData();
  for (const [key, value] of Object.entries({...context, name: 'Demo', email: 'demo@example.com'}))
    data.set(key, value);
  assert.match(inquiryDraftBody(data), /Interest: Buying a home\nLocation \/ property: Brush Prairie/);
});
test('Unknown, duplicate and arbitrary query values cannot seed the inquiry', () => {
  for (const search of [
    '',
    '?community=',
    '?community=unknown',
    '?community=<script>',
    '?community=__proto__',
    '?community=camas&community=camas',
    '?email=private@example.com&message=anything'
  ])
    assert.equal(communityInquiryContext(search, {camas: 'Camas'}), null);
  assert.deepEqual(communityInquiryContext('?community=camas&message=ignored', {camas: 'Camas'}), {
    interest: 'Buying a home',
    location: 'Camas'
  });
});

test('A known shortlist carries up to three distinct communities into the buyer draft', () => {
  const communities = {vancouver: 'Vancouver', camas: 'Camas', 'battle-ground': 'Battle Ground'};
  for (const slugs of ['camas', 'vancouver,camas', 'vancouver,camas,battle-ground']) {
    const context = communityInquiryContext('?communities=' + encodeURIComponent(slugs), communities);
    assert.equal(context.interest, 'Buying a home');
    assert.equal(
      context.location,
      slugs
        .split(',')
        .map(slug => communities[slug])
        .join(', ')
    );
    const body = inquiryDraftBody(
      new Map(Object.entries({name: 'Example visitor', email: 'example@example.com', ...context}))
    );
    assert.ok(body.includes('Location / property: ' + context.location));
  }
});
test('Community shortlists reject ambiguous, unknown, duplicate and excessive selections', () => {
  const communities = {vancouver: 'Vancouver', camas: 'Camas', ridgefield: 'Ridgefield', washougal: 'Washougal'};
  for (const search of [
    '?communities=',
    '?communities=camas,',
    '?communities=camas,camas',
    '?communities=camas,unknown',
    '?communities=camas&communities=vancouver',
    '?community=camas&communities=vancouver',
    '?communities=vancouver,camas,ridgefield,washougal',
    '?communities=__proto__',
    '?communities=%3Cscript%3E'
  ])
    assert.equal(communityInquiryContext(search, communities), null, search);
});
