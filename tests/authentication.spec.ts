import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../test-data/users';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await new LoginPage(page).goto();
  });

  test('AUTH-001: standard user can log in', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });

  test('AUTH-002: invalid credentials are rejected', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(users.invalid.username, users.invalid.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match any user in this service',
    );
  });

  test('AUTH-003: locked out user cannot log in', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      'Sorry, this user has been locked out',
    );
  });
});
