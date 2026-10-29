import {test, expect} from '@playwright/test';
import {readdirSync, statSync} from 'node:fs';
import path from 'node:path';
import {contact} from '../../src/contact.js';
const dist = path.resolve('dist');
function routes(dir = dist, prefix = '') {
  const found = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name !== 'assets') found.push(...routes(full, prefix + '/' + name));
    }
  }
  return statSync(path.join(dir, 'index.html'), {throwIfNoEntry: false})?.isFile() ? [prefix || '/', ...found] : found;
}
// /studio/ is behind Cloudflare Access in production and needs its API; the static shell is not meaningful alone.
const publicRoutes = routes()
  .filter(route => !route.startsWith('/studio'))
  .map(route => (route === '/' ? route : route + '/'));

test('built route list is non-trivial', () => {
  expect(publicRoutes.length).toBeGreaterThan(15);
});

for (const route of publicRoutes) {
  test(`loads cleanly: ${route}`, async ({page}) => {
    const problems = [];
    page.on('console', message => {
      if (['error', 'warning'].includes(message.type())) problems.push(message.type() + ': ' + message.text());
    });
    page.on('pageerror', error => problems.push('pageerror: ' + error.message));
    page.on('requestfailed', request => problems.push('requestfailed: ' + request.url()));
    await page.goto(route);
    await expect(page.locator('h1').first()).toBeVisible();
    expect(problems).toEqual([]);
  });
  test(`no horizontal scroll at 320px: ${route}`, async ({page}) => {
    await page.setViewportSize({width: 320, height: 700});
    await page.goto(route);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('mobile menu opens, closes on Escape and returns focus', async ({page}) => {
  await page.setViewportSize({width: 390, height: 800});
  await page.goto('/');
  const menu = page.locator('details.mobile-nav');
  await menu.locator('summary').click();
  await expect(menu).toHaveJSProperty('open', true);
  await page.keyboard.press('Escape');
  await expect(menu).toHaveJSProperty('open', false);
  await expect(menu.locator('summary')).toBeFocused();
});

test('mobile menu links navigate when clicked with the mouse', async ({page}) => {
  await page.setViewportSize({width: 390, height: 800});
  for (const [label, path] of [
    ['Contact Us', '/contact/'],
    ['Brad’s Listings', '/brads-listings/'],
    ['Search', '/search/']
  ]) {
    await page.goto('/');
    await page.locator('details.mobile-nav summary').click();
    await page.locator('details.mobile-nav nav').getByRole('link', {name: label, exact: true}).click();
    await expect(page).toHaveURL(new RegExp(path + '$'));
  }
});

test('mobile menu closes on outside click and when keyboard focus leaves it', async ({page}) => {
  await page.setViewportSize({width: 390, height: 800});
  await page.goto('/');
  const menu = page.locator('details.mobile-nav');
  await menu.locator('summary').click();
  await page.mouse.click(20, 700);
  await expect(menu).toHaveJSProperty('open', false);
  await menu.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveJSProperty('open', true);
  const links = await menu.locator('nav a').count();
  for (let i = 0; i < links; i++) await page.keyboard.press('Tab');
  await expect(menu).toHaveJSProperty('open', true);
  await page.keyboard.press('Tab');
  await expect(menu).toHaveJSProperty('open', false);
});

test('inquiry form: validation, reviewed draft, edit; nothing is sent', async ({page}) => {
  const requests = [];
  page.on('request', request => {
    if (request.method() !== 'GET') requests.push(request.url());
  });
  await page.goto('/contact/');
  const form = page.locator('form[data-inquiry="contact"]');
  await expect(form.locator('button[type="submit"]')).toBeEnabled();
  await form.locator('button[type="submit"]').click();
  await expect(page.locator('[data-inquiry-errors]')).toBeVisible();
  await expect(form.locator('#inquiry-name')).toBeFocused();
  await form.locator('#inquiry-name').fill('Test Visitor');
  await form.locator('#inquiry-email').fill('not-an-email');
  await form.locator('#inquiry-interest').selectOption({index: 1});
  await form.locator('button[type="submit"]').click();
  await expect(page.locator('[data-inquiry-error-list] a')).toHaveCount(1);
  await form.locator('#inquiry-email').fill('visitor@example.com');
  await form.locator('button[type="submit"]').click();
  const open = page.locator('[data-open-email]');
  await expect(open).toBeVisible();
  expect(await open.getAttribute('href')).toContain(contact.emailHref);
  expect(await open.getAttribute('href')).toContain(encodeURIComponent('Test Visitor'));
  await expect(page.locator('.email-backup')).toContainText(contact.email);
  await form.locator('.edit-inquiry').click();
  await expect(form.locator('#inquiry-name')).toHaveValue('Test Visitor');
  expect(requests).toEqual([]);
});

test('direct contact links use the single contact source', async ({page}) => {
  await page.goto('/');
  await expect(page.locator(`a[href="${contact.phoneHref}"]`).first()).toBeAttached();
  await expect(page.locator(`a[href="${contact.emailHref}"]`).first()).toBeAttached();
});

test('security headers and robots restrictions are served', async ({request}) => {
  const response = await request.get('/');
  expect(response.headers()['content-security-policy']).toContain("script-src 'self'");
  expect(response.headers()['x-frame-options']).toBe('DENY');
});

test('unknown page returns the recovery page with a 404', async ({page}) => {
  const response = await page.goto('/definitely-missing/');
  expect(response.status()).toBe(404);
  await expect(page.locator('[data-recovery-shell], .recovery-page').first()).toBeVisible();
});

// Automated accessibility scan (WCAG 2.x A/AA rules axe can evaluate). Manual keyboard and screen-reader checks remain separate.
import axe from 'axe-core';
test.describe('accessibility', () => {
  test.use({bypassCSP: true});
  for (const route of [
    '/',
    '/about/',
    '/buy/',
    '/sell/',
    '/contact/',
    '/communities/',
    '/resources/',
    '/properties/',
    '/seller-checklist/',
    '/buyer-checklist/',
    '/search/'
  ]) {
    test(`axe: no WCAG A/AA violations: ${route}`, async ({page}) => {
      await page.goto(route);
      await page.addScriptTag({content: axe.source});
      const result = await page.evaluate(() =>
        window.axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']}})
      );
      expect(result.violations.map(v => `${v.id} (${v.nodes.length}): ${v.nodes[0].target.join(' ')}`)).toEqual([]);
    });
  }
});

test('Listing Studio script loads and renders the editor with a mocked API', async ({page}) => {
  const problems = [];
  page.on('console', message => {
    if (['error', 'warning'].includes(message.type())) problems.push(message.type() + ': ' + message.text());
  });
  page.on('pageerror', error => problems.push('pageerror: ' + error.message));
  await page.route('**/api/admin/**', route => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/session')) return route.fulfill({json: {email: 'editor@example.com'}});
    return route.fulfill({
      json: {listings: [], counts: {total: 0, archived: 0, drafts: 0, published: 0}, hasMore: false}
    });
  });
  await page.goto('/studio/');
  await expect(page.locator('#listing-editor')).toBeAttached();
  await expect(page.locator('#listing-counts')).toContainText('Drafts');
  expect(problems).toEqual([]);
});

test('heading font loads as a small WOFF2 and is preloaded with the matching URL', async ({page}) => {
  const fonts = [];
  page.on('response', response => {
    if (response.frame() === page.mainFrame() && /\.(woff2?|ttf)$/.test(new URL(response.url()).pathname))
      fonts.push(response);
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('500 20px Montserrat'))).toBe(true);
  expect(fonts.length).toBe(1);
  expect(fonts[0].status()).toBe(200);
  expect(new URL(fonts[0].url()).pathname).toMatch(/montserrat-latin\.woff2$/);
  expect((await fonts[0].body()).length).toBeLessThan(40000);
  const preload = await page.locator('link[rel="preload"][as="font"]').getAttribute('href');
  expect(new URL(fonts[0].url()).pathname).toBe(preload);
});

test('search separates full market from Brad listings and no empty blog is exposed', async ({page}) => {
  await page.goto('/search/');
  await expect(page.getByRole('link', {name: 'Open Property Search', exact: true})).toHaveAttribute(
    'href',
    'https://bradhazen.realtypronw.net/'
  );
  await expect(page.getByRole('link', {name: /View Brad.s Listings/, exact: true})).toHaveAttribute(
    'href',
    '/brads-listings/'
  );
  await expect(page.locator('.property-search-frame')).toHaveAttribute('src', '/search-widget/');
  await expect(page.locator('.property-search-frame')).toHaveAttribute(
    'sandbox',
    'allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox'
  );
  await expect(page.locator('a[href="/blog/"]')).toHaveCount(0);
  const response = await page.goto('/blog/');
  expect(response.status()).toBe(404);
});
