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
