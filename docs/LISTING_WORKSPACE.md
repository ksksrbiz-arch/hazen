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
