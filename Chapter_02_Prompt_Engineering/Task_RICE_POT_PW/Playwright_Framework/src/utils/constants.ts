/**
 * Constants hold only facts verified against the live VWO login application on
 * 2026-11-22 (see docs/VERIFICATION.md). No values are invented.
 */

/** Hash-based routes observed on https://app.wingify.com. */
export const ROUTES = {
  LOGIN: '#/login',
  DASHBOARD: '#/dashboard',
} as const;

/** URL patterns asserted by the tests. */
export const URL_PATTERNS = {
  LOGIN: /#\/login/,
  DASHBOARD: /#\/dashboard/,
} as const;

/** Exact strings observed in the live application. */
export const EXPECTED = {
  LOGIN_PAGE_TITLE: 'Login - Wingify',
  DASHBOARD_PAGE_TITLE: 'Dashboard',
  /** Generic, non-enumerating message shown for every failed login attempt. */
  INVALID_CREDENTIALS_MESSAGE: 'Your email, password, IP address or location did not match',
  SIGN_IN_BUTTON: 'Sign in',
  EMAIL_LABEL: 'Email address',
  EMAIL_PLACEHOLDER: 'Enter email ID',
  PASSWORD_LABEL: 'Password',
  PASSWORD_PLACEHOLDER: 'Enter password',
  DASHBOARD_LINK: 'Campaigns Overview',
} as const;

/** Stable DOM ids verified on the login page. */
export const SELECTORS = {
  LOGIN_FORM: '#js-login-form',
  EMAIL_INPUT: '#login-username',
  PASSWORD_INPUT: '#login-password',
  REMEMBER_ME_INPUT: '#checkbox-remember',
  REMEMBER_ME_LABEL: 'label[for="checkbox-remember"]',
  SIGN_IN_BUTTON: '#js-login-btn',
  NOTIFICATION_BOX: '#js-notification-box-msg',
} as const;
