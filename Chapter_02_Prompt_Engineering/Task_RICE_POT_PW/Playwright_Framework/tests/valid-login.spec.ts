import { expect, test } from '../src/fixtures/test.fixtures';
import { env } from '../src/config/environment';
import { EXPECTED, URL_PATTERNS } from '../src/utils/constants';
import { annotate } from '../src/utils/allure';
import { VALID_SCENARIOS } from '../src/test-data/login.data';

/**
 * Valid login scenarios for the VWO login application.
 * Traceable to the supplied PRD (Authentication System > Login Process) and to
 * behaviour verified against the live application.
 */
test.describe('VWO Login - Valid scenarios', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test(
    `${VALID_SCENARIOS.CONTROLS}: login page exposes the required controls`,
    { tag: ['@smoke', '@valid'] },
    async ({ loginPage }) => {
      annotate({ epic: 'VWO Authentication', feature: 'Login', severity: 'normal', story: 'Login page rendering' });

      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.emailInput).toHaveAttribute('type', 'email');
      await expect(loginPage.emailInput).toHaveAttribute('placeholder', EXPECTED.EMAIL_PLACEHOLDER);
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
      await expect(loginPage.signInButton).toBeVisible();
      await expect(loginPage.rememberMeLabel).toBeVisible();
    },
  );

  test(
    `${VALID_SCENARIOS.STANDARD}: valid credentials authenticate and land on the dashboard`,
    { tag: ['@smoke', '@valid'] },
    async ({ loginPage, dashboardPage, page }) => {
      annotate({ epic: 'VWO Authentication', feature: 'Login', severity: 'blocker', story: 'Valid credentials' });

      await loginPage.login(env.credentials);
      await dashboardPage.waitForLoad();

      await expect(page).toHaveURL(URL_PATTERNS.DASHBOARD);
      await expect(page).toHaveTitle(EXPECTED.DASHBOARD_PAGE_TITLE);
      await expect(dashboardPage.campaignsOverviewLink).toBeVisible();
      await expect(loginPage.emailInput).toBeHidden();
      await expect(loginPage.errorNotification).toBeHidden();
    },
  );

  test(
    `${VALID_SCENARIOS.REMEMBER_ME}: Remember me can be selected and login still succeeds`,
    { tag: ['@valid', '@regression'] },
    async ({ loginPage, dashboardPage, page }) => {
      annotate({ epic: 'VWO Authentication', feature: 'Login', severity: 'critical', story: 'Remember me' });

      await loginPage.setRememberMe(true);
      expect(await loginPage.isRememberMeChecked()).toBe(true);

      await loginPage.login(env.credentials);
      await dashboardPage.waitForLoad();

      await expect(page).toHaveURL(URL_PATTERNS.DASHBOARD);
      await expect(dashboardPage.campaignsOverviewLink).toBeVisible();
    },
  );
});
