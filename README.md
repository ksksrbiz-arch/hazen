# Brad Hazen — agent website scaffold

Phase 1: marketing and lead-generation website closely matching Realty Pro’s layout and visual direction. No visitor accounts or MLS integration. Deployed for design review at https://hazen-ci5.pages.dev/; not ready for final production launch.

Run `npm ci`, `npm run build` and `npm run check`, then `npm run preview` and open http://localhost:8000. The server uses `jose` for Access token verification; Wrangler is a development dependency. Edit `src/content.json` and `src/styles.css`; build generates physical route directories for refresh-safe navigation.

Start with [the project plan](docs/PROJECT_PLAN.md). Contact details and brokerage name were transcribed from Brad’s supplied card. Current credentials, service areas, listing content and testimonials await confirmation. No fictional properties or reviews are supplied. Contact, buyer, seller, and assessment forms prepare email drafts with a copyable fallback. Visitors send these through their own email application; direct website delivery is not configured. Six community guides include official local resource links.

Repository: https://github.com/ksksrbiz-arch/hazen (private). Client ownership remains to be agreed. No GitHub Actions.

Client intake: [what to ask Brad](docs/BRAD_ONBOARDING.md). Assets and CSS are content-versioned at build time; changes receive new filenames to prevent stale image/style caches. The Pages output remains `dist`.

Planning: [IDX Phase 2](docs/IDX_PHASE_2.md). Manually maintained properties and testimonials are supported through the collections in `src/content.json`; see [content editing](docs/CONTENT_EDITING.md). Empty collections render useful contact paths without fictional listings or reviews.

Listing workspace: `/studio/` is protected by Cloudflare Access email sign-in. It saves drafts to D1 and photos to a private R2 bucket. Publish updates dynamic property pages and homepage features immediately; later draft edits stay private. See [workspace operations](docs/LISTING_WORKSPACE.md). MLS import and automated inquiry delivery remain pending.

Property presentation: published listings support an enlarged photo viewer, link sharing and printable property sheets. Saved full-page previews remain private to enrolled editors at `/studio/preview/[id]/`. Run `npm test` and `npm run check:runtime` to verify storage, authentication, rendering and publication behavior in isolated fixtures.

Client handoff: the private operating guide is at `/studio/guide/`, linked from the editor. It includes a downloadable text copy. See [launch readiness](docs/LAUNCH_READINESS.md) for remaining client inputs and final checks. Brad owns listing entry and real estate operations after handoff.

Browser checks: `npm run test:browser` serves `dist/` with the production security headers and runs Chromium smoke tests (every public route loads without console/CSP errors and without horizontal scroll at 320px, mobile menu, inquiry flow, 404 recovery) plus an axe WCAG A/AA scan of key pages. Run `npm run build` first. It is separate from `npm run verify` because it needs a browser; on a machine without one, run `npx playwright install chromium` (or set `PW_CHROMIUM` to a Chromium binary). These are automated checks, not a substitute for keyboard, screen-reader, real-device and print review.
