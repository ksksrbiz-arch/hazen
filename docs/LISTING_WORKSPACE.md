# Brad’s listing workspace scaffold

## Current build

- Listings-first homepage: feature published listings except Sold, with a seller-oriented fallback until Brad supplies listings.
- Property pages: authorized photo galleries, price/status/facts, public attribution/review date, optional HTTPS video/tour link, showing inquiries.
- `/studio/`: public draft prototype, not a secured admin area. It has no credentials, backend publishing, MLS access, or inbound lead storage.
- Create/edit drafts; add up to 20 photos under 400 KB each; describe photos and select a cover; preview; save to this browser’s IndexedDB; export unpublished JSON and download the photos.
- Reloading the same browser can recover saved drafts. Clearing browser storage, using another device/profile/origin, or private browsing may lose access. Unsaved work is not backed up. Export files for handoff.
- Exported `published:false` JSON uses the same validation/model as the public build. A developer checks it, places authorized photos in `src/assets/`, imports approved content, and sets `published:true` before deployment. The studio never commits to GitHub or calls the MLS.

## Intended production architecture — proposed, not provisioned

Keep Cloudflare Pages for the website. Use an isolated Supabase project for Brad’s admin identity, private drafts, and private photo storage. The proposed migration is `database/migrations/001_listing_workspace.sql`; it is not applied automatically and has not been tested against a live database. Confirm the project/ownership before connecting it. Create/invite Brad through a secure account flow, then add his user ID to `listing_editors` through an administrator. Set membership `enabled=false` to revoke editing access. Public visitor accounts remain the separate IDX phase.

Row-level policies isolate drafts/photos to enrolled editor identities. Anonymous visitors cannot read drafts, permission notes, or publication jobs. Ordinary authenticated users cannot enroll themselves as editors. Provider/service-role keys never go in browser code. Private storage uses short-lived signed URLs for preview; approved images are copied to the public deployment only during publication.

Official implementation references:
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/storage/security/access-control

## Production operations to connect

| Operation | Behavior |
| --- | --- |
| List/create/edit drafts | Verify signed-in editor; owner-scoped records; server validation; incomplete drafts allowed |
| Upload/reorder photos | Private per-editor/per-draft paths; MIME and actual decoded-image validation; 400 KB limit; alt text and cover order |
| Save | Send expected revision; reject stale updates with 409 and retain local edits |
| Preview | Show the saved/working draft to its owner without creating a public route |
| Publish/unpublish | Authorized server endpoint only; validate ready record and permissions, create immutable snapshot/job, return job ID |
| Deployment | Whitelist public content; exclude permission notes/owner IDs; update git via server-held credentials; trigger one bundled Pages build |
| Publication status | Distinguish queued/building/live/failed; mark live only after deployment and route checks; draft saving does not publish |
| Showing request | Validated public endpoint, bot protection, verified email service; success after provider acceptance; retention and recipient confirmed |
| MLS import | Separate provider adapter; unavailable until approved IDX/API access confirmed; supported IDs only; never scrape or use credentials in client code |

The migration only scaffolds storage, identity restrictions, and job records. Publication API, job processor, git adapter, deployment verification, sign-in UI, secure preview, conflict handling, inbound email, backups, and database policy tests still need implementation. Do not replace the draft prototype’s labels with “Publish” until this path is connected and verified.

## Production acceptance

Test anonymous access, non-editor access, cross-editor isolation, expired sessions, revoked membership, stale edits, invalid assets, interrupted uploads, duplicate publish clicks, build failures, rollback, unpublishing, and keyboard/mobile editing. Verify published routes contain no internal notes. Test showing emails with an approved test recipient before routing live inquiries to Brad. Keep MLS feeds and website-only marketing enhancements separate to avoid overwriting Brad’s copy during feed updates.
