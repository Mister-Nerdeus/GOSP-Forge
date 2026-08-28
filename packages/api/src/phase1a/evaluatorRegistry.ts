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
