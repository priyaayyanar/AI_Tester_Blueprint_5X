import { test } from '@playwright/test';

type Severity = 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial';

export interface AllureMeta {
  epic?: string;
  feature?: string;
  story?: string;
  severity?: Severity;
  owner?: string;
}

/**
 * Attaches Allure labels to the current test through Playwright annotations.
 * Keeps reporting metadata declarative and in one place.
 */
export function annotate(meta: AllureMeta): void {
  const info = test.info();
  if (meta.epic) {
    info.annotations.push({ type: 'epic', description: meta.epic });
  }
  if (meta.feature) {
    info.annotations.push({ type: 'feature', description: meta.feature });
  }
  if (meta.story) {
    info.annotations.push({ type: 'story', description: meta.story });
  }
  if (meta.severity) {
    info.annotations.push({ type: 'severity', description: meta.severity });
  }
  if (meta.owner) {
    info.annotations.push({ type: 'owner', description: meta.owner });
  }
}
