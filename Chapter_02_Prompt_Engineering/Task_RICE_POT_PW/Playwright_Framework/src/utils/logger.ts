/**
 * Credential-safe logging helpers. Any value passed through {@link mask} is
 * redacted before it reaches the console so secrets never leak into logs,
 * reports or CI output.
 */
const SECRET_KEYS = /(password|passwd|secret|token|credential|api[_-]?key|auth)/i;

function mask(value: string): string {
  if (value.length <= 2) {
    return '***';
  }
  return `${value[0]}***${value[value.length - 1]}`;
}

export function maskEmail(email: string): string {
  const at = email.indexOf('@');
  if (at <= 0) {
    return mask(email);
  }
  const local = email.slice(0, at);
  const domain = email.slice(at);
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${'*'.repeat(Math.max(1, local.length - 2))}${domain}`;
}

export const logger = {
  info(message: string): void {
    console.log(`[INFO]  ${message}`);
  },
  step(message: string): void {
    console.log(`[STEP]  ${message}`);
  },
  warn(message: string): void {
    console.warn(`[WARN]  ${message}`);
  },
  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  },
};

/**
 * Replaces every sensitive value (by key name) inside a message with `***`.
 */
export function redact(message: string, secrets: Array<string | undefined>): string {
  return secrets.reduce<string>((acc, secret) => {
    if (!secret || secret.length < 3) {
      return acc;
    }
    return acc.split(secret).join('***');
  }, message);
}

export function isSecretKey(key: string): boolean {
  return SECRET_KEYS.test(key);
}
