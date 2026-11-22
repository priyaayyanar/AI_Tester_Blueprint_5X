# Verification Log (Anti-Hallucination Rules)

This document records the facts that were **verified against the live VWO login
application** (`https://app.wingify.com/#/login`) on **2026-11-22** before any
Playwright locator or assertion was written. It follows the output format
required by `../../anti-hallucination.rules.md`.

## Verified Facts

Sources: the supplied PRD, the shared `.env`, and live inspection of the running
application (headless Playwright probes).

### Application / routes
- Login page title: `Login - Wingify`; route: `#/login`.
- Successful login redirects to `https://app.wingify.com/#/dashboard?accountId=<id>`
  with title `Dashboard`.

### Login form elements (all inside `form#js-login-form`)
| Element        | Locator                                | Verified attributes                          |
| -------------- | -------------------------------------- | -------------------------------------------- |
| Email input    | `getByLabel('Email address', exact)`   | `type=email`, `placeholder="Enter email ID"` |
| Password input | `getByLabel('Password', exact)`        | `type=password`, `placeholder="Enter password"` |
| Sign in button | `getByRole('button', { name: 'Sign in' })` | `type=submit`, id `#js-login-btn`        |
| Remember me    | `label[for="checkbox-remember"]` (visible) toggles hidden `#checkbox-remember` | custom control |

- The page also contains hidden forms (`#js-password-reset-form`,
  `#js-forgot-password-form`, `#js-sso-form`) that reuse the same labels and
  placeholders — hence all locators are scoped to `#js-login-form`.

### Failure behaviour
- Failed login shows a notification: `#js-notification-box-msg` with the exact
  text `Your email, password, IP address or location did not match`.
- The same generic message is shown for: incorrect password, unknown email,
  malformed email, empty email, empty password, and both fields empty. The URL
  stays on `#/login` in every case (no user enumeration).
- Note: the "Toggle password visibility" button has accessible name
  `Toggle password visibility`, so password/email labels must be matched exactly
  to avoid a strict-mode collision.

### Remember me
- Initial state is unchecked; clicking the visible label toggles the input to
  `checked`.

## Missing / Unknown Information

- **Inference (low confidence):** the "Remember me" checkbox is only verified to
  be *settable*; its session-persistence behaviour (surviving a browser restart)
  was **not** exercised and is therefore not asserted.
- 2FA, SSO (`SAML/OAuth`), social login and password-reset flows appear in the PRD
  but were **not** in scope and were **not** automated. Their elements were not
  verified.
- The exact rate-limiting thresholds for repeated failed logins were not
  determined.

## Generated Output

- `src/pages/LoginPage.ts`, `src/pages/DashboardPage.ts`, `src/pages/BasePage.ts`
  — Page Object Model.
- `tests/valid-login.spec.ts` — valid login scenarios (VAL-01..VAL-03).
- `tests/invalid-login.spec.ts` — invalid login scenarios (INV-01..INV-06).
- Supporting framework files: `playwright.config.ts`, `tsconfig.json`,
  `package.json`, `src/config/environment.ts`, `src/fixtures/test.fixtures.ts`,
  `src/test-data/login.data.ts`, `src/utils/*`.

## Self-Validation Check

- Every locator above maps 1:1 to a verified fact; none were invented.
- Every assertion in the two specs is traceable to a verified fact or a PRD
  requirement (see traceability table in `../README.md`).
- Suite executed against the live app: **9/9 passed headless** and
  **9/9 passed headed** (system Chrome).
```
