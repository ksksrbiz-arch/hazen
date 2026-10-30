# Workflow: Launch check

Checks production releases and remaining client handoff. The site is already live under Keith's October 29 approval; do not treat this checklist as an instruction to revert indexing or block previously authorized work.

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
- [ ] Check the Ylopo homepage/gallery/search and both Yacolt links. Check legacy Studio status behavior only where used.
- [ ] Confirm inquiry review/copy/email behavior with authorized test content. Send a delivery test only if explicitly approved.
- [ ] Verify connected Ylopo search, links and attribution; separately verify provider approval and FUB routing with authorized access/test data.
- [ ] Check phone and desktop layout, keyboard focus, gallery, menu and contact paths.
- [ ] Verify actual print/PDF output; print styles alone are not proof of a tested printout.
- [ ] Run one real backup, verify and restore drill using `npm run backup` (runbook: `context/workflows/backup-drill/`), and confirm retention needs. Backups run on demand; nothing schedules them automatically yet.
- [ ] Verify final domain, redirects, canonical/share URLs and permissions. Preserve approved production indexing and preview/private exclusions.
- [ ] Decide analytics/privacy settings; do not add third-party tracking by default.
- [ ] Remove or update preview notices and placeholders only after approved replacements exist.

2. Handoff session (from the launch readiness plan, 2026-10-11):

Open the private guide. Confirm who will operate the legacy Studio before assigning it to Brad; he has asked Keith to handle technical work. Demonstrate the workflows they agree to use. Cover photo format/preparation, descriptions, review date, saved vs published state, status changes, unpublish/archive/restore, downloaded promotion copy and inquiry follow-up. Confirm Brad keeps source photos and understands that this editor does not update the MLS. Record final acceptance and the agreed maintenance start date.

## Output

The checklist with each item checked or marked `VERIFY`, the recorded final acceptance and agreed maintenance start date, and a changelog entry.

## Stop conditions

- A requested change depends on missing client/provider information: record that dependency and continue independent authorized work.
- Indexing, sitemap or production domain changes are requested before Keith records launch approval.
- A check can only be shown by automated tests but needs a person (keyboard, screen reader, real device, printed output): mark it `VERIFY`.

## Completion

Done when applicable checks are observed or explicitly deferred, operating responsibilities and acceptance are recorded, and the authorized release is verified. Keep preview noindex and private protections. Technical deployment and full client handoff are distinct completion states.
