import { expect, Locator, Page } from '@playwright/test';
import { env } from '../config/environment';
import { EXPECTED, SELECTORS, URL_PATTERNS } from '../utils/constants';
import { BasePage } from './BasePage';

/**
 * Page Object for the authenticated VWO dashboard reached after a successful
 * login: https://app.wingify.com/#/dashboard?accountId=<id>
 *
 * The dashboard is the post-authentication landing surface described in the
 * PRD ("Seamless transition to main dashboard after successful authentication").
 */
export class DashboardPage extends BasePage {
  /** Navigation link unique to the authenticated shell. */
  readonly campaignsOverviewLink: Locator;
  /** Login email field - used to prove the login form is gone. */
  readonly loginEmailInput: Locator;

  constructor(page: Page) {
    super(page);
    this.campaignsOverviewLink = page.getByRole('link', { name: EXPECTED.DASHBOARD_LINK });
    this.loginEmailInput = page.locator(SELECTORS.EMAIL_INPUT);
  }

  /** Waits until the dashboard route is active and the shell has rendered. */
  async waitForLoad(): Promise<this> {
    await this.waitForUrl(URL_PATTERNS.DASHBOARD);
    await expect(this.campaignsOverviewLink).toBeVisible({ timeout: env.navigationTimeoutMs });
    return this;
  }

  /** Non-throwing check used by negative tests to confirm no navigation occurred. */
  async isDisplayed(): Promise<boolean> {
    return URL_PATTERNS.DASHBOARD.test(this.currentUrl()) && (await this.isVisible(this.campaignsOverviewLink));
  }

  /** True when the authentication error notification is not visible. */
  async hasNoAuthError(): Promise<boolean> {
    return this.page.locator(SELECTORS.NOTIFICATION_BOX).isHidden();
  }
}
