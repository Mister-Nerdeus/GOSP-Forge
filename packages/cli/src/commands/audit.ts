import { writeAuditReport } from '../audit/auditReport.js';
import { FoundationRequiredFiles } from '../audit/foundationRequiredFiles.js';
export function auditCommand(name: string) {
  const files =
    name === 'clean-water'
      ? [
          'examples/projects/automated-water-filter.project-v2.json',
          'docs/audits/CLEAN_WATER_VERTICAL_SLICE_AUDIT.md',
        ]
      : FoundationRequiredFiles;
  return writeAuditReport(name, files);
}
