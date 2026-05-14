import { describe, expect, it } from 'vitest';
import { buildBom, estimateTotals, lifecycleCost } from './index.js';
describe('estimation foundation', () => {
  it('rolls duplicate BOM lines deterministically and warns on unknown quantities', () => {
    const r = buildBom([
      { id: 'pump', kind: 'product', description: 'Pump', quantity: 1, unit: 'each' },
      { id: 'pump', kind: 'product', description: 'Pump', quantity: 2, unit: 'each' },
      { id: 'media', kind: 'material', description: 'Filter media', unit: 'kg' },
    ]);
    expect(r.lines.find((l) => l.id === 'pump')?.quantity).toBe(3);
    expect(r.warnings.length).toBe(1);
  });
  it('totals estimates and lifecycle costs', () => {
    expect(estimateTotals([{ id: 'a', quantity: 2, unitCost: 5 }]).total).toBe(11);
    expect(
      lifecycleCost({
        horizonYears: 5,
        annualMaintenance: 10,
        replacementCost: 20,
        replacementIntervalYears: 2,
      }).total,
    ).toBe(90);
  });
});
