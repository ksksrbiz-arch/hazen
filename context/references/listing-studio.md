# Listing Studio (reference)

Current boundary: Studio maintains legacy/manual D1 pages. Homepage featured listings and `/brads-listings/` are provider-driven and do not change when Studio records are published. It does not edit RMLS or establish FUB ownership.

Load this before changing the authenticated editor (`src/studio.js`, `src/listing-model.js`, `src/listing-promotion.js`, `src/photo-preparation.js`, `src/studio-recovery.js`) or explaining its behaviour to Brad. Reorganised on 2026-10-18 from docs/LISTING_WORKSPACE.md, text unchanged. Storage, authentication and publication internals are in `context/references/architecture.md`.

## Brad’s workflow

1. Sign in at `/studio/` with an enrolled email address.
2. Choose New Listing Draft; enter listing details and authorized photos.
3. Save Draft Online. Incomplete drafts are allowed.
4. Add photo descriptions, review the property preview, and record the internal authorization note.
5. Publish Listing. The server checks required fields, date, price, status, HTTPS tour link and registered photos. Duplicate public page slugs are rejected.
6. The public property page, Properties collection and homepage features update without a GitHub commit or new deployment.
7. Edit and save privately, then publish again when ready. Pending and Sold are supported; These statuses affect legacy/manual pages; the homepage uses Ylopo inventory.
8. Unpublish removes the public page and public photo access while retaining the draft. Archive moves the listing to the Archived filter while retaining data/history. Choose Restore as Draft to recover it without republishing.

JSON export and photo downloads remain available as manual backups. Old browser-only drafts are not automatically uploaded or migrated; they remain in the old browser’s IndexedDB.

## Listing management improvements

The editor shows draft/published/archived totals, title/address search, filters for unpublished changes, saved/unsaved indicators, a publication readiness count, a link to the current published page and the latest 20 recorded changes. Archived listings open read-only. Restore uses an expected revision, records history and keeps the recovered listing private. Photo order can be changed with Move Earlier/Move Later as well as Make Cover; changes require saving.

The public Properties collection supports GET filters for title/address, Active/Pending/Sold and price ordering when published listings exist. These browse Brad’s manually maintained listings; they are not an MLS search. Property share metadata uses the actual listing title, description, cover image and URL. Legacy property routes and private previews remain noindex; production marketing pages are already live.

## Saved page previews and property presentation

After saving a draft, choose **Open Saved Page Preview** above the form. `/studio/preview/[id]/` uses the same property body as the public page, including the full gallery, tour link, MLS number (when supplied), description and attribution. It shows the saved cloud draft, not unsaved input or the published snapshot. A visible private notice remains on printed previews. Internal permission notes are excluded. Preview pages and photos require the same enrolled-editor identity as the studio; preview responses are private/no-store, noindex and no-referrer. Preview pages omit Open Graph metadata and public sharing/showing controls. Archived drafts may still be previewed without restoring or publishing them.

Visitors can select photos to open an accessible modal viewer. Previous/Next, arrow keys, Home/End, Escape, touch swipes and focus return are supported. Without JavaScript, photo links open the image directly. The share action uses the device share sheet when available, otherwise copies the current public URL; clipboard denial offers a selectable link. The showing email draft includes the property title and public URL. Printing produces a property sheet with the cover image, details, description, attribution and Brad’s contact information, excluding navigation and extra gallery photos. Printing and sharing do not change publication status or send inquiries automatically.

## Editor usability improvements

The library now presents separate draft/published/archived totals and listing cards with addresses and status. The editing toolbar keeps Save, Quick Preview and Publish visible while scrolling; export, unpublish and archive are grouped under More actions. Publication requirements can be expanded and selected to focus the missing field. Field hints clarify the public page address, MLS reference and private permission note. Create from address suggests a safe URL slug; it never overwrites an existing address without confirmation. Saved/unsaved badges and separate working/success/error feedback make current state explicit. The mobile layout puts the listing library before the form and wraps the toolbar into touch-friendly controls.

Public property pages have Photos/Details/Contact jump links, a direct contact panel and status-aware inquiry wording for Active, Pending and Sold properties. No website inquiry delivery or inventory synchronization is implied.

## Preparing phone and camera photos

The workspace accepts JPG, PNG and WebP source files up to 25 MB each, with at most 100 MB in one selection. HEIC/HEIF needs to be exported as JPG first. Files are decoded and re-encoded in the browser, preserving the complete frame and proportions, with no enlargement of small photos. Prepared copies use WebP when supported, otherwise JPEG, with a maximum edge of 1,600 pixels and a strict size below the existing 400 KB server limit. Difficult-to-compress images may use a smaller edge. Sources above 50 megapixels are rejected. The browser releases decoded/canvas resources after each image.

Photos are processed sequentially. Progress and per-file results remain outside the temporarily inactive editor, and Stop Preparing Photos cancels the remaining work while retaining photos already added. Failed images do not remove earlier photos. The prepared photo cards show dimensions and byte sizes; Describe Photo jumps to that image’s required description. The first photo remains the cover. Sources remain unchanged on the device and are not uploaded. Save Draft Online uploads only prepared copies; Download Photo downloads the website copy. Keep the original files separately. Original filenames and source sizes exist only in the current browser preparation report, not in published listing fields.

Automated tests cover dimensions, file limits, unsupported formats, browser encoder fallback, cancellation and cleanup. Live browser checks use unsaved illustrative QA images and do not publish a property or send an inquiry.

## Listing promotion kit — October 10, 2026

More actions → Prepare Promotion Kit creates social-post, buyer-email and property-handoff templates from the current public listing fields. Copy Text has a manual selection fallback; Download All Templates produces a review-marked text file. No message, post or inquiry is sent. Missing title/address/price/description are identified rather than invented. Pending and Sold use status-specific wording; Sold prices are labelled listed prices. Private permission notes and media filenames are excluded. A property page link is included only when the saved published version matches the current draft and page address; private/unpublished edits never get a public link. Edits and loading another listing clear prepared copy to avoid stale facts. Templates use the entered description as written; they are not AI-generated sales claims. Brad must verify accuracy and permissions before sharing.

## Interrupted requests and working notes

Download Working Notes retains current text even for incomplete drafts. It includes the internal authorization note and photo descriptions, so keep it private. It does not contain photo bytes, publish/save anything or provide automatic import. Keep original photos separately. Session errors offer sign-in in another tab; Check Connection refreshes the library without replacing the current form/photos. Conflicts require reviewing a newer saved version before reapplying edits. Lost or timed-out requests may already have completed, so the editor never automatically repeats a mutation. Full backup/recovery remains a separate launch requirement.

## Verify

`npm test` and `npm run check:runtime`. Brad runs the handoff session in `context/workflows/launch-check/`.

## Highlights and key details (2026-10-22)

Two optional textareas under the description. `highlights`: one point per line, max 8 x 120 characters. `keyDetails`: `Label: value` per line, max 12 (label 40, value 120). Parsed by `listLines` and `detailPairs` in `src/listing-model.js`, validated in `listingErrors`, whitelisted in `server/listings.js`, rendered by `server/public.js`. Enter only facts Brad has confirmed; the page never fills gaps.
