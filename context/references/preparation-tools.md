# Preparation tools and PDF maintenance

## Source ownership

- Resource hub/home entrances: `scripts/resources.mjs`.
- Shared buyer/seller markup: `scripts/conversation-worksheet.mjs`; prompt sources: `scripts/buyer-worksheet.mjs`, `scripts/seller-worksheet.mjs`, `scripts/seller-marketing.mjs`.
- Guided steps, progress, review-all, print and export: `src/site.js`; visual/print styling: `src/resources.css`.
- Selectable photo plan: `scripts/photo-guide.mjs` and `src/site.js`.
- Shared buyer/seller PDF renderer: `src/seller-pdf.js`; build/bundling: `scripts/build.mjs`.

## Behavior to preserve

Checks/notes stay in the page. No persistence, upload, email or CRM submission is implied. Download or print before leaving to retain entries. Steps preserve form state; printing reveals all sections even when guided view hides them. No-JavaScript markup remains usable.

Seller blank download: `/resources/seller-conversation-checklist.pdf`, generated at build time from the same prompts. Download My PDF lazily imports the fingerprinted jsPDF bundle, preserves check states and appends entered notes. Shared contact details come from `src/contact.js`. Do not replace it with a TXT link or make every visitor load the PDF library. A failed export offers print/blank-PDF fallbacks and resets its button state. Legacy TXT URL is kept only for compatibility.

Buyer blank download: `/resources/buyer-conversation-checklist.pdf`. The buyer export uses the same lazy PDF bundle, with buyer-specific headings and all six buyer prompt groups. Both filled exports preserve checks and append notes; legacy TXT URLs remain available for compatibility. Print remains available for both. Photo selections can be printed but are not stored or sent.

## Verification

Run `npm run verify` and `npx playwright test tests/browser/preparation.spec.mjs`. Inspect actual generated PDF pages for wrapping, clipping and writing space; verify a filled export retains notes and checks. Test the download under normal CSP, not only with CSP bypass. An HTML print preview alone does not prove the PDF works. Keep PDFs Letter size, readable and economical to print.
