# Cloudflare Pages deployment

Repository: ksksrbiz-arch/hazen. Production: https://bradhazen.com/ (Keith authorized October 29, 2026). Preview: https://hazen-ci5.pages.dev/.

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


## Custom domain — October 29, 2026

Zone fd52f5881b3ce7ff29bcf82b9bbb3c07 is active in account 371afa6149061390a094cfbf8a184aff. Pages project hazen has bradhazen.com attached and active, with a proxied CNAME to hazen-ci5.pages.dev. www is redirect-only with a proxied A record to 192.0.2.1, following Cloudflare's redirect-host guidance; it does not need a Pages custom-domain association. Zone redirect ruleset 4997ca589f534d20ab5f79193d0f3185 selects HTTPS apex with 301, preserving path/query. Access destinations now include studio and api/admin on both new hosts as well as the original preview. Identity provider, editor membership and audience are unchanged.

Static build HTML stays noindex as a safe default. Functions now cover HTML/robots/sitemap on all hosts; immutable assets bypass them. Only successful public marketing HTML on https://bradhazen.com receives index/follow at runtime. Preview robots disallow all and its sitemap returns 404. Legacy properties, empty testimonials, agent login, widget, studio and API stay excluded. Generated sitemap contains only eligible published marketing pages; unapproved blog posts never enter it. This supersedes the preview-only indexing/routing notes above.

Ylopo still uses bradhazen.realtypronw.net for full search, accounts and listing details. New domain activation does not prove Follow Up Boss assignment. No mailboxes or email sending service have been provisioned for bradhazen.com. Forms still use visitors' email applications.


Observed live after PR #15 deployment (034fe32): production home/community/gallery return index/follow and bradhazen.com canonical URLs; production sitemap is available and preview sitemap returns 404. Preview HTML/robots remain excluded. HTTP/www redirects preserve paths/queries; both private studio/admin redirect to Cloudflare Access. Ylopo renders both selected properties on the new origin; full search opens Brad's provider subdomain. Sharing image returns 200. Desktop and 390px mobile browser checks had no page errors or horizontal overflow. No email/test lead was sent; signed-in editor mutation on the new origin and physical-device/client training checks remain unperformed.
