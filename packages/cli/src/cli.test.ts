import { describe, expect, it } from 'vitest';
import { estimateCommand } from './commands/estimate.js';
import { simulateCommand } from './commands/simulate.js';
import { validateCommand } from './commands/validate.js';
describe('cli commands', () => {
  it('validates, simulates, and estimates clean water project', () => {
    const manifest = 'examples/projects/automated-water-filter.project-v2.json';
    expect(validateCommand(manifest).ok).toBe(true);
    const simulation = simulateCommand(manifest);
    expect(simulation.ok).toBe(true);
    if (!simulation.ok) throw new Error('Expected Clean Water simulation to succeed.');
    expect(simulation.flow.cleanWaterLiters).toBe(8);
    expect(simulation.repEvaluation.evaluation.result).toEqual({
      flow: simulation.flow,
      power: simulation.power,
      scorecards: simulation.scorecards,
    });
    expect(simulation.repEvaluation.materialInputHash).toBe(
      '809bf1cad1f3b3d18e1c605fbd4550feb8346545c7fa10720a22a00f45f90d0c',
    );
    expect(simulation.repEvaluation.materialResultHash).toBe(
      '0912de0a81bf5cc327663cfb31df0f97dd2f76102190521a912507cdae2ee5e6',
    );
    expect(simulateCommand(manifest)).toMatchObject({
      repEvaluation: { materialResultHash: simulation.repEvaluation.materialResultHash },
    });
    expect(estimateCommand(manifest).ok).toBe(true);
  });
});
