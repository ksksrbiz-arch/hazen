# Hazen — Claude Router

Root router for AI agents in this repo. Routing only: detail lives in `context/`. Hard cap 80 lines.
Mission: Brad Hazen's agent marketing and listing site (Cloudflare Pages, D1, R2), built and run by 1commerce LLC for Keith Skaggs.

## Non-negotiables

1. **Verify before asserting.** Read the repo, run the tests, inspect the live result.
2. **Never invent facts** about Brad: credentials, areas, statistics, reviews, listings, prices. Say `VERIFY`.
3. **Deterministic code owns deterministic work.** AI judges, routes, summarizes, proposes.
4. **Honor session authorization.** Complete authorized releases without re-asking. New listing content, third-party charges, production data/access changes and messages need the applicable authorization; do not treat ordinary authorized site work as blocked.
5. **No MLS scraping or custom inventory sync.** Approved Ylopo widgets load current listings automatically. Legacy D1 listings remain manual; do not conflate them or restore MLS-number-only selection.
6. **Never commit secrets or `backups/`.** Do not collect Brad's MLS password.
7. **Cathedral order.** Foundation, Revenue, Systems, Scale: flag scale-before-revenue.

## Route the task (load only the row you need)

| Task | Load | Do not load |
|---|---|---|
| Orient, or "where are we" | `context/STATE.md`, `context/references/project-overview.md` | `context/CHANGELOG.md` |
| Change or add a site page, copy or style | `context/workflows/site-change/` | other workflows |
| Edit properties or testimonials in `src/content.json` | `context/references/content-editing.md` | `context/references/architecture.md` |
| Import or edit one of Brad's listings | `context/workflows/listing-import/` | `context/references/idx-and-mls.md` |
| Change the Studio editor | `context/references/listing-studio.md` | `context/references/project-plan.md` |
| Change `functions/`, `server/` or auth | `context/references/architecture.md`, `context/references/cloudflare-pages.md` | `context/references/image-assets.md` |
| Change the D1 schema or apply a migration | `context/workflows/d1-migration/` | `context/CHANGELOG.md` |
| Back up, verify or restore | `context/workflows/backup-drill/` | `context/references/listing-studio.md` |
| Prepare to go live, or the Brad handoff | `context/workflows/launch-check/` | `context/references/idx-and-mls.md` |
| Images and photo assets | `context/references/image-assets.md` | `context/references/architecture.md` |
| Brad's facts and sources | `context/references/client-content.md`, `context/references/brad-profile-sources.md` | `context/workflows/` |
| What to ask Brad | `context/references/client-intake.md` | `context/workflows/` |
| MLS, IDX, Ylopo, accounts, alerts | `context/references/search-and-blog-implementation.md`, `context/references/idx-and-mls.md` | unrelated workflows |
| Preparation tools or PDFs | `context/references/preparation-tools.md` | unrelated workflows |
| Scope, sitemap, milestones, acceptance | `context/references/project-plan.md` | `context/CHANGELOG.md` |
| What changed and when | `context/CHANGELOG.md` | everything else |
| Change this structure | `context/references/icm-rules.md` | workflows you are not changing |

Exclusion rule: if a file is not in the row's Load column, do not read it speculatively. Open it only
when the task proves it is needed, and say why.

## Orientation

`CLAUDE.md` → one workflow or reference → its inputs → `context/STATE.md`. Contracts declare
Input / Process / Output / Stop conditions / Completion. Data files stay where they are:
`docs/imports/`, `docs/REFERENCE_ASSETS.json`, `docs/source-assets/`.

## Verification

`npm run verify` (format check, tests, build, route checks, ICM structure check). Also
`npm run check:runtime` for `functions/` and `server/`. Run `npm run check:icm` after editing `context/`.

## Completion standard

Done means: implemented, documented, tested at the right level, `context/STATE.md` says what is true now,
and `context/CHANGELOG.md` has a dated entry for anything notable.
