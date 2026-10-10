# Cloudflare Pages preview setup

Repository: ksksrbiz-arch/hazen. No domain changes required.

In Cloudflare dashboard, choose Workers & Pages → Create application → Pages → Connect to Git (labels may vary). Select the hazen repository.

- Project name: brad-hazen-preview (subject to availability)
- Production branch: main
- Framework preset: None
- Build command: npm run build
- Build output directory: dist
- Root directory: repository root
- Environment variable: NODE_VERSION = 24

Save and deploy. Copy the returned pages.dev URL; do not assume the project name or hostname is available. Git integration builds on Cloudflare, not GitHub Actions.

This is a public development preview containing user-supplied business contact information. HTML robots metadata, robots.txt and an X-Robots-Tag header discourage indexing; these are not access controls. Do not store private client data or secrets in public content. Real form delivery and CMS remain unfinished.

The current scaffold remains intentionally excluded from indexing. Before final production launch, replace placeholder text, configure verified content/forms, implement the production sitemap and metadata, and remove preview indexing restrictions only from production.

## Inquiry delivery — current release
Contact, buyer, seller, and home assessment forms validate visitor input and prepare an email draft. They never claim an inquiry was sent. The visitor must send the draft from their email application. A visible copyable message is provided when no mail application opens. No server endpoint, storage, or email provider is configured in this release.

For direct website submission, next set up a verified sender domain and email provider, server-side validation, bot protection, and a Cloudflare Pages Function. Keep provider keys server-side. Confirm Brad’s recipient address and update the privacy notice before enabling delivery. Do not put provider credentials in the static build or ask Brad for his MLS password.
