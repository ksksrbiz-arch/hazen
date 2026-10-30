# Search, featured listings and blog

Current integration; dated experiments are preserved in git history and `tools/ylopo-lab/`.

## Featured listings

`server/ylopo-gallery.js` supplies the homepage and `/brads-listings/` through sandboxed `/listing-widget/`.

```js
{featured: 't', agentId: 24820243, propertyTypes: [], limit: 6}
```

The numeric ID matches Brad's provider listing-agent ID. RMLS `HAZENB` and agentMui `40433` are not substitutes. Nonnumeric agent values were silently ignored in controls; omitted propertyTypes reinstated a residential restriction and hid Brad's land. Keep explicit empty propertyTypes. Do not restore the superseded MLS-number selection as the default.

The verified Yacolt pair is grouped by exact provider IDs: land `210989090` / MLS 24202394 and commercial `210973857` / MLS 24397685. The land card is visible with both live detail links while both records exist; otherwise the remaining record displays independently. Do not infer identity from matching photos, nearby coordinates or similar addresses. No upstream record is altered.

Ylopo supplies current records on widget load. No inventory is scraped, stored in D1 or synchronized by a job. Gallery limit is six provider records before grouping. Primary-agent matching was tested; secondary co-listings and all future status transitions remain unverified.

## On-site search

`/search/` embeds `/search-widget/`; filters and results remain on Brad's site. Source: `scripts/property-search.mjs`, `server/search-widget.js`, `src/search-widget-client.js`.

City, min/max price, provider-supported property types and bedrooms produce Ylopo queries. Empty propertyTypes includes land. Show-more increases from six to a maximum of 24 results. Loading, empty, reset and retry states retain the external fallback. Do not invent an unsupported land-only filter key.

Full map search, detailed property pages, registration, saved searches and account features open in a new tab on `https://bradhazen.realtypronw.net/`. Full provider pages reject cross-origin framing; do not proxy or bypass this. The on-site result gallery is not an embedded full map/account application.

## Security and lead boundaries

Provider permissions are confined to sandboxed local frames. Keep parent/Studio CSP strict and validate message source plus bounded numeric height. Both widget routes stay noindex and outside the sitemap. Preserve RMLS/brokerage attribution.

Search client source is a literal script string so bundler helper functions cannot leak into the served iframe. Compiled-runtime browser execution guards against deployment-only failures.

A branded subdomain or working search does not establish FUB ownership. Actual assignment, external-domain contractual support, setup/fees and test-lead delivery remain pending confirmation. Custom marketing-site inquiries still prepare mail drafts, not CRM submissions.

## Blog

`src/posts.json` contains two unpublished drafts. `scripts/blog.mjs` requires sources, complete text, Brad approval and valid nonfuture dates. Editorial metadata stays private; rendered content is escaped. No eligible posts means no empty blog route or navigation.

Use `docs/editorial/FIRST-INTERVIEW.md` and `BLOG-DRAFTS-2026-10-29.md`. Do not publish generated prose as Brad's personal voice without his recorded perspective and exact-text approval.

## Verification and sources

Run relevant gallery/search browser tests and `npm run check:runtime`, then check the deployed provider flow without submitting a lead unless authorized. Keep physical-device and CRM gaps explicit.

- https://ylopo.zendesk.com/hc/en-us/articles/360021967431-Embed-a-Search-Widget-on-your-Site
- https://ylopo.zendesk.com/hc/en-us/articles/360021744372-Overview-of-Your-Home-Search-Site
- https://bradhazen.realtypronw.net/widgets
- https://www.realtypronw.net/team/brad-hazen
