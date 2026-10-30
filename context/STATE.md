# State - updated 2026-10-29

Per-run state. Replace superseded lines instead of stacking them; history belongs in `context/CHANGELOG.md`. Each line says when it was observed.

## Current work — October 29, 2026

- Keith authorized publishing on-site filtered results. /search/ now embeds an isolated /search-widget/ with city, min/max price, type, bedrooms, reset, retry and show-more (6 up to 24). Details/map/accounts continue on Brad's provider subdomain in new tabs. Sandbox keeps provider permissions out of marketing/editor pages; widget stays noindex. Live vendor local-browser controls, more/empty/reset and mobile overflow checks passed; release verification follows deployment.

- Automatic Ylopo gallery filter found and browser-verified: numeric agentId 24820243 plus featured=t and explicit propertyTypes=[] returns Brad's land and commercial listings without MLS selection. Three active MLS records currently match. As of October 30, the verified East Yacolt land/commercial pair shares one featured card with both live detail links; if one record disappears, the other remains visible. Gallery capped at six; secondary co-listings/provider support and FUB routing remain unverified. See search-and-blog-implementation.md for controls and evidence.

- Keith purchased bradhazen.com and authorized domain activation on October 29. Cloudflare Pages apex custom domain and proxied CNAME are configured; www is a dedicated proxied redirect hostname; a 301 rule preserves paths/queries and chooses HTTPS apex. Existing Access editor policy/audience retained and destinations extended to apex/www studio/admin.
- Domain release: canonical/share URLs use bradhazen.com; production marketing HTML is indexable with a sitemap. Preview hosts, private pages, widget, legacy manual listings and empty testimonials remain noindex. Blog drafts remain unpublished. PR #15 merged (034fe32) and deployed successfully. Live HTTPS, path/query-preserving HTTP/www redirects, canonical/share image, production/preview robots and sitemap, Ylopo gallery, provider search link and anonymous studio/admin protection verified. Local verify (128 tests), runtime checks and 73 browser tests passed.
- This records technical domain activation, not completion of Brad's personal editor training, print/device review, content/licensing signoff or maintenance agreement. FUB lead assignment still awaits access; inquiries still prepare email drafts.

- Listing navigation: homepage journey card and static/dynamic detail breadcrumbs lead to the Ylopo gallery at /brads-listings/. Legacy detail URLs remain available.

- Community SEO pass: six researched guides in scripts/community-guides.mjs, official section citations, review dates, navigation, FAQs and buyer/search links. Page title and sharing metadata are centralized in scripts/seo.mjs.
- Two researched blog drafts are in src/posts.json and docs/editorial/BLOG-DRAFTS-2026-10-29.md; neither is approved or published. Brad’s recorded perspective and exact-text approval remain required. Preview-host noindex remains in place.
- Outlook checked October 29 during this pass: no reply to the 2:47 p.m. Pacific Ylopo technical-support email. Earlier forwarded questionnaire/training messages are not that reply.

- PR #9 merged and verified on hazen-ci5.pages.dev: MLS-selected gallery, full-market search navigation, approval-gated blog framework.
- Quality pass implemented: cohesive hero and gallery styling, responsive card sizing, preserved RMLS attribution, accessible detail links, bounded frame messages, loading/outage fallbacks. FUB assignment still awaits access; full search remains on Brad’s provider domain.


- Branch codex/site-search-blog starts from current main b7f4e38, preserving newer listing presentation and price changes. Local worktree: C:/Users/keith/Projects/hazen-site-next.
- Built full-market search navigation/page, prominent Brad listings and an approval-gated blog framework; no articles or empty blog published. First interview kit is in docs/editorial/FIRST-INTERVIEW.md.
- Verified Ylopo gallery selection by the two approved MLS numbers, including land. agentId=HAZENB combined with featured returns other agents' properties and is not a valid filter. See context/references/search-and-blog-implementation.md.
- Ylopo support email sent; FUB access still pending. Actual lead routing and automatic agent-wide inventory remain unverified. MLS-selected gallery authorized for preview deployment; no shared account changes.

- Bug sweep 2026-10-29 (merged to main on Keith's instruction; second pass: gallery no-JavaScript note and dev-dependency audit; third pass: header menu links did not navigate on click, fixed): blog date validation, homepage note heading level, article breadcrumb, and a dead `#featured-listings` homepage rewrite fixed; homepage no longer reads D1. See changelog. Open: the RMLS Broker Specific feed ($50/month, reply from Jeff Duman 2026-10-28) is on hold while the Ylopo route is tested; it would conflict with non-negotiable 5 (no automatic MLS sync) and is separate scope from the $1,500 build.

## Observed 2026-10-18

- Repository base: merge of PR #6 (2026-10-12). `npm run verify` on the ICM branch: 103 pass, 0 fail, 2 skipped (they skip when `dist/` is absent, which is the case during `npm test`).
- Production D1 `hazen-listings` already has the three indexes from `002_indexes.sql`, with matching definitions (read-only `sqlite_master` query). No migration was applied.
- Backup drill PASSED 2026-10-18 on Keith's Windows PC (wrangler logged in as skdev@1commercesolutions.com; account 371afa6149061390a094cfbf8a184aff owns both resources). `npm run backup`: database exported, 9 of 9 photos saved. `--verify`: all files match the manifest, `complete: true`. Scratch restore into a new D1 database and R2 bucket: row counts match production (listings 3, photos 9, listing_events 10, the three 002 indexes present) and all 9 restored photos re-hash to the manifest SHA-256 and size. The backup is on that PC only (`Projects\hazen\backups\2026-10-18`, git-ignored): a second copy off the PC and off Cloudflare is still undecided. Backups are not scheduled. Scratch resources `hazen-restore-drill-20261018` (D1 e6bd0072-cab9-492e-8599-e51c3fd32693 and R2 bucket) are awaiting Keith's approval to delete.
- Fixed a Windows bug the drill exposed: `scripts/backup.mjs` spawned `npx` and failed with ENOENT on Windows; it now runs wrangler through Node.
- Repository moved into the ICM layout on branch `claude/icm-restructure` (not merged, not pushed).

- Site polish and listing page overhaul on branch `claude/focused-curie-ae96xf` (2026-10-22): see changelog. Existing D1 listings have not been edited; highlights and key details are empty until Brad confirms facts.

## Open decisions

- MLS/IDX path: waiting on Brad's Ylopo answer (since 2026-10-10). A direct RMLS Broker Specific feed was raised on 2026-10-18; the RMLS process is researched in `context/references/idx-and-mls.md`. Not decided, not started.
- Inquiry delivery: not configured; forms prepare an email draft the visitor sends.
- Backup recovery drill, domain, indexing and brokerage logo: see below and `context/workflows/launch-check/`.

## Information still required from Brad

- [ ] Confirm the quote scope and monthly maintenance arrangement.
- [x] User-supplied headshot integrated on homepage and Meet Brad (October 11, 2026).
- [ ] Approved brokerage brand files and usage guidance.
- [ ] Approved bio, license details, brokerage disclosures and service areas.
- [ ] Confirm public contact details and receiving inbox.
- [x] Domain ownership and Cloudflare access verified for bradhazen.com (October 29).
- [ ] IDX/Ylopo provider, approved agent search or embed, MLS coverage and developer invitation.
- [ ] Required provider/brokerage website-display approvals and disclosures.
- [ ] First listing with approved facts, status, attribution and authorized photos.
- [ ] Decide whether launch uses reviewed email drafts or separately configured server delivery.
