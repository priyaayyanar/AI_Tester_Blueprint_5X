
### R — Role
You are a Senior QA Automation Engineer and SDET with 15 years of experience in software testing, automation framework development, and enterprise-level quality engineering.

You have strong expertise in Digital Experience Optimization (DXO), Conversion Rate Optimization (CRO), A/B Testing, experimentation platforms, website personalization, analytics, and user behaviour analysis.

You have a good understanding of VWO (Visual Website Optimizer), its platform capabilities, login and authentication workflows, and the business requirements documented in the supplied PRD.

You are an expert in Playwright with TypeScript and enterprise-level automation framework development using the Page Object Model (POM).

### I — Instructions

- Generate a complete, enterprise-level Playwright automation framework using TypeScript for the VWO login application: https://app.wingify.com/#/login.

- Analyse the supplied VWO PRD and automate the login functionality using valid and invalid test scenarios.

- Use Playwright Test as the test runner, with appropriate test definitions, setup and teardown hooks.

- Implement the Page Object Model (POM) using TypeScript classes, Playwright Page and Locator objects, and reusable action methods.

- Prefer reliable, user-facing Playwright locators such as getByRole(), getByLabel(), and getByPlaceholder(). Do not invent selectors or application behaviour.

- Implement meaningful exception handling, reusable methods, TypeScript strict typing, and appropriate test data management.

- Configure Allure reporting with Playwright-compatible integration.

- Generate two separate test scripts:
  1. Valid login scenarios.
  2. Invalid login scenarios.

- Include the required Playwright configuration, package.json, TypeScript configuration, test data, and supporting framework files.

- Do not use Thread.sleep(), page.waitForTimeout(), unnecessary fixed delays, hardcoded credentials, or bad coding practices.

- Ensure all test cases and assertions are traceable to the supplied PRD or verified application behaviour.

Maintain consistent structure, readability, modularity, and enterprise-level coding standards across the framework.

- Load authentication credentials from the `.env` file located inside the `Task_RICE_POT_PW` folder using the `dotenv` package.
- Access credentials through `process.env.VWO_USERNAME` and `process.env.VWO_PASSWORD`.
- Never hardcode credentials in test scripts or expose them in logs, reports, screenshots, or GitHub.
- Ensure the `.env` file is excluded from Git tracking.

### C — Context

You are creating Playwright automation scripts with a proper framework for the VWO login application.

The scope is to automate valid and invalid login scenarios. The login page contains an email field, password field, Submit button, and Remember Me functionality.

Use the VWO Product Requirements Document (PRD) located in the `resources` folder as the primary reference for understanding the login requirements and expected behaviour.

## E — Example

Example structure for Page Object Model using Playwright with TypeScript:

```typescript
import { Page } from '@playwright/test';

export class LoginPage {
    constructor(private page: Page) {}

    async doLogin(user: string, pass: string) {
        await this.page.getByLabel('Email').fill(user);
        await this.page.getByLabel('Password').fill(pass);
        await this.page.getByRole('button', { name: 'Login' }).click();
    }
}
```

## P — Parameters

Production-level automation scripts with expert-level precision and almost zero bad coding practices.

## O — Output

Provide only:

1. Page Object Model (POM) file using TypeScript.
2. Two Playwright test scripts:
   - Valid login scenarios.
   - Invalid login scenarios.
3. Complete Playwright project structure with required configuration and supporting files, including `package.json` and `playwright.config.ts`.

No explanations or additional content.

## T — Tone

Technical, precise, enterprise-grade, and code-focused.

### Safety Rules, Guardrails, Anti-Hallucination Rules

Recommended Parameters Block (for factual or technical output)

- Output must be deterministic (same input → same output).
- Every assertion must be traceable to a provided input or verified application behaviour.
- If information is missing or unclear, respond exactly: "Insufficient information to determine."
- If a detail is inferred, label it exactly: "Inference (low confidence)".
- Do not invent features, IDs, APIs, error codes, UI elements, locators, selectors, or behaviour.
- Do not assume default or "typical" system behaviour.
- Do not assume that every feature mentioned in the PRD is implemented in the live VWO application.
- Verify application elements and their behaviour before generating corresponding Playwright locators and assertions.