import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {listingAnalyticsClient} from '../src/listing-analytics.js';

test('listing attribution uses current provider identity, never photo, address or brokerage', () => {
  const scope = vm.createContext({URL});
  vm.runInContext(listingAnalyticsClient, scope);
  vm.runInContext(
    `rememberListingAttribution([
    {id: 101, listingAgent: {id: 24820243}},
    {id: 102, listingAgent: {id: 999}},
    {id: 103, listingOfficesString: 'Realty Pro, Inc.'}
  ]);`,
    scope
  );
  const details = id =>
    JSON.parse(
      vm.runInContext(
        `JSON.stringify(listingClickDetails('https://bradhazen.realtypronw.net/search/detail/${id}'))`,
        scope
      )
    );
  assert.equal(details(101).listing_owner, 'brad');
  assert.equal(details(102).listing_owner, 'other_agent');
  assert.equal(details(103).listing_owner, 'unknown');
  assert.equal(details(104).listing_owner, 'unknown');
  vm.runInContext('rememberListingAttribution([])', scope);
  assert.equal(details(101).listing_owner, 'unknown');
  assert.equal(vm.runInContext("listingClickDetails('https://example.com/search/detail/101')", scope), null);
  assert.equal(vm.runInContext("listingClickDetails('https://bradhazen.realtypronw.net/account')", scope), null);
});
