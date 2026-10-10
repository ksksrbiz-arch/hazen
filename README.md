# Brad Hazen — agent website scaffold

Phase 1: marketing and lead-generation website closely matching Realty Pro’s layout and visual direction. No accounts or MLS integration. Deployed for design review at https://hazen-ci5.pages.dev/; not ready for final production launch.

Run `npm run build` and `npm run check`, then `npm run preview` and open http://localhost:8000. No dependencies are required. Edit `src/content.json` and `src/styles.css`; build generates physical route directories for refresh-safe navigation.

Start with [the project plan](docs/PROJECT_PLAN.md). Contact details and brokerage name were transcribed from Brad’s supplied card. Current credentials, service areas, listing content and testimonials await confirmation. No fictional properties or reviews are supplied. Contact, buyer, seller, and assessment forms prepare email drafts with a copyable fallback. Visitors send these through their own email application; direct website delivery is not configured. Six community guides include official local resource links.

Repository: https://github.com/ksksrbiz-arch/hazen (private). Client ownership remains to be agreed. No GitHub Actions.

Client intake: [what to ask Brad](docs/BRAD_ONBOARDING.md). Assets and CSS are content-versioned at build time; changes receive new filenames to prevent stale image/style caches. The Pages output remains `dist`.

Planning: [IDX Phase 2](docs/IDX_PHASE_2.md). Manually maintained properties and testimonials are supported through the collections in `src/content.json`; see [content editing](docs/CONTENT_EDITING.md). Empty collections render useful contact paths without fictional listings or reviews.

Listing workspace: `/studio/` is a clearly labeled local draft prototype. See [its boundaries and production connection plan](docs/LISTING_WORKSPACE.md). It cannot publish, access the MLS, or receive showing inquiries. The homepage is now listings-first; featured entries come from approved published content.
