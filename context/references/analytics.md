# Search visibility and measurement

## Dedicated Google resources

- Google account: skdev@1commercesolutions.com.
- GA4 account 414213912; property 561690146; web stream 16238648656; measurement ID `G-QSEE7DZFHP`.
- GTM account 6401294415; container 284423131 / `GTM-WG4QVGN8`. Version 2 published October 30, 2026.
- Search Console domain property `sc-domain:bradhazen.com` verified with the existing apex TXT record. Keep that verification record.
- Sitemap submitted successfully; 21 URLs discovered. Homepage live inspection said indexable, but an indexing request encountered a reCAPTCHA connection failure. Submission does not guarantee indexing.

## What is measured

`src/analytics.js` loads GTM only after optional analytics consent on the exact production origin. Preview, widgets, Studio, API, media and legacy property pages do not initialize analytics. Global Privacy Control disables optional analytics. Footer Cookie choices allows changes; choice expires after 180 days.

Events cover page views, scroll milestones, visible engagement time, navigation, phone/email clicks, inquiry starts/validation/draft preparation/copy/edit, downloads/printing, guided steps, checklists, photo plans, community comparisons, FAQs and property search/results/detail clicks. Email draft preparation is never reported as a submitted lead. No visitor form values or worksheet notes enter the data layer. Page URLs use canonical paths without queries; referrers use origins only. Google advertising and automatic user-data detection are disabled.

Search dimensions are independent:

- `search_scope`: `brad` for the agent-filtered gallery; `all_listings` for the wider search.
- `listing_owner`: `brad`, `other_agent`, or `unknown`. The search callback uses the current record's `listingAgent.id`, matching Brad's verified numeric ID 24820243. Missing identity is unknown. This field was verified in a live provider response October 30. This identifies the primary listing agent, not a secondary co-agent or CRM lead owner.
- `listing_id`: public numeric Ylopo property ID, including separate IDs for the grouped land/commercial links.

Widget measurement uses the existing provider callback and bounded postMessage events; no additional inventory request, scraping or synchronization. Parent code accepts messages only from the actual current widget iframe windows. Prior-to-consent interactions are not retrospectively recorded.

## GTM configuration

Reviewed import: `docs/analytics/gtm-container.json`; generator: `scripts/analytics-container.mjs`. The base tag fires on `brad_analytics_ready`, then the approved interaction tag forwards the allowlisted events and fields. Both triggers restrict hostnames to bradhazen.com and bradhazen.realtypronw.net. Automatic event detection and user-provided-data capabilities are disabled to avoid duplicate or misleading form events. Explicit page views prevent double counting.

Analytics CSP allowances apply only to production public responses; private/editor responses keep the strict original policy. No inline executable JavaScript or eval allowance was added.

## Realty Pro boundary

Cross-domain configuration includes exactly bradhazen.com and bradhazen.realtypronw.net. This is preparation, not proof that the provider website is tagged. Brad's available Stars account exposes marketing and profile tools, but no search-subdomain code setting. The branded website edit link opens Realty Pro's Squarespace/Okta login, not an accessible search-subdomain editor. Do not alter brokerage-wide tracking or claim subdomain events are live.

Provider installation requirements are in `docs/analytics/YLOPO-TRACKING-HANDOFF.md`. A tag on the parent site cannot observe provider page views, registrations or CRM outcomes. Sandboxed widget links need a verified provider-supported cross-domain handoff; do not promise stitched sessions just because the two domains are configured. No email or test lead was sent by this measurement setup.

## Checks and primary references

Use `npm run verify`, `npm run check:runtime` and browser analytics/search/gallery checks. Verify live GA collect responses and Realtime after release. Consent and ad blockers mean coverage is not every visitor. Custom dimensions can take time to appear in standard reports.

- https://support.google.com/analytics/answer/6366371
- https://support.google.com/analytics/answer/10071811
- https://developers.google.com/search/docs/appearance/ai-features
