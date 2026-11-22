# VWO Login - Playwright + TypeScript Automation Framework

Enterprise-level Playwright (TypeScript) automation framework built with the
Page Object Model to automate the **VWO / Wingify login** application
(`https://app.wingify.com/#/login`).

It was produced by applying the **RICE_POT** prompt
(`../PW_RISE_POT_Prompt.md`) under the **anti-hallucination rules**
(`../../anti-hallucination.rules.md`) against the supplied **VWO PRD**
(`../resources/Product Requirements Document_ VWO Login Dashboard.pdf`).

> Every locator, message and assertion in this framework was verified against
> the **live** application before it was written. See
> [`docs/VERIFICATION.md`](./docs/VERIFICATION.md) for the verified-facts log.

---

## Tech stack

| Concern            | Choice                                   |
| ------------------ | ---------------------------------------- |
| Language           | TypeScript (strict)                      |
| Test runner        | Playwright Test                          |
| Design pattern     | Page Object Model (POM)                  |
| Reporting          | Playwright HTML + Allure                 |
| Config / secrets   | `dotenv` (loads the shared `.env`)       |
| Browsers           | Bundled Chromium, system Chrome, Edge    |

## Prerequisites

- Node.js 18+ (developed on Node 24)
- Java 11+ — only needed to render the Allure HTML report (`allure generate`)

## Project structure

```
Playwright_Framework/
├── playwright.config.ts          # Runner, reporters, projects, timeouts
├── tsconfig.json                 # Strict TypeScript config
├── package.json                  # Dependencies & npm scripts
├── .env.example                  # Template (real .env lives one level up)
├── .gitignore                    # Excludes .env + all build artifacts
├── docs/
│   └── VERIFICATION.md           # Live-verification / anti-hallucination log
├── src/
│   ├── config/
│   │   └── environment.ts        # Loads & validates .env (no secrets logged)
│   ├── pages/
│   │   ├── BasePage.ts           # Shared navigation/wait/read helpers
│   │   ├── LoginPage.ts          # Login page object (POM)
│   │   └── DashboardPage.ts      # Post-login dashboard page object
│   ├── fixtures/
│   │   └── test.fixtures.ts      # Injects page objects into every test
│   ├── test-data/
│   │   └── login.data.ts         # Invalid/valid scenario datasets + PRD refs
│   └── utils/
│       ├── constants.ts          # Verified routes, messages, selectors
│       ├── logger.ts             # Credential-safe logging + masking
│       └── allure.ts             # Allure metadata helper
└── tests/
    ├── valid-login.spec.ts       # Valid login scenarios
    └── invalid-login.spec.ts     # Invalid login scenarios
```

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Install the bundled Chromium browser
npx playwright install chromium

# 3. Provide credentials
#    The framework loads the shared .env from the Task_RICE_POT_PW folder
#    (one level above this directory). Copy the template if it is missing:
#    ../.env  ->  BASE_URL, VWO_USERNAME, VWO_PASSWORD
```

Credentials are **never** hardcoded and are **never** logged, reported or
committed (`.env` is git-ignored at both the repo root and here).

## Running the tests

```bash
npm test              # Bundled Chromium, headless (default)
npm run test:headed   # System Chrome, headed  (visible browser)
npm run test:chrome   # System Chrome, headless
npm run test:edge     # System Edge, headless
npm run test:valid    # only the valid-login scenarios
npm run test:invalid  # only the invalid-login scenarios
npm run typecheck     # tsc --noEmit
```

### Browser projects

`playwright.config.ts` defines three projects:

| Project    | Browser                    | Best for                         |
| ---------- | -------------------------- | -------------------------------- |
| `chromium` | Playwright bundled Chromium| CI / headless                    |
| `chrome`   | System Google Chrome       | **Headed runs** (reliable here)  |
| `edge`     | System Microsoft Edge      | Alternative headed runner        |

> **Headed note:** in this environment the bundled Playwright Chromium build
> cannot open a headed window (the process exits on launch), so the headed
> scripts (`test:headed`) target the **system Chrome** project. When Chrome or
> Edge is not installed, run headless with `npm test`.

## Reports

- **Playwright HTML report:** written to `playwright-report/` (`npm run report:html`).
- **Allure:** results are written to `allure-results/` on every run.
  ```bash
  npm run allure:generate   # -> allure-report/index.html
  npm run allure:open       # open the generated report
  npm run allure:serve      # live-serve from allure-results
  ```

## Test scenarios

| ID        | Scenario                                                        | Type    | PRD traceability                                                     | Result |
| --------- | --------------------------------------------------------------- | ------- | -------------------------------------------------------------------- | :----: |
| VAL-03    | Login page exposes the required controls                        | Valid   | Functional Requirements > Authentication System > Login Process      | Pass   |
| VAL-01    | Valid credentials authenticate and land on the dashboard        | Valid   | Authentication System > Login Process; Integration > VWO Core Platform| Pass  |
| VAL-02    | Remember me can be selected and login still succeeds            | Valid   | Current State > Remember Me Functionality                            | Pass   |
| INV-01    | Registered email + incorrect password is rejected               | Invalid | Authentication System > Login Process                                | Pass   |
| INV-02    | Unknown email + any password is rejected                        | Invalid | Authentication System > Login Process                                | Pass   |
| INV-03    | Malformed email format is rejected                              | Invalid | User Input Validation > Email Format Verification                    | Pass   |
| INV-04    | Empty email is rejected                                         | Invalid | User Input Validation > Real-time Validation                         | Pass   |
| INV-05    | Empty password is rejected                                      | Invalid | User Input Validation > Real-time Validation                         | Pass   |
| INV-06    | Empty email and password is rejected                            | Invalid | User Input Validation > Real-time Validation                         | Pass   |

Last full run: **9/9 passed** headless and **9/9 passed** headed (system Chrome).

## Anti-hallucination compliance

- Scope limited to the PRD, the live application and the supplied `.env`.
- Only user-facing locators (`getByRole`, `getByLabel`, `getByPlaceholder`) plus
  a small number of stable DOM ids that were observed on the live page.
- No invented elements, messages or behaviour; the generic failure message and
  the dashboard landing route were captured from the running app.
- Full verified-facts / unknowns log: [`docs/VERIFICATION.md`](./docs/VERIFICATION.md).
