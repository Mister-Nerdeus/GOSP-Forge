import { combineConfidence } from '../confidencePolicy.js';
import { replacementCount } from './replacementSchedule.js';

type ProductLike = {
  id: string;
  kind?: string;
  specs?: Array<{
    id: string;
    value: string | number | boolean;
    unit?: string;
    meaning?: {
      targetField?: string;
    };
  }>;
};

type PriceEntry = {
  id: string;
  unitCost: number;
};

function numericSpec(product: ProductLike, targetField: string): number | undefined {
  const spec = product.specs?.find((candidate) => candidate.meaning?.targetField === targetField);
  return typeof spec?.value === 'number' ? spec.value : undefined;
}

export function lifecycleFromProducts(input: {
  products: ProductLike[];
  priceEntries: PriceEntry[];
  horizonYears: number;
}) {
  const warnings: string[] = [];
  const prices = new Map(input.priceEntries.map((entry) => [entry.id, entry.unitCost]));
  let maintenanceCost = 0;
  let replacementReserve = 0;
  const confidenceLevels: Array<'low' | 'medium' | 'high' | 'reviewed'> = [];

  for (const product of input.products) {
    const intervalYears = numericSpec(product, 'replacementIntervalYears');
    const annualMaintenanceCost = numericSpec(product, 'annualMaintenanceCost') ?? 0;
    maintenanceCost += annualMaintenanceCost * input.horizonYears;

    const replacements = replacementCount(input.horizonYears, intervalYears);
    if (replacements.warning) {
      warnings.push(`${product.id}: ${replacements.warning}`);
      confidenceLevels.push('low');
      continue;
    }

    const unitCost = prices.get(product.id);
    if (unitCost === undefined) {
      warnings.push(`${product.id}: Missing replacement unit cost; defaulted to 0 USD.`);
      confidenceLevels.push('low');
      continue;
    }

    replacementReserve += replacements.count * unitCost;
    confidenceLevels.push('medium');
  }

  const confidenceLevel = combineConfidence(confidenceLevels.length ? confidenceLevels : ['low']);
  return {
    lifecycle: {
      horizonYears: input.horizonYears,
      operatingCost: 0,
      maintenanceCost: Number(maintenanceCost.toFixed(2)),
      replacementReserve: Number(replacementReserve.toFixed(2)),
      total: Number((maintenanceCost + replacementReserve).toFixed(2)),
      confidence: {
        level: confidenceLevel,
        rationale: warnings.length
          ? 'Lifecycle estimate has missing product interval or cost data.'
          : 'Lifecycle estimate compiled from product replacement and maintenance specs.',
      },
      assumptions: [
        `${input.horizonYears}-year lifecycle horizon.`,
        'Replacement reserves use default classroom price-pack costs.',
        'Educational/conceptual lifecycle estimate only.',
      ],
    },
    warnings,
  };
}
