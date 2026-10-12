# Brad Hazen - launch and handoff readiness

Updated October 11, 2026 (Pacific). This is a checklist, not a claim of final launch approval.

## Commercial scope

- Agreed fixed website build: $1,500.
- Proposed technical maintenance: $225/month after handoff, subject to Brad's approval.
- Brad handles listing entry, authorized photos, descriptions, pricing, availability, client inquiries and real estate operations.
- Standard provider-supplied IDX integration is in the initial quote. Custom feeds/accounts/alerts/CRM require separate scope unless supplied by that provider.
- Third-party charges require approval. Payment schedule and any applicable tax are not yet agreed.

## Prepared in the platform

Marketing pages, original illustrative scenery, six community guides, comparison and resource tools, buyer/seller worksheets, reviewed inquiry email drafts, private listing editor, publication workflows, photo preparation, public property presentation, promotion templates and private saved previews are implemented. Editor access is restricted to the existing authorized emails. The operating guide is at `/studio/guide/` and opens separately from the editor.

No real listing inventory is published. The site remains a review preview with noindex. Automated inquiry delivery, live MLS search and visitor accounts are not connected. Never change these statements until the underlying integration is verified.

## Information still required from Brad

- [ ] Confirm the quote scope and monthly maintenance arrangement.
- [ ] Original headshot and approved brokerage brand files; use replacement imagery only with permission.
- [ ] Approved bio, license details, brokerage disclosures and service areas.
- [ ] Confirm public contact details and receiving inbox.
- [ ] Domain ownership and access through supported roles.
- [ ] IDX/Ylopo provider, approved agent search or embed, MLS coverage and developer invitation.
- [ ] Required provider/brokerage website-display approvals and disclosures.
- [ ] First listing with approved facts, status, attribution and authorized photos.
- [ ] Decide whether launch uses reviewed email drafts or separately configured server delivery.

## Final verification before launch

- [ ] Run build, route/asset checks, unit tests and compiled Cloudflare runtime checks.
- [ ] Brad signs in with his own authorized editor identity.
- [ ] With Brad's approved listing, demonstrate save, reload, preview and publication. Verify details and cover photo on public pages.
- [ ] Verify a later edit stays private until republished; demonstrate unpublish and restore without losing the draft.
- [ ] Check homepage features and Active/Pending/Sold presentation with approved data.
- [ ] Confirm inquiry review/copy/email behavior with authorized test content. Send a delivery test only if explicitly approved.
- [ ] Verify chosen IDX search, links, responsive behavior and provider disclosures once connected.
- [ ] Check phone and desktop layout, keyboard focus, gallery, menu and contact paths.
- [ ] Verify actual print/PDF output; print styles alone are not proof of a tested printout.
- [ ] Confirm D1/R2 backup and recovery procedure and retention needs. Listing JSON export excludes photo bytes; keep photos separately. No automated backup/export-restore system is currently implemented.
- [ ] Verify final domain, redirects, canonical/share URLs and permissions. Enable indexing and sitemap only after launch approval.
- [ ] Decide analytics/privacy settings; do not add third-party tracking by default.
- [ ] Remove or update preview notices and placeholders only after approved replacements exist.

## Handoff session

Open the private guide. Have Brad create and manage an approved listing himself while Keith observes. Cover photo format/preparation, descriptions, review date, saved vs published state, status changes, unpublish/archive/restore, downloaded promotion copy and inquiry follow-up. Confirm Brad keeps source photos and understands that this editor does not update the MLS. Record final acceptance and the agreed maintenance start date.

## Developer maintenance boundary

Technical maintenance covers updates, functionality checks, hosting oversight, security fixes and troubleshooting of the agreed platform. It does not include routine listing entry, copywriting, pricing decisions, client replies, advertising or new features. Provider outages and subscriptions remain subject to the provider's service and terms.

## Login presentation

`/agent-login/` is the branded public entry point; Continue opens `/studio/` through Cloudflare Access. It has no credential fields and does not grant access. The full Cloudflare login theme is shared with other applications and must not be changed for Brad alone. Keep the existing editor allowlist, application audience, destinations and identity provider intact.
