# Proposed highlights and key details — NOT APPLIED

Status: proposal for Brad or Keith to confirm. Nothing here has been entered in Studio or production D1.

Source: search summaries of the Real Geeks IDX mirrors of RMLS data
(`homesinthe360.realgeeks.com/property/24202394/` and `/24434415/`). The realtor.com pages were refused by the fetch layer and were not read. Both mirrors carry odd values (a "price change of $8,000,000" against $2,000,000 and $12,000,000 asking prices; 836 and 900 days on market), so every line is `VERIFY` against the RMLS record or Brad.

Not proposed: days on market, price-change history, school names (assignments change; point visitors to the district).

## Price reductions (confirmed by Keith, 2026-10-22)

Both mirrors showed a price change of $8,000,000, and Keith confirmed it is accurate and happened on the same date for both: E Yacolt Road $10,000,000 to $2,000,000, NE Hazen Avenue $20,000,000 to $12,000,000. Set `originalPrice` (Studio: "Original price if reduced"). The reduction date is not recorded, so none is shown. The earlier "glitch" reading in this file was wrong.

## E Yacolt Road, MLS 24202394

highlights:

```
Level 1.5-acre parcel in Yacolt
Listing identifies commercial, multifamily and office uses
Electricity listed as available
```

keyDetails:

```
Zoning: C-1
Tax lot: 067100000
Power: Electricity listed as available (VERIFY)
Sewer: Standard septic listed (VERIFY; confirm feasibility)
Annual taxes: $900 as listed (VERIFY)
```

## NE Hazen Avenue, MLS 24434415

highlights:

```
11.35 acres, about half fir trees and half horse pasture
Road frontage included
About 15 minutes north of Battle Ground on State Highway 503
```

keyDetails:

```
Zoning: R-5
Present use: Farm and timber (VERIFY)
Annual taxes: $63 as listed (VERIFY; likely a current-use classification, confirm before publishing)
Division: Listing says it can divide into two legal 5-acre lots (VERIFY with Clark County; do not publish as fact until confirmed)
```

## Before applying

1. Brad confirms each line, especially taxes and the division claim.
2. Enter through Studio as drafts, check `/studio/preview/[id]/`, publish only on authorization (`context/workflows/listing-import/`).
