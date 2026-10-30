import {test, expect} from '@playwright/test';
test('gallery reports an outage and preserves direct listing links', async ({page}) => {
  test.setTimeout(60000);
  await page.route('https://bradhazen.realtypronw.net/build/js/widgets-1.0.0.js', route =>
    route.fulfill({contentType: 'text/javascript', body: ''})
  );
  await page.goto('/brads-listings/', {waitUntil: 'domcontentloaded'});
  await page.locator('iframe').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-gallery-status]')).toContainText('taking longer', {timeout: 20000});
  await expect(page.locator('.listing-footnote details')).toHaveAttribute('open', '');
  await expect(page.getByRole('link', {name: 'East Yacolt Road · MLS 24202394'})).toBeVisible();
});
test('unrelated windows cannot resize the provider frame or claim it is ready', async ({page}) => {
  await page.route('https://bradhazen.realtypronw.net/build/js/widgets-1.0.0.js', route =>
    route.fulfill({contentType: 'text/javascript', body: ''})
  );
  await page.goto('/brads-listings/', {waitUntil: 'domcontentloaded'});
  await page.evaluate(() => window.postMessage({type: 'brad-listing-gallery', height: 9999, state: 'ready'}, '*'));
  await expect(page.locator('[data-gallery-status]')).toBeVisible();
  await expect(page.locator('iframe')).not.toHaveAttribute('style', /9999/);
});
test.describe('without JavaScript', () => {
  test.use({javaScriptEnabled: false});
  test('the loading note stays hidden and fallback links remain available', async ({page}) => {
    await page.goto('/brads-listings/', {waitUntil: 'domcontentloaded'});
    await expect(page.locator('[data-gallery-status]')).toBeHidden();
    await expect(page.locator('noscript').first()).toBeAttached();
    await page.locator('.listing-footnote summary').click();
    await expect(page.getByRole('link', {name: 'NE Hazen Avenue · MLS 24434415'})).toBeVisible();
  });
});

test('cross-listed Yacolt shares one card and follows provider changes', async ({page}) => {
  await page.route('https://bradhazen.realtypronw.net/build/js/widgets-1.0.0.js', route =>
    route.fulfill({
      contentType: 'text/javascript',
      body: `
    window.renderGallery = ids => document.querySelector('.YLOPO_resultsWidget').innerHTML = ids.map(id => '<div class="grid-view-item"><div class="gallery-card-b"><a href="https://bradhazen.realtypronw.net/search/detail/'+id+'"><span class="gallery-card-b-address-block">Property '+id+'</span></a></div></div>').join('');
    renderGallery(['210973857','210989090','205684283']);
  `
    })
  );
  await page.goto('/listing-widget/');
  await expect(page.locator('.grid-view-item:visible')).toHaveCount(2);
  await expect(
    page.getByRole('link', {name: 'East Yacolt Road commercial listing details (opens in a new tab)', exact: true})
  ).toHaveAttribute('href', /210973857/);
  await expect(
    page.getByRole('link', {name: 'East Yacolt Road land listing details (opens in a new tab)', exact: true})
  ).toHaveAttribute('href', /210989090/);
  await page.evaluate(() => window.renderGallery(['210973857', '205684283']));
  await expect(page.locator('.grid-view-item:visible')).toHaveCount(2);
  await expect(page.locator('[data-commercial-details]')).toHaveCount(0);
  await expect(page.locator('.grid-view-item:visible').first()).toContainText('210973857');
  await page.evaluate(() => window.renderGallery(['210989090', '205684283']));
  await expect(page.locator('.grid-view-item:visible')).toHaveCount(2);
  await expect(page.locator('[data-commercial-details]')).toHaveCount(0);
});
