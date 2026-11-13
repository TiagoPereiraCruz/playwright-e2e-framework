import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import { products } from '../test-data/products';
import { users } from '../test-data/users';

test.describe('Shopping cart', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test('CART-001: add a product to the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProduct(products.backpack.id);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await inventoryPage.openCart();

    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.product(products.backpack.name)).toBeVisible();
  });

  test('CART-002: remove a product from the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProduct(products.backpack.id);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await inventoryPage.openCart();
    await cartPage.removeProduct(products.backpack.id);

    await expect(cartPage.items).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });

  test('CART-003: add two different products to the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProduct(products.backpack.id);
    await inventoryPage.addProduct(products.bikeLight.id);
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await inventoryPage.openCart();

    await expect(cartPage.items).toHaveCount(2);
    await expect(cartPage.product(products.backpack.name)).toBeVisible();
    await expect(cartPage.product(products.bikeLight.name)).toBeVisible();
  });
});
