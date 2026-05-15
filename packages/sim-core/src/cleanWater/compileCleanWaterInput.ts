import type { WaterFlowInput } from './waterFlowTypes.js';
import { applyProductSpecEffects } from '../specMeaning/applyProductSpecEffects.js';

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
      affects?: string[];
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

export function compileCleanWaterInput(
  project: {
    id: string;
    scenarioSettings?: { cleanWater?: { sourceLiters?: number; runMinutes?: number } };
  },
  refs: RefValue[],
) {
  const warnings: Warning[] = [];
  const defaultedInputs: string[] = [];
  const products = refs.map((ref) => ref.value).filter(isProductBinding);
  const moduleIds = refs
    .filter((ref) => ref.kind === 'module')
    .map((ref) => ref.id)
    .sort();

  const effects = applyProductSpecEffects(
    products.flatMap((product) => product.specs),
    {},
  );
  warnings.push(...effects.warnings);
  const pumpFlowLpm =
    typeof effects.target.pumpFlowLpm === 'number' ? effects.target.pumpFlowLpm : undefined;
  const voltageV = typeof effects.target.voltageV === 'number' ? effects.target.voltageV : undefined;
  const filterEfficiency =
    typeof effects.target.filterEfficiency === 'number'
      ? effects.target.filterEfficiency
      : undefined;
  const pumpCurrentA =
    typeof effects.target.pumpCurrentA === 'number' ? effects.target.pumpCurrentA : undefined;
  const sourceLiters = project.scenarioSettings?.cleanWater?.sourceLiters;
  const runMinutes = project.scenarioSettings?.cleanWater?.runMinutes;
  const hasValidFilterEfficiency =
    filterEfficiency !== undefined && filterEfficiency > 0 && filterEfficiency <= 1;
  const hasValidPumpCurrent = pumpCurrentA !== undefined && pumpCurrentA > 0;

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

  if (!hasValidFilterEfficiency) {
    warnings.push({
      code: 'missing-filter-efficiency-spec',
      message: 'Missing or invalid filter efficiency spec; defaulting to 0.8.',
      severity: 'warning',
    });
    defaultedInputs.push('water.filterEfficiency');
  }

  if (!hasValidPumpCurrent) {
    warnings.push({
      code: 'missing-pump-current-spec',
      message: 'Missing or invalid pump current spec; defaulting to 1 A.',
      severity: 'warning',
    });
    defaultedInputs.push('power.loads.pump.currentA');
  }

  if (sourceLiters === undefined) {
    warnings.push({
      code: 'missing-source-liters-setting',
      message: 'Missing clean-water source liters scenario setting; defaulting to 20 L.',
      severity: 'warning',
    });
    defaultedInputs.push('water.sourceLiters');
  }

  if (runMinutes === undefined) {
    warnings.push({
      code: 'missing-run-minutes-setting',
      message: 'Missing clean-water run minutes scenario setting; defaulting to 5 minutes.',
      severity: 'warning',
    });
    defaultedInputs.push('water.minutes');
  }

  const water: WaterFlowInput = {
    pumpFlowLpm: pumpFlowLpm ?? 1,
    filterEfficiency: hasValidFilterEfficiency ? filterEfficiency : 0.8,
    sourceLiters: sourceLiters ?? 20,
    minutes: runMinutes ?? 5,
  };

  return {
    projectId: project.id,
    moduleIds,
    water,
    powerSource: { id: 'classroom-battery', voltageV: voltageV ?? 12 },
    powerLoads: [{ id: 'pump', voltageV: voltageV ?? 12, currentA: pumpCurrentA ?? 1 }],
    warnings,
    defaultedInputs,
    knownInputs: [
      ...(pumpFlowLpm === undefined ? [] : ['water.pumpFlowLpm']),
      ...(voltageV === undefined ? [] : ['power.source.voltageV']),
      ...(hasValidFilterEfficiency ? ['water.filterEfficiency'] : []),
      ...(hasValidPumpCurrent ? ['power.loads.pump.currentA'] : []),
      ...(sourceLiters === undefined ? [] : ['water.sourceLiters']),
      ...(runMinutes === undefined ? [] : ['water.minutes']),
    ],
    unknownInputs: [],
    confidence: {
      level: warnings.length ? ('low' as const) : ('medium' as const),
      rationale: warnings.length
        ? 'Manifest refs compiled with missing specs defaulted.'
        : 'Manifest refs compiled with product specs.',
    },
  };
}
