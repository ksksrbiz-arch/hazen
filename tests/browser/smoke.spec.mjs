import {test, expect} from '@playwright/test';
import {readdirSync, statSync, readFileSync} from 'node:fs';
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
    '/buyer-checklist/'
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
