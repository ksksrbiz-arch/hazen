import {test, expect} from '@playwright/test';

test('resource category history keeps the visible guides aligned with the destination', async ({page}) => {
  await page.goto('/resources/');
  await page.getByRole('link', {name: 'Preparing to sell', exact: true}).click();
  await expect(page.locator('#selling-resources')).toBeVisible();
  await page.getByRole('link', {name: 'Planning your next move', exact: true}).click();
  await expect(page.locator('#buying-resources')).toBeVisible();
  await page.goBack();
  await expect(page.locator('#resource-topic')).toHaveValue('selling-resources');
  await expect(page.locator('#selling-resources')).toBeVisible();
  await expect(page.locator('#buying-resources')).toBeHidden();
});

for (const kind of ['buyer', 'seller']) {
  test(kind + ' reset returns to the first guided step and restores useful focus', async ({page}) => {
    await page.goto(`/${kind}-checklist/`);
    await page.locator('.worksheet-card:visible input').first().check();
    await page.getByRole('button', {name: 'Next step →', exact: true}).click();
    await page.locator('#worksheet-notes').fill('Questions to clear');
    page.once('dialog', dialog => dialog.dismiss());
    await page.locator('[data-reset-worksheet]').click();
    await expect(page.locator('[data-plan-position]')).toContainText('Step 2');
    await expect(page.locator('.worksheet-card input:checked')).toHaveCount(1);
    await expect(page.locator('#worksheet-notes')).toHaveValue('Questions to clear');
    page.once('dialog', dialog => dialog.accept());
    await page.locator('[data-reset-worksheet]').click();
    await expect(page.locator('[data-plan-position]')).toContainText('Step 1');
    await expect(page.locator('#worksheet-section-0 input').first()).toBeFocused();
    await expect(page.locator('.worksheet-card input:checked')).toHaveCount(0);
    await expect(page.locator('#worksheet-notes')).toHaveValue('');
  });
}

test('worksheet fragment navigation reveals its target after the page is initialized', async ({page}) => {
  await page.goto('/buyer-checklist/#worksheet-section-1');
  await expect(page.locator('#worksheet-section-1')).toBeVisible();
  await page.evaluate(() => {
    location.hash = 'worksheet-section-4';
  });
  await expect(page.locator('#worksheet-section-4')).toBeVisible();
  await expect(page.locator('[data-plan-position]')).toContainText('Step 5');
  await page.goBack();
  await expect(page.locator('#worksheet-section-1')).toBeVisible();
});

test('community comparison enforces the limit and clear restores all choices', async ({page}) => {
  await page.goto('/communities/');
  const choices = page.locator('[data-community-compare] input[type="checkbox"]');
  for (let i = 0; i < 3; i++) await choices.nth(i).check();
  await expect(choices.nth(3)).toBeDisabled();
  await expect(page.locator('[data-compare-card]:visible')).toHaveCount(3);
  await page.locator('[data-compare-clear]').click();
  await expect(choices.first()).toBeFocused();
  await expect(choices.nth(3)).toBeEnabled();
  await expect(page.locator('[data-compare-card]:visible')).toHaveCount(0);
  await expect(page.locator('[data-compare-contact]')).toBeHidden();
});
