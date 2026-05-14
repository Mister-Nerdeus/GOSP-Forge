import { ProjectManifestV2Schema } from '@gosp/contracts';
import { buildBomFromProject, estimateTotals, lifecycleCost } from '@gosp/estimation';
import { readJsonFile } from '../exampleRegistry.js';
import { resolveProjectRefs } from '../refResolver.js';

export function estimateCommand(file: string) {
  const project = ProjectManifestV2Schema.parse(readJsonFile(file));
  const resolvedRefs = resolveProjectRefs(project);
  if (resolvedRefs.errors.length > 0) {
    return { ok: false, errors: resolvedRefs.errors, warnings: resolvedRefs.warnings };
  }

  const bom = buildBomFromProject({ refs: resolvedRefs.documents });
  const totals = estimateTotals(
    bom.lines.map((line) => ({ id: line.id, quantity: line.quantity, unitCost: 0 })),
  );
  return {
    ok: true,
    bom,
    refs: {
      warnings: resolvedRefs.warnings,
    },
    totals,
    lifecycle: lifecycleCost({
      horizonYears: 3,
      annualMaintenance: 12,
      replacementCost: 8,
      replacementIntervalYears: 1,
    }),
  };
}
