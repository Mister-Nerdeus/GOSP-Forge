import {
  AdvancedChallengeProjectionSchema,
  type AdvancedChallengeProjection,
  type Challenge,
  type Model,
  type Phase1aEvaluationView,
  type Scenario,
  type StemEngineeringDefinition,
} from '@gosp/contracts';

function sameIdentity(left: { id: string; revision: string }, right: { id: string; revision: string }) {
  return left.id === right.id && left.revision === right.revision;
}

function valueAtPath(root: unknown, path: string): unknown {
  const segments = path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);
  let cursor = root;
  for (const segment of segments) {
    if (!cursor || typeof cursor !== 'object' || !(segment in cursor)) return undefined;
    cursor = (cursor as Record<string, unknown>)[segment];
  }
  return cursor;
}

function assertBoundary(
  challenge: Challenge,
  scenario: Scenario,
  model: Model,
  view: Phase1aEvaluationView,
) {
  const evaluation = view.evaluation;
  const material = view.materialInput;
  if (
    !sameIdentity(evaluation.challengeRef, challenge) ||
    !sameIdentity(evaluation.scenarioRef, scenario) ||
    !sameIdentity(evaluation.modelRef, model) ||
    !sameIdentity(material.challenge, challenge) ||
    !sameIdentity(material.compiledScenario, scenario) ||
    !sameIdentity(material.model, model)
  ) {
    throw new Error(`Evaluation ${evaluation.id}@${evaluation.revision} crosses the selected Challenge/Scenario/Model boundary.`);
  }
}

export function buildAdvancedChallengeProjection(input: {
  challenge: Challenge;
  scenario: Scenario;
  model: Model;
  engineeringDefinition: StemEngineeringDefinition;
  evaluations: Phase1aEvaluationView[];
  excludedCandidates?: Array<{ submission: { id: string; revision: string }; explanation: string }>;
}): AdvancedChallengeProjection {
  const objectives = input.engineeringDefinition.objectives
    .filter((objective) => objective.rule.kind === 'numeric-result')
    .map((objective) => {
      const rule = objective.rule as Extract<typeof objective.rule, { kind: 'numeric-result' }>;
      return {
        id: objective.id,
        statement: objective.statement,
        resultPath: rule.resultPath,
        direction: rule.direction,
        source: 'evaluator-engineering-definition' as const,
      };
    });
  if (objectives.length === 0) {
    throw new Error('Advanced Challenge projection requires at least one declared numeric engineering objective.');
  }
  if (input.evaluations.length === 0) {
    throw new Error('Advanced Challenge projection requires at least one evaluated candidate.');
  }

  const candidates: AdvancedChallengeProjection['candidates'] = input.evaluations.map((view) => {
    assertBoundary(input.challenge, input.scenario, input.model, view);
    const failedGateIds = view.hardGates
      .filter((gate) => !gate.passed)
      .map((gate) => gate.constraint.id);
    const objectiveOutcomes = objectives.map((objective) => {
      const value = valueAtPath(view.evaluation, objective.resultPath);
      return typeof value === 'number' && Number.isFinite(value)
        ? { objectiveId: objective.id, status: 'available' as const, value }
        : { objectiveId: objective.id, status: 'unavailable' as const };
    });
    const eligibility = failedGateIds.length > 0
      ? 'failed-gates' as const
      : objectiveOutcomes.some((outcome) => outcome.status === 'unavailable')
        ? 'missing-objective-values' as const
        : 'eligible' as const;
    return {
      submission: { id: view.evaluation.submissionRef.id, revision: view.evaluation.submissionRef.revision },
      evaluation: { id: view.evaluation.id, revision: view.evaluation.revision },
      eligibility,
      failedGateIds,
      objectiveOutcomes,
      dominatedBy: [] as Array<{ submissionId: string; submissionRevision: string }>,
      paretoStatus: eligibility === 'eligible' ? 'non-dominated' : 'ineligible',
    };
  });

  const eligible = candidates.filter((candidate) => candidate.eligibility === 'eligible');
  for (const candidate of eligible) {
    for (const other of eligible) {
      if (candidate === other) continue;
      let noWorse = true;
      let strictlyBetter = false;
      for (const objective of objectives) {
        const candidateValue = candidate.objectiveOutcomes.find((outcome) => outcome.objectiveId === objective.id)!.value!;
        const otherValue = other.objectiveOutcomes.find((outcome) => outcome.objectiveId === objective.id)!.value!;
        const otherIsNoWorse = objective.direction === 'maximize'
          ? otherValue >= candidateValue
          : otherValue <= candidateValue;
        const otherIsStrictlyBetter = objective.direction === 'maximize'
          ? otherValue > candidateValue
          : otherValue < candidateValue;
        noWorse &&= otherIsNoWorse;
        strictlyBetter ||= otherIsStrictlyBetter;
      }
      if (noWorse && strictlyBetter) {
        candidate.dominatedBy.push({
          submissionId: other.submission.id,
          submissionRevision: other.submission.revision,
        });
      }
    }
    if (candidate.dominatedBy.length > 0) candidate.paretoStatus = 'dominated';
  }

  return AdvancedChallengeProjectionSchema.parse({
    projectionVersion: '0.1.0',
    boundary: {
      challenge: { id: input.challenge.id, revision: input.challenge.revision },
      scenario: { id: input.scenario.id, revision: input.scenario.revision },
      model: { id: input.model.id, revision: input.model.revision },
    },
    objectives,
    excludedObjectives: input.engineeringDefinition.objectives
      .filter((objective) => objective.rule.kind !== 'numeric-result')
      .map((objective) => ({
        id: objective.id,
        reason: 'non-numeric-objective' as const,
        explanation: 'This declared engineering objective does not provide a numeric result path and is not used for Pareto comparison.',
      })),
    excludedCandidates: (input.excludedCandidates ?? []).map((candidate) => ({
      submission: candidate.submission,
      reason: 'evaluation-unavailable' as const,
      explanation: candidate.explanation,
    })),
    candidates,
    nonDominatedSet: candidates
      .filter((candidate) => candidate.paretoStatus === 'non-dominated')
      .map((candidate) => ({ submissionId: candidate.submission.id, submissionRevision: candidate.submission.revision })),
    disclosures: [
      'Outcomes are local modeled evaluations, not physical measurements or professional approval.',
      'Hard-gate eligibility is evaluated before objective comparison.',
      'Objectives remain separate; no composite score or ranking is calculated.',
      'The non-dominated set covers only canonical candidates currently stored in this process-local Challenge boundary and does not declare a universal winner.',
    ],
  });
}
