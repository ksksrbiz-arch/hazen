const domain = 'bradhazen.realtypronw.net';
const host = document.querySelector('.YLOPO_searchWidget');
const status = document.querySelector('#status');
const simulation = new URLSearchParams(location.search).get('simulate');
window.YLOPO_WIDGETS = {domain, openInNewTab: false};
let ready = false;
let timer;
const showFallback = () => {
  if (!ready)
    status.textContent =
      'The embedded search is unavailable or taking longer than expected. Use Open Brad’s full property search above.';
};
const observer = new MutationObserver(() => {
  const input = host.querySelector('input');
  if (!input) return;
  ready = true;
  clearTimeout(timer);
  if (!input.getAttribute('aria-label')) input.setAttribute('aria-label', 'Search by city, neighborhood or ZIP code');
  status.textContent = 'Search is ready. Choose a location to open results on Brad’s property-search site.';
  observer.disconnect();
});
observer.observe(host, {childList: true, subtree: true});
timer = setTimeout(showFallback, simulation === 'timeout' ? 1500 : 15000);
if (simulation === 'blocked') {
  clearTimeout(timer);
  showFallback();
} else if (simulation !== 'timeout') {
  const script = document.createElement('script');
  script.src = `https://${domain}/build/js/widgets-1.0.0.js`;
  script.defer = true;
  script.onerror = () => {
    clearTimeout(timer);
    showFallback();
  };
  document.head.appendChild(script);
}
