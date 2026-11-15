import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { CheckoutInformationPage } from '../pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import { checkoutInformation } from '../test-data/checkout';
import { products } from '../test-data/products';
import { users } from '../test-data/users';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addProduct(products.backpack.id);
    await inventoryPage.addProduct(products.bikeLight.id);
    await inventoryPage.openCart();
    await new CartPage(page).proceedToCheckout();
  });

  test('CHECKOUT-001: complete a purchase with valid information', async ({
    page,
  }) => {
    const informationPage = new CheckoutInformationPage(page);
    await informationPage.fillInformation(
      checkoutInformation.firstName,
      checkoutInformation.lastName,
      checkoutInformation.postalCode,
    );
    await informationPage.continueToOverview();

    const overviewPage = new CheckoutOverviewPage(page);
    await overviewPage.finishOrder();

    const completePage = new CheckoutCompletePage(page);
    await expect(completePage.title).toHaveText('Checkout: Complete!');
    await expect(completePage.confirmationMessage).toHaveText(
      'Thank you for your order!',
    );
  });

  test('CHECKOUT-002: require a first name', async ({ page }) => {
    const informationPage = new CheckoutInformationPage(page);
    await informationPage.fillInformation(
      '',
      checkoutInformation.lastName,
      checkoutInformation.postalCode,
    );
    await informationPage.continueToOverview();

    await expect(informationPage.errorMessage).toHaveText(
      'Error: First Name is required',
    );
  });

  test('CHECKOUT-003: require a last name', async ({ page }) => {
    const informationPage = new CheckoutInformationPage(page);
    await informationPage.fillInformation(
      checkoutInformation.firstName,
      '',
      checkoutInformation.postalCode,
    );
    await informationPage.continueToOverview();

    await expect(informationPage.errorMessage).toHaveText(
      'Error: Last Name is required',
    );
  });

  test('CHECKOUT-004: require a postal code', async ({ page }) => {
    const informationPage = new CheckoutInformationPage(page);
    await informationPage.fillInformation(
      checkoutInformation.firstName,
      checkoutInformation.lastName,
      '',
    );
    await informationPage.continueToOverview();

    await expect(informationPage.errorMessage).toHaveText(
      'Error: Postal Code is required',
    );
  });

  test('CHECKOUT-005: validate the order totals', async ({ page }) => {
    const informationPage = new CheckoutInformationPage(page);
    await informationPage.fillInformation(
      checkoutInformation.firstName,
      checkoutInformation.lastName,
      checkoutInformation.postalCode,
    );
    await informationPage.continueToOverview();

    const overviewPage = new CheckoutOverviewPage(page);
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
