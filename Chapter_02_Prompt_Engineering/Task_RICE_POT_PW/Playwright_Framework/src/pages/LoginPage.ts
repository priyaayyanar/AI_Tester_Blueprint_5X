import { expect, Locator, Page } from '@playwright/test';
import { Credentials, env } from '../config/environment';
import { EXPECTED, SELECTORS } from '../utils/constants';
import { maskEmail } from '../utils/logger';
import { BasePage } from './BasePage';

/**
 * Page Object for the VWO (Wingify) login page:
 * https://app.wingify.com/#/login
 *
 * Locators are scoped to the visible login form (`#js-login-form`) because the
 * page also renders hidden password-reset, forgot-password and SSO forms that
 * reuse the same labels/placeholders.
 *
 * All locators and expected strings were verified against the live application
 * (see docs/VERIFICATION.md).
 */
export class LoginPage extends BasePage {
  private readonly form: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly rememberMeLabel: Locator;
  readonly forgotPasswordButton: Locator;
  readonly errorNotification: Locator;

  constructor(page: Page) {
    super(page);
    this.form = page.locator(SELECTORS.LOGIN_FORM);
    this.emailInput = this.form.getByLabel(EXPECTED.EMAIL_LABEL, { exact: true });
    this.passwordInput = this.form.getByLabel(EXPECTED.PASSWORD_LABEL, { exact: true });
    this.signInButton = this.form.getByRole('button', { name: EXPECTED.SIGN_IN_BUTTON, exact: true });
    this.rememberMeCheckbox = this.form.locator(SELECTORS.REMEMBER_ME_INPUT);
    this.rememberMeLabel = this.form.locator(SELECTORS.REMEMBER_ME_LABEL);
    this.forgotPasswordButton = this.form.getByRole('button', { name: 'Forgot Password?' });
    this.errorNotification = page.locator(SELECTORS.NOTIFICATION_BOX);
  }

  /** Opens the login page and waits for the email field to be ready. */
  async open(): Promise<this> {
    await this.openBaseUrl();
    await expect(this.emailInput).toBeVisible({ timeout: env.navigationTimeoutMs });
    return this;
  }

  async enterEmail(email: string): Promise<this> {
    await this.emailInput.fill(email);
    return this;
  }

  async enterPassword(password: string): Promise<this> {
    await this.passwordInput.fill(password);
    return this;
  }

  async clickSignIn(): Promise<this> {
    await this.signInButton.click();
    return this;
  }

  /**
   * Sets the "Remember me" checkbox to the requested state. The native input is
   * visually hidden (custom control), so the visible label is clicked instead.
   */
  async setRememberMe(checked: boolean): Promise<this> {
    const current = await this.rememberMeCheckbox.isChecked();
    if (current !== checked) {
      await this.rememberMeLabel.click();
    }
    return this;
  }

  async isRememberMeChecked(): Promise<boolean> {
    return this.rememberMeCheckbox.isChecked();
  }

  /**
   * Performs a full login. Credentials are never logged.
   */
  async login(credentials: Credentials): Promise<this> {
    await this.enterEmail(credentials.username);
    await this.enterPassword(credentials.password);
    await this.clickSignIn();
    return this;
  }

  /** Waits for the authentication error notification to appear. */
  async waitForError(): Promise<this> {
    await expect(this.errorNotification).toBeVisible();
    return this;
  }

  /** Reads the trimmed authentication error message. */
  async getErrorMessage(): Promise<string> {
    await this.waitForError();
    return this.getText(this.errorNotification);
  }

  /** Returns true when the login form (email field) is no longer visible. */
  async isLoginFormHidden(): Promise<boolean> {
    return this.emailInput.isHidden();
  }

  /** Human-readable, credential-free label used in log messages. */
  static describeEmail(email: string): string {
    return maskEmail(email);
  }
}
