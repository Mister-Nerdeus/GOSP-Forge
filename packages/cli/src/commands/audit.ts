import { writeAuditReport } from '../audit/auditReport.js';
import { FoundationRequiredFiles } from '../audit/foundationRequiredFiles.js';
import { scanNoProfessionalClaims } from '../audit/noProfessionalClaimScanner.js';
export function auditCommand(name: string) {
  const files =
    name === 'clean-water'
      ? [
          'examples/projects/automated-water-filter.project-v2.json',
          'docs/audits/CLEAN_WATER_VERTICAL_SLICE_AUDIT.md',
        ]
      : FoundationRequiredFiles;
  const report = writeAuditReport(name, files, {
    writeArtifacts: process.env.GOSP_WRITE_AUDIT_ARTIFACTS === '1',
  });
  const claimScan = scanNoProfessionalClaims();
  const ok = report.ok && claimScan.ok;
  return {
    ...report,
    ok,
    decision: ok ? 'GO' : 'NO-GO',
    claimScan,
  };
}
