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

for (const kind of ['seller', 'buyer'])
  test(kind + ' download creates a PDF with page-only entries and offers a blank PDF', async ({page}, testInfo) => {
    const pdfRequests = [];
    page.on('request', request => {
      if (/seller-pdf\.[a-f0-9]+\.js/.test(request.url())) pdfRequests.push(request.url());
    });
    await page.goto(`/${kind}-checklist/`);
    expect(pdfRequests).toHaveLength(0);
    await page.locator('.worksheet-card:visible input').first().check();
    await page.locator('#worksheet-notes').fill('Discuss the garden and preferred timeline.');
    const downloaded = page.waitForEvent('download');
    await page.getByRole('button', {name: 'Download My PDF', exact: true}).click();
    const download = await downloaded;
    await download.saveAs(testInfo.outputPath(`${kind}-filled.pdf`));
    expect(pdfRequests).toHaveLength(1);
    expect(download.suggestedFilename()).toBe(`brad-hazen-${kind}-checklist.pdf`);
    const stream = await download.createReadStream();
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const pdf = Buffer.concat(chunks);
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    await expect(page.locator('[data-worksheet-feedback]')).toContainText('Nothing was sent to Brad');
    await expect(page.getByRole('link', {name: 'Download Blank PDF', exact: true})).toHaveAttribute(
      'href',
      `/resources/${kind}-conversation-checklist.pdf`
    );
  });

test('buyer PDF loading failure keeps entries and offers recovery', async ({page}) => {
  await page.route('**/assets/seller-pdf.*.js', route => route.abort());
  await page.goto('/buyer-checklist/');
  const check = page.locator('.worksheet-card:visible input').first();
  await check.check();
  await page.locator('#worksheet-notes').fill('Keep my priorities.');
  const button = page.getByRole('button', {name: 'Download My PDF', exact: true});
  await button.click();
  await expect(page.locator('[data-worksheet-feedback]')).toContainText('Download Blank PDF');
  await expect(button).toBeEnabled();
  await expect(check).toBeChecked();
  await expect(page.locator('#worksheet-notes')).toHaveValue('Keep my priorities.');
});

for (const kind of ['buyer', 'seller'])
  test(kind + ' mobile steps keep the active topic visible and review begins at the top', async ({page}) => {
    await page.setViewportSize({width: 320, height: 740});
    await page.goto(`/${kind}-checklist/`);
    for (let step = 1; step < 6; step++) await page.getByRole('button', {name: 'Next step →', exact: true}).click();
    const active = page.locator('.worksheet-topic-nav [aria-current="step"]');
    expect(
      await active.evaluate(link => {
        const child = link.getBoundingClientRect(),
          parent = link.parentElement.getBoundingClientRect();
        return child.left >= parent.left - 1 && child.right <= parent.right + 1;
      })
    ).toBe(true);
    await page.getByRole('button', {name: 'Review your plan →', exact: true}).click();
    await expect(page.locator('#worksheet-section-0')).toBeFocused();
    await expect(page.locator('.worksheet-card:visible')).toHaveCount(6);
    await page.getByRole('button', {name: 'Return to guided steps', exact: true}).click();
    await expect(page.locator('#worksheet-section-5')).toBeFocused();
    await expect(page.locator('[data-plan-position]')).toContainText('Step 6');
  });
