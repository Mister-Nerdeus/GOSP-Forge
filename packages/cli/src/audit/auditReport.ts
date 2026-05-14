import fs from 'node:fs';
import path from 'node:path';
import { resolveRepoPath } from '../exampleRegistry.js';
import type { FoundationRequiredFile } from './foundationRequiredFiles.js';

type AuditFileInput = string | FoundationRequiredFile;

function normalizeFile(input: AuditFileInput): FoundationRequiredFile {
  return typeof input === 'string' ? { file: input, required: true } : input;
}

export function writeAuditReport(name: string, files: AuditFileInput[]) {
  const checks = files.map((input) => {
    const item = normalizeFile(input);
    const exists = fs.existsSync(resolveRepoPath(item.file));
    const status = !exists && item.required ? 'fail' : !exists || item.placeholder ? 'warn' : 'pass';
    return {
      file: item.file,
      required: item.required,
      exists,
      status,
      note: item.note,
    };
  });
  const counts = {
    pass: checks.filter((check) => check.status === 'pass').length,
    warn: checks.filter((check) => check.status === 'warn').length,
    fail: checks.filter((check) => check.status === 'fail').length,
  };
  const go = counts.fail === 0;
  const report = {
    ok: go,
    name,
    decision: go ? 'GO' : 'NO-GO',
    counts,
    checks,
    generatedAt: new Date().toISOString(),
  };
  const dir = resolveRepoPath(path.join('artifacts', 'batches', name));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'audit.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(
    path.join(dir, 'audit.md'),
    [
      '# ' + name + ' Audit',
      '',
      'Decision: ' + report.decision,
      '',
      `Pass: ${counts.pass}`,
      `Warn: ${counts.warn}`,
      `Fail: ${counts.fail}`,
      '',
    ].join('\n'),
  );
  return report;
}
