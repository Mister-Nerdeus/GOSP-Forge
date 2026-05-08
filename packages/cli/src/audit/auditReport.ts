import fs from 'node:fs';
import path from 'node:path';
import { resolveRepoPath } from '../exampleRegistry.js';
import { claimCheck } from './claimCheck.js';
export function writeAuditReport(name: string, files: string[]) {
  const checks = claimCheck(files);
  const go = checks.every((check) => check.exists);
  const report = { name, decision: go ? 'GO' : 'NO-GO', checks, generatedAt: new Date().toISOString() };
  const dir = resolveRepoPath(path.join('artifacts', 'batches', name));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'audit.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(dir, 'audit.md'), '# ' + name + ' Audit\n\nDecision: ' + report.decision + '\n');
  return report;
}
