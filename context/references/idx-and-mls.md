# IDX and MLS (reference)

Load this before any discussion or work on MLS data, IDX search, visitor accounts, saved searches or listing alerts. Sources: Keith's direction of 2026-10-10 (docs/IDX_PHASE_2.md, moved here), the intake questions in `context/references/client-intake.md`, and RMLS public documentation researched 2026-10-18. Facts from the RMLS research are the vendor's published process, not a quote or a commitment; anything marked VERIFY must be confirmed with RMLS (ds@rmls.com) before it drives a decision.

## Planned Phase 2 (Keith's direction, 2026-10-10)

Brad has an MLS login. That does not confirm website publication rights, an approved IDX integration, API access or an existing provider subscription. Confirm what Realty Pro and Brad's MLS membership already include before choosing or buying anything. Do not collect his password.

Planned features: listing search, results and details; visitor registration, login and recovery; saved homes; editable saved searches; email listing alerts and preferences; a provider lead dashboard for Brad. Preserve the current marketing site and integrate the provider's existing functionality where available.

Pricing direction (Keith, planning range only, not a quote): $500-$1,000 additional if an existing approved, website-ready provider includes these features. Provider subscriptions, setup fees, MLS fees and unusual customization are separate. Do not retain the earlier $2,000-$4,000 estimate as the default.

Email alerts first. SMS, push, custom CRM automation, social login and custom-built account infrastructure are out of scope without additional scope. Alert timeliness depends on the provider or feed update frequency. No claim of instantaneous MLS updates.

## Hold (2026-10-10)

Keith directed us to wait for Brad's answer about Ylopo. Do not enable MLS search, visitor accounts, favorites or alerts, or overlapping provider/CRM integrations while it is pending. Independent seller content, public UX and the existing listing presentation continue. Status: still pending as of 2026-10-18 (`context/STATE.md`).

## Direct RMLS feed (researched 2026-10-18, not decided, not started)

- Brad's market coverage decides the MLS. Brad is in Washington, and Keith states RMLS is his MLS. RMLS covers Oregon and SW Washington; whether Clark County listings Brad needs are in RMLS or only in NWMLS is VERIFY with Brad.
- RMLS offers a RESO Web API (OData v4, RESO certified, https://resoapi.rmlsweb.com/reso/odata, bearer token issued to vendors) and standard feeds (IDX, VOW, full) plus tailored feeds. Updates run about every 15 minutes. IDX statuses are ACT, BMP and SLD.
- Process: the vendor emails ds@rmls.com; a Listing Content License Agreement (LCLA) is signed by the subscriber, the Participant Broker and the vendor; limited credentials are issued; RMLS reviews the site (a test site is acceptable); billing then starts. Either party may terminate on 30 days' notice. Rules come from the LCLA and the RMLS Internet Policy (Section V covers Broker Specific).
- A Broker Specific feed would carry only the Participant's own listings. NAR Policy Statement 8.3 gives a Participant a right to a feed of their own listing content; use it as leverage, not as a guarantee.
- Fees: a 2015 LCLA showed $50/month per firm for IDX or Broker Specific via RETS and VOW at $50/month plus $25 setup. These are outdated. Current pricing: VERIFY.
- The broker (Realty Pro, Inc.) must sign. That is a client dependency, not a build task.

## Rules

- A membership alone does not authorize copying listings onto a website. Brad or the broker completes agreements himself; developer access comes through the provider's supported invitation or API-key process.
- Do not scrape MLS or directory sites. Manually maintained listings stay labelled as manual (`context/references/listing-studio.md`).
- Weigh scale against revenue first (Cathedral order): do not build feed infrastructure before the $1,500 build is accepted and Brad has answered the Ylopo question.

## Known gaps

- Brad's Ylopo/IDX/CRM entitlement through Realty Pro: unknown.
- Which MLS(s) hold the listings Brad needs: VERIFY.
- Current RMLS fees and review timeline: VERIFY.

## Verify

Keith approves any MLS or provider decision. The launch check item for IDX is in `context/workflows/launch-check/`.
