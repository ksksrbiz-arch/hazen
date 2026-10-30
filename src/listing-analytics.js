// Runs inside the existing isolated provider frame. No new inventory request or storage.
export const listingAnalyticsClient = `
const listingAttribution = new Map();
function rememberListingAttribution(listings) {
  listingAttribution.clear();
  for (const listing of listings) {
    const id = String(listing.id ?? '');
    if (!/^[0-9]{1,20}$/.test(id)) continue;
    const agent = listing.listingAgent?.id;
    const validAgent = /^[0-9]+$/.test(String(agent ?? '')) && Number(agent) > 0;
    listingAttribution.set(id, validAgent ? Number(agent) === 24820243 ? 'brad' : 'other_agent' : 'unknown');
  }
}
function listingClickDetails(href, featured = false) {
  let url;
  try { url = new URL(href); } catch { return null; }
  if (url.origin !== 'https://bradhazen.realtypronw.net') return null;
  const match = url.pathname.match(/^\\/search\\/detail\\/([0-9]{1,20})\\/?$/);
  if (!match) return null;
  return {listing_id: match[1], listing_owner: featured ? 'brad' : listingAttribution.get(match[1]) || 'unknown'};
}
const measureListing = (event, details = {}) => parent.postMessage({type: 'brad-analytics', event, ...details}, '*');
`;
