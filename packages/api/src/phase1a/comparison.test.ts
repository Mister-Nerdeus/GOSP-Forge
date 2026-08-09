import { describe, expect, it } from 'vitest';
import { comparePhase1aEvaluations, Phase1aService } from './service.js';

describe('Phase-1A deterministic comparison', () => {
  it('finds changed and fixed material inputs, result deltas, and gate changes without mutation', async () => {
    const workspace = await new Phase1aService().getWorkspace();
    const [baseline, candidate] = workspace.evaluations;
    const beforeBaseline = structuredClone(baseline);
    const beforeCandidate = structuredClone(candidate);

    const comparison = comparePhase1aEvaluations(baseline!, candidate!);

    expect(comparison.changedInputPaths).toContain('submission.materialPayload.values[0]');
    expect(comparison.fixedInputPaths).toContain('compiledScenario.parameters.scale');
    expect(comparison.resultDeltas).toContainEqual(
      expect.objectContaining({ resultPath: 'result.value', baseline: 53, candidate: 23, delta: -30 }),
    );
    expect(comparison.hardGateChanges).toEqual([
      expect.objectContaining({ baselinePassed: true, candidatePassed: true, changed: false }),
    ]);
    expect(comparison.explanation.summary).toMatch(/baseline performed better/);
    expect(baseline).toEqual(beforeBaseline);
    expect(candidate).toEqual(beforeCandidate);
  });

  it('rejects a pair across a mismatched model boundary', async () => {
    const workspace = await new Phase1aService().getWorkspace();
    const baseline = workspace.evaluations[0]!;
    const invalid = structuredClone(workspace.evaluations[1]!);
    invalid.materialInput.model.revision = '2.0.0';

    expect(() => comparePhase1aEvaluations(baseline, invalid)).toThrow(/not comparable/);
  });

  it('compares material payload paths that exist in only one candidate', async () => {
    const service = new Phase1aService();
    const workspace = await service.getWorkspace();
    const submission = structuredClone(workspace.submissions[1]!);
    submission.id = 'submission.sandbox-001.with-disclosure';
    submission.materialPayload = {
      ...(submission.materialPayload as Record<string, unknown>),
      toolDisclosure: 'No agent-generated material values.',
    };
    await service.createSubmission(submission);
    const candidate = await service.evaluateSubmission(submission.id, submission.revision);

    const comparison = comparePhase1aEvaluations(workspace.evaluations[0]!, candidate);
    expect(comparison.changedInputPaths).toContain('submission.materialPayload.toolDisclosure');
  });
});
