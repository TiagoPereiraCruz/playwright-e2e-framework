# Playwright E2E Framework

[![Playwright Tests](https://github.com/TiagoPereiraCruz/playwright-e2e-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/TiagoPereiraCruz/playwright-e2e-framework/actions/workflows/playwright.yml)
![Playwright](https://img.shields.io/badge/Playwright-E2E%20Testing-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-CI%20v26-339933?logo=nodedotjs&logoColor=white)

## 1. Project Overview

A TypeScript and Playwright framework for end-to-end testing of the SauceDemo shopping experience. It covers authentication, shopping cart operations, and checkout flows using browser UI tests.

## 2. Tech Stack

- Node.js (CI runs Node.js 26)
- TypeScript with strict type checking
- Playwright Test
- Chromium, Firefox, and WebKit browser projects

## 3. Features

- End-to-end UI scenarios for authentication, shopping cart, and checkout.
- Page Object Model for page locators and actions.
- Shared typed test data for users, products, and checkout scenarios.
- An `authenticatedPage` custom fixture for tests that require a logged-in user.
- Independent required-field checkout tests generated from typed data.

## 4. Test Coverage

| Area | Test ID | Scenario |
| --- | --- | --- |
| Authentication | AUTH-001 | Standard user can log in |
| Authentication | AUTH-002 | Invalid credentials are rejected |
| Authentication | AUTH-003 | Locked-out user cannot log in |
| Shopping Cart | CART-001 | Add a product to the cart |
| Shopping Cart | CART-002 | Remove a product from the cart |
| Shopping Cart | CART-003 | Add two different products to the cart |
| Checkout | CHECKOUT-001 | Complete a purchase with valid information |
| Checkout | CHECKOUT-002 | Require First Name |
| Checkout | CHECKOUT-003 | Require Last Name |
| Checkout | CHECKOUT-004 | Require Postal Code |
| Checkout | CHECKOUT-005 | Validate item subtotal, tax, and total calculations |

**Total: 11 functional scenarios.**

## 5. Custom Fixtures

`tests/fixtures.ts` extends Playwright's `test` with an `authenticatedPage` fixture. It uses the existing `LoginPage` and standard test user, waits for navigation to `/inventory.html`, then provides the same page to the test. Cart and checkout setup remains in their test files; the fixture handles authentication only.

## 6. Data-Driven Testing

The required checkout fields are represented by typed `requiredFieldScenarios` in `test-data/checkout.ts`. `tests/checkout.spec.ts` iterates over the scenarios and declares one Playwright test per entry. Each field validation therefore retains an independent test title and result in the report.

## 7. Page Object Model

Page Objects in `pages/` encapsulate locators and user actions for login, inventory, cart, and the checkout information, overview, and completion pages. Tests create and use these objects while keeping assertions in the test files.

## 8. Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── playwright.yml
├── .gitignore
├── pages/
│   ├── CartPage.ts
│   ├── CheckoutCompletePage.ts
│   ├── CheckoutInformationPage.ts
│   ├── CheckoutOverviewPage.ts
│   ├── InventoryPage.ts
│   └── LoginPage.ts
├── test-data/
│   ├── checkout.ts
│   ├── products.ts
│   └── users.ts
├── tests/
│   ├── authentication.spec.ts
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   └── fixtures.ts
├── package.json
├── package-lock.json
├── playwright.config.ts
├── README.md
└── tsconfig.json
```

`playwright-report/` and `test-results/` are generated during test/report runs and are Git-ignored.

## 9. Installation and Setup

Requirements: Node.js and npm. The CI workflow uses Node.js 26.

```bash
npm ci
```

### Browser Installation

Install all browsers supported by the Playwright configuration:

```bash
npx playwright install
```

For Chromium-only local runs, install only Chromium:

```bash
npx playwright install chromium
```

Local Windows security policies may restrict WebKit execution in some environments. Do not disable or weaken security mechanisms to work around this limitation. GitHub Actions performs the cross-browser validation on Linux.

## 10. Running Tests

```bash
npm test
```

Runs the Chromium project only.

```bash
npm run test:all
```

Runs all configured browser projects: Chromium, Firefox, and WebKit.

```bash
npm run test:ui
```

Opens Playwright's interactive test UI.

## 11. TypeScript Type Checking

```bash
npm run typecheck
```

Runs `tsc --noEmit` with strict type checking.

## 12. CI/CD Pipeline

The GitHub Actions workflow runs on pushes and pull requests targeting `main` or `master`. It uses Ubuntu, sets up Node.js 26, installs dependencies with `npm ci`, runs the TypeScript check, installs Playwright browsers and system dependencies, and runs `npm run test:all`.

The workflow uploads the generated `playwright-report/` as an artifact named `playwright-report`, with a 30-day retention period.

## 13. Test Reports

Playwright is configured with the HTML reporter. After a test run, open the generated local report with:

```bash
npm run test:report
```

In CI, the report is available as the `playwright-report` artifact for the corresponding workflow run. No permanent hosted report URL is configured.

## 14. Application Under Test

The tests target SauceDemo at [https://www.saucedemo.com](https://www.saucedemo.com), configured as the Playwright `baseURL`.
