import type { WaterFlowInput } from './waterFlowTypes.js';

type RefValue = {
  id: string;
  kind: string;
  value: unknown;
};

type ProductBindingLike = {
  kind: 'ProductBinding';
  id: string;
  moduleIds: string[];
  specs: Array<{
    id: string;
    value: string | number | boolean;
    unit?: string;
    meaning?: {
      targetField?: string;
    };
  }>;
};

type Warning = { code: string; message: string; severity: 'info' | 'warning' | 'blocker' };

function isProductBinding(value: unknown): value is ProductBindingLike {
  return (
    typeof value === 'object' &&
    value !== null &&
    'kind' in value &&
    value.kind === 'ProductBinding' &&
    'specs' in value &&
    Array.isArray(value.specs)
  );
}

function numberSpec(product: ProductBindingLike, targetField: string): number | undefined {
  const spec = product.specs.find((item) => item.meaning?.targetField === targetField);
  return typeof spec?.value === 'number' ? spec.value : undefined;
}

export function compileCleanWaterInput(project: { id: string }, refs: RefValue[]) {
  const warnings: Warning[] = [];
  const defaultedInputs: string[] = [];
  const products = refs.map((ref) => ref.value).filter(isProductBinding);
  const moduleIds = refs
    .filter((ref) => ref.kind === 'module')
    .map((ref) => ref.id)
    .sort();

  const pump = products.find((product) => product.moduleIds.includes('pump'));
  const battery = products.find((product) => product.moduleIds.includes('classroom-battery'));
  const pumpFlowLpm = pump ? numberSpec(pump, 'pumpFlowLpm') : undefined;
  const voltageV = battery ? numberSpec(battery, 'voltageV') : undefined;

  if (pumpFlowLpm === undefined) {
    warnings.push({
      code: 'missing-pump-flow-spec',
      message: 'Missing pump flow spec; defaulting to 1 L/min.',
      severity: 'warning',
    });
    defaultedInputs.push('water.pumpFlowLpm');
  }

  if (voltageV === undefined) {
    warnings.push({
      code: 'missing-battery-voltage-spec',
      message: 'Missing battery voltage spec; defaulting to 12 V.',
      severity: 'warning',
    });
    defaultedInputs.push('power.source.voltageV');
  }

  defaultedInputs.push('water.sourceLiters', 'water.minutes', 'water.filterEfficiency');

  const water: WaterFlowInput = {
    pumpFlowLpm: pumpFlowLpm ?? 1,
    filterEfficiency: 0.8,
    sourceLiters: 20,
    minutes: 5,
  };

  return {
    projectId: project.id,
    moduleIds,
    water,
    powerSource: { id: 'classroom-battery', voltageV: voltageV ?? 12 },
    powerLoads: [{ id: 'pump', voltageV: voltageV ?? 12, currentA: 1 }],
    warnings,
    defaultedInputs,
    unknownInputs: [],
    confidence: {
      level: warnings.length ? ('low' as const) : ('medium' as const),
      rationale: warnings.length
        ? 'Manifest refs compiled with missing specs defaulted.'
        : 'Manifest refs compiled with product specs.',
    },
  };
}
