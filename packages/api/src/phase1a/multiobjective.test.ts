import { describe, expect, it } from 'vitest';
import type { Phase1aObjective } from '@gosp/contracts';
import { comparePhase1aEvaluations, Phase1aService } from './service.js';

const cloneWithSecondary = <T extends { evaluation: { result: unknown } }>(view: T, secondary: number) => {
  const cloned = structuredClone(view);
  cloned.evaluation.result = {
    ...(cloned.evaluation.result as Record<string, unknown>),
    secondary,
  };
  return cloned;
};

describe('Phase-1A multi-objective comparison', () => {
  it('reports a tradeoff when each design wins at least one objective', async () => {
    const workspace = await new Phase1aService().getWorkspace();
    const baseline = cloneWithSecondary(workspace.evaluations[0]!, 20);
    const candidate = cloneWithSecondary(workspace.evaluations[1]!, 10);
    const objectives: Phase1aObjective[] = [
      { id: 'primary', label: 'Primary', resultPath: 'result.value', direction: 'maximize' },
      { id: 'secondary', label: 'Secondary', resultPath: 'result.secondary', direction: 'minimize' },
    ];

    const comparison = comparePhase1aEvaluations(baseline, candidate, objectives);

    expect(comparison.dominance).toBe('tradeoff');
    expect(comparison.objectiveOutcomes).toEqual([
      expect.objectContaining({ id: 'primary', preferred: 'baseline' }),
      expect.objectContaining({ id: 'secondary', preferred: 'candidate' }),
    ]);
  });

  it('reports candidate dominance when it is no worse on every objective and better on at least one', async () => {
    const workspace = await new Phase1aService().getWorkspace();
    const baseline = cloneWithSecondary(workspace.evaluations[0]!, 20);
    const candidate = cloneWithSecondary(workspace.evaluations[1]!, 10);
    const objectives: Phase1aObjective[] = [
      { id: 'primary', label: 'Primary', resultPath: 'result.value', direction: 'minimize' },
      { id: 'secondary', label: 'Secondary', resultPath: 'result.secondary', direction: 'minimize' },
    ];

    const comparison = comparePhase1aEvaluations(baseline, candidate, objectives);

    expect(comparison.dominance).toBe('candidate-dominates');
  });

  it('does not allow a better objective value to override a failed hard gate', async () => {
    const workspace = await new Phase1aService().getWorkspace();
    const baseline = structuredClone(workspace.evaluations[0]!);
    const candidate = structuredClone(workspace.evaluations[1]!);
    candidate.evaluation.result = { value: 1000 };
    candidate.hardGates[0]!.passed = false;

    const comparison = comparePhase1aEvaluations(baseline, candidate, [
      { id: 'primary', label: 'Primary', resultPath: 'result.value', direction: 'maximize' },
    ]);

    expect(comparison.dominance).toBe('baseline-dominates');
    expect(comparison.hardGateChanges[0]).toEqual(
      expect.objectContaining({ baselinePassed: true, candidatePassed: false, changed: true }),
    );
  });

  it('reports equivalence when every declared objective ties and all gates pass', async () => {
    const workspace = await new Phase1aService().getWorkspace();
    const baseline = structuredClone(workspace.evaluations[0]!);
    const candidate = structuredClone(workspace.evaluations[1]!);
    candidate.evaluation.result = structuredClone(baseline.evaluation.result);

    const comparison = comparePhase1aEvaluations(baseline, candidate, [
      { id: 'primary', label: 'Primary', resultPath: 'result.value', direction: 'maximize' },
    ]);

    expect(comparison.dominance).toBe('equivalent');
  });
});
