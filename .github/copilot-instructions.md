# Project Context

This repository is a professional E2E test automation
framework built with TypeScript and Playwright.

# Engineering Guidelines

- Use TypeScript with strict typing.
- Follow Playwright official best practices.
- Prefer readable and maintainable test code.
- Use Page Object Model when it adds value.
- Avoid unnecessary abstractions.
- Use meaningful test descriptions.
- Prefer Playwright locators such as getByRole,
  getByLabel and getByTestId.
- Avoid fixed sleeps and arbitrary timeouts.
- Keep tests independent and isolated.
- Do not hardcode sensitive information.
- Avoid duplicated test logic.

# QA Guidelines

- Cover positive and negative scenarios.
- Consider boundary conditions.
- Validate business rules, not only page visibility.
- Include meaningful assertions.
- Avoid tests that depend on execution order.
- Explain relevant architectural decisions.

# Copilot Behavior

- Explain proposed changes before implementing
  complex features.
- Do not modify unrelated files.
- Do not introduce dependencies without justification.
- Explain new TypeScript concepts when relevant.
- Identify potential test instability.
- Never claim tests passed without execution.