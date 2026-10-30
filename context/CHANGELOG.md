# Changelog — dated implementation passes

History, not instructions. Oldest first; append new entries at the end with a date and what was verified. Moved unchanged from docs/PROJECT_PLAN.md (line 59 onward) on 2026-10-18. For what is true now, read `context/STATE.md`.

## Reference recreation revision
Approved direction: close visual recreation of the reference. Implemented waterfront hero, gold (#bf902e) introduction band and buttons, Montserrat typography, three photo-backed buyer/seller cards, community photo tiles, Brad profile section and contact banner. Six community examples are included for design review, not a confirmed service-area list. Brad portrait remains pending; no fake headshot or testimonials. Accounts and live MLS search remain excluded. Total preview routes: 16. Browser preview of localhost is unavailable in this session; build and internal path checks pass.

## Optimization pass
Supporting image group reduced from 854,998 to 330,686 bytes (61% reduction). Added a 768px mobile hero variant, eager hero loading with reserved dimensions, and lazy decoding for lower-page images. Build fingerprints assets/CSS for immutable caching while HTML revalidates. Added active navigation, keyboard/outside-click menu closure, larger contact targets, draft buyer/seller/assessment content, and a 404 recovery page. `npm run check` verifies routes/assets, primary headings, preview noindex, working contact references, and image payload limits. CMS and online inquiry delivery still require implementation. Real-device/browser layout and performance have not been verified.

## Inquiry and community pass
Added contact, buyer, seller, and assessment inquiry forms with browser validation, email draft preparation, and copyable fallback. Added six drafted community guides based on official city/county resources. Refined Brad’s draft bio without publishing unconfirmed experience durations. Portrait, approved reviews, authorized listings, direct inquiry delivery, and CMS remain pending. All 17 generated HTML files pass the route, asset, heading, contact, and image checks.

## Navigation and usability pass
Added Properties to the shared navigation, mobile quick contact with safe-area spacing, inner-page breadcrumbs, inquiry jump links, community cross-links, buyer/seller/assessment FAQs, and fuller About/empty-state layouts. Removed the duplicate contact-page banner. Added initials favicon and social preview metadata, and fingerprinted JavaScript to prevent stale form code. Draft-form submit buttons stay disabled until JavaScript loads; no-JavaScript visitors get direct contact links instead of a form GET that could expose their entered details in the URL. Required fields reject whitespace-only entries. Portrait, reviews, MLS, CMS, and server email delivery still require real assets or separate configuration.

## Phase 2 planning update — October 10, 2026
Keith authorized planning visitor accounts, saved homes/searches, and email alerts while continuing the marketing site. Brad has an MLS login; existing IDX coverage and website permissions are unconfirmed. See [the Phase 2 scope](IDX_PHASE_2.md). Preliminary integration budget is now $500–$1,000 if an existing approved provider supplies the functionality, rather than the earlier broad estimate. Confirm actual service and work before a fixed quote. Phase 1 remains active; no accounts or automated alerts are enabled.

## Listings and testimonials foundation
Added centralized property/testimonial models, publish controls, property card and detail templates, authorized photo galleries, listing attribution/update dates, contextual inquiry forms, and client-story layouts. The actual collections remain empty until Brad supplies approved content. These are manually maintained marketing listings, separate from future IDX inventory. Mobile contact bar hides while inquiry fields have focus to give the form more space. Content is edited in JSON and deployed through git; a client CMS is still pending.

## Listings-first scaffold — October 10, 2026
Brad’s primary goal is winning and promoting his own listings. Homepage seller calls to action and featured listings take priority over buyer account features. The public draft studio supports local preparation, photos, preview, and export. See [listing workspace architecture](LISTING_WORKSPACE.md) for current boundaries and proposed authenticated publishing. Supabase schema/policies are scaffolded only; no database or credentials have been provisioned. Visitor accounts/MLS alerts remain planned, not enabled.

## October 10, 2026 — Cloudflare listing backend

Connected dedicated Hazen D1/R2 resources and Access email sign-in. Cloud editor replaces the local draft prototype: save, private preview, photo uploads, publish/unpublish/archive, public snapshot isolation, conflict detection and change history. Dynamic publication updates the website without a git deployment. First live editor session, private draft saving, photo upload and reload verified with skdev@1commercesolutions.com. Brad and the additional OneCommerce email were enrolled at Keith’s explicit request. Visitor accounts/saved homes/searches/alerts and MLS approval remain in IDX_PHASE_2.md. Automated inquiry delivery is still pending verified sender configuration.

## Listing management pass — October 10, 2026

Added searchable listing management, status/archived filters and counts, saved/unsaved and unpublished-change indicators, publication readiness, live-page links, recent change history, photo ordering and safe restoration of archived listings as private drafts. Public listing browsing adds address/title, status and price filters; property share metadata now reflects each listing. Privacy copy covers the authenticated workspace and retained archives. Automated inquiry delivery, MLS approval, approved content and final domain/indexing remain launch work.

## Property presentation pass — October 10, 2026

Added a shared property-page layout for public listings and authenticated saved-draft previews. The visitor experience now includes an enlarged photo viewer with keyboard/touch navigation, native sharing with clipboard/manual fallbacks, contextual showing-email drafts and printable property sheets. Brad can review all saved photos and listing fields on the finished page before publishing; unsaved edits remain excluded and private previews cannot be shared publicly. MLS numbers entered manually are displayed when provided. This does not import or synchronize MLS data. Test coverage includes preview authentication, private media paths, exclusion of internal notes/social metadata, unsafe draft tour URLs and public gallery markup.

## UI and UX pass — October 10, 2026

Refined the authenticated studio with a clearer library/editor hierarchy, status cards, persistent primary actions, a separate secondary-actions menu, clickable publication requirements, safe address-to-URL suggestions, contextual field hints, photo cover badges/counts and visible request feedback outside the editable form. Mobile controls wrap and the library stays accessible above the editor. Public listing pages gained section navigation, status-aware inquiries and a direct contact panel. Automated checks cover slug normalization and status-dependent inquiry behavior alongside existing auth/storage/runtime checks.

## Public page UI and UX pass — October 10, 2026

Simplified contact-page hierarchy by placing direct contact inside the inquiry panel. Shared buyer, seller, assessment and property inquiry forms now group contact details and plans, keep optional phone/timing in a disclosure, adapt address requirements to the chosen topic, and prepare a reviewable draft before visitors explicitly open their email application. Editing invalidates the previous draft; no inquiry is uploaded or automatically sent. Forms remain inert until JavaScript initializes. Added numbered buyer/seller/assessment process cards, section jump navigation, clearer community guide links/resources, calmer FAQ panels and mobile menu Home/direct-call links with keyboard focus closure. Approved content, headshot, MLS approval and verified email delivery remain launch work.

## Original imagery replacement — October 10, 2026

Keith instructed that Realty Pro’s exact imagery must not be used. Replaced the copied raster assets with six original AI-generated Pacific Northwest scenes and optimized WebP variants for the hero, background sections, community cards/headers and three circular feature images. The copied branding raster is also removed; brokerage affiliation remains text. Public imagery captions identify the scenes as illustrative, not actual listings or photos of specific communities. See IMAGE_ASSETS.md for the complete prompts, paths and byte sizes. Actual listing photos and Brad’s headshot must come from approved client assets.

## Listing photo preparation — October 10, 2026

Replaced the manual under-400-KB upload prerequisite with browser-side preparation of larger JPG/PNG/WebP sources. The studio now resizes/re-encodes website copies, shows batch progress and per-file failures, supports stopping, reports dimensions/sizes, and links preparation results to each photo description. No original is changed or uploaded, and preparation does not save or publish. The existing authenticated storage, ownership checks, photo limits and private/published snapshot isolation are unchanged. HEIC conversion, approved client photos, verified inquiry delivery, MLS permissions and final launch content remain pending.

## Listing promotion kit — October 10, 2026

More actions → Prepare Promotion Kit creates social-post, buyer-email and property-handoff templates from the current public listing fields. Copy Text has a manual selection fallback; Download All Templates produces a review-marked text file. No message, post or inquiry is sent. Missing title/address/price/description are identified rather than invented. Pending and Sold use status-specific wording; Sold prices are labelled listed prices. Private permission notes and media filenames are excluded. A property page link is included only when the saved published version matches the current draft and page address; private/unpublished edits never get a public link. Edits and loading another listing clear prepared copy to avoid stale facts. Templates use the entered description as written; they are not AI-generated sales claims. Brad must verify accuracy and permissions before sharing.

## Seller marketing experience — October 10, 2026

Added a public listing-marketing page explaining the property presentation, pricing/positioning discussion, proposed outreach channels, and feedback decisions. Homepage now introduces dedicated listing pages and directs sellers to the approach or a property conversation. The Sell page links the approach and includes a six-part preparation guide with a downloadable text checklist and no registration gate. Copy distinguishes built website capabilities from photography, advertising, brokerage/MLS distribution and other services Brad must confirm. No results, sale-price promises, testimonials, or actual listing inventory were invented. Seller inquiries still prepare an email draft and require the visitor to send it.

## Guided seller inquiry — October 10, 2026

Sell and listing-marketing pages now offer Pricing guidance, Preparing to list, and Marketing my property conversation choices. Selecting one focuses the inquiry and prefills an optional conversation focus. Shared inquiries include an optional property-detail disclosure for selling/assessment topics: focus, property type, and features/updates. These prompts add no required fields. Switching to a buyer or other topic hides/disables them and excludes prior seller details from the email draft. Topic/goal/field changes invalidate an earlier draft. The browser bundle uses a shared, tested draft formatter with an explicit field allowlist; no form data is uploaded or stored and email opening/sending remains an explicit visitor action.

## Printable seller worksheet — October 10, 2026

While Ylopo/provider discovery is pending, added a standalone seller checklist with 18 review prompts, optional questions, an on-screen progress count, reset controls and a dedicated print layout. Entries remain in the current page; no account, persistent site storage, backend submission or external service is involved. The existing blank text download is retained. Sell and listing-marketing pages now link to the worksheet. Printed notes use a text-only mirror so long questions are not clipped by textarea print rendering. MLS search, visitor account/alert infrastructure and CRM overlap remain pending Brad’s response.

## Listing photography preparation — October 10, 2026

Added a standalone photography guide with room/site shot planning, preparation, accurate-image guidance, and an organized handoff to Brad. Linked it from the listing approach and authenticated photo editor; the editor link opens separately to preserve the working draft. Includes a print layout and direct seller conversation/checklist links. No photos, client claims, paid services, or external integrations are added by this guide. Ylopo-dependent work remains pending.

## Public collection refinements — October 10, 2026

Expanded Brad’s own manually maintained property collection with optional whole-dollar price bounds and minimum bedrooms, applied-filter summaries, persistent clear controls, and clearer empty/no-match recovery. Bedroom filters exclude absent counts so land is retained only when no bedroom restriction is selected. Invalid or reversed price bounds are not applied and produce explicit feedback. Filters remain standard GET navigation and work without JavaScript; no accounts, saved searches, provider data, or MLS integration.

## Visitor flow simplification — October 10, 2026

Hide collection filters when no listings are published; show distinct buying and selling next steps instead. Filters remain available once Brad publishes properties. Email inquiry review now temporarily hides the editable fields and submit controls, bringing the draft and send/copy/edit choices forward. Edit restores the fields; changes invalidate the prior draft. The site still prepares drafts only and sends nothing automatically.

## Cloudflare delivery and response hardening — October 10, 2026

Confirmed production D1/R2 bindings, no preview data bindings, and disabled public R2 development domain. Enabled Pages build caching through the project API. Static pages and all Functions responses now share restrictive script/style/source, frame, and browser-permission headers; private preview referrer policy remains intact. Published media uses browser-only revalidation and R2 ETags, with publication checked before every conditional request; unchanged GET responses return 304 and HEAD uses metadata only. Unpublished/archived photos remain unavailable even with a previously valid ETag. Missing storage or transient failures return a non-cacheable 503. No edge media cache, external analytics, or new services were enabled.

## Marketing sheet and short caption — October 10, 2026

Expanded the authenticated promotion kit with a concise property caption and same-page printable marketing sheet. The sheet uses whitelisted entered public facts and the current prepared cover photo; internal notes and private photo routes are excluded. Unpublished/changed drafts carry an explicit working-draft label and no public URL. Editing or cloud operations invalidate the kit and sheet; preview never saves, publishes, or sends. Browser print can produce a PDF; actual print/PDF output is not verified in automated checks.

## Campaign planning and follow-up — October 11, 2026 (UTC)

Expanded the promotion kit with a campaign launch brief, status-aware agent outreach copy and a seller-update outline. Presentation and planning formats are grouped in the selector and included in the text download. Launch approvals, channel owners, dates and budgets remain explicit prompts; seller activity, showing counts, feedback and spend must come from actual records. No metrics or completed marketing services are invented. These formats retain public-fact allowlists, draft warnings, matching-publication link guards and edit invalidation. No CRM, MLS, automated posting or message delivery is added.

## Itemized billing draft — October 11, 2026 (UTC)

Started an editable scope ledger covering 24 completed deliverable bundles through the marketing-sheet release. Iterative revisions are grouped by deliverable, not charged as separate tasks or guessed hours. Fees are unassigned and the build subtotal remains blank until every bundle is priced. The earlier $3,500 working estimate was superseded by the agreed $1,500 fixed build price. Pending MLS/Ylopo, visitor accounts/alerts, direct inquiry delivery, approved assets and final launch work are excluded. Campaign planning and follow-up are a subsequent addition to the promotion-tools bundle.

## Public resource discovery and community handoff — October 10, 2026 (Pacific)

Added a public guides/tools hub grouping existing seller preparation, photography, listing approach, assessment, buying, community and property resources. Linked it from the mobile menu/footer and added contextual resource links to Buy, Sell, About and assessment pages. Cards and link rows adapt to small screens without adding imagery or external services. Community guide inquiries now carry only a known public community slug into the general contact form, preselect buying and show an editable starting-point notice. Unknown/duplicate values and other query data cannot prefill inquiry details. No inquiry is stored or sent automatically; Cloudflare delivery remains separate work. The route checker now resolves query-bearing internal links by pathname and verifies their anchors.

## Buyer preparation and worksheet retention — October 10, 2026 (Pacific)

Added an 18-prompt buyer conversation worksheet, optional questions/notes, review progress, reset, print layout and blank text download. Linked it from the buying page and public resource hub. Buyer and seller worksheets now share rendering and behavior, and Download My Worksheet preserves the current reviewed prompts and notes in a local text file. Notes and checkbox values stay in the current page until the visitor explicitly downloads or prints; no storage, inquiry submission or automated message is added. Export formatting has bounded inputs and excludes unrelated fields. Actual printer/PDF output remains unverified.

## Public guide discovery — October 11, 2026

Added an in-page resource finder with buying/selling categories, title-and-description keyword matching, live result counts, clear filters and an empty state. Multiple search words must all match the resource. Category jump links also reset the search so their destination stays visible. Controls appear only after initialization; all eight guides remain usable without JavaScript. Filtering does not submit or retain visitor searches. No MLS, accounts or external service integration was added.

## Community comparison — October 10, 2026

Added a temporary, three-community shortlist to Communities. Selected cards reuse existing guide introductions and official-resource links, with common visit prompts and a buyer worksheet link. Selection controls and shortcut appear only after JavaScript initialization; the original guide grid remains the fallback. The inquiry handoff accepts only one allowlisted set of one to three unique community slugs, rejects ambiguous/unknown/repeated/oversized sets, and fills editable buyer location context. Selections travel in the contact-page URL only when the visitor continues. No account preferences are saved and no inquiry is sent automatically. No new property inventory or location rankings are implied.

## Client handoff preparation - October 11, 2026

Added a private Listing Studio Guide with the six-step save/review/publish workflow, common tasks, troubleshooting, promotion limits and Brad's post-handoff responsibilities. The editor opens it separately to preserve unsaved work; a text copy is downloadable. Studio authorization and private/no-store responses cover both routes. Anonymous access is included in runtime checks. A launch checklist records remaining content, provider and acceptance requirements. The $1,500 build price is agreed; $225 monthly technical maintenance is proposed. Listing entry and ongoing marketing operations belong to Brad, not maintenance.

## Agent sign-in and workspace branding - October 11, 2026

Added a branded `/agent-login/` entry with existing original PNW illustration, BH mark, secure sign-in button, email-code instructions and visitor contact alternative. It collects no credentials and links to the existing protected studio. The public footer links to Agent Sign In. Studio now has the same mark, favicon and shortcuts for property entry, promotion preparation and the private guide. Full Cloudflare Access login colors/logo are organization-wide and would affect ClearView; keep those shared settings unchanged. Hazen-specific app name/logo can be set independently without changing policies. Backup/recovery, first approved listing validation and IDX onboarding remain launch work; branding does not imply those are complete.

## Editor interruption recovery - October 11, 2026

Added truthful session, conflict, server and connection errors, a 25-second request timeout with no automatic mutation retry, a separate-tab sign-in path and a read-only connection check that retains current editor fields/photos. Download Working Notes works for incomplete drafts and includes current text/authorization notes/photo descriptions, but excludes photo bytes and unrelated credentials/media paths. It is a private text recovery aid, not a complete backup or import format. Tests cover error distinctions, lost mutation replies, timeout and incomplete/zero-valued recovery notes. Full backups and a recovery drill remain pending.

## Public recovery and homepage resilience - October 11, 2026

Missing static pages and unavailable property links now use branded recovery pages with useful buying/selling/resources navigation and direct contact. Unknown property pages retain HTTP 404; failed property collection reads retain 503. No request path or private listing state is echoed. Recovery responses are non-cacheable, noindex and secured by middleware. When the listing database query fails, the homepage retains its marketing content and displays a truthful featured-listing fallback instead of returning a whole-page error. Isolated runtime checks simulate unpublication and a database outage; no live storage is modified.

## Preparation tools across visitor journeys - October 11, 2026

The homepage now introduces the seller worksheet, buyer worksheet and photo preparation guide, with a direct path to the full resource hub. Buy and home assessment expose useful preparation links beside their primary inquiry action. Related resources now connect community guides, comparison, worksheets, photography and listing marketing in both directions. All links remain native and usable without JavaScript; the comparison section itself still requires JavaScript. No new registration, tracking or inventory was introduced.

## Inquiry UI and validation - October 11, 2026

Shared public inquiries now show a current details/review stage, field-specific validation messages and an error summary with links that focus the affected controls. Required whitespace-only values are rejected; native email validity is retained. ARIA invalid/described-by states connect each error while preserving existing hints. Topic changes update assessment-address requirements and remove irrelevant errors. Valid details still prepare only an email draft; edit retains values and returns to the details stage. Native validation is disabled only after the enhanced handler initializes. Mobile draft actions stack with full-width targets and the step list uses vertical rows. No data is submitted, stored or sent automatically.

## Reading and question navigation UI - October 11, 2026

FAQs now use individual disclosure cards with clear plus/minus cues and a JavaScript-enhanced Show/Hide All Answers action. Native question disclosures work without JavaScript. On-page links use larger button-style targets and indicate the selected URL fragment; targets can receive native anchor focus. Long biography/privacy/community sections are left-aligned with a bounded reading width and calmer spacing. Other-community links use consistent full-height grid targets, stacking on narrow screens. Content and inquiry delivery behavior are unchanged.

## Worksheet UX and progress - October 11, 2026

Buyer and seller worksheets now prioritize downloading the completed worksheet, show a native progress bar and per-section reviewed counts, and provide native topic/notes jump links. Selected prompts have clearer highlighting and whole-section review state. Notes show the available character allowance. Overall progress text changes only when the check count changes, reducing repeated screen-reader announcements while typing. Reset clears the download-reminder state, so it does not falsely ask for another download before one has occurred. No entries are persisted or sent. Added controls are excluded from print styles; actual printed output remains a launch check.

## Public profile enrichment and typography - October 11, 2026

Expanded Brad’s introduction and homepage summary using the supplied Homes.com and Realtor.com profiles, with native external directory links on Meet Brad. Added specialties and profile service areas to agent metadata. Recorded conflicting experience totals, office addresses and phone details in BRAD_PROFILE_SOURCES.md; existing business-card direct contact remains authoritative. No directory listings, headshots, transaction statistics or reviews were imported.

Corrected the static Montserrat Medium face declaration from an inaccurate 400–700 range to weight 500. Native system fonts now supply body/control weights while the existing Medium face is reserved for headings. Disabled synthetic font weights and introduced one shared typography layer with larger reading text, labels, helpers and navigation across marketing, inquiry, preparation tools, branded login and the private workspace. Print-specific dimensions remain unchanged. Desktop live layout/interaction review is required after deployment; private authenticated and physical-device/print verification remain launch checks.

## First two real listings - October 11, 2026

User requested publication of E Yacolt Road (RMLS 24202394, $2,000,000, 1.5 acres) and NE Hazen Avenue (RMLS 24434415, $12,000,000, 11.35 acres), supplying Homes.com and Realtor.com property URLs. Core facts and Active status were cross-checked with the supplied Realtor.com pages. Yacolt uses the source’s displayed 0/E Yacolt address, not the 305 number in the legacy URL, and retains the agent-owner disclosure. Land-lease wording and parcel division claims are presented as questions to verify, not guaranteed terms or approvals.

Both records use the normal D1 draft/published snapshot and private R2 photo model, so Brad can edit, republish, unpublish and archive through Studio. Seven source image copies are preserved without retouching or watermark removal, below the existing 400 KB photo budget. Sources, record IDs, image URLs and SHA-256 hashes are recorded in `docs/imports/brad-listings-2026-10-11.json`. Map and boundary captions identify approximate outlines. Existing archived QA is untouched. Public status remains manually maintained; no MLS syncing is implied.

Added optional property type, lot acres and HTTPS source URL through draft normalization, validation, Studio fields, public cards/details, promotion copy and recovery notes. Missing home counts remain absent for land. Tests cover survival through save/render/export and rejection of negative acreage or unsafe source URLs. Publication and live gallery verification complete this increment; broader launch acceptance remains pending.

## Brad’s supplied headshot - October 11, 2026

Replaced homepage and Meet Brad portrait placeholders with the user-supplied square headshot. Responsive 400px and 800px WebP copies retain the full image without retouching or cropping; the uploaded source remains unchanged. Native srcset/sizes, lazy loading, explicit dimensions and asynchronous decoding keep the portrait efficient and prevent layout shifts. Onboarding and launch records now mark the headshot received; brokerage logo files remain outstanding.

## Backup drill and Windows fix — October 18, 2026

First real backup, verify and scratch restore against the live Cloudflare account, run from Keith's PC. All passed (details in `context/STATE.md`). The drill exposed that `scripts/backup.mjs` could not spawn `npx` on Windows; fixed by running wrangler's bin through `process.execPath`. The repository was restructured into the ICM layout the same day.

## Premium polish and listing overhaul — October 22, 2026
Audited the live build before changing it: images were already WebP, assets already immutable-cached, below-fold images natively lazy, fonts preloaded as a 12 KB subset. Framer Motion was not added: the site is static HTML with no React, so CSS transitions and a small IntersectionObserver slide-in reveal (transform only; opacity fades made axe flag mid-transition contrast) (`src/site.js`) are used, all gated on `prefers-reduced-motion`. New `src/polish.css`: 44px targets for standalone links (footer, breadcrumbs, page actions, chips; a Playwright audit at 390 and 820px went from 11-16 undersized targets per page to the unavoidable inline ones), button/card/menu transitions, busy and confirmed states on Share Listing. New `src/listings.css` and a rewrite of card and detail markup in `server/public.js`: fact chips, photo count, calculated per-acre rate, excerpt, status colours; detail page with a gallery grid, At a glance, Highlights, Disclosure callout, Property details table, map link and a sticky contact card. New optional `highlights` and `keyDetails` listing fields (model, server whitelist, Studio form, recovery export). Tests: 110 pass, including new `tests/listing-detail.test.mjs`. Not done: real-device, screen-reader and print review; the two Yacolt and Hazen listings in D1 have no highlights or details yet, so Brad or Keith must add confirmed facts in Studio.


## Price reduction field — October 22, 2026
Added optional `originalPrice` (model validation, server whitelist, Studio field, recovery export). Cards and detail pages show "Price reduced · Was $X" (and the drop on detail) for Active or Pending listings, never for Sold. Keith confirmed the two imported listings were reduced by $8,000,000 on the same date (Yacolt $10M to $2M, Hazen $20M to $12M); the date is not recorded and is not shown. Listing data in D1 is not yet updated; that write still needs approval.

## Search and blog preparation — October 29, 2026
Built Search Properties page/navigation and moved Brad's featured section ahead of seller marketing. Added source/approval/date-gated blog rendering and private interview kit, with no empty public blog. Fixed Windows route-check file URL. Researched and verified explicit MLS gallery selection for Brad's two parcels; disproved agentId=HAZENB as a sufficient filter even with featured. Strict CSP unchanged; widgets remain isolated. No runtime account changes or deployment. See search-and-blog-implementation.md for evidence and remaining work.

## 2026-10-29 — MLS-selected preview gallery

- Featured MLS 24202394 and 24434415 through the Ylopo widget on home and /brads-listings/. New listings require adding their MLS numbers.
- Isolated vendor permissions to /listing-widget/; private editor security and legacy property pages remain intact. Direct property links remain available if the widget cannot load.

## 2026-10-29 — Listing experience quality pass

- Refined homepage hierarchy, mobile actions and search presentation. Restyled provider cards while retaining RMLS logos and brokerage attribution.
- Added accessible detail links, automatic bounded frame sizing, loading status and direct-link outage fallback. Parent checks the sending frame before accepting layout messages.
- Compared the public Realty Pro profile with the custom site; the profile currently shows a broad brokerage gallery. Lead-routing verification and Brad-approved blog content remain pending.

- Updated the privacy explanation to describe provider listing requests, external search/accounts, and the separate local email-draft forms. Verification: 119 unit checks, 28 pages, compiled runtime; browser checks include provider outage and spoofed resize protection.

## 2026-10-29 — Community SEO and blog preparation

- Replaced repetitive community copy with six distinct, primary-source guides, linked citations, review date, guide navigation, FAQs and search/buyer links.
- Added intent-specific page titles and community descriptions, matching sharing titles and per-page Open Graph URLs. No indexing or production-domain change.
- Wrote two unpublished article drafts with source notes and Brad interview prompts. Added checks that unapproved drafts stay out of the public build.
## Bug sweep (2026-10-29)
Reviewed PR #9 and the repo with the blog path exercised by a temporary published post (reverted). Fixed four defects: (1) `scripts/blog.mjs` threw a bare RangeError for out-of-range dates such as 2026-13-01; it now raises the intended publication error; (2) homepage note cards used h2 under the section's h2, now h3; (3) article breadcrumbs skipped the Real estate notes parent; (4) `functions/_middleware.js` still rewrote `#featured-listings`, which no longer exists after the homepage became the static Ylopo gallery (`#brad-mls-listings`), so every homepage request ran a D1 query that changed nothing. The homepage now serves the static shell with `Cache-Control: no-store` and does not read D1; the unused `homepageListingFallback` was removed. Verified: `npm run verify` 122 pass, 0 fail, 0 skipped; `npm run check:runtime` passes; Playwright 70 pass (axe included); build with a temporary published post passes `npm run check`. Not changed: D1 listings are reachable only via /properties/ and the journey card since Properties left the navigation (VERIFY with Keith that this is intended).

## Bug sweep, second pass (2026-10-29)
Reviewed PR #10 and the server/functions code. Fixed: with JavaScript off the gallery showed "Loading selected listings…" forever and the no-script note pointed at links hidden inside a closed details element; the note now starts hidden (revealed by `src/site.js`) and the no-script text names the fallback links. Ran `npm audit fix` (no force): the three dev-only findings (undici via miniflare and wrangler, used by `check:runtime`) are cleared; `jose` and the shipped runtime were unaffected. Verified: `npm run verify` 123 pass, 0 skipped; `check:runtime` passes; Playwright 73 pass, including a new no-JavaScript test. Reviewed and left alone: empty catches in `server/public.js` (deliberate URL validation), media content type (uploads always set it).


## 2026-10-29 — Consistent listing navigation

- Homepage journey card 03 and public property-detail breadcrumbs now lead to /brads-listings/. Legacy detail URLs and private Studio previews remain available.

## Bug sweep, third pass (2026-10-29)
Fixed the header menu: clicking a menu link with the mouse did nothing. The `focusout` handler in `src/site.js` closed the menu in a microtask while focus was still moving from the Menu button to the link, so the link was hidden before the click landed and the click hit the page underneath. It now closes only when focus moves to a known element outside the menu (Escape and outside-click handling are unchanged). Added Playwright tests for mouse navigation from the menu and for closing on outside click and on keyboard focus leaving; the navigation test fails on the old handler.

Reviewed PRs #13 and #14 and ran a throwaway ESLint pass (undefined names, unused code, duplicate keys, unreachable code) over `functions/`, `server/`, `scripts/`, `src/`, `tests/` and `tools/`. Removed dead code left by the homepage change: the unused `cards` import in `functions/_middleware.js`, the unused `featured` list in `scripts/build.mjs`, and an unused import in `tests/browser/smoke.spec.mjs`. Remaining lint findings are false positives (`site.js` shares scope with files the build concatenates before it; `DOMException` is a browser global; `permissionNote` is destructured on purpose to keep it out of public output). Probed and found sound: listing validation (`src/listing-model.js`), draft cleaning and publish checks (`server/listings.js`), inquiry draft building (field limits match `maxlength`), community and SEO additions, and the unapproved blog drafts (none can publish). Verified: `npm run verify`, `check:runtime` and Playwright pass.


## October 29, 2026 — bradhazen.com activation

Keith authorized connecting his purchased domain and putting the existing site live. Added hostname-aware production indexing, canonical/share URLs, public sitemap, preview/private exclusions and canonical redirect fallback. Cloudflare apex/www custom domains and DNS point to hazen-ci5.pages.dev; a zone rule redirects HTTP/www to HTTPS apex while preserving path/query. Extended the existing Access application's destinations without changing editor membership, JWT audience or provider. Updated the private guide's links and provider status. No D1/R2 changes, new tracking, email delivery or blog publication. Local verify (128 tests and 28 generated pages) and compiled runtime checks passed, including production-versus-preview robots/metadata, sitemap exclusions, redirect and anonymous protection. Browser and hosted verification recorded in the release handoff.


## October 29, 2026 — domain live verification

PR #15 deployed as 034fe32, Cloudflare deployment 8f4a6a3d-fd90-4bcc-a1c9-ce637509e0a7. Verified HTTPS apex, 301 HTTP/www paths and queries, canonical/share image, indexable marketing pages, excluded previews/private/legacy pages, public-only sitemap and Access redirects. Desktop/mobile browser checks loaded both Ylopo listings without page errors; search still opens Brad's provider account. All 73 local browser tests passed. Simplified www to a dedicated proxied redirect A record (192.0.2.1) and removed the unnecessary pending Pages association; HTTPS redirect rechecked successfully. Provider/FUB assignment and signed-in new-origin editing remain separate unverified items.


## October 29, 2026 — automatic Ylopo agent gallery

Replaced fixed MLS selection with the vendor's numeric agentId filter and explicit empty propertyTypes. Positive/negative remote controls distinguish valid filtering from silently ignored parameters. Actual widget browser test returned three Brad-attributed active records, including a commercial record absent from the previous selection. Both Yacolt MLS representations retained. Uses existing vendor display only, without a scrape/sync/import job. Keeps sandbox/security, provider links, fallback links and six-card display cap. External-domain approval, secondary co-listings and FUB routing are not claimed verified.

Validation: npm run verify passed (128 tests, 28 generated pages), compiled runtime checks passed, and all 75 Playwright browser tests passed. Live vendor widget test rendered three Brad-attributed records with no mlsId in its request.


## October 29, 2026 — on-site property search

Implemented user-authorized inline market search with an isolated provider frame, city/price/type/bedroom filters, progressive 6-to-24 results, validation, reset, empty states, load timeout and retry. Stale results hide during requests/failures; callbacks are matched to the current query. Preserved provider-rendered attribution and Brad-subdomain detail/map/account links, opening new tabs. Parent frame messages require the exact window and bounded height. No CRM, account, DNS or lead-send changes. Widget excluded from indexing/sitemap; marketing/editor CSP unchanged. Local live-provider browser tests verified filtering, 12-card expansion, zero results and reset at mobile width; returned Camas listings respected price and bedroom constraints. Browser regression tests cover validation, failure recovery controls and message isolation. Full hosted maps and lead assignment remain outside this release.

Validation: npm run verify passed (130 tests, 29 generated pages), compiled runtime checks passed and all 80 browser tests passed. Direct live-widget axe audit found no WCAG A/AA violations after contrast corrections. Desktop image sizing verified against card width; mobile live filters/more/empty/reset had no page errors or horizontal overflow.

## October 30 — preparation tools and local photography

Buyer and seller preparation now offer guided steps, section navigation, progress, review-all and print-all behavior; page-only checks/notes remain unsent and unsaved. Photo preparation now lets visitors select planned views. Resource entrances and planning cards received the dark-green, warm-neutral editorial treatment. Old resource links to manual properties now point to Brad's live gallery.

All six community cards and guide images use actual local photographs. Source, author, capture date, license, adaptation notes and download provenance are recorded in src/community-photos.json and credited publicly. CC BY-SA photo adaptations retain their source license. Some source photography is older (Camas 2005); dates are displayed. Brush Prairie uses its actual post office; no unrelated scenic photo is substituted. Other illustrative site imagery remains labeled separately.

Validation: 130 Node tests, 84 browser tests including accessibility, mobile width and guided/print state; build/route/image checks. Production verification follows deployment.
