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
});
