# Workflow: Launch check

Produces a signed-off decision on whether the Hazen site can leave design preview, with every check observed and recorded, and Brad's handoff completed.

## Load / exclude

| Load | Do not load |
|---|---|
| `context/STATE.md` (open client inputs) | `context/CHANGELOG.md` |
| `context/references/project-overview.md` (scope, maintenance boundary) | `context/references/image-assets.md` |
| `context/references/listing-studio.md` (what Brad will operate) | `context/references/idx-and-mls.md` unless IDX is part of launch |
| `context/references/project-plan.md` (launch acceptance criteria) | other workflow contracts |

## Input

- Brad's approved content and the client inputs still open in `context/STATE.md`.
- A passing `npm run verify` on the branch to be launched.
- Keith present for the handoff session; Brad signs in with his own authorized editor identity.

## Process

1. Work the checklist with Keith. A box stays unchecked until it has been observed, not assumed.

- [ ] Run build, route/asset checks, unit tests and compiled Cloudflare runtime checks.
- [ ] Brad signs in with his own authorized editor identity.
- [ ] With Brad's approved listing, demonstrate save, reload, preview and publication. Verify details and cover photo on public pages.
- [ ] Verify a later edit stays private until republished; demonstrate unpublish and restore without losing the draft.
- [ ] Check homepage features and Active/Pending/Sold presentation with approved data.
- [ ] Confirm inquiry review/copy/email behavior with authorized test content. Send a delivery test only if explicitly approved.
- [ ] Verify chosen IDX search, links, responsive behavior and provider disclosures once connected.
- [ ] Check phone and desktop layout, keyboard focus, gallery, menu and contact paths.
- [ ] Verify actual print/PDF output; print styles alone are not proof of a tested printout.
- [ ] Run one real backup, verify and restore drill using `npm run backup` (runbook: `context/workflows/backup-drill/`), and confirm retention needs. Backups run on demand; nothing schedules them automatically yet.
- [ ] Verify final domain, redirects, canonical/share URLs and permissions. Enable indexing and sitemap only after launch approval.
- [ ] Decide analytics/privacy settings; do not add third-party tracking by default.
- [ ] Remove or update preview notices and placeholders only after approved replacements exist.

2. Handoff session (from the launch readiness plan, 2026-10-11):

Open the private guide. Have Brad create and manage an approved listing himself while Keith observes. Cover photo format/preparation, descriptions, review date, saved vs published state, status changes, unpublish/archive/restore, downloaded promotion copy and inquiry follow-up. Confirm Brad keeps source photos and understands that this editor does not update the MLS. Record final acceptance and the agreed maintenance start date.

## Output

The checklist with each item checked or marked `VERIFY`, the recorded final acceptance and agreed maintenance start date, and a changelog entry.

## Stop conditions

- Any required client input in `context/STATE.md` is still open: list it, do not launch around it.
- Indexing, sitemap or production domain changes are requested before Keith records launch approval.
- A check can only be shown by automated tests but needs a person (keyboard, screen reader, real device, printed output): mark it `VERIFY`.

## Completion

Done when every checklist item is observed or explicitly deferred by Keith, Brad has created and managed an approved listing himself, final acceptance is recorded in `context/STATE.md`, and Keith approves going live. Preview notices and noindex are removed only after that approval.
