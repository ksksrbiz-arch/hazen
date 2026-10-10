# Brad’s Cloudflare listing workspace

## Connected on October 10, 2026

The website stays on Cloudflare Pages (`hazen`, `hazen-ci5.pages.dev`). Production uses a dedicated D1 database `hazen-listings` and private R2 bucket `hazen-listing-photos`. No unrelated projects or buckets are used.

Cloudflare Access application **Hazen Listing Studio** protects `/studio` and `/api/admin`. Existing email one-time-pin identity provider is used. Enrolled editors: `skdev@1commercesolutions.com`, `b.hazen@hotmail.com`, and `skdev@1commerce.online`. The latter two were explicitly requested and added to both the Access allow policy and production `EDITOR_EMAILS` on October 10, 2026. No password or MLS credentials belong in the repository or browser code.

Functions verify Access JWT signatures, issuer, audience, expiration, subject and editor email. Alternate deployment URLs remain protected by origin verification, even where an Access gateway is absent. Preview builds have no production database, storage or authentication bindings and cannot change production listings. Production and preview fail closed.

## Brad’s workflow

1. Sign in at `/studio/` with an enrolled email address.
2. Choose New Listing Draft; enter listing details and authorized photos.
3. Save Draft Online. Incomplete drafts are allowed.
4. Add photo descriptions, review the property preview, and record the internal authorization note.
5. Publish Listing. The server checks required fields, date, price, status, HTTPS tour link and registered photos. Duplicate public page slugs are rejected.
6. The public property page, Properties collection and homepage features update without a GitHub commit or new deployment.
7. Edit and save privately, then publish again when ready. Pending and Sold are supported; Sold properties leave the homepage feature section.
8. Unpublish removes the public page and public photo access while retaining the draft. Archive moves the listing to the Archived filter while retaining data/history. Choose Restore as Draft to recover it without republishing.

JSON export and photo downloads remain available as manual backups. Old browser-only drafts are not automatically uploaded or migrated; they remain in the old browser’s IndexedDB.

## Storage and publication

`database/cloudflare/001_listings.sql` is the applied SQLite schema. Each listing has an independent working draft and published JSON snapshot. Permission notes are excluded from public snapshots. Photos use immutable UUID filenames scoped to a listing. A public media Function serves only images referenced by the current published snapshot. The bucket has no public R2 URL. Removed photos are retained privately as history; automated cleanup is not implemented. Limits: 20 photos per draft, each under 400 KB; 200 historical uploads per listing; editor list shows the 200 latest unarchived records.

Browser checks decode selected images. The server independently checks byte limits, permitted image signatures and content type. No SVG or arbitrary filename uploads. Mutations require a verified editor and same-origin Origin header. Draft save, publish, unpublish and archive use expected revisions; stale sessions receive 409. D1 transactional batches record successful changes in `listing_events`. Authorization notes and actor identifiers are never rendered in public HTML. Responses with private data use no-store caching. Unpublished media is also not cached publicly. Previously downloaded public photos cannot be recalled.

Cloudflare Access controls entry, with a second editor allowlist at the origin. Editors share Brad’s single-agent workspace; there is no separate multi-agent or client tenancy. There is no account enrollment endpoint.

## Verification and pending work

`npm test` checks signed token validation, expired/wrong-audience/non-editor rejection, API create/upload/save/publish/unpublish, draft isolation, conflicting edits, transactional history, duplicate slugs, private photo access, HTML escaping and published snapshot stability. Tests use local SQLite and simulated R2/JWKS, not live Cloudflare credentials. `npm run check` validates the generated routes/assets. Wrangler compiles Pages Functions.

The first authenticated live session was verified with `skdev@1commercesolutions.com`: cloud draft creation, photo upload, saving and reload succeeded. The private QA record was archived with history retained. No test property was published to production. `npm run check:runtime` runs the compiled Pages Functions against isolated local D1/R2, including homepage/collection/detail rendering, private-note exclusion, anonymous rejection, media and unpublication. Before client launch, verify upload, reload, publication and unpublication with Brad’s first approved listing. Confirm backup/retention requirements, domain ownership, authorized assets and client content. No automated backup export/restore UI is provided yet; archived listings can be restored by an authorized editor in the studio.

Automated showing/contact delivery is not connected: visitors use their own email application or call Brad. Add a verified sender/provider, approved recipient, bot protection, server validation and a truthful delivery result separately. MLS import and visitor accounts/alerts remain the separately planned IDX phase; an MLS login alone is not website API authorization.

The earlier Supabase migration in `database/migrations/001_listing_workspace.sql` is an unused alternative design. It has not been applied and is superseded by this Cloudflare implementation.

## Listing management improvements

The editor shows draft/published/archived totals, title/address search, filters for unpublished changes, saved/unsaved indicators, a publication readiness count, a link to the current published page and the latest 20 recorded changes. Archived listings open read-only. Restore uses an expected revision, records history and keeps the recovered listing private. Photo order can be changed with Move Earlier/Move Later as well as Make Cover; changes require saving.

The public Properties collection supports GET filters for title/address, Active/Pending/Sold and price ordering when published listings exist. These browse Brad’s manually maintained listings; they are not an MLS search. Property share metadata uses the actual listing title, description, cover image and URL. The preview remains noindex pending launch approval.

## Saved page previews and property presentation

After saving a draft, choose **Open Saved Page Preview** above the form. `/studio/preview/[id]/` uses the same property body as the public page, including the full gallery, tour link, MLS number (when supplied), description and attribution. It shows the saved cloud draft, not unsaved input or the published snapshot. A visible private notice remains on printed previews. Internal permission notes are excluded. Preview pages and photos require the same enrolled-editor identity as the studio; preview responses are private/no-store, noindex and no-referrer. Preview pages omit Open Graph metadata and public sharing/showing controls. Archived drafts may still be previewed without restoring or publishing them.

Visitors can select photos to open an accessible modal viewer. Previous/Next, arrow keys, Home/End, Escape, touch swipes and focus return are supported. Without JavaScript, photo links open the image directly. The share action uses the device share sheet when available, otherwise copies the current public URL; clipboard denial offers a selectable link. The showing email draft includes the property title and public URL. Printing produces a property sheet with the cover image, details, description, attribution and Brad’s contact information, excluding navigation and extra gallery photos. Printing and sharing do not change publication status or send inquiries automatically.

## Editor usability improvements

The library now presents separate draft/published/archived totals and listing cards with addresses and status. The editing toolbar keeps Save, Quick Preview and Publish visible while scrolling; export, unpublish and archive are grouped under More actions. Publication requirements can be expanded and selected to focus the missing field. Field hints clarify the public page address, MLS reference and private permission note. Create from address suggests a safe URL slug; it never overwrites an existing address without confirmation. Saved/unsaved badges and separate working/success/error feedback make current state explicit. The mobile layout puts the listing library before the form and wraps the toolbar into touch-friendly controls.

Public property pages have Photos/Details/Contact jump links, a direct contact panel and status-aware inquiry wording for Active, Pending and Sold properties. No website inquiry delivery or inventory synchronization is implied.

## Preparing phone and camera photos

The workspace accepts JPG, PNG and WebP source files up to 25 MB each, with at most 100 MB in one selection. HEIC/HEIF needs to be exported as JPG first. Files are decoded and re-encoded in the browser, preserving the complete frame and proportions, with no enlargement of small photos. Prepared copies use WebP when supported, otherwise JPEG, with a maximum edge of 1,600 pixels and a strict size below the existing 400 KB server limit. Difficult-to-compress images may use a smaller edge. Sources above 50 megapixels are rejected. The browser releases decoded/canvas resources after each image.

Photos are processed sequentially. Progress and per-file results remain outside the temporarily inactive editor, and Stop Preparing Photos cancels the remaining work while retaining photos already added. Failed images do not remove earlier photos. The prepared photo cards show dimensions and byte sizes; Describe Photo jumps to that image’s required description. The first photo remains the cover. Sources remain unchanged on the device and are not uploaded. Save Draft Online uploads only prepared copies; Download Photo downloads the website copy. Keep the original files separately. Original filenames and source sizes exist only in the current browser preparation report, not in published listing fields.

Automated tests cover dimensions, file limits, unsupported formats, browser encoder fallback, cancellation and cleanup. Live browser checks use unsaved illustrative QA images and do not publish a property or send an inquiry.

## Listing promotion kit — October 10, 2026

More actions → Prepare Promotion Kit creates social-post, buyer-email and property-handoff templates from the current public listing fields. Copy Text has a manual selection fallback; Download All Templates produces a review-marked text file. No message, post or inquiry is sent. Missing title/address/price/description are identified rather than invented. Pending and Sold use status-specific wording; Sold prices are labelled listed prices. Private permission notes and media filenames are excluded. A property page link is included only when the saved published version matches the current draft and page address; private/unpublished edits never get a public link. Edits and loading another listing clear prepared copy to avoid stale facts. Templates use the entered description as written; they are not AI-generated sales claims. Brad must verify accuracy and permissions before sharing.
