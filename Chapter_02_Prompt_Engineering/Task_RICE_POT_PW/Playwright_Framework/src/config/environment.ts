import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

/**
 * Loads the `.env` file that lives in the `Task_RICE_POT_PW` folder (the parent
 * of this Playwright_Framework directory). Several candidate locations are
 * tried so the framework works regardless of the current working directory.
 */
function resolveEnvFile(): string {
  const candidates = [
    path.resolve(__dirname, '..', '..', '..', '.env'), // src/config -> Task_RICE_POT_PW/.env
    path.resolve(process.cwd(), '..', '.env'), // run from Playwright_Framework
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '..', '..', '.env'),
  ];

  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) {
    throw new Error(
      'Unable to locate the .env file. Create it in the Task_RICE_POT_PW folder ' +
        `(expected at: ${candidates[0]}).`,
    );
  }
  return found;
}

dotenv.config({ path: resolveEnvFile(), override: false });

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(
      `Missing required environment variable "${name}". Add it to the .env file in the Task_RICE_POT_PW folder.`,
    );
  }
  return value.trim();
}

function optionalNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw || raw.trim().length === 0) {
    return fallback;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function optionalBoolean(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (!raw || raw.trim().length === 0) {
    return fallback;
  }
  return raw.trim().toLowerCase() === 'true';
}

export interface Credentials {
  username: string;
  password: string;
}

export interface EnvConfig {
  baseUrl: string;
  credentials: Credentials;
  headless: boolean;
  actionTimeoutMs: number;
  navigationTimeoutMs: number;
}

export const env: EnvConfig = {
  baseUrl: required('BASE_URL'),
  credentials: {
    username: required('VWO_USERNAME'),
    password: required('VWO_PASSWORD'),
  },
  headless: optionalBoolean('HEADLESS', true),
  actionTimeoutMs: optionalNumber('ACTION_TIMEOUT_MS', 15000),
  navigationTimeoutMs: optionalNumber('NAVIGATION_TIMEOUT_MS', 30000),
};
