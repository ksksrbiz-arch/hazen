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

test('seller download creates a PDF with page-only entries and offers a blank PDF', async ({page}) => {
  await page.goto('/seller-checklist/');
  await page.locator('.worksheet-card:visible input').first().check();
  await page.locator('#worksheet-notes').fill('Discuss the garden and preferred timeline.');
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', {name: 'Download My PDF', exact: true}).click();
  const download = await downloaded;
  expect(download.suggestedFilename()).toBe('brad-hazen-seller-checklist.pdf');
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const pdf = Buffer.concat(chunks);
  expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  await expect(page.locator('[data-worksheet-feedback]')).toContainText('Nothing was sent to Brad');
  await expect(page.getByRole('link', {name: 'Download Blank PDF', exact: true})).toHaveAttribute(
    'href',
    '/resources/seller-conversation-checklist.pdf'
  );
});
