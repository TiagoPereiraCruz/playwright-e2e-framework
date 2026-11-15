import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly items: Locator;

  constructor(private readonly page: Page) {
    this.items = page.locator('[data-test="inventory-item"]');
  }

  product(name: string): Locator {
    return this.items.filter({
      has: this.page.getByText(name, { exact: true }),
    });
  }

  async removeProduct(productId: string): Promise<void> {
    await this.page.locator(`[data-test="remove-${productId}"]`).click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.page.getByRole('button', { name: 'Checkout' }).click();
  }
}
