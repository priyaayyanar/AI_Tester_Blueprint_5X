import { env } from '../config/environment';

/**
 * Invalid-login scenarios. Every scenario was reproduced against the live
 * application on 2026-11-22 and returns the same generic message, so the
 * expected result is shared (see docs/VERIFICATION.md).
 *
 * `prdReference` links each case to the requirement it covers so the suite
 * stays traceable to the supplied PRD.
 */
export interface InvalidLoginScenario {
  id: string;
  title: string;
  email: string;
  password: string;
  prdReference: string;
}

export const INVALID_LOGIN_SCENARIOS: readonly InvalidLoginScenario[] = [
  {
    id: 'INV-01',
    title: 'registered email with an incorrect password is rejected',
    email: env.credentials.username,
    password: 'IncorrectPassword@123',
    prdReference: 'PRD - Functional Requirements > Authentication System > Login Process',
  },
  {
    id: 'INV-02',
    title: 'unknown email with any password is rejected',
    email: 'invalid.user@example.com',
    password: 'WrongPassword@123',
    prdReference: 'PRD - Functional Requirements > Authentication System > Login Process',
  },
  {
    id: 'INV-03',
    title: 'malformed email format is rejected',
    email: 'not-an-email',
    password: 'SomePassword@123',
    prdReference: 'PRD - Functional Requirements > User Input Validation > Email Format Verification',
  },
  {
    id: 'INV-04',
    title: 'empty email is rejected',
    email: '',
    password: 'SomePassword@123',
    prdReference: 'PRD - Functional Requirements > User Input Validation > Real-time Validation',
  },
  {
    id: 'INV-05',
    title: 'empty password is rejected',
    email: 'invalid.user@example.com',
    password: '',
    prdReference: 'PRD - Functional Requirements > User Input Validation > Real-time Validation',
  },
  {
    id: 'INV-06',
    title: 'empty email and password is rejected',
    email: '',
    password: '',
    prdReference: 'PRD - Functional Requirements > User Input Validation > Real-time Validation',
  },
];

/** Valid-login scenario identifiers, all backed by live behaviour. */
export const VALID_SCENARIOS = {
  STANDARD: 'VAL-01',
  REMEMBER_ME: 'VAL-02',
  CONTROLS: 'VAL-03',
} as const;
