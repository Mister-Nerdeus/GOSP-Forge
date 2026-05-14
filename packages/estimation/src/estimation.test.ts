import { describe, expect, it } from 'vitest';
import { buildBom, buildBomFromProject, estimateTotals, lifecycleCost } from './index.js';
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

  it('builds a BOM from manifest ref documents with visible defaulted quantities', () => {
    const result = buildBomFromProject({
      refs: [
        {
          id: 'pump-product',
          kind: 'product',
          value: {
            kind: 'ProductBinding',
            id: 'pump-product',
            name: 'Pump product',
            moduleIds: ['pump'],
          },
        },
        {
          id: 'housing',
          kind: 'module',
          value: {
            kind: 'ModulePackage',
            id: 'housing',
            name: 'Housing',
            capabilities: { requiresFabrication: true },
            fabricationProfile: {
              materials: [{ id: 'pla', name: 'PLA', unit: 'g', quantity: 120 }],
            },
          },
        },
      ],
    });

    expect(result.lines.map((line) => [line.id, line.kind, line.quantity])).toEqual([
      ['housing', 'custom-part', 1],
      ['housing:pla', 'material', 120],
      ['pump-product', 'product', 1],
    ]);
    expect(result.lines.find((line) => line.id === 'pump-product')?.confidence.level).toBe('low');
    expect(result.warnings).toEqual([
      'Missing quantity for product pump-product; defaulted to 1 each.',
      'Missing quantity for fabricated module housing; defaulted to 1 each.',
    ]);
  });
});
