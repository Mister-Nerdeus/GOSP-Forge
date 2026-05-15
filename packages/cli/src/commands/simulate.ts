import { ProjectManifestV2Schema } from '@gosp/contracts';
import {
  compileCleanWaterInput,
  createSimulationRunEnvelope,
  generateModuleScorecards,
  generateSystemScorecard,
  simulatePowerFlow,
  simulateWaterFlow,
} from '@gosp/sim-core';
import { readJsonFile } from '../exampleRegistry.js';
import { resolveProjectRefs } from '../refResolver.js';

const cleanWaterScoringProfile = {
  id: 'clean-water-scoring-profile',
  version: '0.1.0',
  sponsorNeutral: true as const,
  components: [
    { id: 'clean-water-volume', weight: 0.45 },
    { id: 'power-compatibility', weight: 0.25 },
    { id: 'confidence', weight: 0.2 },
    { id: 'warning-penalty', weight: 0.1 },
  ],
};

export function simulateCommand(file: string) {
  const project = ProjectManifestV2Schema.parse(readJsonFile(file));
  const resolvedRefs = resolveProjectRefs(project);
  if (resolvedRefs.errors.length > 0) {
    return { ok: false, errors: resolvedRefs.errors, warnings: resolvedRefs.warnings };
  }

  const input = compileCleanWaterInput(project, resolvedRefs.documents);
  const flow = simulateWaterFlow(input.water);
  const power = simulatePowerFlow(input.powerSource, input.powerLoads);
  const warnings = [...input.warnings, ...flow.warnings];
  const moduleScorecards = generateModuleScorecards({
    moduleIds: input.moduleIds,
    profileId: cleanWaterScoringProfile.id,
    warnings,
    defaultedInputs: input.defaultedInputs,
  });
  const systemScorecard = generateSystemScorecard({
    projectId: input.projectId,
    profile: cleanWaterScoringProfile,
    flow,
    power,
    confidenceLevel: input.confidence.level,
    warningCount: warnings.length,
    moduleScorecards,
  });
  const scorecards = {
    modules: moduleScorecards,
    system: systemScorecard,
  };

  return {
    ok: true,
    input,
    flow,
    power,
    scorecards,
    envelope: createSimulationRunEnvelope({
      runId: 'clean-water-run-v0',
      projectId: input.projectId,
      moduleIds: input.moduleIds,
      modelVersion: '0.1.0',
      assumptions: [{ id: 'clean-water.no-potable-claim', description: 'No potable-water claim.' }],
      output: { flow, power, scorecards },
      warnings,
      unknownInputs: input.unknownInputs,
      defaultedInputs: input.defaultedInputs,
      knownInputs: input.knownInputs,
      confidence: input.confidence,
    }),
  };
}
