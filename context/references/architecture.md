# Architecture and operations (reference)

Load this before changing `functions/`, `server/`, `database/`, Cloudflare configuration, authentication or the publication model. Reorganised on 2026-10-18 from docs/LISTING_WORKSPACE.md (sections dated 2026-10-10 to 2026-10-12), text unchanged. Deployment settings are in `context/references/cloudflare-pages.md`; editor behaviour is in `context/references/listing-studio.md`.

## Connected on October 10, 2026

The website stays on Cloudflare Pages (`hazen`, `hazen-ci5.pages.dev`). Production uses a dedicated D1 database `hazen-listings` and private R2 bucket `hazen-listing-photos`. No unrelated projects or buckets are used.

Cloudflare Access application **Hazen Listing Studio** protects `/studio` and `/api/admin`. Existing email one-time-pin identity provider is used. Enrolled editors: `skdev@1commercesolutions.com`, `b.hazen@hotmail.com`, and `skdev@1commerce.online`. The latter two were explicitly requested and added to both the Access allow policy and production `EDITOR_EMAILS` on October 10, 2026. No password or MLS credentials belong in the repository or browser code.

Functions verify Access JWT signatures, issuer, audience, expiration, subject and editor email. Alternate deployment URLs remain protected by origin verification, even where an Access gateway is absent. Preview builds have no production database, storage or authentication bindings and cannot change production listings. Production and preview fail closed.

## Storage and publication

`database/cloudflare/001_listings.sql` is the applied SQLite schema. Each listing has an independent working draft and published JSON snapshot. Permission notes are excluded from public snapshots. Photos use immutable UUID filenames scoped to a listing. A public media Function serves only images referenced by the current published snapshot. The bucket has no public R2 URL. Removed photos are retained privately as history; automated cleanup is not implemented. Limits: 20 photos per draft, each under 400 KB; 200 historical uploads per listing; editor list shows the 200 latest unarchived records.

Browser checks decode selected images. The server independently checks byte limits, permitted image signatures and content type. No SVG or arbitrary filename uploads. Mutations require a verified editor and same-origin Origin header. Draft save, publish, unpublish and archive use expected revisions; stale sessions receive 409. D1 transactional batches record successful changes in `listing_events`. Authorization notes and actor identifiers are never rendered in public HTML. Responses with private data use no-store caching. Unpublished media is also not cached publicly. Previously downloaded public photos cannot be recalled.

Cloudflare Access controls entry, with a second editor allowlist at the origin. Editors share Brad’s single-agent workspace; there is no separate multi-agent or client tenancy. There is no account enrollment endpoint.

## Verification and pending work

`npm test` checks signed token validation, expired/wrong-audience/non-editor rejection, API create/upload/save/publish/unpublish, draft isolation, conflicting edits, transactional history, duplicate slugs, private photo access, HTML escaping and published snapshot stability. Tests use local SQLite and simulated R2/JWKS, not live Cloudflare credentials. `npm run check` validates the generated routes/assets. Wrangler compiles Pages Functions.

The first authenticated live session was verified with `skdev@1commercesolutions.com`: cloud draft creation, photo upload, saving and reload succeeded. The private QA record was archived with history retained. No test property was published to production. `npm run check:runtime` runs the compiled Pages Functions against isolated local D1/R2, including homepage/collection/detail rendering, private-note exclusion, anonymous rejection, media and unpublication. Before client launch, verify upload, reload, publication and unpublication with Brad’s first approved listing. Confirm backup/retention requirements, domain ownership, authorized assets and client content. No automated backup export/restore UI is provided yet; archived listings can be restored by an authorized editor in the studio.

Automated showing/contact delivery is not connected: visitors use their own email application or call Brad. Add a verified sender/provider, approved recipient, bot protection, server validation and a truthful delivery result separately. MLS import and visitor accounts/alerts remain the separately planned IDX phase; an MLS login alone is not website API authorization.

An earlier, never-applied Supabase design (`database/migrations/001_listing_workspace.sql`) was removed on October 12, 2026 because this Cloudflare implementation superseded it; it remains in git history. `database/cloudflare/` is the only schema directory.

## Reliability hardening — October 12, 2026

Photo uploads reserve the photo name and enforce the 200-upload history cap in one atomic D1 statement before the R2 write; an R2 failure removes the reservation. Request bodies are read with a hard size bound even without `Content-Length`. Storage or unexpected failures now return 500 (logged with the cause) instead of a misleading 400; missing Access configuration returns 503 instead of looking like a sign-in prompt. Draft numeric/boolean fields are type-checked on save. Publishing verifies all photos with one registration query. One unusable published snapshot is skipped rather than failing the collection. The library reports when more than 200 listings exist. The photo size limit lives in `src/listing-model.js` for both browser and server.

`database/cloudflare/002_indexes.sql` adds additive indexes. **It must be applied to the production D1 database** (`wrangler d1 execute hazen-listings --remote --file database/cloudflare/002_indexes.sql`) — deploying code does not migrate. Tests and the runtime check load every file in that directory in order.

Verified 2026-10-18: all three indexes in `002_indexes.sql` already exist in production `hazen-listings` with definitions matching the file (read-only query of `sqlite_master`). The procedure for future migrations is `context/workflows/d1-migration/`.

## Verify

`npm run verify` and `npm run check:runtime`.
