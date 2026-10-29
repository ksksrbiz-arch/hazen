# State - updated 2026-10-29

Per-run state. Replace superseded lines instead of stacking them; history belongs in `context/CHANGELOG.md`. Each line says when it was observed.

## Current work — October 29, 2026

- Branch codex/site-search-blog starts from current main b7f4e38, preserving newer listing presentation and price changes. Local worktree: C:/Users/keith/Projects/hazen-site-next.
- Built full-market search navigation/page, prominent Brad listings and an approval-gated blog framework; no articles or empty blog published. First interview kit is in docs/editorial/FIRST-INTERVIEW.md.
- Verified Ylopo gallery selection by the two approved MLS numbers, including land. agentId=HAZENB combined with featured returns other agents' properties and is not a valid filter. See context/references/search-and-blog-implementation.md.
- Ylopo support email sent; FUB access still pending. Actual lead routing and automatic agent-wide inventory remain unverified. No deployment or shared account changes.

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
- [ ] Domain ownership and access through supported roles.
- [ ] IDX/Ylopo provider, approved agent search or embed, MLS coverage and developer invitation.
- [ ] Required provider/brokerage website-display approvals and disclosures.
- [ ] First listing with approved facts, status, attribution and authorized photos.
- [ ] Decide whether launch uses reviewed email drafts or separately configured server delivery.
