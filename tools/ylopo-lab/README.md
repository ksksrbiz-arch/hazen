# Private Ylopo integration lab

Run from repository root:

```powershell
python -m http.server 8766 --bind 127.0.0.1 --directory tools/ylopo-lab
```

Open http://127.0.0.1:8766/. Local only, outside the production build. No lead submissions are performed by this page.

The public loader URL was found in the existing Realty Pro profile's source, not guessed. The lab loads it directly from Ylopo and does not redistribute vendor bundles or cache inventory.

Verified in local Chrome October 29, 2026: widget renders; Vancouver suggestions populate; selecting Vancouver navigates to bradhazen.realtypronw.net/search with Vancouver/WA location parameters. Full results stay provider-hosted. Home/search responses currently send X-Frame-Options: SAMEORIGIN, preventing embedding the entire page on our separate domain. No bypass is attempted.

gallery-test.html is a diagnostic only. agentId is referenced in public widget code, but HAZENB as its value is NOT a documented or verified contract. The second gallery uses the exact property-type/featured filter from the current profile as a control. Neither gallery is approved as Brad-only. Do not publish this test page.

Lead delivery, HTTPS production-origin behavior, phone UX and Brad-only inventory remain separate acceptance checks. FUB access is pending from Realty Pro. A working search destination does not prove CRM assignment.

## Resilience verification

Added an always-available direct search link, accessible loading/ready/failure status, script-error handling, a 15-second timeout and recovery if the widget arrives late. Narrow-screen CSS and keyboard focus styling are included; physical-phone testing remains pending. Diagnostic URLs ?simulate=blocked and ?simulate=timeout omit the vendor load and exercise fallback behavior. Node VM checks passed for blocked, timeout, ready, script error and late recovery. Chrome confirmed the blocked state retains the correct Brad-domain link.

## MLS selection breakthrough

October 29: mls-test.html rendered exactly E Yacolt Road and NE Hazen Avenue using data-search with mlsId array ["24202394","24434415"] and limit 6, with no residential propertyTypes filter. These match the prior approved import records. Links retain Brad's domain. This is explicit listing selection with provider-rendered data, not automatic discovery of future Brad listings. Add/remove MLS IDs deliberately and verify status behavior before production. Do not confuse the generic featured flag with agent ownership.

The public widget's initial-search predicate recognizes MLS IDs, locations, featured, map bounds and listing IDs; agentId alone does not satisfy it. Therefore the previous agentId-only spinner was inconclusive, not evidence of absent inventory. Public documentation reviewed did not establish the agent-ID field/value contract for agent-wide gallery filtering.
