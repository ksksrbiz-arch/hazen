# State — updated October 30, 2026

Current implementation and last verified release facts. Historical passes belong in `CHANGELOG.md`, not as competing instructions here. External account status below is the last verified state, not a live mailbox or dashboard check.

## Live release

- Production: https://bradhazen.com/; Pages project `hazen`, main branch. Preview hostname https://hazen-ci5.pages.dev/ stays noindex. HTTP/www redirect to HTTPS apex with path/query preserved. Domain activation authorized October 29.
- PR #19: on-site filtered search at `/search/`, isolated `/search-widget/`, details/maps/accounts on Brad's Ylopo subdomain. Live city/type/price/bedroom/more/empty/reset/mobile checks passed.
- Automatic featured gallery uses `{featured:'t', agentId:24820243, propertyTypes:[], limit:6}`. Numeric agent ID is not RMLS `HAZENB`. Live provider data loads on visits; no scraping/import/scheduled sync.
- PR #20: verified Yacolt provider IDs `210989090` (land, MLS 24202394) and `210973857` (commercial, MLS 24397685) share one featured card with both links. Either remains visible independently if its counterpart disappears. Homepage and `/brads-listings/` verified live with two visible property cards, including NE Hazen Avenue. Do not assume all future duplicate-looking records represent the same property.
- PR #21: guided buyer/seller steps, progress/review/print behavior, selectable photo plan, and real licensed local photographs for all six community cards/guides. Sources, dates, authors and licenses: `src/community-photos.json`. Some photos are older; dates are disclosed. Other scenic imagery remains illustrative.
- PR #22 / merge `2d3f3f9`: polished two-page seller PDF, blank download plus browser-generated filled PDF preserving checks and appending notes. Verified live PDF response, download and extracted notes. Buyer download remains text. Preparation entries are page-only, not saved or sent.
- Legacy D1 `/properties/` pages and Studio remain available but are not the featured inventory source. Main navigation and resource links use the Ylopo gallery.
- Public marketing pages are indexable on production only; widgets, legacy property routes, private routes and empty testimonials remain excluded. Blog drafts are unapproved/unpublished; no blog routes/nav are generated yet.

## Unresolved integration and handoff

- Custom forms prepare email drafts; visitors must send them. No direct delivery endpoint or FUB creation is configured.
- FUB access and actual Brad lead assignment remain unverified. Need account mapping confirmation and an authorized end-to-end test; distinguish new leads from existing-contact routing and check automatic messages before testing.
- Last mailbox check October 29: Ylopo response at 4:10 p.m. Pacific did not settle external embedding approval, routing, setup or fee questions. Clarification sent at 4:16 p.m. Pacific. Check for a new reply when asked; do not claim this is current inbox state or resend automatically.
- Direct RMLS Broker Specific feed is on hold while using Ylopo. It is not configured or billed by this repo. A working widget is not proof of contractual approval or CRM assignment.
- Secondary co-listing matching, future inventory/status transitions and more than six featured records are not fully verified.
- Brad's exact blog wording/approval, final bio/license/brokerage assets/disclosures, commercial maintenance agreement, operating responsibilities, signed-in editor check on the custom domain, physical-device and physical-print acceptance remain to be completed as applicable. Technical launch is already authorized; do not revert it to preview because handoff items remain.

## Validation baseline

- PR #21: 130 Node tests and 84 browser tests including automated WCAG checks and 320px widths; compiled runtime passed.
- PR #22: 131 Node tests, four targeted preparation/browser tests, build/route/asset/ICM checks and compiled runtime passed. Both PDF checklist pages visually reviewed; filled notes extracted; live download verified. These counts are release evidence, not permanent expected counts.
- No live test lead, email or CRM mutation was sent in these release checks.

## Operations still relevant

- D1 indexes from `002_indexes.sql` were verified present October 18; do not reapply as an outstanding migration.
- October 18 backup/restore drill passed: 9 photos and database content verified. Local backup is git-ignored; second off-device copy, retention and scheduling remain undecided. Scratch restore resources await a separately authorized cleanup; do not delete by inference.
- This checkout is `C:/Users/keith/Projects/hazen-site-next`. Other checkout/worktree changes may belong to Keith or another agent; inspect status before editing or merging.
