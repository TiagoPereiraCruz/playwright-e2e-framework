import { type Locator, type Page } from '@playwright/test';

export class CheckoutOverviewPage {
  readonly products: Locator;
  readonly productPrices: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  private readonly finishButton: Locator;

  constructor(private readonly page: Page) {
    this.products = page.locator('[data-test="inventory-item"]');
    this.productPrices = page.locator('[data-test="inventory-item-price"]');
    this.subtotal = page.locator('[data-test="subtotal-label"]');
    this.tax = page.locator('[data-test="tax-label"]');
    this.total = page.locator('[data-test="total-label"]');
    this.finishButton = page.getByRole('button', { name: 'Finish' });
  }

  product(name: string): Locator {
    return this.products.filter({
      has: this.page.getByText(name, { exact: true }),
    });
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }
}
