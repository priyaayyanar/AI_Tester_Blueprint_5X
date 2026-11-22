import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/environment';

/**
 * Central Playwright configuration.
 * - Credentials/URL come from the .env file (never hardcoded here).
 * - Reporters: console list, HTML report and Allure.
 * - Traces/screenshots/videos are captured only on failure to keep runs clean.
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',

  /* Deterministic runs: the suite shares a single VWO account, so tests must
     not authenticate concurrently. */
  fullyParallel: false,
  workers: 1,

  /* Fail the build on CI if a test.only was accidentally committed. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  /* Reasonable, non-arbitrary timeouts for a real network application. */
  timeout: 60_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],

  use: {
    baseURL: env.baseUrl,
    headless: env.headless,
    actionTimeout: env.actionTimeoutMs,
    navigationTimeout: env.navigationTimeoutMs,
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    /* Bundled Playwright Chromium - default headless runs. */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    /* System-installed Google Chrome - reliable for headed runs. */
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    /* System-installed Microsoft Edge - alternative headed runner. */
    {
      name: 'edge',
      use: { ...devices['Desktop Chrome'], channel: 'msedge' },
    },
  ],
});
