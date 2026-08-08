import { ProjectManifestV2Schema } from '@gosp/contracts';
import {
  CLEAN_WATER_SCORING_PROFILE,
  compileCleanWaterInput,
  createCleanWaterRepMaterialInput,
  createSimulationRunEnvelope,
  evaluateCleanWaterRep,
  generateModuleScorecards,
  generateSystemScorecard,
  simulatePowerFlow,
  simulateWaterFlow,
} from '@gosp/vertical-clean-water';
import { readJsonFile } from '../exampleRegistry.js';
import { resolveProjectRefs } from '../refResolver.js';

export function simulateCommand(file: string) {
  const project = ProjectManifestV2Schema.parse(readJsonFile(file));
  const resolvedRefs = resolveProjectRefs(project);
  if (resolvedRefs.errors.length > 0) {
    return { ok: false, errors: resolvedRefs.errors, warnings: resolvedRefs.warnings };
  }

  const input = compileCleanWaterInput(project, resolvedRefs.documents);
  const graphBlockers = input.warnings.filter(
    (warning) => warning.code === 'missing-required-clean-water-graph-node' && warning.severity === 'blocker',
  );
  if (graphBlockers.length > 0) {
    return { ok: false, errors: graphBlockers, warnings: input.warnings, input };
  }

  const flow = simulateWaterFlow(input.water);
  const power = simulatePowerFlow(input.powerSource, input.powerLoads);
  const warnings = [...input.warnings, ...flow.warnings];
  const moduleScorecards = generateModuleScorecards({
    moduleIds: input.moduleIds,
    profileId: CLEAN_WATER_SCORING_PROFILE.id,
    warnings,
    defaultedInputs: input.defaultedInputs,
  });
  const systemScorecard = generateSystemScorecard({
    projectId: input.projectId,
    profile: CLEAN_WATER_SCORING_PROFILE,
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
  const repMaterialInput = createCleanWaterRepMaterialInput({
    project,
    compiledInput: input,
    resolvedRefs: resolvedRefs.documents,
  });
  const repEvaluation = evaluateCleanWaterRep(repMaterialInput);

  return {
    ok: true,
    input,
    flow,
    power,
    scorecards,
    repEvaluation,
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
