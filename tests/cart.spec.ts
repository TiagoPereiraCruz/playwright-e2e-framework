import { test, expect } from './fixtures';
import { CartPage } from '../pages/CartPage';
import { InventoryPage } from '../pages/InventoryPage';
import { products } from '../test-data/products';

test.describe('Shopping cart', () => {
  test('CART-001: add a product to the cart', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);

    await inventoryPage.addProduct(products.backpack.id);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await inventoryPage.openCart();

    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.product(products.backpack.name)).toBeVisible();
  });

  test('CART-002: remove a product from the cart', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);

    await inventoryPage.addProduct(products.backpack.id);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await inventoryPage.openCart();
    await cartPage.removeProduct(products.backpack.id);

    await expect(cartPage.items).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });

  test('CART-003: add two different products to the cart', async ({
    authenticatedPage,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);

    await inventoryPage.addProduct(products.backpack.id);
    await inventoryPage.addProduct(products.bikeLight.id);
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await inventoryPage.openCart();

    await expect(cartPage.items).toHaveCount(2);
    await expect(cartPage.product(products.backpack.name)).toBeVisible();
    await expect(cartPage.product(products.bikeLight.name)).toBeVisible();
  });
});
