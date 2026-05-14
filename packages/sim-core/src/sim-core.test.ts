import { describe, expect, it } from 'vitest';
import {
  createSimulationRunEnvelope,
  applyProductSpecEffects,
  compareCleanWaterBaselines,
  createCleanWaterImpactReport,
  runWaterWarningController,
  scoreCleanWater,
  sha256,
  simulatePowerFlow,
  simulateWaterFlow,
  stableStringify,
} from './index.js';
describe('sim-core foundation', () => {
  it('stable stringifies and hashes deterministically', () => {
    expect(stableStringify({ b: 1, a: 2 })).toBe(stableStringify({ a: 2, b: 1 }));
    expect(sha256('x')).toBe(sha256('x'));
  });
  it('simulates clean water flow with visible missing data', () => {
    const out = simulateWaterFlow({ sourceLiters: 10, minutes: 3 });
    expect(out.cleanWaterLiters).toBe(2.4);
    expect(out.warnings.length).toBe(1);
  });
  it('checks power compatibility and controller logic', () => {
    expect(
      simulatePowerFlow({ id: 'battery', voltageV: 12 }, [{ id: 'pump', voltageV: 9 }]).compatible,
    ).toBe(false);
    expect(runWaterWarningController(6).state.dashboardStatus).toBe('warning');
  });
  it('creates validated run envelope', () => {
    expect(
      createSimulationRunEnvelope({
        runId: 'run',
        projectId: 'proj',
        moduleIds: ['m'],
        modelVersion: '0.1.0',
        assumptions: [{ id: 'a', description: 'A' }],
        output: { ok: true },
      }),
    ).toBeTruthy();
  });
  it('maps known product spec targets and warns on unknown targets', () => {
    const result = applyProductSpecEffects(
      [
        { id: 'flow', value: 2, meaning: { targetField: 'pumpFlowLpm' } },
        { id: 'sponsor', value: true, meaning: { targetField: 'sponsoredBoost' } },
        {
          id: 'replacement',
          value: 1,
          meaning: { affects: ['cost'], targetField: 'replacementIntervalYears' },
        },
      ],
      {},
    );

    expect(result.target.pumpFlowLpm).toBe(2);
    expect(result.target.sponsoredBoost).toBeUndefined();
    expect(result.target.replacementIntervalYears).toBeUndefined();
    expect(result.warnings).toEqual([
      expect.objectContaining({ code: 'unknown-product-spec-target' }),
    ]);
  });
  it('compares clean water baselines as anchors without superiority claims', () => {
    const comparison = compareCleanWaterBaselines({
      mode: 'education',
      simulatedCleanWaterLiters: 8,
      baselines: [
        {
          id: 'commercial-gravity-filter',
          name: 'Commercial gravity filter',
          description: 'Classroom comparison baseline.',
        },
      ],
    });

    expect(comparison.comparisonType).toBe('anchor-only-not-superiority-claim');
    expect(comparison.baselines[0].interpretation).toContain('not a claim of superiority');
  });
  it('reports direct and downstream impacts separately', () => {
    const report = createCleanWaterImpactReport({
      flow: { cleanWaterLiters: 8 },
      power: { compatible: true },
    });

    expect(report.direct[0].id).toBe('direct-pump-flow');
    expect(report.downstream.length).toBeGreaterThan(0);
    expect(report.limitations.join(' ')).toContain('No potable-water certification');
  });
  it('scores clean water output with sponsor-neutral inputs', () => {
    const profile = {
      id: 'clean-water-scoring-profile',
      version: '0.1.0',
      sponsorNeutral: true as const,
      components: [
        { id: 'clean-water-volume', weight: 0.45 },
        { id: 'power-compatibility', weight: 0.25 },
        { id: 'confidence', weight: 0.2 },
        { id: 'warning-penalty', weight: 0.1 },
      ],
    };
    const input = {
      cleanWaterLiters: 8,
      powerCompatible: true,
      confidenceLevel: 'medium' as const,
      warningCount: 0,
    };

    expect(scoreCleanWater(profile, { ...input, sponsored: false }).score).toBe(
      scoreCleanWater(profile, { ...input, sponsored: true }).score,
    );
    expect(scoreCleanWater(profile, input).componentScores).toMatchObject({
      'clean-water-volume': 80,
      'power-compatibility': 100,
    });
  });
});
