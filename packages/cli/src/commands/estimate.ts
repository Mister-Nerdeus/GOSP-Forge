import { buildBom, estimateTotals, lifecycleCost } from '@gosp/estimation';
export function estimateCommand(_file: string) {
  const bom = buildBom([
    { id: 'pump', kind: 'product', description: 'Classroom pump', quantity: 1, unit: 'each' },
    {
      id: 'filter-media',
      kind: 'material',
      description: 'Filter media',
      quantity: 1,
      unit: 'cartridge',
    },
    {
      id: 'housing',
      kind: 'custom-part',
      description: 'FDM filter housing',
      quantity: 1,
      unit: 'each',
    },
  ]);
  const totals = estimateTotals([
    { id: 'pump', quantity: 1, unitCost: 18 },
    { id: 'filter-media', quantity: 1, unitCost: 8 },
    { id: 'housing', quantity: 1, unitCost: 6 },
  ]);
  return {
    ok: true,
    bom,
    totals,
    lifecycle: lifecycleCost({
      horizonYears: 3,
      annualMaintenance: 12,
      replacementCost: 8,
      replacementIntervalYears: 1,
    }),
  };
}
