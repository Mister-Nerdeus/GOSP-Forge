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
  input: 'synthetic flexible-panel design plus a controlled environment and hazard threshold',
  output: 'screened solar power, cleaning recovery, bend-radius margin, and storm-stow timing margin',
} as const;

export const SOLAR_DEPLOYMENT_SOLVER_DESCRIPTOR = {
  id: 'gosp.vertical.solar-deployment.screening-solver',
  revision: '0.1.0',
  fidelity: 'analytical-educational-screening',
  arithmetic: 'ECMAScript Number binary64',
} as const;

export const SOLAR_DEPLOYMENT_SOLVER_SOURCE_PATHS = [
  'tsconfig.base.json',
  'packages/vertical-solar-deployment/tsconfig.json',
  'packages/sim-core/src/rep/sourceImplementationIdentity.ts',
  'packages/vertical-solar-deployment/src/solarDeploymentRepAdapter.ts',
] as const;

const solarDeploymentSolverSourceSpec = {
  kind: 'solver',
  id: SOLAR_DEPLOYMENT_SOLVER_DESCRIPTOR.id,
  revision: SOLAR_DEPLOYMENT_SOLVER_DESCRIPTOR.revision,
  sourcePaths: [...SOLAR_DEPLOYMENT_SOLVER_SOURCE_PATHS],
} as const;

export const solarDeploymentSolverSourceManifest = () =>
  loadSourceImplementationManifest(solarDeploymentSolverSourceSpec);

export const SolarPanelSchema = z.object({
  ratedPowerW: z.number().finite().positive(),
  minimumBendRadiusM: z.number().finite().nonnegative(),
  massKg: z.number().finite().positive(),
  temperatureCoefficientPerC: z.number().finite(),
  referenceCellTemperatureC: z.number().finite(),
});

export const SolarEnvironmentSchema = z.object({
  irradianceWm2: z.number().finite().nonnegative(),
  cellTemperatureC: z.number().finite(),
  incidenceAngleDeg: z.number().finite().min(0).max(180),
  windSpeedMps: z.number().finite().nonnegative(),
  modeledWindRiseRateMpsPerSecond: z.number().finite().positive(),
});

export const SolarDeploymentDesignSchema = z.object({
  coreRadiusM: z.number().finite().nonnegative(),
  deployedFraction: z.number().finite().min(0).max(1),
  deployTimeSeconds: z.number().finite().positive(),
  stowTimeSeconds: z.number().finite().positive(),
});

export const SolarControlDesignSchema = z.object({
  windStowTriggerMps: z.number().finite().nonnegative(),
  hazardWindThresholdMps: z.number().finite().nonnegative(),
  sensorLatencySeconds: z.number().finite().nonnegative(),
  controllerLatencySeconds: z.number().finite().nonnegative(),
});

export const SolarCleaningDesignSchema = z.object({
  soilingLossFraction: z.number().finite().min(0).max(1),
  modeledCleaningRecoveryFraction: z.number().finite().min(0).max(1),
});

export const SolarDeploymentPayloadSchema = z
  .object({
    panel: SolarPanelSchema,
    environment: SolarEnvironmentSchema,
    deployment: SolarDeploymentDesignSchema,
    control: SolarControlDesignSchema,
    cleaning: SolarCleaningDesignSchema,
  })
  .superRefine((value, context) => {
    if (value.control.windStowTriggerMps >= value.control.hazardWindThresholdMps) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['control', 'windStowTriggerMps'],
        message: 'The stow trigger must be below the modeled hazard threshold.',
      });
    }
  });

export type SolarDeploymentPayload = z.infer<typeof SolarDeploymentPayloadSchema>;

const artifactIdentity = (
  kind: 'contract' | 'component-data',
  id: string,
  revision: string,
  content: unknown,
) => ({ kind, id, revision, contentHash: sha256(canonicalJson(content)) });

const syntheticProvenance = {
  sources: [],
  method: 'authored' as const,
  notes: [
    'Synthetic educational fixture. No manufacturer specification or physical test result is represented as verified data.',
  ],
};

export const DEFAULT_SYNTHETIC_SOLAR_DEPLOYMENT_PAYLOAD: SolarDeploymentPayload = {
  panel: {
    ratedPowerW: 200,
    minimumBendRadiusM: 0.075,
    massKg: 4.2,
    temperatureCoefficientPerC: -0.003,
    referenceCellTemperatureC: 25,
  },
  environment: {
    irradianceWm2: 900,
    cellTemperatureC: 45,
    incidenceAngleDeg: 20,
    windSpeedMps: 12,
    modeledWindRiseRateMpsPerSecond: 1.5,
  },
  deployment: {
    coreRadiusM: 0.1,
    deployedFraction: 1,
    deployTimeSeconds: 24,
    stowTimeSeconds: 16,
  },
  control: {
    windStowTriggerMps: 12,
    hazardWindThresholdMps: 30,
    sensorLatencySeconds: 1,
    controllerLatencySeconds: 1,
  },
  cleaning: {
    soilingLossFraction: 0.12,
    modeledCleaningRecoveryFraction: 0.08,
  },
};

export function createSyntheticSolarDeploymentRepMaterialInput(
  payload: SolarDeploymentPayload = DEFAULT_SYNTHETIC_SOLAR_DEPLOYMENT_PAYLOAD,
): RepMaterialInput {
  const parsedPayload = SolarDeploymentPayloadSchema.parse(payload);
  const contractIdentity = artifactIdentity(
    'contract',
    SOLAR_DEPLOYMENT_REP_CONTRACT_DESCRIPTOR.id,
    SOLAR_DEPLOYMENT_REP_CONTRACT_DESCRIPTOR.revision,
    SOLAR_DEPLOYMENT_REP_CONTRACT_DESCRIPTOR,
  );
  const solverIdentity = sourceImplementationIdentity(solarDeploymentSolverSourceSpec);
  const componentIdentity = artifactIdentity(
    'component-data',
    'component.synthetic-flexible-solar-panel',
    '0.1.0',
    parsedPayload.panel,
  );
  const challengeId = 'challenge.solar-deployment.synthetic';
  const scenarioId = 'scenario.solar-deployment.synthetic.reference';
  const modelId = 'model.solar-deployment.synthetic-screening';
  const workflowId = 'workflow.solar-deployment.synthetic-screening';
  const submissionId = 'submission.solar-deployment.synthetic.reference';
  const canonicalRef = (kind: string, id: string, revision = '0.1.0') => ({ kind, id, revision });
  const syntheticAssumption = {
    id: 'assumption.solar-deployment.synthetic-inputs',
    statement: 'All panel, environment, deployment, controller, and cleaning values are synthetic educational inputs.',
    material: true,
  };
  const reducedOrderAssumption = {
    id: 'assumption.solar-deployment.reduced-order',
    statement: 'The power, bend-radius, and storm-stow relationships are simplified screening models, not full structural or electrical validation.',
    material: true,
  };
  const controlledScenarioAssumption = {
    id: 'assumption.solar-deployment.controlled-environment',
    statement: 'Candidate submissions must use the exact controlled environment and hazard threshold recorded in the Scenario; design variables may change only outside that fixed boundary.',
    material: true,
  };

  return RepMaterialInputSchema.parse({
    repVersion: '0.1.0',
    challenge: {
      kind: 'Challenge',
      id: challengeId,
      revision: '0.1.0',
      provenance: syntheticProvenance,
      title: 'Synthetic retractable flexible-solar deployment challenge',
      problemStatement:
        'Compare flexible-solar deployment concepts for modeled power, bend-radius margin, storm-stow timing, and cleaning recovery using synthetic educational inputs under one controlled environment.',
      evaluationModelRef: canonicalRef('Model', modelId, SOLAR_DEPLOYMENT_SOLVER_DESCRIPTOR.revision),
      workflowRef: canonicalRef('Workflow', workflowId, SOLAR_DEPLOYMENT_REP_CONTRACT_DESCRIPTOR.revision),
      permittedScenarioRefs: [canonicalRef('Scenario', scenarioId)],
      status: 'open',
    },
    submission: {
      kind: 'Submission',
      id: submissionId,
      revision: '0.1.0',
      provenance: syntheticProvenance,
      challengeRef: canonicalRef('Challenge', challengeId),
      scenarioRef: canonicalRef('Scenario', scenarioId),
      materialPayload: parsedPayload,
      componentData: [componentIdentity],
      status: 'submitted',
    },
    compiledScenario: {
      kind: 'Scenario',
      id: scenarioId,
      revision: '0.1.0',
      provenance: syntheticProvenance,
      name: 'Synthetic retractable solar reference scenario',
      systemElementRefs: [],
      environment: parsedPayload.environment,
      componentData: [componentIdentity],
      operatingConditions: {
        hazardWindThresholdMps: parsedPayload.control.hazardWindThresholdMps,
      },
      assumptions: [syntheticAssumption, reducedOrderAssumption, controlledScenarioAssumption],
      parameters: {},
      modelRef: canonicalRef('Model', modelId, SOLAR_DEPLOYMENT_SOLVER_DESCRIPTOR.revision),
      status: 'controlled',
    },
    model: {
      kind: 'Model',
      id: modelId,
      revision: SOLAR_DEPLOYMENT_SOLVER_DESCRIPTOR.revision,
      provenance: syntheticProvenance,
      name: 'Retractable flexible-solar analytical screening model',
      modelType: 'analytical',
      fidelity: {
        level: 'analytical',
        calibrationStatus: 'not-calibrated',
        limitations: [
          'No structural wind-load model is included.',
          'No fatigue, laminate, wiring-flex, actuator-force, hail, precipitation, or dynamic roll mechanics are modeled.',
          'Power uses a simplified incidence, temperature, soiling, and deployment-fraction relationship.',
          'Storm-stow timing uses a synthetic linear wind-rise assumption.',
          'Cleaning recovery is an assumed model input, not measured cleaning performance.',
        ],
      },
      solver: solverIdentity,
      contractIdentities: [contractIdentity],
      assumptions: [syntheticAssumption, reducedOrderAssumption, controlledScenarioAssumption],
      status: 'active',
    },
    workflow: {
      kind: 'Workflow',
      id: workflowId,
      revision: SOLAR_DEPLOYMENT_REP_CONTRACT_DESCRIPTOR.revision,
      provenance: syntheticProvenance,
      name: 'Synthetic solar deployment screening workflow',
      steps: [
        { id: 'validate-inputs', name: 'Validate synthetic inputs and Scenario boundary', action: 'inspect' },
        { id: 'power', name: 'Calculate modeled solar power', action: 'execute' },
        { id: 'bend', name: 'Calculate bend-radius margin', action: 'execute' },
        { id: 'stow', name: 'Calculate storm-stow timing margin', action: 'execute' },
        { id: 'cleaning', name: 'Calculate modeled cleaning recovery', action: 'execute' },
        { id: 'record', name: 'Record explainable screening evidence', action: 'record' },
      ],
      status: 'active',
    },
    runner: referenceRunnerIdentity(),
    contractIdentities: [contractIdentity],
    componentData: [componentIdentity],
    materialAssumptions: [syntheticAssumption, reducedOrderAssumption, controlledScenarioAssumption],
    materialParameters: {
      vertical: 'solar-deployment',
      adapterRevision: SOLAR_DEPLOYMENT_REP_CONTRACT_DESCRIPTOR.revision,
      inputClassification: 'synthetic-educational',
    },
  });
}

function powerAtSoilingLoss(payload: SolarDeploymentPayload, soilingLossFraction: number) {
  const angleRadians = (payload.environment.incidenceAngleDeg * Math.PI) / 180;
  const incidenceFactor = Math.max(0, Math.cos(angleRadians));
  const temperatureFactor =
    1 +
    payload.panel.temperatureCoefficientPerC *
      (payload.environment.cellTemperatureC - payload.panel.referenceCellTemperatureC);
  const soilingFactor = 1 - soilingLossFraction;
  const instantaneousPowerW =
    payload.panel.ratedPowerW *
    (payload.environment.irradianceWm2 / 1000) *
    incidenceFactor *
    temperatureFactor *
    soilingFactor *
    payload.deployment.deployedFraction;
  return { incidenceFactor, temperatureFactor, soilingFactor, instantaneousPowerW };
}

function assertControlledScenarioBoundary(input: RepMaterialInput, payload: SolarDeploymentPayload) {
  const scenarioEnvironment = SolarEnvironmentSchema.parse(input.compiledScenario.environment);
  if (canonicalJson(scenarioEnvironment) !== canonicalJson(payload.environment)) {
    throw new Error('Submission environment does not match the controlled Scenario environment.');
  }
  const scenarioHazardThreshold = input.compiledScenario.operatingConditions.hazardWindThresholdMps;
  if (
    typeof scenarioHazardThreshold !== 'number' ||
    scenarioHazardThreshold !== payload.control.hazardWindThresholdMps
  ) {
    throw new Error('Submission hazard threshold does not match the controlled Scenario hazard threshold.');
  }
}

function evaluateSyntheticSolarDeployment(input: RepMaterialInput): RepEvaluatorOutput {
  const payload = SolarDeploymentPayloadSchema.parse(input.submission.materialPayload);
  assertControlledScenarioBoundary(input, payload);
  const beforeCleaning = powerAtSoilingLoss(payload, payload.cleaning.soilingLossFraction);
  const postCleaningSoilingLoss = Math.max(
    0,
    payload.cleaning.soilingLossFraction - payload.cleaning.modeledCleaningRecoveryFraction,
  );
  const afterCleaning = powerAtSoilingLoss(payload, postCleaningSoilingLoss);
  const cleaningRecoveredPowerW = Math.max(
    0,
    afterCleaning.instantaneousPowerW - beforeCleaning.instantaneousPowerW,
  );
  const bendRadiusMarginM =
    payload.deployment.coreRadiusM - payload.panel.minimumBendRadiusM;
  const availableTimeSeconds =
    (payload.control.hazardWindThresholdMps - payload.environment.windSpeedMps) /
    payload.environment.modeledWindRiseRateMpsPerSecond;
  const requiredResponseTimeSeconds =
    payload.control.sensorLatencySeconds +
    payload.control.controllerLatencySeconds +
    payload.deployment.stowTimeSeconds;
  const stowTimeMarginSeconds = availableTimeSeconds - requiredResponseTimeSeconds;

  return {
    result: {
      power: {
        instantaneousPowerW: beforeCleaning.instantaneousPowerW,
        postCleaningPowerW: afterCleaning.instantaneousPowerW,
        cleaningRecoveredPowerW,
        incidenceFactor: beforeCleaning.incidenceFactor,
        temperatureFactor: beforeCleaning.temperatureFactor,
        soilingFactor: beforeCleaning.soilingFactor,
        postCleaningSoilingLossFraction: postCleaningSoilingLoss,
      },
      deployment: {
        bendRadiusMarginM,
        deployTimeSeconds: payload.deployment.deployTimeSeconds,
        stowTimeSeconds: payload.deployment.stowTimeSeconds,
      },
      storm: {
        availableTimeSeconds,
        requiredResponseTimeSeconds,
        stowTimeMarginSeconds,
      },
    },
    explainability: {
      explanation:
        'This synthetic educational screening model estimates solar power from irradiance, incidence angle, temperature, soiling, and deployed fraction; separately checks roll-core bend-radius margin and a simplified storm-stow timing margin under the exact controlled Scenario environment.',
      equations: [
        {
          id: 'solar.power',
          expression:
            'P = Prated * (irradiance / 1000) * max(0, cos(angle)) * [1 + tempCoeff * (cellTemp - referenceTemp)] * (1 - soilingLoss) * deployedFraction',
          description: 'Reduced analytical screening relationship for instantaneous panel power.',
          variables: {
            Prated: 'Synthetic panel rated power.',
            irradiance: 'Synthetic controlled plane-of-array irradiance input.',
            angle: 'Synthetic controlled incidence angle.',
            tempCoeff: 'Synthetic fractional temperature coefficient per degree C.',
            cellTemp: 'Synthetic controlled cell temperature.',
            referenceTemp: 'Synthetic reference cell temperature.',
            soilingLoss: 'Synthetic fractional soiling loss.',
            deployedFraction: 'Candidate fraction of the panel considered deployed.',
          },
        },
        {
          id: 'solar.bend-margin',
          expression: 'bendRadiusMargin = coreRadius - minimumBendRadius',
          description: 'Positive values satisfy the modeled minimum bend-radius check.',
          variables: {
            coreRadius: 'Candidate roll-core radius.',
            minimumBendRadius: 'Synthetic minimum panel bend-radius input.',
          },
        },
        {
          id: 'solar.stow-margin',
          expression:
            'stowTimeMargin = ((hazardWind - currentWind) / modeledWindRiseRate) - (sensorLatency + controllerLatency + stowTime)',
          description: 'Simplified timing margin before the controlled synthetic rising-wind hazard threshold is reached.',
          variables: {
            hazardWind: 'Controlled synthetic hazard threshold.',
            currentWind: 'Controlled synthetic current wind speed.',
            modeledWindRiseRate: 'Controlled assumed linear wind-speed increase rate.',
            sensorLatency: 'Candidate modeled sensor latency.',
            controllerLatency: 'Candidate modeled control latency.',
            stowTime: 'Candidate modeled mechanical stow duration.',
          },
        },
      ],
      intermediateValues: [
        { id: 'incidence-factor', value: beforeCleaning.incidenceFactor },
        { id: 'temperature-factor', value: beforeCleaning.temperatureFactor },
        { id: 'pre-clean-power', value: beforeCleaning.instantaneousPowerW, unit: 'W' },
        { id: 'post-clean-power', value: afterCleaning.instantaneousPowerW, unit: 'W' },
        { id: 'bend-radius-margin', value: bendRadiusMarginM, unit: 'm' },
        { id: 'available-stow-time', value: availableTimeSeconds, unit: 's' },
        { id: 'required-response-time', value: requiredResponseTimeSeconds, unit: 's' },
        { id: 'stow-time-margin', value: stowTimeMarginSeconds, unit: 's' },
      ],
      modelInspection: {
        assumptions: input.materialAssumptions,
        boundaryConditions: input.model.boundaryConditions,
        numericalSettings: { arithmetic: SOLAR_DEPLOYMENT_SOLVER_DESCRIPTOR.arithmetic },
        convergence: 'Closed-form analytical screening; numerical convergence is not applicable.',
        calibration: 'Not calibrated against manufacturer or physical test data.',
      },
      evidenceRefs: [],
    },
    uncertainty: [
      {
        parameterPath: 'compiledScenario.environment.modeledWindRiseRateMpsPerSecond',
        method: 'qualitative',
        rationale: 'The linear wind-rise rate is a synthetic controlled assumption and can dominate stow timing.',
        unit: 'm/s^2',
      },
      {
        parameterPath: 'submission.materialPayload.cleaning.modeledCleaningRecoveryFraction',
        method: 'qualitative',
        rationale: 'Cleaning recovery is a candidate assumption and has not been physically measured.',
      },
    ],
    sensitivity: [
      {
        parameterPath: 'submission.materialPayload.panel.ratedPowerW',
        resultPath: 'result.power.instantaneousPowerW',
        method: 'local-derivative',
        effect:
          (payload.environment.irradianceWm2 / 1000) *
          beforeCleaning.incidenceFactor *
          beforeCleaning.temperatureFactor *
          beforeCleaning.soilingFactor *
          payload.deployment.deployedFraction,
        rank: 1,
        interpretation: 'At fixed controlled conditions, screened instantaneous power scales linearly with rated power.',
      },
      {
        parameterPath: 'submission.materialPayload.deployment.stowTimeSeconds',
        resultPath: 'result.storm.stowTimeMarginSeconds',
        method: 'local-derivative',
        effect: -1,
        rank: 1,
        interpretation: 'Each additional second of candidate stow time reduces the storm-stow margin by one second.',
      },
    ],
  };
}

export function evaluateSyntheticSolarDeploymentRep(rawInput: unknown) {
  return evaluateRep(rawInput, evaluateSyntheticSolarDeployment);
}
