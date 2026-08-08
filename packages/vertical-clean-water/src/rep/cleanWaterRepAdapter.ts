import { z } from 'zod';
import { RepMaterialInputSchema, type RepMaterialInput } from '@gosp/contracts';
import {
  canonicalJson,
  evaluateRep,
  loadSourceImplementationManifest,
  referenceRunnerIdentity,
  sha256,
  sourceImplementationIdentity,
  type RepEvaluatorOutput,
} from '@gosp/sim-core';
import { simulatePowerFlow } from '../cleanWater/powerFlowEngine.js';
import { simulateWaterFlow } from '../cleanWater/waterFlowEngine.js';
import { generateModuleScorecards } from '../scoring/moduleScorecardGenerator.js';
import { generateSystemScorecard } from '../scoring/systemScorecardGenerator.js';

export const CLEAN_WATER_SCORING_PROFILE = {
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

const WarningSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  severity: z.enum(['info', 'warning', 'blocker']),
});

const CleanWaterRepPayloadSchema = z.object({
  compiledInput: z.object({
    projectId: z.string().min(1),
    moduleIds: z.array(z.string().min(1)).min(1),
    water: z.object({
      sourceLiters: z.number().finite().nonnegative(),
      minutes: z.number().finite().nonnegative(),
      pumpFlowLpm: z.number().finite().nonnegative(),
      filterEfficiency: z.number().finite().min(0).max(1),
    }),
    powerSource: z.object({
      id: z.string().min(1),
      voltageV: z.number().finite().optional(),
      currentA: z.number().finite().optional(),
    }),
    powerLoads: z.array(
      z.object({
        id: z.string().min(1),
        voltageV: z.number().finite().optional(),
        currentA: z.number().finite().optional(),
      }),
    ),
    warnings: z.array(WarningSchema),
    defaultedInputs: z.array(z.string()),
    unknownInputs: z.array(z.string()),
    knownInputs: z.array(z.string()),
    confidence: z.object({
      level: z.enum(['low', 'medium', 'high', 'reviewed']),
      rationale: z.string().min(1),
    }),
  }),
  scoringProfile: z.object({
    id: z.string().min(1),
    version: z.string().min(1),
    sponsorNeutral: z.literal(true),
    components: z.array(z.object({ id: z.string().min(1), weight: z.number().finite() })).min(1),
  }),
});

const CLEAN_WATER_REP_CONTRACT_DESCRIPTOR = {
  id: 'gosp.vertical.clean-water.rep-contract',
  revision: '0.1.0',
  input: 'compiled Clean Water flow, power, confidence, warnings, module identities, and scoring profile',
  output: 'flow, power compatibility, module scorecards, and system scorecard',
} as const;

const CLEAN_WATER_SOLVER_DESCRIPTOR = {
  id: 'gosp.vertical.clean-water.screening-solver',
  revision: '0.1.0',
  fidelity: 'level-1-screening',
  arithmetic: 'ECMAScript Number binary64',
} as const;

export const CLEAN_WATER_SOLVER_SOURCE_PATHS = [
  'tsconfig.base.json',
  'packages/vertical-clean-water/tsconfig.json',
  'packages/sim-core/src/rep/sourceImplementationIdentity.ts',
  'packages/vertical-clean-water/src/rep/cleanWaterRepAdapter.ts',
  'packages/vertical-clean-water/src/cleanWater/waterFlowTypes.ts',
  'packages/vertical-clean-water/src/cleanWater/waterFlowEngine.ts',
  'packages/vertical-clean-water/src/cleanWater/powerCompatibility.ts',
  'packages/vertical-clean-water/src/cleanWater/powerFlowEngine.ts',
  'packages/vertical-clean-water/src/cleanWater/scoreCleanWater.ts',
  'packages/vertical-clean-water/src/scoring/moduleScorecardGenerator.ts',
  'packages/vertical-clean-water/src/scoring/systemScorecardGenerator.ts',
] as const;

const cleanWaterSolverSourceSpec = {
  kind: 'solver',
  id: CLEAN_WATER_SOLVER_DESCRIPTOR.id,
  revision: CLEAN_WATER_SOLVER_DESCRIPTOR.revision,
  sourcePaths: [...CLEAN_WATER_SOLVER_SOURCE_PATHS],
} as const;

export const cleanWaterSolverSourceManifest = () =>
  loadSourceImplementationManifest(cleanWaterSolverSourceSpec);

const artifactIdentity = (
  kind: 'contract' | 'component-data',
  id: string,
  revision: string,
  content: unknown,
) => ({ kind, id, revision, contentHash: sha256(canonicalJson(content)) });

type ResolvedRef = { id: string; kind: string; value: unknown };
type CompiledInput = z.infer<typeof CleanWaterRepPayloadSchema>['compiledInput'];

export function createCleanWaterRepMaterialInput(input: {
  project: { id: string; version: string };
  compiledInput: CompiledInput;
  resolvedRefs: ResolvedRef[];
}): RepMaterialInput {
  const contractIdentity = artifactIdentity(
    'contract',
    CLEAN_WATER_REP_CONTRACT_DESCRIPTOR.id,
    CLEAN_WATER_REP_CONTRACT_DESCRIPTOR.revision,
    CLEAN_WATER_REP_CONTRACT_DESCRIPTOR,
  );
  const solverIdentity = sourceImplementationIdentity(cleanWaterSolverSourceSpec);
  const componentData = input.resolvedRefs
    .map((ref) => {
      const value = ref.value as { version?: unknown };
      const revision = typeof value?.version === 'string' ? value.version : input.project.version;
      return artifactIdentity('component-data', `${ref.kind}.${ref.id}`, revision, ref.value);
    })
    .sort((left, right) => (left.id < right.id ? -1 : left.id > right.id ? 1 : 0));
  const provenance = { sources: [], method: 'derived' as const };
  const canonicalRef = (kind: string, id: string, revision = input.project.version) => ({
    kind,
    id,
    revision,
  });
  const modelId = 'model.clean-water.screening';
  const workflowId = 'workflow.clean-water.screening';
  const scenarioId = `scenario.${input.project.id}.compiled`;
  const challengeId = `challenge.${input.project.id}`;
  const submissionId = `submission.${input.project.id}.current`;
  const assumption = {
    id: 'assumption.clean-water.educational-screening',
    statement: 'The Clean Water result is an educational level-1 screening result only.',
    material: true,
  };

  return RepMaterialInputSchema.parse({
    repVersion: '0.1.0',
    challenge: {
      kind: 'Challenge',
      id: challengeId,
      revision: input.project.version,
      provenance,
      title: 'Clean Water educational screening evaluation',
      problemStatement: 'Evaluate the resolved Clean Water fixture without a potable-water claim.',
      evaluationModelRef: canonicalRef('Model', modelId, CLEAN_WATER_SOLVER_DESCRIPTOR.revision),
      workflowRef: canonicalRef('Workflow', workflowId, CLEAN_WATER_REP_CONTRACT_DESCRIPTOR.revision),
      permittedScenarioRefs: [canonicalRef('Scenario', scenarioId)],
      status: 'open',
    },
    submission: {
      kind: 'Submission',
      id: submissionId,
      revision: input.project.version,
      provenance,
      challengeRef: canonicalRef('Challenge', challengeId),
      scenarioRef: canonicalRef('Scenario', scenarioId),
      materialPayload: {
        compiledInput: input.compiledInput,
        scoringProfile: CLEAN_WATER_SCORING_PROFILE,
      },
      componentData,
      status: 'submitted',
    },
    compiledScenario: {
      kind: 'Scenario',
      id: scenarioId,
      revision: input.project.version,
      provenance,
      name: 'Compiled Clean Water scenario',
      systemElementRefs: input.compiledInput.moduleIds.map((id) =>
        canonicalRef('SystemElement', id),
      ),
      componentData,
      parameters: {
        water: input.compiledInput.water,
        powerSource: input.compiledInput.powerSource,
        powerLoads: input.compiledInput.powerLoads,
      },
      assumptions: [assumption],
      modelRef: canonicalRef('Model', modelId, CLEAN_WATER_SOLVER_DESCRIPTOR.revision),
      status: 'controlled',
    },
    model: {
      kind: 'Model',
      id: modelId,
      revision: CLEAN_WATER_SOLVER_DESCRIPTOR.revision,
      provenance,
      name: 'Clean Water level-1 screening model',
      modelType: 'reduced-order',
      fidelity: {
        level: 'rule-check',
        calibrationStatus: 'not-calibrated',
        limitations: [
          'Educational screening only.',
          'No potable-water certification or professional engineering claim.',
        ],
      },
      solver: solverIdentity,
      contractIdentities: [contractIdentity],
      assumptions: [assumption],
      status: 'active',
    },
    workflow: {
      kind: 'Workflow',
      id: workflowId,
      revision: CLEAN_WATER_REP_CONTRACT_DESCRIPTOR.revision,
      provenance,
      name: 'Clean Water screening workflow',
      steps: [
        { id: 'flow', name: 'Evaluate water flow', action: 'execute' },
        { id: 'power', name: 'Evaluate power compatibility', action: 'execute' },
        { id: 'score', name: 'Produce transparent scorecards', action: 'record' },
      ],
      status: 'active',
    },
    runner: referenceRunnerIdentity(),
    contractIdentities: [contractIdentity],
    componentData,
    materialAssumptions: [assumption],
    materialParameters: { vertical: 'clean-water', adapterRevision: '0.1.0' },
  });
}

function evaluateCleanWater(input: RepMaterialInput): RepEvaluatorOutput {
  const payload = CleanWaterRepPayloadSchema.parse(input.submission.materialPayload);
  const compiled = payload.compiledInput;
  const flow = simulateWaterFlow(compiled.water);
  const power = simulatePowerFlow(compiled.powerSource, compiled.powerLoads);
  const warnings = [...compiled.warnings, ...flow.warnings];
  const moduleScorecards = generateModuleScorecards({
    moduleIds: compiled.moduleIds,
    profileId: payload.scoringProfile.id,
    warnings,
    defaultedInputs: compiled.defaultedInputs,
  });
  const systemScorecard = generateSystemScorecard({
    projectId: compiled.projectId,
    profile: payload.scoringProfile,
    flow,
    power,
    confidenceLevel: compiled.confidence.level,
    warningCount: warnings.length,
    moduleScorecards,
  });
  const capacityLiters = compiled.water.pumpFlowLpm * compiled.water.minutes;

  return {
    result: { flow, power, scorecards: { modules: moduleScorecards, system: systemScorecard } },
    explainability: {
      explanation: 'The vertical adapter evaluates flow, power compatibility, and sponsor-neutral scorecards.',
      equations: [
        {
          id: 'clean-water.flow-screen',
          expression: 'cleanWaterLiters = min(sourceLiters, pumpFlowLpm * minutes) * filterEfficiency',
          description: 'Level-1 educational flow screening relationship.',
          variables: {
            sourceLiters: 'Available source volume.',
            pumpFlowLpm: 'Pump flow rate.',
            minutes: 'Run duration.',
            filterEfficiency: 'Educational filter efficiency assumption.',
          },
        },
      ],
      intermediateValues: [
        { id: 'pump-capacity-liters', value: capacityLiters, unit: 'L' },
        { id: 'clean-water-liters', value: flow.cleanWaterLiters, unit: 'L' },
      ],
      modelInspection: {
        assumptions: input.materialAssumptions,
        boundaryConditions: input.model.boundaryConditions,
        numericalSettings: { arithmetic: 'ECMAScript Number binary64' },
        convergence: 'Closed-form screening calculation; convergence is not applicable.',
        calibration: 'Not calibrated.',
      },
      evidenceRefs: [],
    },
    uncertainty: [
      {
        parameterPath: 'compiledScenario.parameters.water.filterEfficiency',
        method: 'qualitative',
        rationale: 'Filter efficiency is a model input and has not been physically validated here.',
      },
    ],
    sensitivity: [
      {
        parameterPath: 'compiledScenario.parameters.water.filterEfficiency',
        resultPath: 'result.flow.cleanWaterLiters',
        method: 'local-derivative',
        effect: Math.min(compiled.water.sourceLiters, capacityLiters),
        rank: 1,
        interpretation: 'Local flow sensitivity to efficiency equals the pre-efficiency treated volume.',
      },
    ],
  };
}

export function evaluateCleanWaterRep(rawInput: unknown) {
  return evaluateRep(rawInput, evaluateCleanWater);
}
