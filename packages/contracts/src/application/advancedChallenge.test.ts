import { describe, expect, it } from 'vitest';
import { AdvancedChallengeProjectionSchema } from './advancedChallenge.js';

const projection = {
  projectionVersion: '0.1.0' as const,
  boundary: {
    challenge: { id: 'challenge-1', revision: '1' },
    scenario: { id: 'scenario-1', revision: '1' },
    model: { id: 'model-1', revision: '1' },
  },
  objectives: [{ id: 'output', statement: 'Increase output.', resultPath: 'result.output', direction: 'maximize' as const, source: 'evaluator-engineering-definition' as const }],
  excludedObjectives: [],
  excludedCandidates: [],
  candidates: [
    {
      submission: { id: 'submission-a', revision: '1' },
      evaluation: { id: 'evaluation-a', revision: '1' },
      eligibility: 'eligible' as const,
      failedGateIds: [],
      objectiveOutcomes: [{ objectiveId: 'output', status: 'available' as const, value: 2 }],
      dominatedBy: [],
      paretoStatus: 'non-dominated' as const,
    },
  ],
  nonDominatedSet: [{ submissionId: 'submission-a', submissionRevision: '1' }],
  disclosures: ['Modeled outcomes only.', 'No composite score.', 'No universal winner.', 'Process-local candidates only.'],
};

describe('AdvancedChallengeProjectionSchema', () => {
  it('accepts an explicit non-dominated set without a composite score', () => {
    expect(AdvancedChallengeProjectionSchema.parse(projection).nonDominatedSet).toHaveLength(1);
  });

  it('rejects eligible candidates with unavailable objective values', () => {
    const invalid = structuredClone(projection);
    invalid.candidates[0]!.objectiveOutcomes[0] = { objectiveId: 'output', status: 'unavailable' } as never;
    expect(() => AdvancedChallengeProjectionSchema.parse(invalid)).toThrow(/eligible candidates/i);
  });

  it('rejects a non-dominated set that does not match candidate status', () => {
    expect(() => AdvancedChallengeProjectionSchema.parse({ ...projection, nonDominatedSet: [] })).toThrow(/exactly match/i);
  });

  it('rejects duplicate objective and candidate identities', () => {
    expect(() => AdvancedChallengeProjectionSchema.parse({
      ...projection,
      objectives: [projection.objectives[0], projection.objectives[0]],
    })).toThrow(/objective identities must be unique/i);
    expect(() => AdvancedChallengeProjectionSchema.parse({
      ...projection,
      candidates: [projection.candidates[0], projection.candidates[0]],
      nonDominatedSet: [projection.nonDominatedSet[0], projection.nonDominatedSet[0]],
    })).toThrow(/candidate Submission identities must be unique/i);

    const duplicateEvaluation = structuredClone(projection);
    duplicateEvaluation.candidates.push({
      ...structuredClone(projection.candidates[0]!),
      submission: { id: 'submission-b', revision: '1' },
    });
    duplicateEvaluation.nonDominatedSet.push({ submissionId: 'submission-b', submissionRevision: '1' });
    expect(() => AdvancedChallengeProjectionSchema.parse(duplicateEvaluation)).toThrow(/candidate Evaluation identities must be unique/i);
  });

  it('rejects unknown dominance references and eligibility despite a failed gate', () => {
    const unknownDominator = structuredClone(projection);
    unknownDominator.candidates[0]!.dominatedBy = [{ submissionId: 'not-projected', submissionRevision: '1' }];
    unknownDominator.candidates[0]!.paretoStatus = 'dominated' as never;
    unknownDominator.nonDominatedSet = [];
    expect(() => AdvancedChallengeProjectionSchema.parse(unknownDominator)).toThrow(/another projected candidate/i);

    const failedGate = structuredClone(projection);
    failedGate.candidates[0]!.failedGateIds = ['gate.failed'];
    expect(() => AdvancedChallengeProjectionSchema.parse(failedGate)).toThrow(/eligible candidates must pass/i);
  });
});
