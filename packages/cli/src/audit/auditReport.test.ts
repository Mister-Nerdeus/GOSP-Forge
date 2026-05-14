import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { resolveRepoPath } from '../exampleRegistry.js';
import { writeAuditReport } from './auditReport.js';

const testAuditName = '.tmp-audit-readonly-test';
const testAuditDir = resolveRepoPath(path.join('artifacts', 'batches', testAuditName));

afterEach(() => {
  fs.rmSync(testAuditDir, { recursive: true, force: true });
});

describe('audit reports', () => {
  it('returns machine-readable checks without writing artifacts by default', () => {
    fs.rmSync(testAuditDir, { recursive: true, force: true });

    const report = writeAuditReport(testAuditName, ['README.md']);

    expect(report.ok).toBe(true);
    expect(report.counts.pass).toBe(1);
    expect(fs.existsSync(testAuditDir)).toBe(false);
  });

  it('can write artifacts when explicitly requested', () => {
    const report = writeAuditReport(testAuditName, ['README.md'], { writeArtifacts: true });

    expect(report.ok).toBe(true);
    expect(fs.existsSync(path.join(testAuditDir, 'audit.json'))).toBe(true);
    expect(fs.existsSync(path.join(testAuditDir, 'audit.md'))).toBe(true);
  });
});
