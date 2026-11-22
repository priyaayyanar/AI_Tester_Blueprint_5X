# Framework Overview

An enterprise-style **Playwright + TypeScript** automation framework built with
the **Page Object Model (POM)** to test the VWO / Wingify login application
(`https://app.wingify.com/#/login`). It covers valid and invalid login scenarios,
uses Allure reporting, and every locator/assertion was verified against the live
application (anti-hallucination compliant).

This document is a single reference you can copy into notes or a Word doc.

## Built from

- **Prompt:** `../PW_RISE_POT_Prompt.md` (the RICE_POT framework)
- **Requirements:** `../resources/Product Requirements Document_ VWO Login Dashboard.pdf` (VWO PRD)
- **Rules followed:** `../../anti-hallucination.rules.md`
- **Credentials:** loaded from `../.env` (never hardcoded, never committed)

## Tech stack

| Concern          | Choice                                            |
| ---------------- | ------------------------------------------------- |
| Language         | TypeScript (strict mode)                          |
| Test runner      | Playwright Test                                   |
| Design pattern   | Page Object Model (POM)                           |
| Reporting        | Playwright HTML + Allure                          |
| Config / secrets | dotenv (loads the shared `.env`)                  |
| Browsers         | Chromium (bundled), system Chrome, system Edge    |

## Folder structure

```
Playwright_Framework/
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── package-lock.json
├── .gitignore
├── .env.example
├── README.md
├── docs/
│   ├── VERIFICATION.md
│   └── OVERVIEW.md          <-- this file
├── src/
│   ├── config/
│   │   └── environment.ts
│   ├── pages/
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   └── DashboardPage.ts
│   ├── fixtures/
│   │   └── test.fixtures.ts
│   ├── test-data/
│   │   └── login.data.ts
│   └── utils/
│       ├── constants.ts
│       ├── logger.ts
│       └── allure.ts
└── tests/
    ├── valid-login.spec.ts
    └── invalid-login.spec.ts
```

## File-by-file (what it does and why)

### 1. `package.json`
Project manifest. Defines npm scripts (`test`, `test:headed`, `test:chrome`,
`test:edge`, `test:valid`, `test:invalid`, `typecheck`, `report:html`,
`allure:generate`, `allure:open`, `allure:serve`, `clean`) and dependencies
(`@playwright/test`, `dotenv`, `allure-playwright`, `allure-commandline`,
`typescript`, `@types/node`, `rimraf`).

### 2. `tsconfig.json`
Strict TypeScript config: `strict`, `noImplicitAny`, `strictNullChecks`,
`noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`,
`noFallthroughCasesInSwitch`. Catches mistakes at compile time.

### 3. `playwright.config.ts`
Central runner config.
- `testDir: ./tests`, `outputDir: ./test-results`
- `fullyParallel: false`, `workers: 1` — a single shared VWO account must not log
  in concurrently (determinism).
- `retries: 0` locally / `2` on CI; `forbidOnly` on CI.
- Timeouts: test `60s`, expect `10s`.
- Reporters: `list` + `html` + `allure-playwright`.
- `use{}`: `baseURL` from env, `headless` from env, action/navigation timeouts,
  1440x900 viewport, `trace`/`screenshot`/`video` only on failure.
- Projects: `chromium` (bundled), `chrome` (system Google Chrome — used for
  headed runs), `edge` (system Edge).

### 4. `.env.example`
Template for the shared env file (`BASE_URL`, `VWO_USERNAME`, `VWO_PASSWORD` +
optional overrides). Safe to commit; the real `.env` is not.

### 5. `.gitignore`
Excludes `node_modules/`, `.env`/`.env.*`, `dist/`, `test-results/`,
`playwright-report/`, `allure-results/`, `allure-report/`, logs, editor/OS files.

### 6. `README.md`
Setup, structure, run commands, browser-project notes, reporting,
scenario/traceability table, and anti-hallucination summary.

### 7. `docs/VERIFICATION.md`
Anti-hallucination verification log: the exact facts captured from the live page
(element ids, labels, error text, routes), the missing/unknown items, generated
output and self-validation. This is the evidence trail proving nothing was
invented.

### 8. `src/config/environment.ts`
Loads the `.env` from the `Task_RICE_POT_PW` folder (tries several candidate
paths so it works from any CWD), calls `dotenv.config` with `override: false`
(never overwrites existing values), and validates required variables with clear
errors. Exports a typed `env` object (`baseUrl`, `credentials`, `headless`,
timeouts). Values are never logged.

### 9. `src/utils/logger.ts`
Credential-safe logging helpers: `mask()`, `maskEmail()`, `redact()`,
`isSecretKey()`. Ensures secrets never leak into console, logs, reports,
screenshots, or CI output.

### 10. `src/utils/constants.ts`
Single source of truth for **verified** values only: `ROUTES`
(`#/login`, `#/dashboard`), `URL_PATTERNS`, `EXPECTED` strings (page titles, the
exact failure message `Your email, password, IP address or location did not
match`, labels/placeholders/button text) and `SELECTORS` (login form, inputs,
remember-me, submit, notification box).

### 11. `src/utils/allure.ts`
`annotate()` helper that attaches Allure metadata (epic, feature, story,
severity, owner) to tests via Playwright annotations.

### 12. `src/pages/BasePage.ts`
Abstract base for all page objects. Shared helpers: `goto()`, `openBaseUrl()`,
`waitForUrl()`, `currentUrl()`, `isVisible()`, `getText()`, `waitForVisible()`.
Avoids duplication across pages.

### 13. `src/pages/LoginPage.ts`
The main POM class. All locators are scoped to the visible login form
(`form#js-login-form`) to avoid collisions with hidden reset/forgot/SSO forms
that reuse the same labels.
- Locators: email `getByLabel('Email address', { exact: true })`, password
  `getByLabel('Password', { exact: true })`, submit
  `getByRole('button', { name: 'Sign in' })`, remember-me label + hidden
  checkbox, error notification.
- Methods: `open()`, `enterEmail()`, `enterPassword()`, `clickSignIn()`,
  `setRememberMe()` (clicks the visible label because the native checkbox is
  hidden), `isRememberMeChecked()`, `login()`, `waitForError()`,
  `getErrorMessage()`, `isLoginFormHidden()`, `describeEmail()` (masked).

### 14. `src/pages/DashboardPage.ts`
Post-login page object. `waitForLoad()` waits for the `#/dashboard` route and the
"Campaigns Overview" navigation link; `isDisplayed()` and `hasNoAuthError()`
support negative tests.

### 15. `src/fixtures/test.fixtures.ts`
Extends Playwright's base `test` with custom fixtures (`loginPage`,
`dashboardPage`) so tests get ready-made page objects without constructor
boilerplate. Re-exports the shared `test` and `expect`.

### 16. `src/test-data/login.data.ts`
Data-driven test data. `INVALID_LOGIN_SCENARIOS` (6 cases) each with `id`,
`title`, `email`, `password` and a `prdReference` for traceability.
`VALID_SCENARIOS` ids. Keeps data separate from test logic.

### 17. `tests/valid-login.spec.ts`
Valid login scenarios (3 tests):
- **VAL-03**: login page exposes the required controls (email/password/submit/remember-me + attributes)
- **VAL-01**: valid credentials authenticate and land on the dashboard
- **VAL-02**: Remember me can be selected and login still succeeds

### 18. `tests/invalid-login.spec.ts`
Invalid login scenarios (data-driven loop, 6 tests):
- **INV-01**: registered email + incorrect password rejected
- **INV-02**: unknown email + any password rejected
- **INV-03**: malformed email format rejected
- **INV-04**: empty email rejected
- **INV-05**: empty password rejected
- **INV-06**: empty email and password rejected

Each asserts the exact generic message, stays on `#/login`, and never reaches
the dashboard.

## Test scenarios — result

| ID       | Scenario                                                  | Type    | Result |
| -------- | --------------------------------------------------------- | ------- | :----: |
| VAL-03   | Login page exposes the required controls                  | Valid   | Pass   |
| VAL-01   | Valid credentials authenticate and land on dashboard      | Valid   | Pass   |
| VAL-02   | Remember me can be selected and login still succeeds      | Valid   | Pass   |
| INV-01   | Registered email + incorrect password rejected            | Invalid | Pass   |
| INV-02   | Unknown email + any password rejected                     | Invalid | Pass   |
| INV-03   | Malformed email format rejected                           | Invalid | Pass   |
| INV-04   | Empty email rejected                                      | Invalid | Pass   |
| INV-05   | Empty password rejected                                   | Invalid | Pass   |
| INV-06   | Empty email and password rejected                         | Invalid | Pass   |

**Total: 9 tests (3 valid + 6 invalid) — 9/9 passed headless (bundled Chromium)
and 9/9 passed headed (system Chrome).**

## How to run

```bash
npm install
npx playwright install chromium

npm test                 # headless, bundled Chromium
npm run test:headed      # headed, system Chrome
npm run test:chrome      # headless, system Chrome
npm run test:edge        # headless, system Edge
npm run test:valid       # valid scenarios only
npm run test:invalid     # invalid scenarios only
npm run typecheck        # tsc --noEmit

npm run allure:generate  # -> allure-report/index.html
```

## Key talking points (interview prep)

- **Page Object Model with scoped locators** — all login locators live inside
  `form#js-login-form` because the page also renders hidden password-reset,
  forgot-password and SSO forms that reuse the same labels and placeholders.
- **`getByLabel(..., { exact: true })`** — default `getByLabel` does substring
  matching, so `'Password'` also matched the "Toggle password visibility" button
  and caused a strict-mode violation. Exact matching fixed it (a real debugging
  story).
- **Custom fixtures** to inject page objects and keep tests clean.
- **Data-driven invalid tests** with PRD traceability.
- **Credential safety** — `dotenv` `override: false`; `.env` is never changed,
  committed or logged; `.gitignore` excludes `.env` and `.commandcode`.
- **Anti-hallucination** — every locator/assertion verified on the live app
  before coding; documented in `docs/VERIFICATION.md`.
- **Reporting** — Allure + HTML; multi-browser projects (`chromium`/`chrome`/`edge`).
- **Determinism** — `workers: 1` and `fullyParallel: false` because a single
  shared account must not authenticate concurrently.
- **Environment gotcha** — the bundled Playwright Chromium could not open a
  headed window in this environment, so headed runs use the system Chrome project.
