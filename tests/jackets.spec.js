const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

const pageUrl = pathToFileURL(path.join(__dirname, '..', 'fixtures', 'jackets.html')).href;

async function openCatalog(page) {
  await page.goto(pageUrl);
}

async function productNames(page) {
  return page.locator('.product-item strong').allTextContents();
}

async function productPrices(page) {
  const prices = await page.locator('.product-item .price').allTextContents();
  return prices.map((price) => Number(price.replace('$', '')));
}

test.describe('Men Jackets catalog', () => {
  test.beforeEach(async ({ page }) => {
    await openCatalog(page);
  });

  test('opens the catalog page and shows the expected toolbar data', async ({ page }) => {
    await expect(page).toHaveTitle('Men Jackets - Lab Store');
    await expect(page.getByRole('heading', { name: 'Men Jackets' })).toBeVisible();
    await expect(page.locator('.toolbar-amount')).toContainText('Items 1-5 of 5');
    await expect(page.locator('.product-item')).toHaveCount(5);
  });

  test('shows product names and prices', async ({ page }) => {
    await expect(page.locator('.product-item').first()).toContainText('Proteus Fitness Jackshirt');
    await expect(page.locator('.product-item').first().locator('.price')).toHaveText('$79.00');
    await expect(page.locator('.product-item .price')).toHaveText([
      '$79.00',
      '$45.00',
      '$68.00',
      '$56.00',
      '$99.00'
    ]);
  });

  test('sorts products by price from lowest to highest', async ({ page }) => {
    await page.locator('.sorter-options').selectOption('price');

    await expect.poll(() => productPrices(page)).toEqual([45, 56, 68, 79, 99]);
    await expect(page.locator('.product-item').first()).toContainText('Montana Wind Jacket');
    await expect(page.locator('.product-item').last()).toContainText('Orion Shell Jacket');
  });

  test('sorts products alphabetically by name', async ({ page }) => {
    await page.locator('.sorter-options').selectOption('name');

    await expect.poll(() => productNames(page)).toEqual([
      'Kenobi Trail Jacket',
      'Lando Gym Jacket',
      'Montana Wind Jacket',
      'Orion Shell Jacket',
      'Proteus Fitness Jackshirt'
    ]);
  });

  test('contains available filter checkboxes', async ({ page }) => {
    await expect(page.getByRole('checkbox', { name: 'M', exact: true })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'L', exact: true })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Black', exact: true })).toBeVisible();

    await page.getByRole('checkbox', { name: 'M', exact: true }).check();
    await expect(page.getByRole('checkbox', { name: 'M', exact: true })).toBeChecked();
  });
});
