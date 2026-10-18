# Workflow: D1 migration

Adds or applies an additive schema change to the `hazen-listings` D1 database without breaking the live site.

## Load / exclude

| Load | Do not load |
|---|---|
| `context/references/architecture.md` | `context/CHANGELOG.md` |
| `context/references/cloudflare-pages.md` (bindings, additive rule) | `context/references/listing-studio.md` |
| `database/cloudflare/` (existing numbered files) | other workflow contracts |

## Input

- A reason for the change and the code that needs it.
- Wrangler authenticated for the account that owns `hazen-listings` (or the Cloudflare connector, read-only, to check state).

## Process

1. Write the next numbered file in `database/cloudflare/` (`003_...sql`). Keep it additive and idempotent (`CREATE ... IF NOT EXISTS`); no drops or destructive rewrites.
2. Run `npm test` and `npm run check:runtime`: both load every file in that directory in order.
3. Deploying code does not migrate. Before applying, take a backup (`context/workflows/backup-drill/`).
4. Apply with Keith's approval: `wrangler d1 execute hazen-listings --remote --file database/cloudflare/<file>.sql`.
5. Verify in production by a read-only query of `sqlite_master` that each object exists with the definition in the file.
6. Record the date and result in `context/STATE.md` and a line in `context/CHANGELOG.md`.

## Output

A numbered SQL file, passing tests, and a STATE.md entry confirming the object exists in production.

## Stop conditions

- The change is not additive (drops, renames, type changes): stop and ask Keith.
- Production already differs from the repo's files in a way the new file does not account for.
- Wrangler is authenticated to a different account than the one holding the database.

## Completion

Done when the file is committed, tests and runtime check pass, the change is applied and read back from production, and `context/STATE.md` says so. `002_indexes.sql` was verified present in production on 2026-10-18; no change was made that day.
