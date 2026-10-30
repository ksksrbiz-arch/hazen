/* Public interaction measurement. Never read form values, notes, addresses or arbitrary URL queries. */
(() => {
  const production = location.origin === 'https://bradhazen.com';
  const privatePage = /^\/(studio|api|media|agent-login|listing-widget|search-widget|properties)(\/|$)/.test(
    location.pathname
  );
  if (!production || privatePage) return;
  const measurement = 'G-QSEE7DZFHP',
    container = 'GTM-WG4QVGN8',
    key = 'brad-analytics-choice-v1';
  const events = new Set([
    'page_view',
    'scroll_depth',
    'engaged_time',
    'contact_click',
    'inquiry_start',
    'inquiry_validation_error',
    'email_draft_ready',
    'inquiry_copy',
    'inquiry_edit',
    'resource_download',
    'worksheet_download',
    'print_request',
    'guide_step',
    'guide_review',
    'checklist_change',
    'photo_plan_change',
    'community_compare',
    'faq_open',
    'navigation_click',
    'outbound_click',
    'property_search',
    'search_results',
    'search_error',
    'search_more',
    'search_reset',
    'listing_click',
    'gallery_state'
  ]);
  const enums = new Set([
    'header',
    'footer',
    'main',
    'mobile',
    'phone',
    'email',
    'email_draft',
    'buyer',
    'seller',
    'buy',
    'sell',
    'contact',
    'assessment',
    'search',
    'featured',
    'ready',
    'unavailable',
    'pdf',
    'txt',
    'next',
    'back',
    'all',
    'internal',
    'external',
    'provider',
    'download',
    'copy',
    'edit'
  ]);
  let enabled = false,
    loaded = false;
  const pagePath = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || 'https://bradhazen.com/';
  const pageType = location.pathname.startsWith('/communities/')
    ? 'community'
    : location.pathname.split('/')[1] || 'home';
  const referrer = (() => {
    try {
      return new URL(document.referrer).origin + '/';
    } catch {
      return '';
    }
  })();
  window.dataLayer = window.dataLayer || [];
  const gtag = function () {
    window.dataLayer.push(arguments);
  };
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });
  gtag('set', {
    send_page_view: false,
    page_location: pagePath,
    page_referrer: referrer,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  function track(name, details = {}) {
    if (!enabled || !events.has(name)) return;
    const safe = {
      event: name,
      page_location: pagePath,
      page_referrer: referrer,
      page_title: document.title,
      page_type: pageType,
      action: '',
      placement: '',
      item_id: '',
      form_type: '',
      search_scope: '',
      listing_owner: '',
      listing_id: '',
      count: 0,
      percent: 0
    };
    for (const k of ['action', 'placement', 'form_type']) if (enums.has(details[k])) safe[k] = details[k];
    for (const k of ['count', 'percent'])
      if (Number.isFinite(details[k])) safe[k] = Math.max(0, Math.min(1000, Math.round(details[k])));
    // Public route or fixed control IDs only, never visitor-entered values.
    if (typeof details.item_id === 'string' && /^[a-z0-9/_-]{1,100}$/.test(details.item_id))
      safe.item_id = details.item_id;
    if (['brad', 'all_listings'].includes(details.search_scope)) safe.search_scope = details.search_scope;
    if (['brad', 'other_agent', 'unknown'].includes(details.listing_owner)) safe.listing_owner = details.listing_owner;
    if (/^[0-9]{1,20}$/.test(String(details.listing_id ?? ''))) safe.listing_id = String(details.listing_id);
    window.dataLayer.push(safe);
  }
  window.bradTrack = track;
  const panel = document.createElement('section');
  panel.className = 'analytics-choice';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'Analytics cookie choice');
  panel.innerHTML =
    '<p><strong>A little insight helps us improve.</strong> Allow optional analytics cookies to help Brad understand which pages and tools are useful. Your form answers and notes are not included. <a href="/privacy/">Privacy details</a></p><div><button data-choice="yes">Allow analytics</button><button data-choice="no">No thanks</button></div>';
  document.body.append(panel);
  function start() {
    enabled = true;
    window['ga-disable-' + measurement] = false;
    gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    if (!loaded) {
      loaded = true;
      window.dataLayer.push({'gtm.start': Date.now(), event: 'gtm.js'});
      window.dataLayer.push({event: 'brad_analytics_ready', page_location: pagePath, page_referrer: referrer});
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtm.js?id=' + container;
      document.head.append(script);
      track('page_view');
    }
  }
  function choose(yes) {
    try {
      localStorage.setItem(key, JSON.stringify({allowed: yes, at: Date.now()}));
    } catch {}
    panel.hidden = true;
    if (yes) start();
    else {
      enabled = false;
      window['ga-disable-' + measurement] = true;
      gtag('consent', 'update', {analytics_storage: 'denied'});
      for (const cookie of document.cookie.split(';')) {
        const name = cookie.trim().split('=')[0];
        if (/^_ga(?:_|$)/.test(name))
          for (const domain of ['', '; domain=bradhazen.com', '; domain=.bradhazen.com'])
            document.cookie = name + '=; Max-Age=0; path=/' + domain;
      }
      if (loaded) location.reload();
    }
  }
  panel.addEventListener('click', e => {
    const button = e.target.closest('[data-choice]');
    if (button) choose(button.dataset.choice === 'yes');
  });
  document.querySelectorAll('[data-analytics-settings]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      panel.hidden = false;
      panel.querySelector('button').focus();
    });
  });
  let choice;
  try {
    choice = JSON.parse(localStorage.getItem(key));
  } catch {}
  if (navigator.globalPrivacyControl === true) choose(false);
  else if (choice && Date.now() - choice.at < 180 * 86400000) {
    if (choice.allowed) start();
  } else panel.hidden = false;
  const placement = el =>
    el.closest('header')
      ? 'header'
      : el.closest('footer')
        ? 'footer'
        : el.closest('.mobile-contact')
          ? 'mobile'
          : 'main';
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (link) {
      const raw = link.getAttribute('href');
      if (raw.startsWith('tel:')) track('contact_click', {action: 'phone', placement: placement(link)});
      else if (raw.startsWith('mailto:'))
        track('contact_click', {
          action: link.matches('[data-open-email]') ? 'email_draft' : 'email',
          placement: placement(link)
        });
      else {
        let url;
        try {
          url = new URL(link.href);
        } catch {
          return;
        }
        if (url.origin === location.origin) {
          if (/\.(pdf|txt)$/.test(url.pathname))
            track('resource_download', {action: url.pathname.endsWith('.pdf') ? 'pdf' : 'txt', item_id: url.pathname});
          else track('navigation_click', {placement: placement(link), item_id: url.pathname});
        } else if (url.protocol === 'https:')
          track('outbound_click', {
            action: url.hostname === 'bradhazen.realtypronw.net' ? 'provider' : 'external',
            placement: placement(link)
          });
      }
    }
    const button = e.target.closest('button');
    if (!button) return;
    if (button.matches('[data-print-property],[data-print-guide],[data-print-worksheet]')) track('print_request');
    if (button.matches('[data-plan-next]')) track('guide_step', {action: 'next'});
    if (button.matches('[data-plan-back]')) track('guide_step', {action: 'back'});
    if (button.matches('[data-plan-all]')) track('guide_review', {action: 'all'});
    if (button.matches('.edit-inquiry')) track('inquiry_edit', {action: 'edit'});
  });
  const started = new WeakSet();
  document.addEventListener('focusin', e => {
    const form = e.target.closest('[data-inquiry]');
    if (enabled && form && !started.has(form)) {
      started.add(form);
      track('inquiry_start', {form_type: form.dataset.inquiry});
    }
  });
  document.addEventListener('change', e => {
    if (
      e.target.matches(
        '[data-conversation-worksheet] input[type=checkbox],[data-seller-worksheet] input[type=checkbox]'
      )
    )
      track('checklist_change');
    if (e.target.closest('.photo-shot-grid')) track('photo_plan_change');
    if (e.target.closest('[data-community-compare]')) track('community_compare');
  });
  document.addEventListener(
    'toggle',
    e => {
      if (e.target.tagName === 'DETAILS' && e.target.open && e.target.closest('.faq-section')) track('faq_open');
    },
    true
  );
  const depths = new Set();
  window.addEventListener(
    'scroll',
    () => {
      if (!enabled) return;
      const total = document.documentElement.scrollHeight - innerHeight;
      if (total <= 0) return;
      const percent = (100 * scrollY) / total;
      for (const depth of [25, 50, 75, 90])
        if (percent >= depth && !depths.has(depth)) {
          depths.add(depth);
          track('scroll_depth', {percent: depth});
        }
    },
    {passive: true}
  );
  let seconds = 0;
  const milestones = new Set();
  setInterval(() => {
    if (!enabled || document.visibilityState !== 'visible') return;
    seconds += 5;
    for (const n of [30, 60, 120, 300])
      if (seconds >= n && !milestones.has(n)) {
        milestones.add(n);
        track('engaged_time', {count: n});
      }
  }, 5000);
  window.addEventListener('message', e => {
    if (e.data?.type !== 'brad-analytics') return;
    const frame = [...document.querySelectorAll('.brad-listings-frame,.property-search-frame')].find(
      f => f.contentWindow === e.source
    );
    if (!frame) return;
    const allowed = frame.matches('.property-search-frame')
      ? ['property_search', 'search_results', 'search_error', 'search_more', 'search_reset', 'listing_click']
      : ['listing_click'];
    if (allowed.includes(e.data.event))
      track(e.data.event, {
        count: e.data.count,
        listing_id: e.data.listing_id,
        listing_owner: e.data.listing_owner,
        search_scope: frame.matches('.property-search-frame') ? 'all_listings' : 'brad',
        action: frame.matches('.property-search-frame') ? 'search' : 'featured'
      });
  });
})();
