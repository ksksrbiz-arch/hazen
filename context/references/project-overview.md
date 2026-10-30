# Project overview (reference)

Live single-agent marketing and search site for Brad Hazen, Realty Pro, Inc., built by Keith Skaggs / 1commerce LLC. Current status: `context/STATE.md`; architecture: `architecture.md`.

## What it is

Production https://bradhazen.com/; non-indexed preview hostname https://hazen-ci5.pages.dev/. Cloudflare Pages project `hazen` deploys `main` from the private ksksrbiz-arch/hazen repository. Node static generation plus Pages Functions. The main listing/search experience uses Ylopo; D1/private R2 serve the separate legacy/manual Studio. Client ownership and maintenance handoff remain to be agreed.

## Commercial scope

- Agreed fixed website build: $1,500.
- Proposed technical maintenance: $225/month after handoff, subject to Brad's approval.
- Brad retains factual approval and real estate/client decisions. Keith has been asked to handle the technical setup; finalize the division of routine content entry and maintenance at handoff.
- Standard provider-supplied IDX integration is in the initial quote. Custom feeds/accounts/alerts/CRM require separate scope unless supplied by that provider.
- Third-party charges require approval. Payment schedule and any applicable tax are not yet agreed.

## Prepared in the platform

Marketing pages, researched community guides with real licensed local photos, comparison tools, guided preparation, seller PDFs and page-only notes are live. Ylopo supplies automatic featured listings and filtered on-site results; details/maps/accounts open on Brad's provider subdomain. Studio remains protected and separate from RMLS. Blog drafts remain approval-gated.

Custom forms prepare visitor-sent email drafts. Direct delivery and Follow Up Boss lead assignment are not verified or configured by the custom site. Technical launch does not constitute completed training, contractual/provider approval or final handoff.

## Developer maintenance boundary

Technical maintenance covers updates, functionality checks, hosting oversight, security fixes and troubleshooting of the agreed platform. It does not include routine listing entry, copywriting, pricing decisions, client replies, advertising or new features. Provider outages and subscriptions remain subject to the provider's service and terms.

## Login presentation

`/agent-login/` is the branded public entry point; Continue opens `/studio/` through Cloudflare Access. It has no credential fields and does not grant access. The full Cloudflare login theme is shared with other applications and must not be changed for Brad alone. Keep the existing editor allowlist, application audience, destinations and identity provider intact.

## Verify

`npm run verify` for the build. The launch checklist is `context/workflows/launch-check/`.
