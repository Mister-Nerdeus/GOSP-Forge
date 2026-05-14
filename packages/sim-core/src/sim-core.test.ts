import { describe, expect, it } from 'vitest';
import {
  createSimulationRunEnvelope,
  runWaterWarningController,
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
});
