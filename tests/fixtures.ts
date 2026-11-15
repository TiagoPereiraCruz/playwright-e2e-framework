import { test as base, type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../test-data/users';

type AuthenticatedFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthenticatedFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await page.waitForURL(/\/inventory\.html$/);

    await use(page);
  },
});

export { expect } from '@playwright/test';
