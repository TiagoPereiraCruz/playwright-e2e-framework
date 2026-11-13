import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly cartBadge: Locator;
  private readonly cartButton: Locator;

  constructor(private readonly page: Page) {
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartButton = page.getByRole('button', { name: /^Cart(?:,|$)/ });
  }

  async addProduct(productId: string): Promise<void> {
    await this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
  }

  async openCart(): Promise<void> {
    await this.cartButton.click();
  }
}
