import { describe, expect, it } from 'vitest';
import { estimateCommand } from './commands/estimate.js';
import { simulateCommand } from './commands/simulate.js';
import { validateCommand } from './commands/validate.js';
describe('cli commands', () => {
  it('validates, simulates, and estimates clean water project', () => {
    const manifest = 'examples/projects/automated-water-filter.project-v2.json';
    expect(validateCommand(manifest).ok).toBe(true);
    expect(simulateCommand(manifest).ok).toBe(true);
    expect(estimateCommand(manifest).ok).toBe(true);
  });
});
