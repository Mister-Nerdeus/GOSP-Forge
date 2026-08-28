import {
  CanonicalConstraintSchema,
  RequirementSchema,
  SubmissionSchema,
  type Challenge,
  type Evaluation,
  type Phase1aGateDefinition,
  type Phase1aObjective,
  type RepEvaluationResult,
  type RepMaterialInput,
  type Submission,
} from '@gosp/contracts';
import { createSandbox001MaterialInput, runSandbox001 } from '@gosp/sim-core';
import {
  createCleanWaterRepMaterialInput,
  evaluateCleanWaterRep,
} from '@gosp/vertical-clean-water';
import {
  DEFAULT_SYNTHETIC_SOLAR_DEPLOYMENT_PAYLOAD,
  createSyntheticSolarDeploymentRepMaterialInput,
  evaluateSyntheticSolarDeploymentRep,
} from '@gosp/vertical-solar-deployment';

const provenance = { sources: [], method: 'authored' as const, notes: [] };

export type Phase1aEvaluatorDefinition = {
  id: string;
  title: string;
  description: string;
  template: RepMaterialInput;
  seedSubmissions: Submission[];
  objectives: Phase1aObjective[];
  gates: Phase1aGateDefinition[];
  limitations: string[];
  evaluate(input: RepMaterialInput): RepEvaluationResult;
  claimStatement(evaluation: Evaluation): string;
};

function sandboxDefinition(): Phase1aEvaluatorDefinition {
  const template = createSandbox001MaterialInput();
  const candidate = SubmissionSchema.parse({
    ...structuredClone(template.submission),
    id: 'submission.sandbox-001.candidate-low',
    materialPayload: { values: [0, 1, 1], weights: [2, 3, 5], offset: 7 },
  });
  return {
    id: 'evaluator.sandbox-001',
    title: 'Sandbox deterministic weighted sum',
    description: 'Synthetic reference evaluator for deterministic REP and controlled comparison.',
    template,
    seedSubmissions: [template.submission, candidate],
    objectives: [
      {
        id: 'weighted-sum',
        label: 'Weighted sum',
        resultPath: 'result.value',
        direction: 'maximize',
      },
    ],
    gates: [
      {
        id: 'valid-completion',
        statement: 'The Submission must pass canonical REP and registered evaluator validation and complete evaluation.',
        resultPath: 'evaluation.status',
        operator: 'eq',
        expected: 'completed',
      },
    ],
    limitations: [
      'Synthetic deterministic benchmark only; it does not establish physical validity.',
      'Local replay is not independent external reproduction.',
      'No professional approval, product certification, regulatory approval, or deployment readiness is claimed.',
    ],
    evaluate: runSandbox001,
    claimStatement: (evaluation) =>
      `Under the recorded synthetic inputs, result.value is ${(evaluation.result as { value: number }).value}.`,
  };
}

function cleanWaterDefinition(): Phase1aEvaluatorDefinition {
  const template = createCleanWaterRepMaterialInput({
    project: { id: 'clean-water-local-demo', version: '1.0.0' },
    compiledInput: {
      projectId: 'clean-water-local-demo',
      moduleIds: ['source', 'pump', 'filter'],
      water: {
        sourceLiters: 100,
        minutes: 10,
        pumpFlowLpm: 8,
        filterEfficiency: 0.8,
      },
      powerSource: { id: 'source', voltageV: 12, currentA: 5 },
      powerLoads: [{ id: 'pump', voltageV: 12, currentA: 3 }],
      warnings: [],
      defaultedInputs: [],
      unknownInputs: [],
      knownInputs: ['sourceLiters', 'minutes', 'pumpFlowLpm', 'filterEfficiency'],
      confidence: {
        level: 'low',
        rationale: 'Synthetic educational inputs have not been physically validated.',
      },
    },
    resolvedRefs: [],
  });
  const candidate = structuredClone(template.submission);
  candidate.id = 'submission.clean-water-local-demo.candidate-efficiency';
  const payload = candidate.materialPayload as {
    compiledInput: { water: { filterEfficiency: number } };
  };
  payload.compiledInput.water.filterEfficiency = 0.9;
  const parsedCandidate = SubmissionSchema.parse(candidate);
  return {
    id: 'evaluator.clean-water.educational-screening',
    title: 'Clean Water educational screening',
    description: 'Vertical-owned level-1 flow, power, and scorecard evaluator with explicit non-claims.',
    template,
    seedSubmissions: [template.submission, parsedCandidate],
    objectives: [
      {
        id: 'clean-water-volume',
        label: 'Modeled clean-water volume',
        resultPath: 'result.flow.cleanWaterLiters',
        direction: 'maximize',
        unit: 'L',
      },
    ],
    gates: [
      {
        id: 'valid-completion',
        statement: 'The Submission must pass canonical REP and registered evaluator validation and complete evaluation.',
        resultPath: 'evaluation.status',
        operator: 'eq',
        expected: 'completed',
      },
    ],
    limitations: [
      'Educational level-1 screening only; inputs are synthetic and not field observations.',
      'The calculation is not potable-water, laboratory, professional, certification, or regulatory validation.',
      'Local replay is not independent external reproduction or deployment evidence.',
    ],
    evaluate: evaluateCleanWaterRep,
    claimStatement: (evaluation) => {
      const result = evaluation.result as { flow: { cleanWaterLiters: number } };
      return `Under the recorded educational screening inputs, result.flow.cleanWaterLiters is ${result.flow.cleanWaterLiters}.`;
    },
  };
}

function solarDeploymentDefinition(): Phase1aEvaluatorDefinition {
  const referencePayload = structuredClone(DEFAULT_SYNTHETIC_SOLAR_DEPLOYMENT_PAYLOAD);
  referencePayload.environment.modeledWindRiseRateMpsPerSecond = 0.75;
  const template = createSyntheticSolarDeploymentRepMaterialInput(referencePayload);
  const candidate = structuredClone(template.submission);
  candidate.id = 'submission.solar-deployment.synthetic.tradeoff-candidate';
  const payload = candidate.materialPayload as typeof referencePayload;
  payload.environment.incidenceAngleDeg = 30;
  payload.deployment.coreRadiusM = 0.12;
  payload.deployment.deployTimeSeconds = 30;
  payload.deployment.stowTimeSeconds = 12;
  payload.cleaning.modeledCleaningRecoveryFraction = 0.1;
  const parsedCandidate = SubmissionSchema.parse(candidate);

  return {
    id: 'evaluator.solar-deployment.synthetic-screening',
    title: 'Retractable flexible-solar synthetic screening',
    description:
      'Synthetic educational evaluator for modeled solar power, roll bend margin, storm-stow timing, deployment speed, and cleaning recovery.',
    template,
    seedSubmissions: [template.submission, parsedCandidate],
    objectives: [
      {
        id: 'instantaneous-power',
        label: 'Modeled instantaneous solar power',
        resultPath: 'result.power.instantaneousPowerW',
        direction: 'maximize',
        unit: 'W',
      },
      {
        id: 'storm-stow-margin',
        label: 'Storm-stow timing margin',
        resultPath: 'result.storm.stowTimeMarginSeconds',
        direction: 'maximize',
        unit: 's',
      },
      {
        id: 'bend-radius-margin',
        label: 'Bend-radius margin',
        resultPath: 'result.deployment.bendRadiusMarginM',
        direction: 'maximize',
        unit: 'm',
      },
      {
        id: 'deployment-time',
        label: 'Deployment time',
        resultPath: 'result.deployment.deployTimeSeconds',
        direction: 'minimize',
        unit: 's',
      },
      {
        id: 'stow-time',
        label: 'Stow time',
        resultPath: 'result.deployment.stowTimeSeconds',
        direction: 'minimize',
        unit: 's',
      },
      {
        id: 'cleaning-recovery',
        label: 'Modeled cleaning power recovery',
        resultPath: 'result.power.cleaningRecoveredPowerW',
        direction: 'maximize',
        unit: 'W',
      },
    ],
    gates: [
      {
        id: 'valid-completion',
        statement: 'The Submission must pass canonical REP and registered evaluator validation and complete evaluation.',
        resultPath: 'evaluation.status',
        operator: 'eq',
        expected: 'completed',
      },
      {
        id: 'bend-radius',
        statement: 'The modeled roll-core radius shall not be below the synthetic minimum bend-radius input.',
        resultPath: 'evaluation.result.deployment.bendRadiusMarginM',
        operator: 'gte',
        expected: 0,
        unit: 'm',
      },
      {
        id: 'storm-stow-margin',
        statement: 'The modeled storm-stow timing margin shall be nonnegative.',
        resultPath: 'evaluation.result.storm.stowTimeMarginSeconds',
        operator: 'gte',
        expected: 0,
        unit: 's',
      },
      {
        id: 'positive-temperature-factor',
        statement: 'The simplified temperature factor shall remain positive for this screening model.',
        resultPath: 'evaluation.result.power.temperatureFactor',
        operator: 'gt',
        expected: 0,
      },
    ],
    limitations: [
      'All inputs are synthetic educational values; no manufacturer performance claim is verified.',
      'No structural wind-load, fatigue, laminate, wiring-flex, actuator-force, hail, precipitation, or dynamic roll mechanics are modeled.',
      'The solar power relationship is a reduced analytical screening model and is not an IEC/STC performance verification.',
      'Storm-stow timing assumes a linear synthetic wind-speed rise and is not a weather forecast or safety certification.',
      'Cleaning recovery is modeled from an assumed recovery fraction and is not measured cleaning performance.',
      'Local replay is not independent external reproduction or physical validation.',
    ],
    evaluate: evaluateSyntheticSolarDeploymentRep,
    claimStatement: (evaluation) => {
      const result = evaluation.result as {
        power: { instantaneousPowerW: number };
        deployment: { bendRadiusMarginM: number };
        storm: { stowTimeMarginSeconds: number };
      };
      return `Under the recorded synthetic educational inputs, modeled instantaneous power is ${result.power.instantaneousPowerW} W, bend-radius margin is ${result.deployment.bendRadiusMarginM} m, and storm-stow timing margin is ${result.storm.stowTimeMarginSeconds} s.`;
    },
  };
}

export class Phase1aEvaluatorRegistry {
  readonly definitions: Phase1aEvaluatorDefinition[];

  constructor(definitions = [sandboxDefinition(), cleanWaterDefinition(), solarDeploymentDefinition()]) {
    this.definitions = definitions;
  }

  forMaterialInput(input: RepMaterialInput) {
    return this.forModel(input.model.id, input.model.revision);
  }

  forChallenge(challenge: Challenge) {
    return this.forModel(challenge.evaluationModelRef.id, challenge.evaluationModelRef.revision);
  }

  forModel(id: string, revision: string) {
    const definition = this.definitions.find(
      (item) => item.template.model.id === id && item.template.model.revision === revision,
    );
    if (!definition) {
      throw new Error(`No local evaluator is registered for Model ${id}@${revision}.`);
    }
    return definition;
  }

  requirementsFor(challenge: Challenge, definition: Phase1aEvaluatorDefinition) {
    const target = { kind: 'Challenge' as const, id: challenge.id, revision: challenge.revision };
    const validityRequirement = {
      record: RequirementSchema.parse({
        kind: 'Requirement',
        id: `requirement.${challenge.id}.valid-input`,
        revision: challenge.revision,
        provenance,
        relationships: [{ type: 'applies-to', target, description: 'Input validity requirement.' }],
        statement: 'A Submission shall pass canonical validation and its registered evaluator input checks.',
        obligation: 'shall',
        status: 'accepted',
        verificationMethod: 'analysis',
      }),
      role: 'hard-gate' as const,
    };
    const objectives = definition.objectives.map((objective) => ({
      record: RequirementSchema.parse({
        kind: 'Requirement',
        id: `requirement.${challenge.id}.objective.${objective.id}`,
        revision: challenge.revision,
        provenance,
        relationships: [{ type: 'applies-to', target, description: 'Controlled comparison objective.' }],
        statement: `A candidate should ${objective.direction} ${objective.resultPath} within fixed comparison boundaries.`,
        obligation: 'should',
        status: 'accepted',
        verificationMethod: 'analysis',
      }),
      role: 'objective' as const,
    }));
    return [validityRequirement, ...objectives];
  }

  constraintsFor(challenge: Challenge, definition: Phase1aEvaluatorDefinition) {
    const target = { kind: 'Challenge' as const, id: challenge.id, revision: challenge.revision };
    return definition.gates.map((gate) =>
      CanonicalConstraintSchema.parse({
        kind: 'Constraint',
        id: `constraint.${challenge.id}.${gate.id}`,
        revision: challenge.revision,
        provenance,
        relationships: [{ type: 'applies-to', target, description: 'Registered evaluator hard gate.' }],
        statement: gate.statement,
        constraintType: typeof gate.expected === 'number' ? 'numeric' : 'logical',
        parameter: gate.resultPath,
        operator: gate.operator,
        value: gate.expected,
        unit: gate.unit,
        status: 'active',
      }),
    );
  }
}
