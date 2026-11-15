import { type Locator, type Page } from '@playwright/test';

export class CheckoutCompletePage {
  readonly title: Locator;
  readonly confirmationMessage: Locator;

  constructor(page: Page) {
    this.title = page.locator('[data-test="title"]');
    this.confirmationMessage = page.locator('[data-test="complete-header"]');
  }
}
