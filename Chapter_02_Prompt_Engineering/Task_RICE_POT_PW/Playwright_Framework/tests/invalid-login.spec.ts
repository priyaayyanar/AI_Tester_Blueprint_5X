import { expect, test } from '../src/fixtures/test.fixtures';
import { EXPECTED, URL_PATTERNS } from '../src/utils/constants';
import { annotate } from '../src/utils/allure';
import { INVALID_LOGIN_SCENARIOS } from '../src/test-data/login.data';

/**
 * Invalid login scenarios for the VWO login application.
 *
 * Verified behaviour: every failed attempt (unknown email, wrong password,
 * malformed email, empty fields) keeps the user on #/login and shows the same
 * generic, non-enumerating message:
 *   "Your email, password, IP address or location did not match"
 */
test.describe('VWO Login - Invalid scenarios', () => {
  for (const scenario of INVALID_LOGIN_SCENARIOS) {
    test(
      `${scenario.id}: ${scenario.title}`,
      { tag: ['@invalid', '@regression'] },
      async ({ loginPage, dashboardPage, page }) => {
        annotate({
          epic: 'VWO Authentication',
          feature: 'Login',
          severity: 'critical',
          story: 'Invalid credentials',
        });
        test.info().annotations.push({ type: 'requirement', description: scenario.prdReference });

        await loginPage.open();
        await loginPage.enterEmail(scenario.email);
        await loginPage.enterPassword(scenario.password);
        await loginPage.clickSignIn();

        await loginPage.waitForError();
        expect(await loginPage.getErrorMessage()).toBe(EXPECTED.INVALID_CREDENTIALS_MESSAGE);

        // The user must remain on the login page and never reach the dashboard.
        await expect(page).toHaveURL(URL_PATTERNS.LOGIN);
        await expect(page).not.toHaveURL(URL_PATTERNS.DASHBOARD);
        await expect(loginPage.emailInput).toBeVisible();
        expect(await dashboardPage.isDisplayed()).toBe(false);
      },
    );
  }
});
