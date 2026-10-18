# Workflow: Site change

Makes a code, content or style change to the Hazen site and proves it with the repository's own checks.

## Load / exclude

| Load | Do not load |
|---|---|
| `context/references/project-overview.md` | `context/CHANGELOG.md` unless tracing history |
| `context/references/content-editing.md` (copy and property or testimonial fields) | `context/references/idx-and-mls.md` |
| `context/references/architecture.md` (only for `functions/`, `server/`, `database/`) | `context/references/brad-profile-sources.md` unless editing Brad's bio |
| `context/references/image-assets.md` (only for images) | other workflow contracts |

## Input

- A described change. Facts about Brad (credentials, areas, statistics, reviews, listings) must come from Brad or the sources in `context/references/client-content.md`; never invent them.
- Content lives in `src/content.json` and `src/styles.css`; pages are built by `scripts/build.mjs`.

## Process

1. Change the smallest set of files. Keep `published: false` on properties until Brad authorizes text and photos.
2. `npm run format` for code. `npm run verify` runs format check, tests, build and route/asset checks.
3. For anything touching `functions/` or `server/`, also run `npm run check:runtime`.
4. For visual or navigation changes, `npm run build` then `npm run test:browser` where a browser is available. Automated checks do not replace keyboard, screen-reader, real-device or print review; say which were not done.
5. Add a dated entry to `context/CHANGELOG.md`; update `context/STATE.md` if status or open items changed.

## Output

A committed change on a branch, passing `npm run verify`, with the changelog entry. The Pages preview builds from `main` through Cloudflare's Git integration.

## Stop conditions

- The change needs a fact only Brad can supply: record it as an open input in `context/STATE.md` and leave a visible placeholder-free fallback.
- It would enable indexing, a sitemap or a production domain before Keith's launch approval.
- It touches the D1 schema: use `context/workflows/d1-migration/`.

## Completion

Done when `npm run verify` passes (plus the extra checks above where they apply), the changelog is updated, and Keith has merged it.
