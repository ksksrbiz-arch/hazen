# Brad Hazen — real estate website

Live at **https://bradhazen.com/** for Brad Hazen, Realty Pro, Inc. Built and operated by Keith Skaggs / **1commerce LLC**. Cloudflare Pages project `hazen` deploys `main`; `https://hazen-ci5.pages.dev/` is the non-indexed preview hostname. Repository: https://github.com/ksksrbiz-arch/hazen.

## What is live

- Marketing pages, six researched community guides, local photography with public source/license/date credits, and community comparison.
- `/brads-listings/` and the homepage show Brad's current Ylopo listings. The verified Yacolt land/commercial pair shares one card with both detail links.
- `/search/` provides on-site city, price, type and bedroom filters, current results, reset/retry and show-more. Listing details, full map, saved searches and account tools open on `https://bradhazen.realtypronw.net/`.
- Guided buyer/seller preparation and selectable photo planning. Seller downloads are branded PDFs, including checked items and notes; buyer export remains text. Entries stay in the page unless the visitor downloads/prints them.
- Private Cloudflare Access-protected `/studio/` uses D1/R2 for legacy/manual listing pages. It does not control the Ylopo gallery or update RMLS.
- Blog infrastructure exists, but the two draft posts are unapproved and unpublished. No empty blog is exposed.

**Lead routing is not certified.** Custom-site forms prepare an email draft that the visitor must send. They do not deliver to a server or create Follow Up Boss leads. Ylopo/FUB assignment, provider approval/setup details and fees still need confirmation; see [current state](context/STATE.md). Working search and Brad-branded URLs do not prove lead ownership.

## Develop and verify

Node 22+ (Cloudflare is configured for Node 24):

```sh
npm ci
npx playwright install chromium
npm run verify
npm run test:browser
npm run check:runtime
```

`verify` runs formatting, Node tests, build, route/asset checks and ICM checks. Browser tests cover navigation, mobile widths, accessibility, search, gallery grouping, guided preparation and PDF download. Runtime checks compile Pages Functions and exercise isolated D1/R2/auth plus emitted search-script execution; Chromium is required for that check too.

For a local preview with fixture-backed Functions and production headers, run `node tests/browser/static-server.mjs` after building and open `http://localhost:4173` (`PORT` can override). `npm run preview` is a static-only Python server on port 8000: it does not reproduce Functions, Access or live hostname indexing behavior.

Cloudflare's build command is `npm run verify`, output `dist`; it does not run the browser/runtime suites automatically. There is no GitHub Actions workflow. Run the applicable checks before merging. `dist` is generated, not edited. Source assets/CSS/scripts are fingerprinted; PDF generation code is loaded only when requested.

## Source map

| Area                               | Files                                                                                                                                   |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Build, routes, shared layout       | `scripts/build.mjs`, `src/content.json`, `src/styles.css`, `src/editorial.css`, `src/site.js`                                           |
| Featured gallery / Yacolt grouping | `server/ylopo-gallery.js`                                                                                                               |
| On-site search                     | `scripts/property-search.mjs`, `server/search-widget.js`, `src/search-widget-client.js`                                                 |
| Guides and real community images   | `scripts/community-guides.mjs`, `src/community-photos.json`, `src/assets/community-*.webp`                                              |
| Preparation / printable seller PDF | `scripts/resources.mjs`, `scripts/conversation-worksheet.mjs`, `scripts/seller-worksheet.mjs`, `src/resources.css`, `src/seller-pdf.js` |
| Blog approval gates                | `scripts/blog.mjs`, `src/posts.json`, `docs/editorial/`                                                                                 |
| Hostname indexing / security       | `server/site-domain.js`, `functions/_middleware.js`, `server/response-security.js`                                                      |
| Legacy editor and storage          | `src/studio.js`, `server/listings.js`, `database/cloudflare/`                                                                           |

## Contributor guidance

Start with [AGENTS.md](AGENTS.md), then [CLAUDE.md](CLAUDE.md) and [current state](context/STATE.md). Stable operating references live in `context/references/`; recurring workflows in `context/workflows/`; dated history in [CHANGELOG](context/CHANGELOG.md).

Read [search integration](context/references/search-and-blog-implementation.md), [deployment](context/references/cloudflare-pages.md), [preparation/PDF maintenance](context/references/preparation-tools.md) or [image rights](context/references/image-assets.md) as appropriate. Preserve provider attribution, preview noindex, private editor protection, blog approval gates and truthful inquiry wording. Never commit credentials, backups or private client data.

## Analytics and search visibility

Measurement setup, event definitions, consent and provider limitations: [analytics reference](context/references/analytics.md). The dedicated GTM configuration is in `docs/analytics/gtm-container.json`. Realty Pro subdomain installation is a separate provider-side requirement; see the [installation handoff](docs/analytics/YLOPO-TRACKING-HANDOFF.md). A working outgoing listing click is not a verified CRM lead.
