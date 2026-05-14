import { ProjectManifestV2Schema } from '@gosp/contracts';
import {
  compileCleanWaterInput,
  createSimulationRunEnvelope,
  simulatePowerFlow,
  simulateWaterFlow,
} from '@gosp/sim-core';
import { readJsonFile } from '../exampleRegistry.js';
import { resolveProjectRefs } from '../refResolver.js';

export function simulateCommand(file: string) {
  const project = ProjectManifestV2Schema.parse(readJsonFile(file));
  const resolvedRefs = resolveProjectRefs(project);
  if (resolvedRefs.errors.length > 0) {
    return { ok: false, errors: resolvedRefs.errors, warnings: resolvedRefs.warnings };
  }

  const refs = resolvedRefs.resolved.map((ref) => ({ ...ref, value: readJsonFile(ref.path) }));
  const input = compileCleanWaterInput(project, refs);
  const flow = simulateWaterFlow(input.water);
  const power = simulatePowerFlow(input.powerSource, input.powerLoads);
  const warnings = [...input.warnings, ...flow.warnings];
  return {
    ok: true,
    input,
    flow,
    power,
    envelope: createSimulationRunEnvelope({
      runId: 'clean-water-run-v0',
      projectId: input.projectId,
      moduleIds: input.moduleIds,
      modelVersion: '0.1.0',
      assumptions: [{ id: 'clean-water.no-potable-claim', description: 'No potable-water claim.' }],
      output: { flow, power },
      warnings,
      unknownInputs: input.unknownInputs,
      defaultedInputs: input.defaultedInputs,
      confidence: input.confidence,
    }),
  };
}
