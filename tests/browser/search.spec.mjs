import {test, expect} from '@playwright/test';

const loader = '**/build/js/widgets-1.0.0.js';
const fixture = `
const render=()=>{
 const root=document.querySelector('#search-results');if(!root)return;
 const search=JSON.parse(root.dataset.search);
 const list=search.maxPrice===1?[]:Array.from({length:search.limit},(_,i)=>({id:i}));
 root.innerHTML=list.map((_,i)=>'<div class="grid-view-item"><div class="gallery-card-b"><a href="https://bradhazen.realtypronw.net/search/detail/123"><span class="gallery-card-b-address-block">Test property '+i+'</span></a></div></div>').join('');
 window.YLOPO_WIDGETS.widgetOnloadCallback('listings',list,{search});
};
if(document.querySelector('#search-results')){window.YLOPO_WIDGETS.remountable['YLOPO_resultsWidget-fixture']=render;render();}
`;

test('inline search filters, more, validation, empty results and reset stay on the page', async ({page}) => {
  await page.route(loader, route => route.fulfill({contentType: 'text/javascript', body: fixture}));
  await page.goto('/search/');
  const frame = page.frameLocator('.property-search-frame');
  await expect(frame.locator('#search-status')).toContainText('Showing 6');
  await frame.getByLabel('City', {exact: true}).selectOption('Camas');
  await frame.getByLabel('Minimum price').fill('500000');
  await frame.getByLabel('Maximum price').fill('400000');
  await frame.getByRole('button', {name: 'Search properties', exact: true}).click();
  await expect(frame.locator('#search-status')).toContainText('Vancouver');
  await frame.getByLabel('Maximum price').fill('900000');
  await frame.getByLabel('Property type', {exact: true}).selectOption('house');
  await frame.getByLabel('Bedrooms', {exact: true}).selectOption('3');
  await frame.getByRole('button', {name: 'Search properties', exact: true}).click();
  await expect(frame.locator('#search-status')).toContainText('Camas');
  const query = JSON.parse(await frame.locator('#search-results').getAttribute('data-search'));
  expect(query).toMatchObject({minPrice: 500000, maxPrice: 900000, beds: 3, propertyTypes: ['house']});
  await frame.getByRole('button', {name: 'Show more properties'}).click();
  await expect(frame.locator('.grid-view-item')).toHaveCount(12);
  await frame.getByLabel('Minimum price').fill('');
  await frame.getByLabel('Maximum price').fill('1');
  await frame.getByRole('button', {name: 'Search properties', exact: true}).click();
  await expect(frame.locator('#search-status')).toContainText('No matching properties');
  await expect(frame.locator('.grid-view-item')).toHaveCount(0);
  await frame.getByRole('button', {name: 'Reset', exact: true}).click();
  await expect(frame.locator('#search-status')).toContainText('Vancouver');
  expect(new URL(page.url()).pathname).toBe('/search/');
  await expect(frame.getByRole('link', {name: /Open full map search/})).toHaveAttribute('target', '_blank');
});

test('provider load failure retains full-search fallback and retry', async ({page}) => {
  await page.route(loader, route => route.abort());
  await page.goto('/search/');
  const frame = page.frameLocator('.property-search-frame');
  await expect(frame.locator('#search-status')).toContainText('taking longer');
  await expect(frame.getByRole('button', {name: 'Try again'})).toBeVisible();
  await expect(frame.getByRole('link', {name: /Open full map search/})).toBeVisible();
  await expect(frame.locator('#search-results')).toBeHidden();
});

test('search frame cannot be resized by unrelated windows', async ({page}) => {
  await page.route(loader, route => route.abort());
  await page.goto('/search/');
  const frame = page.locator('.property-search-frame');
  await expect(page.frameLocator('.property-search-frame').getByRole('button', {name: 'Try again'})).toBeVisible();
  const height = await frame.evaluate(el => el.style.height);
  await page.evaluate(() => window.postMessage({type: 'brad-property-search', height: 23000}, '*'));
  await expect(frame).not.toHaveCSS('height', '23000px');
  expect(await frame.evaluate(el => el.style.height)).toBe(height);
});
