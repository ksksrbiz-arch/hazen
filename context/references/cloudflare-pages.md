# Cloudflare Pages preview setup

Repository: ksksrbiz-arch/hazen. No domain changes required.

In Cloudflare dashboard, choose Workers & Pages → Create application → Pages → Connect to Git (labels may vary). Select the hazen repository.

- Project name: brad-hazen-preview (subject to availability)
- Production branch: main
- Framework preset: None
- Build command: npm run verify (runs tests, the build and the route/asset check, so a failing check blocks the deploy; `npm run build` alone skips them)
- Build output directory: dist
- Root directory: repository root
- Environment variable: NODE_VERSION = 24

Save and deploy. Copy the returned pages.dev URL; do not assume the project name or hostname is available. Git integration builds on Cloudflare, not GitHub Actions.

This is a public development preview containing user-supplied business contact information. HTML robots metadata, robots.txt and an X-Robots-Tag header discourage indexing; these are not access controls. Do not store private client data or secrets in public content. Real form delivery remains unfinished. The Cloudflare listing editor is connected; see `context/references/listing-studio.md`.

The current scaffold remains intentionally excluded from indexing. Before final production launch, replace placeholder text, configure verified content/forms, implement the production sitemap and metadata, and remove preview indexing restrictions only from production.

## Inquiry delivery — current release
Contact, buyer, seller, and home assessment forms validate visitor input and prepare an email draft. They never claim an inquiry was sent. The visitor must send the draft from their email application. A visible copyable message is provided when no mail application opens. No server endpoint, storage, or email provider is configured in this release.

For direct website submission, next set up a verified sender domain and email provider, server-side validation, bot protection, and a Cloudflare Pages Function. Keep provider keys server-side. Confirm Brad’s recipient address and update the privacy notice before enabling delivery. Do not put provider credentials in the static build or ask Brad for his MLS password.

## Listing backend configuration

Actual project: `hazen`; hostname: `hazen-ci5.pages.dev`. Production bindings:

- D1 `DB`: `044f8f13-ea36-4fa6-b67e-330c58dbf050` (`hazen-listings`).
- R2 `PHOTOS`: `hazen-listing-photos` (private).
- `ACCESS_TEAM_DOMAIN`: `https://unify1.cloudflareaccess.com`.
- `ACCESS_AUD`: `039cc8a13d61072fe10ebbd898a124796ec1ec17eaa91b8efb4cfd8c63fbb264` (public application identifier, not a credential).
- `EDITOR_EMAILS`: enrolled editor emails, comma-separated; initial editor is the Cloudflare account email.

Access application ID: `42cdfe69-6542-4f3c-9831-64c121968575`. Its destinations protect `/studio` and `/api/admin`; policy grants only the initial editor. Updating destinations for a custom domain also requires redeploying any changed runtime configuration. Preview has no production backend bindings. Both environments set `fail_open=false`.

The deployment bundles `/functions`, `/server`, and `jose`. `dist/_routes.json` limits dynamic invocation to home, property, studio, admin and media routes. Marketing pages/assets remain static. The schema was applied through the Cloudflare D1 API. Keep migrations additive and reviewed; `npm run build` does not migrate databases.
