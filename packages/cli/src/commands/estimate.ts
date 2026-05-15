import { ProjectManifestV2Schema } from '@gosp/contracts';
import { estimateFromProject, evaluateEstimateModeGate } from '@gosp/estimation';
import { readJsonFile } from '../exampleRegistry.js';
import { resolveProjectRefs } from '../refResolver.js';

export function estimateCommand(file: string) {
  const project = ProjectManifestV2Schema.parse(readJsonFile(file));
  const resolvedRefs = resolveProjectRefs(project);
  if (resolvedRefs.errors.length > 0) {
    return { ok: false, errors: resolvedRefs.errors, warnings: resolvedRefs.warnings };
  }

  const result = estimateFromProject({ projectId: project.id, refs: resolvedRefs.documents });
  const modeGate = evaluateEstimateModeGate({
    mode: project.mode,
    qualityReport: result.qualityReport,
  });
  return {
    ok: modeGate.ok,
    bom: result.bom,
    refs: {
      warnings: resolvedRefs.warnings,
    },
    totals: result.totals,
    lifecycle: result.lifecycle,
    qualityReport: result.qualityReport,
    modeGate,
    estimate: result.estimate,
    envelope: result.envelope,
    warnings: result.warnings,
  };
}
