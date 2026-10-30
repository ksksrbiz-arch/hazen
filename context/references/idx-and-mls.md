# IDX and MLS (reference)

Load this before any discussion or work on MLS data, IDX search, visitor accounts, saved searches or listing alerts. Sources: Keith's direction of 2026-10-10 (docs/IDX_PHASE_2.md, moved here), the intake questions in `context/references/client-intake.md`, and RMLS public documentation researched 2026-10-18. Facts from the RMLS research are the vendor's published process, not a quote or a commitment; anything marked VERIFY must be confirmed with RMLS (ds@rmls.com) before it drives a decision.

## Current decision

Keith authorized Ylopo integration through Realty Pro. Brad's provider site is `https://bradhazen.realtypronw.net/`; RMLS ID is HAZENB. Automatic featured listings and on-site filtered results are live; full map/details/accounts stay provider-hosted. Use `search-and-blog-implementation.md` for implementation. The old wait-for-provider/Phase 2 gate is superseded.

October 30 Ylopo Support says external search-site embedding is outside its RMLS/NWMLS agreement. The specific widget clarification is drafted, not sent; technical functionality is not approval. Setup and fee details remain unresolved. Support confirms new subdomain registrations/inquiries go to Brad, while existing contacts retain their CRM owner; exact FUB user mapping and an end-to-end test remain unverified. Custom forms still use visitor-sent email drafts. Do not infer routing from an agent URL or gallery filter. Do not send tests or messages without authorization.

A direct RMLS Broker Specific feed is on hold, not implemented. Historical estimates/process below are research, not current quotes or permission to subscribe. User-specific correspondence and the latest provider answer take precedence. Never collect Brad's MLS password, scrape inventory or duplicate the feed into D1 without a separately approved design.

## Historical direct RMLS research (October 18; not selected)

- Brad's market coverage decides the MLS. Brad is in Washington, and Keith states RMLS is his MLS. RMLS covers Oregon and SW Washington; whether Clark County listings Brad needs are in RMLS or only in NWMLS is VERIFY with Brad.
- RMLS offers a RESO Web API (OData v4, RESO certified, https://resoapi.rmlsweb.com/reso/odata, bearer token issued to vendors) and standard feeds (IDX, VOW, full) plus tailored feeds. Updates run about every 15 minutes. IDX statuses are ACT, BMP and SLD.
- Process: the vendor emails ds@rmls.com; a Listing Content License Agreement (LCLA) is signed by the subscriber, the Participant Broker and the vendor; limited credentials are issued; RMLS reviews the site (a test site is acceptable); billing then starts. Either party may terminate on 30 days' notice. Rules come from the LCLA and the RMLS Internet Policy (Section V covers Broker Specific).
- A Broker Specific feed would carry only the Participant's own listings. NAR Policy Statement 8.3 gives a Participant a right to a feed of their own listing content; use it as leverage, not as a guarantee.
- Fees: a 2015 LCLA showed $50/month per firm for IDX or Broker Specific via RETS and VOW at $50/month plus $25 setup. These are outdated. Current pricing: VERIFY.
- The broker (Realty Pro, Inc.) must sign. That is a client dependency, not a build task.

## Rules

- A membership alone does not authorize copying listings onto a website. Brad or the broker completes agreements himself; developer access comes through the provider's supported invitation or API-key process.
- Do not scrape MLS or directory sites. Manually maintained listings stay labelled as manual (`context/references/listing-studio.md`).
- Weigh scale against revenue first (Cathedral order): do not add a separate feed stack while the selected Ylopo integration is serving the authorized scope.

## Known gaps

- Ylopo search access through Realty Pro is established; exact included services/fees and FUB mapping remain unconfirmed.
- Brad's identified listings are RMLS; additional market/MLS coverage needs confirmation if requested.
- Current RMLS fees and review timeline: VERIFY.

## Verify

Keith approves any MLS or provider decision. The launch check item for IDX is in `context/workflows/launch-check/`.
