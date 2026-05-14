import { describe, expect, it } from 'vitest';
import {
  buildBom,
  buildBomFromProject,
  estimateFromProject,
  estimateTotals,
  lifecycleCost,
} from './index.js';
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

  it('adds separate fabrication machine and labor BOM lines from profiles', () => {
    const result = buildBomFromProject({
      refs: [
        {
          id: 'filter-housing',
          kind: 'module',
          value: {
            kind: 'ModulePackage',
            id: 'filter-housing',
            name: 'Filter Housing',
            capabilities: { requiresFabrication: true },
            fabricationProfile: {
              materials: [{ id: 'pla', name: 'PLA', unit: 'g', quantity: 120 }],
              routes: [{ process: 'fdm-print', machineTimeMinutes: 300, laborMinutes: 20 }],
              labor: { setupMinutes: 15, assemblyMinutes: 20, inspectionMinutes: 10 },
            },
          },
        },
      ],
    });

    expect(result.lines.map((line) => [line.id, line.kind, line.quantity])).toEqual([
      ['filter-housing', 'custom-part', 1],
      ['filter-housing:labor', 'labor', 65],
      ['filter-housing:machine-time', 'process', 300],
      ['filter-housing:pla', 'material', 120],
    ]);
  });

  it('creates a conceptual cost estimate from BOM lines and price entries', () => {
    const result = estimateFromProject({
      projectId: 'project',
      refs: [
        {
          id: 'classroom-diaphragm-pump',
          kind: 'product',
          value: {
            kind: 'ProductBinding',
            id: 'classroom-diaphragm-pump',
            name: 'Classroom Diaphragm Pump',
            moduleIds: ['pump'],
          },
        },
      ],
    });

    expect(result.estimate.total).toBe(19.8);
    expect(result.estimate.lines[0]).toMatchObject({
      id: 'classroom-diaphragm-pump',
      kind: 'product',
      unitCost: 18,
      currency: 'USD',
    });
    expect(result.estimate.assumptions.join(' ').toLowerCase()).toContain('not a quote');
  });

  it('lowers confidence when a BOM line has no price entry', () => {
    const result = estimateFromProject({
      projectId: 'project',
      refs: [
        {
          id: 'unknown-product',
          kind: 'product',
          value: {
            kind: 'ProductBinding',
            id: 'unknown-product',
            name: 'Unknown Product',
            moduleIds: ['unknown'],
          },
        },
      ],
    });

    expect(result.estimate.total).toBe(0);
    expect(result.estimate.confidence.level).toBe('low');
    expect(result.warnings).toContain('Missing unit cost for unknown-product; defaulted to 0 USD.');
  });
});
