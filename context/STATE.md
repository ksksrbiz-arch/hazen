# State — updated 2026-10-18

Per-run state. Replace superseded lines instead of stacking them; history belongs in `context/CHANGELOG.md`. Each line says when it was observed.

## Observed 2026-10-18

- Repository base: merge of PR #6 (2026-10-12). `npm run verify` on the ICM branch: 103 pass, 0 fail, 2 skipped (they skip when `dist/` is absent, which is the case during `npm test`).
- Production D1 `hazen-listings` already has the three indexes from `002_indexes.sql`, with matching definitions (read-only `sqlite_master` query). No migration was applied.
- Backup drill PASSED 2026-10-18 on Keith's Windows PC (wrangler logged in as skdev@1commercesolutions.com; account 371afa6149061390a094cfbf8a184aff owns both resources). `npm run backup`: database exported, 9 of 9 photos saved. `--verify`: all files match the manifest, `complete: true`. Scratch restore into a new D1 database and R2 bucket: row counts match production (listings 3, photos 9, listing_events 10, the three 002 indexes present) and all 9 restored photos re-hash to the manifest SHA-256 and size. The backup is on that PC only (`Projects\hazen\backups\2026-10-18`, git-ignored): a second copy off the PC and off Cloudflare is still undecided. Backups are not scheduled. Scratch resources `hazen-restore-drill-20261018` (D1 e6bd0072-cab9-492e-8599-e51c3fd32693 and R2 bucket) are awaiting Keith's approval to delete.
- Fixed a Windows bug the drill exposed: `scripts/backup.mjs` spawned `npx` and failed with ENOENT on Windows; it now runs wrangler through Node.
- Repository moved into the ICM layout on branch `claude/icm-restructure` (not merged, not pushed).

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
