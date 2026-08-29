import {
  CanonicalConstraintSchema,
  RequirementSchema,
  SubmissionSchema,
  type Challenge,
  type Evaluation,
  type Interface,
  type RepEvaluationResult,
  type RepMaterialInput,
  type Submission,
  type SystemElement,
} from '@gosp/contracts';
import { createSandbox001MaterialInput, runSandbox001 } from '@gosp/sim-core';
import {
  createCleanWaterRepMaterialInput,
  createCleanWaterStemSystemDefinition,
  evaluateCleanWaterRep,
} from '@gosp/vertical-clean-water';

const provenance = { sources: [], method: 'authored' as const, notes: [] };

export type Phase1aEvaluatorDefinition = {
  id: string;
  title: string;
  description: string;
  template: RepMaterialInput;
  seedSubmissions: Submission[];
  objectiveResultPath: string;
  limitations: string[];
  systemElements: SystemElement[];
  interfaces: Interface[];
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
    objectiveResultPath: 'result.value',
    limitations: [
      'Synthetic deterministic benchmark only; it does not establish physical validity.',
      'Local replay is not independent external reproduction.',
      'No professional approval, product certification, regulatory approval, or deployment readiness is claimed.',
    ],
    systemElements: [],
    interfaces: [],
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
  const systemDefinition = createCleanWaterStemSystemDefinition(template.compiledScenario.revision);
  return {
    id: 'evaluator.clean-water.educational-screening',
    title: 'Clean Water educational screening',
    description: 'Vertical-owned level-1 flow, power, and scorecard evaluator with explicit non-claims.',
    template,
    seedSubmissions: [template.submission, parsedCandidate],
    objectiveResultPath: 'result.flow.cleanWaterLiters',
    limitations: [
      'Educational level-1 screening only; inputs are synthetic and not field observations.',
      'The calculation is not potable-water, laboratory, professional, certification, or regulatory validation.',
      'Local replay is not independent external reproduction or deployment evidence.',
    ],
    ...systemDefinition,
    evaluate: evaluateCleanWaterRep,
    claimStatement: (evaluation) => {
      const result = evaluation.result as { flow: { cleanWaterLiters: number } };
      return `Under the recorded educational screening inputs, result.flow.cleanWaterLiters is ${result.flow.cleanWaterLiters}.`;
    },
  };
}

export class Phase1aEvaluatorRegistry {
  readonly definitions: Phase1aEvaluatorDefinition[];

  constructor(definitions = [sandboxDefinition(), cleanWaterDefinition()]) {
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
    return [
      {
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
      },
      {
        record: RequirementSchema.parse({
          kind: 'Requirement',
          id: `requirement.${challenge.id}.objective`,
          revision: challenge.revision,
          provenance,
          relationships: [{ type: 'applies-to', target, description: 'Controlled comparison objective.' }],
          statement: `A candidate should improve ${definition.objectiveResultPath} within fixed comparison boundaries.`,
          obligation: 'should',
          status: 'accepted',
          verificationMethod: 'analysis',
        }),
        role: 'objective' as const,
      },
    ];
  }

  constraintsFor(challenge: Challenge) {
    const target = { kind: 'Challenge' as const, id: challenge.id, revision: challenge.revision };
    return [
      CanonicalConstraintSchema.parse({
        kind: 'Constraint',
        id: `constraint.${challenge.id}.valid-completion`,
        revision: challenge.revision,
        provenance,
        relationships: [{ type: 'applies-to', target, description: 'Canonical evaluation hard gate.' }],
        statement: 'The Submission must pass canonical REP and registered evaluator validation and complete evaluation.',
        constraintType: 'logical',
        parameter: 'evaluation.status',
        operator: 'eq',
        value: 'completed',
        status: 'active',
      }),
    ];
  }
}
