# Editing Brad’s website content

Content lives in `src/content.json`. Editing and deploying currently requires repository access; no client CMS is connected.

## Featured properties

Add an object to `properties` only after Brad supplies the property details and authorizes the text/photos. Keep `published: false` while preparing it. Required fields for a published property:

| Field | Content |
| --- | --- |
| `published` | `true` to publish; `false` to remove from cards and generated routes |
| `slug` | Unique lowercase words separated by hyphens |
| `title` / `address` | Approved property title and public address |
| `price` | Numeric dollar amount, without currency symbols |
| `status` | `Active`, `Pending`, or `Sold` |
| `beds` / `baths` / `squareFeet` | Optional numeric facts; leave absent when unknown |
| `description` | Approved plain text description |
| `images` | Array of `{ "file": "filename.webp", "alt": "Accurate description" }` |
| `propertyType` / `lotAcres` | Optional text (80 characters) and acreage |
| `highlights` | Optional. One short point per line, up to 8 lines of 120 characters. Only facts Brad confirmed |
| `keyDetails` | Optional. One `Label: value` per line, up to 12 (zoning, parcel number, year built). Rendered in the Property details table |
| `attribution` | Approved public listing/brokerage attribution |
| `permissionNote` | Internal record of Brad’s authorization and image rights; not rendered |
| `updatedAt` | Date the details were reviewed, in `YYYY-MM-DD` format |

Place authorized image files in `src/assets/`; use the filename only in the JSON. Optimize images below 400 KB before publishing. The page also shows an At a glance grid, price per acre and per sq ft (calculated from the asking price and size, labelled as not an appraisal, never stored), a map link, and a paragraph starting `Disclosure:` as a callout. Nothing is shown for fields left empty. Build creates `/properties/[slug]/`, property cards, a gallery, status/price/facts, attribution, and an inquiry prefilled with the address. Published properties are separate from any future MLS search. Update status and review date when Brad confirms changes; set `published` to `false` to unpublish. Rebuilding removes the old output directory, so unpublished property routes are not retained.

## Testimonials

Add to `testimonials`: `published`, `quote`, `attribution`, `permissionNote`, and optional `sourceUrl` (HTTPS only). Use exact client-approved wording and attribution. Consent/source notes stay internal. No star rating is inferred or displayed. Empty collections keep the current introductory/contact content.

## Verification and publication

Run `npm run build`, `npm run check`, and `npm test`. Check the preview on narrow and wide screens. Push approved changes to `main` for Cloudflare deployment. Never commit confidential client documents, secrets, or MLS credentials in content or permission notes. Permission notes should record authorization without private contact information.
