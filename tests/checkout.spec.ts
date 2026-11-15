import { test, expect } from './fixtures';
import { CartPage } from '../pages/CartPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { CheckoutInformationPage } from '../pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { InventoryPage } from '../pages/InventoryPage';
import {
  checkoutInformation,
  requiredFieldScenarios,
} from '../test-data/checkout';
import { products } from '../test-data/products';

test.describe('Checkout', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    await inventoryPage.addProduct(products.backpack.id);
    await inventoryPage.addProduct(products.bikeLight.id);
    await inventoryPage.openCart();
    await new CartPage(authenticatedPage).proceedToCheckout();
  });

  test('CHECKOUT-001: complete a purchase with valid information', async ({
    authenticatedPage,
  }) => {
    const informationPage = new CheckoutInformationPage(authenticatedPage);
    await informationPage.fillInformation(
      checkoutInformation.firstName,
      checkoutInformation.lastName,
      checkoutInformation.postalCode,
    );
    await informationPage.continueToOverview();

    const overviewPage = new CheckoutOverviewPage(authenticatedPage);
    await overviewPage.finishOrder();

    const completePage = new CheckoutCompletePage(authenticatedPage);
    await expect(completePage.title).toHaveText('Checkout: Complete!');
    await expect(completePage.confirmationMessage).toHaveText(
      'Thank you for your order!',
    );
  });

  for (const scenario of requiredFieldScenarios) {
    test(scenario.title, async ({ authenticatedPage }) => {
      const informationPage = new CheckoutInformationPage(authenticatedPage);
      await informationPage.fillInformation(
        scenario.firstName,
        scenario.lastName,
        scenario.postalCode,
      );
      await informationPage.continueToOverview();

      await expect(informationPage.errorMessage).toHaveText(
        scenario.expectedError,
      );
    });
  }

  test('CHECKOUT-005: validate the order totals', async ({
    authenticatedPage,
  }) => {
    const informationPage = new CheckoutInformationPage(authenticatedPage);
    await informationPage.fillInformation(
      checkoutInformation.firstName,
      checkoutInformation.lastName,
      checkoutInformation.postalCode,
    );
    await informationPage.continueToOverview();

    const overviewPage = new CheckoutOverviewPage(authenticatedPage);
    await expect(overviewPage.products).toHaveCount(2);
    await expect(overviewPage.product(products.backpack.name)).toBeVisible();
    await expect(overviewPage.product(products.bikeLight.name)).toBeVisible();

    await expect(overviewPage.productPrices).toHaveCount(2);
    const itemPrices = await overviewPage.productPrices.allTextContents();
    expect(itemPrices).toHaveLength(2);

    const itemTotalCents = itemPrices
      .map(parseCents)
      .reduce((sum, price) => sum + price, 0);
    const subtotalCents = parseCents(await overviewPage.subtotal.innerText());
    const taxCents = parseCents(await overviewPage.tax.innerText());
    const totalCents = parseCents(await overviewPage.total.innerText());

    expect(subtotalCents).toBe(itemTotalCents);
    expect(totalCents).toBe(subtotalCents + taxCents);
  });
});

function parseCents(text: string): number {
  const amount = text.match(/\$([0-9]+)\.([0-9]{2})/);
  if (!amount) {
    throw new Error(`Could not find a currency amount in "${text}"`);
  }

  return Number(amount[1]) * 100 + Number(amount[2]);
}
