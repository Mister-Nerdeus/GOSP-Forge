import { describe, expect, it } from 'vitest';
import { createSandboxStemEngineeringDefinition } from '@gosp/sim-core';
import { Phase1aService } from './service.js';
import { buildAdvancedChallengeProjection } from './advancedChallengeProjection.js';

async function sandboxFixture() {
  const workspace = await new Phase1aService().getWorkspace();
  return {
    workspace,
    input: {
      challenge: workspace.challenge.record,
      scenario: workspace.challenge.scenario,
      model: workspace.challenge.model,
      engineeringDefinition: createSandboxStemEngineeringDefinition(),
      evaluations: structuredClone(workspace.evaluations),
    },
  };
}

describe('buildAdvancedChallengeProjection', () => {
  it('marks a strictly worse candidate dominated and equivalent candidates non-dominated', async () => {
    const { input } = await sandboxFixture();
    const dominated = buildAdvancedChallengeProjection(input);
    expect(dominated.candidates.map((candidate) => candidate.paretoStatus)).toEqual(['non-dominated', 'dominated']);

    input.evaluations[1]!.evaluation.result = structuredClone(input.evaluations[0]!.evaluation.result);
    const equivalent = buildAdvancedChallengeProjection(input);
    expect(equivalent.candidates.every((candidate) => candidate.paretoStatus === 'non-dominated')).toBe(true);
  });

  it('keeps failed gates and missing numeric values outside Pareto comparison', async () => {
    const { input } = await sandboxFixture();
    input.evaluations[0]!.hardGates[0]!.passed = false;
    input.evaluations[1]!.evaluation.result = {};
    const projection = buildAdvancedChallengeProjection(input);
    expect(projection.candidates.map((candidate) => candidate.eligibility)).toEqual([
      'failed-gates', 'missing-objective-values',
    ]);
    expect(projection.nonDominatedSet).toEqual([]);
  });

  it('rejects evaluations from another canonical boundary', async () => {
    const { input } = await sandboxFixture();
    input.evaluations[1]!.evaluation.modelRef.revision = 'other';
    expect(() => buildAdvancedChallengeProjection(input)).toThrow(/crosses the selected/i);
  });

  it.each([
    ['solver', (input: Awaited<ReturnType<typeof sandboxFixture>>['input']) => {
      input.evaluations[1]!.materialInput.model.solver.contentHash = 'c'.repeat(64);
    }],
    ['runner', (input: Awaited<ReturnType<typeof sandboxFixture>>['input']) => {
      input.evaluations[1]!.evaluation.runner.contentHash = 'c'.repeat(64);
    }],
    ['contract', (input: Awaited<ReturnType<typeof sandboxFixture>>['input']) => {
      input.evaluations[1]!.evaluation.contractIdentities[0]!.contentHash = 'c'.repeat(64);
    }],
    ['dataset', (input: Awaited<ReturnType<typeof sandboxFixture>>['input']) => {
      input.evaluations[1]!.evaluation.datasetIdentities.push({ kind: 'dataset', id: 'dataset.other', revision: '1', contentHash: 'c'.repeat(64) });
    }],
  ] as const)('rejects %s identity drift across candidates', async (_label, mutate) => {
    const { input } = await sandboxFixture();
    mutate(input);
    expect(() => buildAdvancedChallengeProjection(input)).toThrow(/exact solver, runner, contract, or dataset/i);
  });

  it('keeps the workspace usable and discloses a stored candidate rejected by its evaluator', async () => {
    const service = new Phase1aService();
    const initial = await service.getWorkspace();
    const invalid = structuredClone(initial.submissions[0]!);
    invalid.id = 'submission.sandbox-001.stored-invalid';
    invalid.materialPayload = { values: ['not-numeric'], weights: [1], offset: 0 };
    await service.createSubmission(invalid);
    const workspace = await service.getWorkspace();
    expect(workspace.advancedChallenge?.candidates).toHaveLength(2);
    expect(workspace.advancedChallenge?.excludedCandidates).toEqual([{
      submission: { id: invalid.id, revision: invalid.revision },
      reason: 'evaluation-unavailable',
      explanation: expect.stringMatching(/rejected this stored Submission/i),
    }]);
  });

  it('projects the two seeded solar tradeoffs without declaring a universal winner', async () => {
    const service = new Phase1aService();
    const initial = await service.getWorkspace();
    const solar = initial.availableEvaluators.find((item) => item.id.includes('solar'))!;
    const workspace = await service.getWorkspace(undefined, solar.challengeRef, 'solve');
    expect(workspace.advancedChallenge?.objectives).toHaveLength(3);
    expect(workspace.advancedChallenge?.candidates.map((candidate) => candidate.paretoStatus)).toEqual([
      'non-dominated', 'non-dominated',
    ]);
    expect(workspace.advancedChallenge?.nonDominatedSet).toHaveLength(2);
    expect(workspace.advancedChallenge).not.toHaveProperty('compositeScore');
    expect(workspace.advancedChallenge).not.toHaveProperty('ranking');
    expect(workspace.advancedChallenge).not.toHaveProperty('universalWinner');
  });
});
