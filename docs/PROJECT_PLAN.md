# Brad Hazen — Phase 1 plan

## Outcome and boundaries
Create a single-agent marketing website that converts buyer/seller interest into conversations. Reference: https://www.realtypronw.net/. Recreate the reference layout closely, personalized for Brad. The revised preview uses sourced reference imagery; confirm asset permissions and replace where required before final launch. Use Brad-specific copy, never other agents’ testimonials or MLS inventory. No MLS feed, public accounts, saved searches, instant valuation, or custom CRM in Phase 1. Optional external brokerage search link requires Brad's approved URL.

Working commercial estimate: $3,500 build, subject to final scope. Target 8–12 core pages plus six templated community guides; explicitly confirm the final page count in the proposal. Two design revision rounds. Client supplies draft text and licensed assets. Extensive copywriting, photography, subscriptions, ongoing SEO and maintenance are separate. CMS and real inquiry delivery are planned deliverables, not implemented features of this scaffold.

## Sitemap and conversion paths
Home → Buy / Sell → Contact; Sell → Home assessment → personal follow-up. Communities → local guide → Contact. Featured properties → property details → showing inquiry.

Scaffold routes: /, /about/, /buy/, /sell/, /communities/, /properties/, /home-valuation/, /testimonials/, /contact/, /privacy/. Next iteration adds /communities/[slug]/ and /properties/[slug]/ only when verified content exists. Blog is optional and not included by default.

## Technical approach
Initial scaffold: dependency-free Node static generation, semantic HTML, shared CSS, physical route directories, centralized JSON content. No runtime database required for public pages. Provisional production direction: static generation with an authenticated CMS or Git-based editing selected after Brad's editing needs are known. Cloudflare Pages hosts the design preview at https://hazen-ci5.pages.dev/ and deploys from main. No GitHub Actions. Keep content separate from templates so an eventual Astro/CMS migration or IDX integration can reuse the same data and URLs.

Content models:
- Agent: name, approved bio, photo, brokerage, license, verified phone/email, service areas, approved external search URL.
- Community: slug, name, original guide, licensed hero image/alt text, CTA, publish status.
- Property: slug, authorization, address, price, beds/baths, size, status, image rights/alt text, listing attribution, updated date. Archive or unpublish promptly when instructed; manually maintained inventory is clearly described.
- Testimonial: approved quote, attribution, consent/source, publish status.
- Inquiry: type, name, email, optional phone, message, optional property/address, source page, notification status and created timestamp. Avoid collecting financing documents or unnecessary sensitive details.

## Lead delivery implementation
Use a server-side endpoint or reputable form service after destination and hosting are confirmed. Validate type, lengths, email and allowed fields server-side; apply rate limits and honeypot, add a challenge if spam warrants it. Keep mail keys server-only. Send to Brad's verified inbox; show success only after confirmed acceptance. Preserve entered values on recoverable failures, disable duplicate submission during requests, offer a verified alternative contact path, and log delivery failures without exposing personal details. Separate inquiry handling from optional marketing consent. Define retention/deletion and backup notification behavior before launch. Current forms validate input and prepare an email draft with a copyable fallback; they never claim delivery. Direct server delivery remains a launch requirement.

## Milestones
1. Discovery: confirm brokerage, markets, assets, contact routing, domain ownership, editing needs and written scope.
2. Design: approve mobile homepage and typography/color direction; then shared layouts and page designs.
3. Build: real content, community/property detail templates, CMS, inquiry endpoint and notifications.
4. QA: mobile/tablet/desktop navigation; keyboard/focus/contrast; route refresh; form error/delivery/spam checks; image sizes and metadata.
5. Launch: domain/DNS, HTTPS, approved privacy and brokerage disclosures, indexing/sitemap, analytics and conversion events, client training and recovery instructions.

Planning duration: 3–5 weeks after assets and approvals, not a guaranteed delivery date.

## Required from Brad
- Correct public name, brokerage affiliation, license details and approved required disclosures.
- Domain/hosting preferences, verified phone/email and recipient for inquiries.
- Headshot, logo/brand preferences, authorized photos and biography.
- Confirm the six proposed service communities and guidance on target buyers/sellers.
- Approved testimonials and authorized featured listings, if any.
- Whether he needs self-service editing, an existing CRM connection, or an external brokerage search link.

Do not infer Brad's identity, location, accomplishments, or brokerage from a name-only search.

## Launch acceptance criteria
- All public content verified; no placeholder notices, invented reviews, fake listings, or unfinished navigation.
- Brad can edit agreed content and maintain listing status without developer intervention.
- Forms deliver tested inquiries to the agreed recipient and handle provider failure accurately.
- Inquiry submission records no message contents or contact details in analytics events.
- Accessible navigation and forms, readable layouts at 320px and common landscape widths.
- Direct visits and refreshes work for every route; useful 404 and image fallbacks.
- Production domain, titles, canonical URLs and sitemap configured; preview noindex restrictions removed only on approved production launch.
- Brokerage/data/photo permissions reviewed by Brad; privacy matches actual services.
- Source handoff, subscription ownership, maintenance terms, and rollback process documented.

## Future IDX expansion
Confirm MLS membership and provider permissions, then select a compatible IDX service. Add approved search links/widgets or an integration behind a provider boundary. Keep website content and inquiry handling independent. Quote accounts, alerts, recurring vendor charges and valuation services separately. Never scrape MLS inventory.

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
