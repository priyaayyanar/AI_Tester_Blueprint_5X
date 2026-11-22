import { expect, Locator, Page } from '@playwright/test';
import { env } from '../config/environment';

/**
 * Base class for all page objects. Provides navigation, waiting and read
 * helpers that every page shares. Page objects never assert credentials and
 * never log sensitive values.
 */
export abstract class BasePage {
  protected readonly page: Page;

  protected constructor(page: Page) {
    this.page = page;
  }

  /** Navigates to an absolute URL and waits for the DOM to be ready. */
  async goto(url: string): Promise<void> {
    await this.page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: env.navigationTimeoutMs,
    });
  }

  /** Opens the application base URL (the login page). */
  async openBaseUrl(): Promise<void> {
    await this.goto(env.baseUrl);
  }

  /** Waits until the current URL matches the supplied pattern. */
  async waitForUrl(pattern: RegExp): Promise<void> {
    await this.page.waitForURL(pattern, { timeout: env.navigationTimeoutMs });
  }

  /** Returns the current page URL. */
  currentUrl(): string {
    return this.page.url();
  }

  /** Non-throwing visibility check. */
  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible().catch(() => false);
  }

  /** Trimmed text content (empty string when the element has no text). */
  async getText(locator: Locator): Promise<string> {
    const text = await locator.textContent();
    return (text ?? '').trim();
  }

  /** Waits for an element to become visible. */
  async waitForVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible({ timeout: env.actionTimeoutMs });
  }
}
