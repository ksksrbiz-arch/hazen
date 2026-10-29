# Search and blog implementation — October 29, 2026

Branch codex/site-search-blog, worktree C:/Users/keith/Projects/hazen-site-next, based on current origin/main b7f4e38. Existing work in C:/Users/keith/Projects/hazen is preserved separately. Preview merge authorized by Keith on October 29.

## Implemented

- /search/ explains full-market search versus Brad's listings, uses his verified personal search domain, offers direct contact without registration, and preserves the current site's strict CSP.
- Main navigation, homepage action and buyer page link to search. Homepage features Brad's listings before seller marketing. Legacy D1/manual collection and detail pages remain available; home and main navigation now feature the MLS-selected gallery.
- Blog build framework with index, article routes and latest-posts section. No posts means no blog route/nav/empty section. Published entries require sourceReference, approvedByBrad=true, valid approval/publication dates and complete text sections. Future-dated posts remain excluded. Editorial metadata is not rendered; content is escaped.
- src/posts.json starts empty; no invented Brad articles. docs/editorial/FIRST-INTERVIEW.md includes source prompts, proof questions and a draft schema.
- Fixed Windows file-URL conversion in scripts/check.mjs so route validation works on Keith's machine.
- Private tools/ylopo-lab contains working search, failure handling and gallery diagnostics outside dist.

## Listing filter research and evidence

Public Ylopo home-search documentation describes MLS-number searches. Its public gallery builder code accepts a comma/space-separated set and produces an mlsId array. The same builder's initial-search predicate does not accept agentId alone, explaining the earlier stalled experiment.

Verified in Chrome: data-search with {"mlsId":["24202394","24434415"],"limit":6} returns exactly East Yacolt Road and NE Hazen Avenue. These match the previously approved listing source records, and links stay on bradhazen.realtypronw.net. E Yacolt's detail page credits Brad Hazen as the listing agent as well as Presented By.

Further negative test: {"featured":"t","agentId":"HAZENB","limit":6} returned the broad featured collection, including 9604 NE 106th St (known to credit James Kimball and Karl Lemire). Therefore this is NOT a valid Brad-only filter and must not ship.

Working interim option: explicitly select approved MLS numbers; Ylopo supplies current data for those selections. Add new MLS numbers when Brad gains listings. This is not automatic discovery of all future listings. Automatic agent/co-listing scope and sold/withdrawn behavior remain unverified; do not claim empty results prove no inventory.

The current profile's residential propertyTypes list excludes land. Do not reuse it for Brad's gallery. Use no residential restriction in the explicit-MLS test.

Home and search responses send SAMEORIGIN; full-page framing is blocked. Strict site CSP also disallows the vendor scripts/styles/requests. The approved gallery uses a sandboxed local /listing-widget/ frame with vendor permissions confined to that response. The parent and Studio retain their strict policies. Provider cards open the Brad-domain detail in a new tab; direct fallback links remain outside the frame. Full-market search uses direct navigation. CRM assignment is still unverified.

## Research sources

- https://ylopo.zendesk.com/hc/en-us/articles/360021744372-Overview-of-Your-Home-Search-Site
- https://ylopo.zendesk.com/hc/en-us/articles/360021967431-Embed-a-Search-Widget-on-your-Site
- https://bradhazen.realtypronw.net/widgets
- https://www.realtypronw.net/team/brad-hazen
- Local approved baseline: docs/imports/brad-listings-2026-10-11.json

## Remaining work

Ylopo support email was sent October 29 from skdev@1commerce.online. FUB access is pending from Realty Pro; actual registration/inquiry delivery cannot yet be certified. No accounts, automatic messages, indexing, DNS or existing live listings changed. Physical phone testing and production-origin widget checks remain pending. Receive Brad's interview/approval before publishing articles.

## Verification

npm run verify passed: 119 tests, 28 generated-page checks and ICM validation. Existing browser suite passed 64 checks; two added search routing/empty-blog/accessibility checks passed afterward. Live Chrome visual review confirmed the search page layout. No physical-phone, screen-reader or deployed-production verification in this pass. npm audit --omit=dev reported zero production dependency vulnerabilities; existing dev-tool advisories were not changed.


## October 29 follow-up — automatic agent filter verified

Supersedes the explicit-MLS interim recommendation above. Public widget request supports numeric agentId=24820243, Brad's listingAgent.id on both approved records. Numeric ID is not RMLS HAZENB or agentMui 40433. Use {featured:'t', agentId:24820243, propertyTypes:[], limit:6}. Explicit empty propertyTypes removes the default residential selection. Omission returned zero Brad records; unrecognized property-type labels also removed restrictions and must not be treated as valid type filters.

Observed controls via the widget's public /api/1.0/listings request: featured alone, agentId='HAZENB' and a nonnumeric invalid ID all returned other agents' listings (ignored strings). Numeric James ID 24507698 selected James; numeric nonexistent ID 999999999 returned none. Brad's numeric ID plus propertyTypes:[] returned three ACTIVE records, all listingAgent.id=24820243: 24397685 (NE East Yacolt Road, CommercialSale), 24202394 (East Yacolt Road, Land), and 24434415 (NE Hazen Ave, Land). Two Yacolt entries appear to be alternate commercial/land MLS listings of the same property; retain provider records, do not invent deduplication.

The actual vendor widget rendered all three in an isolated browser test on the production origin with no mlsId in its request. Links remained on Brad's provider subdomain. Gallery now uses that query and displays up to six matching records; existing direct links remain emergency fallbacks. No MLS scraping job, database import or scheduled sync is added. Each widget load requests Ylopo's current results. Secondary co-listing matching, future inventory/status changes and external-domain contractual support remain unverified. Do not claim every possible co-listing or unlimited inventory is covered.

Support's October 29 reply did not answer external-site embedding approval, exact Brad/FUB routing, integration method or fees. Keith authorized a clarification reply, which was sent in the same Outlook thread. Do not resend while waiting.
