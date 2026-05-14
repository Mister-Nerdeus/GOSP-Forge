import { describe, expect, it } from 'vitest';
import { estimateCommand } from './commands/estimate.js';
import { simulateCommand } from './commands/simulate.js';
import { validateCommand } from './commands/validate.js';
describe('cli commands', () => {
  it('validates, simulates, and estimates clean water project', () => {
    expect(validateCommand('examples/projects/automated-water-filter.project-v2.json').ok).toBe(
      true,
    );
    expect(simulateCommand('x').ok).toBe(true);
    expect(estimateCommand('x').ok).toBe(true);
  });
});
