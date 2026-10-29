// Literal browser source: bundler helpers must not leak into the isolated frame.
export const searchWidgetClient = `(function searchWidgetClient() {
  const form = document.querySelector('#search-filters');
  const results = document.querySelector('#search-results');
  const status = document.querySelector('#search-status');
  const summary = document.querySelector('#search-summary');
  const more = document.querySelector('#search-more');
  const retry = document.querySelector('#search-retry');
  let current = JSON.parse(results.dataset.search),
    timer,
    settled = false;
  const notify = () => parent.postMessage({type: 'brad-property-search', height: document.body.offsetHeight + 24}, '*');
  new ResizeObserver(notify).observe(document.body);
  const failed = () => {
    if (settled) return;
    status.textContent = 'Property search is taking longer than expected. Try again or open Brad’s full search below.';
    results.hidden = true;
    results.setAttribute('aria-busy', 'false');
    retry.hidden = false;
    more.hidden = true;
    notify();
  };
  const loading = () => {
    settled = false;
    clearTimeout(timer);
    results.hidden = true;
    results.setAttribute('aria-busy', 'true');
    status.textContent = 'Finding matching properties…';
    summary.textContent = '';
    retry.hidden = true;
    more.hidden = true;
    timer = setTimeout(failed, 15000);
  };
  const decorate = () => {
    for (const card of results.querySelectorAll('.grid-view-item')) {
      const link = card.querySelector('a[href]');
      const address = card.querySelector('.gallery-card-b-address-block');
      if (!link || !address) continue;
      const label = address.textContent.trim();
      link.setAttribute('aria-label', \`View \${label} details (opens in a new tab)\`);
      const map = card.querySelector('button.card-icon');
      if (map) map.setAttribute('aria-label', \`Switch photo and map for \${label}\`);
      if (!card.querySelector('.gallery-detail-link')) {
        const detail = document.createElement('a');
        detail.href = link.href;
        detail.className = 'gallery-detail-link';
        detail.textContent = 'View property details ↗';
        detail.setAttribute('aria-label', link.getAttribute('aria-label'));
        card.querySelector('.gallery-card-b').append(detail);
      }
    }
  };
  new MutationObserver(() => {
    decorate();
    notify();
  }).observe(results, {childList: true, subtree: true});
  window.YLOPO_WIDGETS = {
    domain: 'bradhazen.realtypronw.net',
    openInNewTab: true,
    remountable: {},
    widgetOnloadCallback(type, listings, props) {
      if (type !== 'listings' || JSON.stringify(props.search) !== JSON.stringify(current)) return;
      settled = true;
      clearTimeout(timer);
      results.hidden = false;
      results.setAttribute('aria-busy', 'false');
      retry.hidden = true;
      const city = current.locations[0].city;
      status.textContent = listings.length
        ? \`Showing \${listings.length} matching \${listings.length === 1 ? 'property' : 'properties'} in \${city}.\`
        : \`No matching properties returned in \${city}. Try a wider price range or fewer filters.\`;
      summary.textContent =
        listings.length === current.limit
          ? current.limit < 24
            ? 'More matches may be available. Show more below.'
            : 'Showing up to 24 matches. Use full search for more results and map tools.'
          : 'Results are supplied by Realty Pro. Availability can change; confirm details with Brad.';
      more.hidden = listings.length < current.limit || current.limit >= 24;
      notify();
    }
  };
  function run() {
    results.dataset.search = JSON.stringify(current);
    loading();
    const remount = Object.entries(window.YLOPO_WIDGETS.remountable).find(([key]) =>
      key.startsWith('YLOPO_resultsWidget-')
    )?.[1];
    if (remount) remount({force: true});
    else failed();
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const fields = new FormData(form),
      min = Number(fields.get('min')),
      max = Number(fields.get('max'));
    const maxField = form.elements.namedItem('max');
    maxField.setCustomValidity(max && min > max ? 'Maximum price must be at least the minimum price.' : '');
    if (!form.reportValidity()) return;
    current = {
      locations: [{city: fields.get('city'), state: 'WA'}],
      propertyTypes: fields.get('type') ? [fields.get('type')] : [],
      limit: 6
    };
    if (min) current.minPrice = min;
    if (max) current.maxPrice = max;
    if (fields.get('beds')) current.beds = Number(fields.get('beds'));
    run();
  });
  form.addEventListener('input', () => form.elements.namedItem('max').setCustomValidity(''));
  form.addEventListener('reset', () => {
    form.elements.namedItem('max').setCustomValidity('');
    setTimeout(() => form.requestSubmit(), 0);
  });
  more.addEventListener('click', () => {
    current = {...current, limit: Math.min(24, current.limit + 6)};
    run();
  });
  retry.addEventListener('click', () => {
    if (!Object.keys(window.YLOPO_WIDGETS.remountable).length) location.reload();
    else run();
  });
  document.addEventListener(
    'click',
    event => {
      const link = event.target.closest('a[href]');
      if (link && new URL(link.href).hostname === 'bradhazen.realtypronw.net') {
        event.preventDefault();
        event.stopImmediatePropagation();
        window.open(link.href, '_blank', 'noopener');
      }
    },
    true
  );
  window.addEventListener(
    'error',
    event => {
      if (event.target?.tagName === 'SCRIPT') failed();
    },
    true
  );
  loading();
})();`;
