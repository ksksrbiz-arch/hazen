import {test, expect} from '@playwright/test';
for (const route of ['/seller-checklist/', '/buyer-checklist/'])
  test('guided planning retains checks and prints all steps ' + route, async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});
    await page.goto(route);
    await expect(page.locator('.worksheet-card:visible')).toHaveCount(1);
    await page.locator('.worksheet-card:visible input').first().check();
    await page.getByRole('button', {name: 'Next step →', exact: true}).click();
    await expect(page.locator('[data-plan-position]')).toContainText('Step 2');
    await page.getByRole('button', {name: 'Previous step', exact: true}).click();
    await expect(page.locator('.worksheet-card:visible input').first()).toBeChecked();
    await page.getByRole('button', {name: 'View all steps', exact: true}).click();
    const total = await page.locator('.worksheet-card').count();
    await expect(page.locator('.worksheet-card:visible')).toHaveCount(total);
    await page.getByRole('button', {name: 'Return to guided steps', exact: true}).click();
    await page.emulateMedia({media: 'print'});
    await expect(page.locator('.worksheet-card:visible')).toHaveCount(total);
    await page.emulateMedia({media: 'screen'});
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
test('photo planning is selectable and community photos are credited', async ({page}) => {
  await page.goto('/listing-photos/');
  await page.locator('.photo-shot-grid input').first().check();
  await expect(page.locator('.photo-plan-status')).toContainText('1 views selected');
  await page.goto('/communities/');
  await expect(page.locator('.area-card img[src*="community-"]')).toHaveCount(6);
  await page.locator('.community-photo-credits summary').click();
  await expect(page.locator('.community-photo-credits')).toContainText('Steve Morgan');
});
