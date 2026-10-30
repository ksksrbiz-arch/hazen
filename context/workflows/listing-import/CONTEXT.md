# Workflow: Listing import (manual)

Puts one of Brad's authorized listings into Studio as a draft with its evidence recorded, and publishes it only when Keith or Brad authorizes. This is a manual legacy-D1 workflow, separate from the live Ylopo gallery. Do not create duplicate D1 records merely to make a provider listing appear on the homepage.

## Load / exclude

| Load | Do not load |
|---|---|
| `context/references/listing-studio.md` (draft, publish, photo rules) | `context/CHANGELOG.md` |
| `context/references/brad-profile-sources.md` (known listing references and their conflicts) | `context/references/idx-and-mls.md` |
| `context/references/image-assets.md` (photo budget) | other workflow contracts |

## Input

- A listing Brad (or the broker) has authorized for his site, with price, status, facts and attribution confirmed by him.
- Source evidence: the directory or MLS page URL, and the photos with permission to reuse them.
- Precedent: `docs/imports/brad-listings-2026-10-11.json` records the E Yacolt Road and NE Hazen Avenue imports, their stable record IDs, source URLs and photo hashes.

## Process

1. Confirm authority, current status and asking price with Brad. Directory data can be stale or conflict (see the brad-profile-sources reference).
2. Create the listing through Studio (`/studio/`) or its admin API as a draft. Keep photos within the stated size budget, without retouching or watermark removal of source images.
3. Record the source evidence for the new listing in `docs/imports/` in the same shape as the precedent file.
4. Preview privately at `/studio/preview/[id]/`, check details and the cover photo, then publish only on authorization.
5. Add a changelog entry: what was imported, from where, who authorized it.

## Output

A published or draft D1 listing with R2 photos, an evidence record in `docs/imports/`, and a changelog entry.

## Stop conditions

- Brad has not confirmed authority, status or price: stay a draft.
- Photo permission or attribution is unknown.
- A request implies automatic MLS syncing: this workflow does not do that; see `context/references/idx-and-mls.md`.

## Completion

Done when the listing renders correctly in the private preview (and publicly if published), the evidence record exists, and `npm test` still passes. Public status stays manually maintained; say so in the handoff.
