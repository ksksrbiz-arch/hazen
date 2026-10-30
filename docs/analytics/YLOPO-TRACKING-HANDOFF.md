# Brad Hazen search-subdomain tracking — installation requirement

Prepared October 30, 2026. Not sent; installation is not verified.

**Target only:** https://bradhazen.realtypronw.net/ — not Realty Pro's main Squarespace site and not every agent's subdomain.

**Dedicated GA4 destination:** G-QSEE7DZFHP, property 561690146. **GTM:** GTM-WG4QVGN8. Exact-domain cross-domain settings already include bradhazen.com and bradhazen.realtypronw.net.

The available Brad Stars account has no tracking-code field for this search subdomain. Ylopo or an authorized search-site administrator must install/enable the integration. Merely adding the hostname in Google does not install a tag there.

## What the provider needs to implement or confirm

1. Confirm a supported way to install Brad's dedicated measurement on only his search subdomain and whether any fee applies. Preserve the brokerage's existing tags, lead routing and consent handling.
2. Use the same GA4 stream and honor analytics consent. Do not send visitor names, emails, phones, message text, login tokens or account identifiers to GA4.
3. Track initial and client-side route page views without duplicate events. Use sanitized page paths; account and search query values must not leak into page_location/referrers.
4. Report listing views/clicks with public `listing_id` and `listing_owner` (`brad`, `other_agent`, `unknown`) from authoritative listing-agent attribution; Brad's primary listing-agent ID is 24820243. Include `search_scope` (`brad` or `all_listings`) separately. Missing identity must remain unknown.
5. Report a registration or inquiry success only after the provider confirms success, not on a button click. Confirm whether successful new leads actually reach Brad in Follow Up Boss; existing contacts may retain another owner.
6. Verify cross-domain continuity for normal links and the current sandboxed-widget/new-tab detail links. Preserve Google's supported linker parameters through redirects without changing existing Ylopo attribution. Confirm with a real session test on both hosts.

## Existing GTM event contract (if the provider installs this container)

The container intentionally does not fire merely from a raw installation. The integration must establish consent and send sanitized values before activating the base tag:

```js
window.dataLayer = window.dataLayer || [];
// After the provider's consent manager grants analytics_storage:
window.dataLayer.push({
  event: 'brad_analytics_ready',
  page_location: 'https://bradhazen.realtypronw.net/', // actual public path, no query
  page_referrer: 'https://bradhazen.com/' // origin only, or empty when absent
});
window.dataLayer.push({
  event: 'page_view',
  page_location: 'https://bradhazen.realtypronw.net/',
  page_referrer: 'https://bradhazen.com/',
  page_title: 'Brad Hazen property search',
  page_type: 'search',
  action: '', placement: '', item_id: '', form_type: '',
  search_scope: 'all_listings', listing_owner: '', listing_id: '', count: 0, percent: 0
});
```

This example is a contract illustration, not a complete install snippet or authorization to hard-code consent. The provider may instead offer its own supported GA4 installation; coordinate event naming and disable duplicate page views first. Registration success events need an approved tag trigger added because the current custom site's forms only prepare email drafts.
