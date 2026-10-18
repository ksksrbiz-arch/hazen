# Workflow: Backup and restore drill

Produces proof that the Hazen D1 database and R2 photos can be backed up, verified and restored, for Keith to rely on before launch.

## Load / exclude

| Load | Do not load |
|---|---|
| `context/references/architecture.md` (storage and publication model) | `context/CHANGELOG.md` |
| `scripts/backup.mjs` and `scripts/backup-lib.mjs` (read before running) | `context/references/image-assets.md` |
| `context/STATE.md` (record the result) | other workflow contracts |

## Input

- A machine where `wrangler whoami` shows the Cloudflare account that owns `hazen-listings` and `hazen-listing-photos`. A cloud session without those credentials cannot run this (found 2026-10-18).
- A private place to store the backup. `backups/` is git-ignored and holds private authorization notes and unpublished drafts. Never commit it.
- Permission from Keith to create a scratch D1 database and R2 bucket, and to delete them afterwards.

## Process

1. Back up: `npm run backup`. It writes `backups/<date>/database.sql`, `photos/<listing-id>/<file>` and `manifest.json`. It exits non-zero and sets `complete: false` if any photo is missing or truncated.
2. Verify: `npm run backup -- --verify backups/<date>` re-hashes everything against the manifest.
3. Restore into scratch resources only, never over production:
   - create a scratch D1 database and a scratch R2 bucket;
   - `wrangler d1 execute <scratch-db> --remote --file backups/<date>/database.sql`;
   - for each manifest entry, `wrangler r2 object put <scratch-bucket>/<key> --remote --file backups/<date>/photos/<key> --content-type <type>`.
4. Compare: row counts of `listings`, `photos`, `listing_events` match production; every photo key in the scratch database exists in the scratch bucket with the manifest size and SHA-256.
5. Record the date, counts, any failure and the retention decision in `context/STATE.md`. Delete the scratch resources once Keith confirms.

Steps 3 and 4 were run once as written above and passed; the scratch-resource name was `hazen-restore-drill-<yyyymmdd>`. For a database mistake in the last 30 days, D1 Time Travel (`wrangler d1 time-travel restore hazen-listings --timestamp <ISO time>`) needs no backup file; rehearsing it against production is out of scope for this drill.

Notes from the first run (2026-10-18, Windows): the Cloudflare login can see two accounts, so set `CLOUDFLARE_ACCOUNT_ID=371afa6149061390a094cfbf8a184aff` (the skdev account that owns both resources) in the shell before any wrangler command. Photo content type was taken from the key's extension (webp). The restore comparison used row counts for `listings`, `photos`, `listing_events`, the three 002 indexes in `sqlite_master`, and a SHA-256 re-hash of every restored R2 object.

## Output

A dated backup directory outside the repository, a passing `--verify`, and a STATE.md entry with the restore comparison.

## Stop conditions

- `wrangler whoami` shows the wrong account or none: stop, do not look for credentials elsewhere.
- Manifest `complete: false` or `--verify` fails: stop and report which photos; do not call the backup good.
- Any step would write to the production database or bucket: stop.
- Backups keep nothing off Cloudflare yet: ask Keith where a second copy lives before declaring done.

## Completion

Done when backup, verify and a scratch restore have all passed on real resources, the comparison is recorded in `context/STATE.md`, the scratch resources are deleted with Keith's approval, and the launch-check backup item can be checked. Nothing schedules backups automatically; say so rather than implying it.
