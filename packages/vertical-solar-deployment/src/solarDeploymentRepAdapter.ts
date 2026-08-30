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

export const SOLAR_DEPLOYMENT_REP_CONTRACT_DESCRIPTOR = {
  id: 'gosp.vertical.solar-deployment.rep-contract',
  revision: '0.1.0',
  input: 'synthetic retractable-panel design under controlled panel, environment, soiling, and hazard conditions',
  output: 'screened power, bend-radius margin, and storm-stow timing margin',
} as const;

export const SOLAR_DEPLOYMENT_SOLVER_DESCRIPTOR = {
  id: 'gosp.vertical.solar-deployment.screening-solver',
  revision: '0.1.0',
  fidelity: 'analytical-educational-screening',
  arithmetic: 'ECMAScript Number binary64',
} as const;

const solverSourceSpec = {
  kind: 'solver',
  id: SOLAR_DEPLOYMENT_SOLVER_DESCRIPTOR.id,
  revision: SOLAR_DEPLOYMENT_SOLVER_DESCRIPTOR.revision,
  sourcePaths: [
    'tsconfig.base.json',
    'packages/vertical-solar-deployment/tsconfig.json',
    'packages/sim-core/src/rep/sourceImplementationIdentity.ts',
    'packages/vertical-solar-deployment/src/solarDeploymentRepAdapter.ts',
  ],
} as const;

export const solarDeploymentSolverSourceManifest = () =>
  loadSourceImplementationManifest(solverSourceSpec);

export const SolarDeploymentPayloadSchema = z.object({
  panel: z.object({
    ratedPowerW: z.number().finite().positive(),
    minimumBendRadiusM: z.number().finite().nonnegative(),
    temperatureCoefficientPerC: z.number().finite(),
    referenceCellTemperatureC: z.number().finite(),
  }),
  environment: z.object({
    irradianceWm2: z.number().finite().nonnegative(),
    cellTemperatureC: z.number().finite(),
    incidenceAngleDeg: z.number().finite().min(0).max(180),
    windSpeedMps: z.number().finite().nonnegative(),
    modeledWindRiseRateMpsPerSecond: z.number().finite().positive(),
  }),
  deployment: z.object({
    coreRadiusM: z.number().finite().nonnegative(),
    deployedFraction: z.number().finite().min(0).max(1),
    stowTimeSeconds: z.number().finite().positive(),
  }),
  control: z.object({
    windStowTriggerMps: z.number().finite().nonnegative(),
    hazardWindThresholdMps: z.number().finite().nonnegative(),
    sensorLatencySeconds: z.number().finite().nonnegative(),
    controllerLatencySeconds: z.number().finite().nonnegative(),
  }),
  cleaning: z.object({
    soilingLossFraction: z.number().finite().min(0).max(1),
  }),
}).superRefine((value, context) => {
  if (value.control.windStowTriggerMps >= value.control.hazardWindThresholdMps) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['control', 'windStowTriggerMps'],
      message: 'The stow trigger must be below the modeled hazard threshold.',
    });
  }
});

export type SolarDeploymentPayload = z.infer<typeof SolarDeploymentPayloadSchema>;

export const DEFAULT_SYNTHETIC_SOLAR_DEPLOYMENT_PAYLOAD: SolarDeploymentPayload = {
  panel: {
    ratedPowerW: 200,
    minimumBendRadiusM: 0.075,
    temperatureCoefficientPerC: -0.003,
    referenceCellTemperatureC: 25,
  },
  environment: {
    irradianceWm2: 900,
    cellTemperatureC: 45,
    incidenceAngleDeg: 20,
    windSpeedMps: 8,
    modeledWindRiseRateMpsPerSecond: 0.75,
  },
  deployment: { coreRadiusM: 0.1, deployedFraction: 1, stowTimeSeconds: 16 },
  control: {
    windStowTriggerMps: 12,
    hazardWindThresholdMps: 30,
    sensorLatencySeconds: 1,
    controllerLatencySeconds: 1,
  },
  cleaning: { soilingLossFraction: 0.12 },
};

const syntheticProvenance = {
  sources: [],
  method: 'authored' as const,
  notes: ['Synthetic educational fixture; no manufacturer specification or physical result is represented as verified data.'],
};

const artifactIdentity = (
  kind: 'contract' | 'component-data',
  id: string,
  revision: string,
  content: unknown,
) => ({ kind, id, revision, contentHash: sha256(canonicalJson(content)) });

export function createSyntheticSolarDeploymentRepMaterialInput(
  payload: SolarDeploymentPayload = DEFAULT_SYNTHETIC_SOLAR_DEPLOYMENT_PAYLOAD,
): RepMaterialInput {
  const parsedPayload = SolarDeploymentPayloadSchema.parse(payload);
  const challengeId = 'challenge.solar-deployment.synthetic';
  const scenarioId = 'scenario.solar-deployment.synthetic.reference';
  const modelId = 'model.solar-deployment.synthetic-screening';
  const workflowId = 'workflow.solar-deployment.synthetic-screening';
  const ref = (kind: string, id: string, revision = '0.1.0') => ({ kind, id, revision });
  const assumptions = [
    {
      id: 'assumption.solar-deployment.synthetic-inputs',
      statement: 'All panel, environment, deployment, controller, and soiling values are synthetic educational inputs.',
      material: true,
    },
    {
      id: 'assumption.solar-deployment.reduced-order',
      statement: 'Power, bend-radius, and storm-stow relationships are simplified screening models, not structural or electrical validation.',
      material: true,
    },
    {
      id: 'assumption.solar-deployment.controlled-boundary',
      statement: 'Candidates retain the controlled panel, environment, soiling condition, and hazard threshold.',
      material: true,
    },
  ];
  const contractIdentity = artifactIdentity(
    'contract',
    SOLAR_DEPLOYMENT_REP_CONTRACT_DESCRIPTOR.id,
    SOLAR_DEPLOYMENT_REP_CONTRACT_DESCRIPTOR.revision,
    SOLAR_DEPLOYMENT_REP_CONTRACT_DESCRIPTOR,
  );
  const componentIdentity = artifactIdentity(
    'component-data',
    'component.synthetic-flexible-solar-panel',
    '0.1.0',
    parsedPayload.panel,
  );

  return RepMaterialInputSchema.parse({
    repVersion: '0.1.0',
    challenge: {
      kind: 'Challenge', id: challengeId, revision: '0.1.0', provenance: syntheticProvenance,
      title: 'Synthetic retractable solar deployment validation',
      problemStatement: 'Compare a retractable solar concept under one synthetic controlled panel and environment.',
      evaluationModelRef: ref('Model', modelId), workflowRef: ref('Workflow', workflowId),
      permittedScenarioRefs: [ref('Scenario', scenarioId)], status: 'open',
    },
    submission: {
      kind: 'Submission', id: 'submission.solar-deployment.synthetic.reference', revision: '0.1.0',
      provenance: syntheticProvenance, challengeRef: ref('Challenge', challengeId),
      scenarioRef: ref('Scenario', scenarioId), materialPayload: parsedPayload,
      componentData: [componentIdentity], status: 'submitted',
    },
    compiledScenario: {
      kind: 'Scenario', id: scenarioId, revision: '0.1.0', provenance: syntheticProvenance,
      name: 'Synthetic retractable solar reference scenario',
      systemElementRefs: [
        ref('SystemElement', 'solar-panel'),
        ref('SystemElement', 'retraction-mechanism'),
        ref('SystemElement', 'storm-controller'),
      ],
      environment: parsedPayload.environment, componentData: [componentIdentity],
      operatingConditions: { hazardWindThresholdMps: parsedPayload.control.hazardWindThresholdMps },
      assumptions,
      parameters: { fixedPanel: parsedPayload.panel, soilingLossFraction: parsedPayload.cleaning.soilingLossFraction },
      modelRef: ref('Model', modelId), status: 'controlled',
    },
    model: {
      kind: 'Model', id: modelId, revision: '0.1.0', provenance: syntheticProvenance,
      name: 'Retractable solar analytical screening model', modelType: 'analytical',
      fidelity: {
        level: 'analytical', calibrationStatus: 'not-calibrated',
        limitations: [
          'No structural wind-load, fatigue, laminate, wiring-flex, actuator-force, weather, or dynamic-roll model is included.',
          'Power and storm timing use simplified deterministic relationships.',
          'No manufacturer or physical test data calibrates the model.',
        ],
      },
      solver: sourceImplementationIdentity(solverSourceSpec), contractIdentities: [contractIdentity],
      assumptions, status: 'active',
    },
    workflow: {
      kind: 'Workflow', id: workflowId, revision: '0.1.0', provenance: syntheticProvenance,
      name: 'Synthetic retractable solar screening workflow',
      steps: [
        { id: 'validate', name: 'Validate controlled inputs', action: 'inspect' },
        { id: 'power', name: 'Calculate modeled power', action: 'execute' },
        { id: 'bend', name: 'Calculate bend-radius margin', action: 'execute' },
        { id: 'stow', name: 'Calculate storm-stow margin', action: 'execute' },
        { id: 'record', name: 'Record explainable evidence', action: 'record' },
      ],
      status: 'active',
    },
    runner: referenceRunnerIdentity(), contractIdentities: [contractIdentity],
    componentData: [componentIdentity], materialAssumptions: assumptions,
    materialParameters: { vertical: 'solar-deployment', adapterRevision: '0.1.0', inputClassification: 'synthetic-educational' },
  });
}

function assertControlledBoundary(input: RepMaterialInput, payload: SolarDeploymentPayload) {
  const scenario = input.compiledScenario;
  if (canonicalJson(scenario.environment) !== canonicalJson(payload.environment)) {
    throw new Error('Submission environment does not match the controlled Scenario environment.');
  }
  if (canonicalJson(scenario.parameters.fixedPanel) !== canonicalJson(payload.panel)) {
    throw new Error('Submission panel does not match the controlled Scenario panel.');
  }
  if (scenario.parameters.soilingLossFraction !== payload.cleaning.soilingLossFraction) {
    throw new Error('Submission soiling condition does not match the controlled Scenario.');
  }
  if (scenario.operatingConditions.hazardWindThresholdMps !== payload.control.hazardWindThresholdMps) {
    throw new Error('Submission hazard threshold does not match the controlled Scenario.');
  }
}

function evaluateSyntheticSolarDeployment(input: RepMaterialInput): RepEvaluatorOutput {
  const payload = SolarDeploymentPayloadSchema.parse(input.submission.materialPayload);
  assertControlledBoundary(input, payload);
  const incidenceFactor = Math.max(0, Math.cos((payload.environment.incidenceAngleDeg * Math.PI) / 180));
  const temperatureFactor = 1 + payload.panel.temperatureCoefficientPerC
    * (payload.environment.cellTemperatureC - payload.panel.referenceCellTemperatureC);
  const soilingFactor = 1 - payload.cleaning.soilingLossFraction;
  const instantaneousPowerW = payload.panel.ratedPowerW
    * (payload.environment.irradianceWm2 / 1000)
    * incidenceFactor * temperatureFactor * soilingFactor * payload.deployment.deployedFraction;
  const bendRadiusMarginM = payload.deployment.coreRadiusM - payload.panel.minimumBendRadiusM;
  const stowStartWindMps = Math.max(payload.environment.windSpeedMps, payload.control.windStowTriggerMps);
  const availableTimeSeconds = (payload.control.hazardWindThresholdMps - stowStartWindMps)
    / payload.environment.modeledWindRiseRateMpsPerSecond;
  const requiredResponseTimeSeconds = payload.control.sensorLatencySeconds
    + payload.control.controllerLatencySeconds + payload.deployment.stowTimeSeconds;
  const stowTimeMarginSeconds = availableTimeSeconds - requiredResponseTimeSeconds;

  return {
    result: {
      power: { instantaneousPowerW, incidenceFactor, temperatureFactor, soilingFactor },
      deployment: { bendRadiusMarginM },
      storm: { stowStartWindMps, availableTimeSeconds, requiredResponseTimeSeconds, stowTimeMarginSeconds },
    },
    explainability: {
      explanation: 'Synthetic reduced-order screening under the exact controlled Scenario; no browser physics is used.',
      equations: [
        {
          id: 'solar.power',
          expression: 'P = Prated * (irradiance / 1000) * cos(angle) * temperatureFactor * (1 - soilingLoss) * deployedFraction',
          description: 'Reduced analytical relationship for instantaneous panel power.',
          variables: {
            Prated: 'Controlled panel rated power.', irradiance: 'Controlled irradiance.', angle: 'Controlled incidence angle.',
            temperatureFactor: 'Calculated temperature adjustment.', soilingLoss: 'Controlled soiling loss.', deployedFraction: 'Candidate deployed fraction.',
          },
        },
        {
          id: 'solar.bend-margin', expression: 'bendRadiusMargin = coreRadius - minimumBendRadius',
          description: 'Positive values pass the modeled bend-radius screen.',
          variables: { coreRadius: 'Candidate core radius.', minimumBendRadius: 'Controlled minimum bend radius.' },
        },
        {
          id: 'solar.stow-margin',
          expression: 'stowTimeMargin = ((hazardWind - max(currentWind, triggerWind)) / windRiseRate) - (sensorLatency + controllerLatency + stowTime)',
          description: 'Simplified time margin before the controlled hazard threshold.',
          variables: {
            hazardWind: 'Controlled hazard threshold.', currentWind: 'Controlled current wind.', triggerWind: 'Candidate stow trigger.',
            windRiseRate: 'Controlled linear wind-rise assumption.', sensorLatency: 'Candidate sensor latency.',
            controllerLatency: 'Candidate controller latency.', stowTime: 'Candidate stow duration.',
          },
        },
      ],
      intermediateValues: [
        { id: 'solar-incidence-factor', value: incidenceFactor },
        { id: 'solar-temperature-factor', value: temperatureFactor },
        { id: 'solar-soiling-factor', value: soilingFactor },
        { id: 'solar-bend-radius-margin', value: bendRadiusMarginM, unit: 'm' },
        { id: 'solar-stow-start-wind', value: stowStartWindMps, unit: 'm/s' },
        { id: 'solar-available-stow-time', value: availableTimeSeconds, unit: 's' },
        { id: 'solar-required-response-time', value: requiredResponseTimeSeconds, unit: 's' },
      ],
      modelInspection: {
        assumptions: input.materialAssumptions, boundaryConditions: input.model.boundaryConditions,
        numericalSettings: { arithmetic: SOLAR_DEPLOYMENT_SOLVER_DESCRIPTOR.arithmetic },
        convergence: 'Closed-form analytical screening; numerical convergence is not applicable.',
        calibration: 'Not calibrated against manufacturer or physical test data.',
      },
      evidenceRefs: [],
    },
    uncertainty: [{
      parameterPath: 'compiledScenario.environment.modeledWindRiseRateMpsPerSecond', method: 'qualitative',
      rationale: 'The synthetic linear wind-rise assumption can dominate the stow margin.', unit: 'm/s^2',
    }],
    sensitivity: [{
      parameterPath: 'submission.materialPayload.deployment.stowTimeSeconds',
      resultPath: 'result.storm.stowTimeMarginSeconds', method: 'local-derivative', effect: -1, rank: 1,
      interpretation: 'Each added second of stow time reduces the modeled margin by one second.',
    }],
  };
}

export function evaluateSyntheticSolarDeploymentRep(rawInput: unknown) {
  return evaluateRep(rawInput, evaluateSyntheticSolarDeployment);
}
