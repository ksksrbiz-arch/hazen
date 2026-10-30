import {test, expect} from '@playwright/test';
import {analyticsCsp} from '../../server/response-security.js';
import {mkdir} from 'node:fs/promises';

async function localProduction(page) {
  await page.route('https://bradhazen.com/**', async route => {
    const url = new URL(route.request().url());
    const response = await fetch('http://localhost:4173' + url.pathname);
    await route.fulfill({
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers),
        'content-security-policy': /widget/.test(url.pathname)
          ? response.headers.get('content-security-policy')
          : analyticsCsp
      },
      body: Buffer.from(await response.arrayBuffer())
    });
  });
  await page.route('https://www.googletagmanager.com/**', route =>
    route.fulfill({contentType: 'text/javascript', body: ''})
  );
}

test('analytics waits for consent, strips query and personal values, and can be disabled', async ({page}) => {
  await localProduction(page);
  await page.goto('https://bradhazen.com/contact/?email=private@example.com&message=private-message');
  expect(await page.locator('script[src*="googletagmanager"]').count()).toBe(0);
  await page.getByRole('button', {name: 'Allow analytics', exact: true}).click();
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(1);
  const initial = await page.evaluate(() => window.dataLayer.filter(e => e.event));
  expect(initial.filter(e => e.event === 'page_view')).toHaveLength(1);
  expect(initial.find(e => e.event === 'page_view').page_location).toBe('https://bradhazen.com/contact/');
  await page.evaluate(() =>
    window.bradTrack('listing_click', {
      listing_owner: 'brad',
      listing_id: '101',
      email: 'private@example.com',
      message: 'private-message',
      item_id: 'private@example.com'
    })
  );
  const event = await page.evaluate(() => window.dataLayer.at(-1));
  expect(event.listing_owner).toBe('brad');
  expect(event.listing_id).toBe('101');
  expect(JSON.stringify(event)).not.toMatch(/private@example|private-message/);
  expect(event.item_id).toBe('');
  await page.getByRole('button', {name: 'Cookie choices', exact: true}).click();
  await page.getByRole('button', {name: 'No thanks', exact: true}).click();
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
});

test('only trusted result frames can report listing activity and missing attribution stays unknown', async ({page}) => {
  await localProduction(page);
  await page.route('**/build/js/widgets-1.0.0.js', route =>
    route.fulfill({
      contentType: 'text/javascript',
      body: `
    const root=document.querySelector('#search-results');
    const search=JSON.parse(root.dataset.search);
    root.innerHTML='<div class="grid-view-item"><div class="gallery-card-b"><a href="https://bradhazen.realtypronw.net/search/detail/101"><span class="gallery-card-b-address-block">Example property</span></a></div></div>';
    window.YLOPO_WIDGETS.widgetOnloadCallback('listings',[{id:101,listingAgent:{id:24820243}}],{search});
  `
    })
  );
  await page.goto('https://bradhazen.com/search/');
  await page.getByRole('button', {name: 'Allow analytics', exact: true}).click();
  await page.evaluate(() =>
    window.postMessage({type: 'brad-analytics', event: 'listing_click', listing_owner: 'brad'}, '*')
  );
  expect(await page.evaluate(() => window.dataLayer.filter(e => e.event === 'listing_click'))).toHaveLength(0);
  await page
    .frameLocator('.property-search-frame')
    .getByRole('link', {name: /View Example property details/})
    .first()
    .click();
  await expect
    .poll(() => page.evaluate(() => window.dataLayer.filter(e => e.event === 'listing_click').length))
    .toBe(1);
  const event = await page.evaluate(() => window.dataLayer.find(e => e.event === 'listing_click'));
  expect(event).toMatchObject({
    listing_owner: 'brad',
    listing_id: '101',
    search_scope: 'all_listings',
    action: 'search'
  });
});

test('preview and private pages do not initialize Google analytics', async ({page}) => {
  await page.goto('/contact/');
  expect(await page.evaluate(() => typeof window.bradTrack)).toBe('undefined');
  await localProduction(page);
  await page.goto('https://bradhazen.com/agent-login/');
  expect(await page.evaluate(() => typeof window.bradTrack)).toBe('undefined');
});

test('consent choices fit a narrow screen and remain above the mobile contact bar', async ({page}) => {
  await page.setViewportSize({width: 320, height: 700});
  await localProduction(page);
  await page.goto('https://bradhazen.com/contact/');
  const panel = page.getByRole('region', {name: 'Analytics cookie choice'});
  await expect(panel).toBeVisible();
  const box = await panel.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(320);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(624);
  await mkdir('test-results/analytics-proof', {recursive: true});
  await page.screenshot({path: 'test-results/analytics-proof/consent-mobile.png'});
  await page.getByRole('button', {name: 'No thanks', exact: true}).click();
  await expect(panel).toBeHidden();
});
