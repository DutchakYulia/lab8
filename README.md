# Laboratory Work 8

Automated UI tests for the local `Men Jackets` catalog page.

## Project structure

- `fixtures/jackets.html` - test page with product list, filters and sorting.
- `tests/jackets.spec.js` - Playwright automated tests.
- `playwright.config.js` - Playwright configuration.

## Test scenarios

1. Verify that the catalog page opens, has the correct title and displays 5 products.
2. Verify product names and prices.
3. Verify sorting by price in ascending order.
4. Verify sorting by product name in alphabetical order.
5. Verify that filter checkboxes are visible and can be selected.

## Run

```bash
npm test
```

For a visible browser run:

```bash
npm run test:headed
```
