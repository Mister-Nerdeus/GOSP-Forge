import { CostEstimateSchema } from '@gosp/contracts';
import { buildBomFromProject } from './bom/buildBomFromProject.js';
import type { BomBuildResult } from './bom/bomTypes.js';
import { combineConfidence } from './confidencePolicy.js';
import { estimateTotals } from './estimateTotals.js';
import { lifecycleCost } from './lifecycle/lifecycleCost.js';
import { defaultClassroomPricePack } from './price/defaultClassroomPricePack.js';

type RefDocument = Parameters<typeof buildBomFromProject>[0]['refs'][number];
type CostLineKind =
  | 'bom'
  | 'product'
  | 'fabrication'
  | 'labor'
  | 'installation'
  | 'operation'
  | 'maintenance'
  | 'replacement'
  | 'contingency';

function costLineKindForBom(kind: BomBuildResult['lines'][number]['kind']): CostLineKind {
  if (kind === 'product') return 'product';
  if (kind === 'labor') return 'labor';
  if (kind === 'material' || kind === 'custom-part' || kind === 'process') return 'fabrication';
  return 'bom';
}

export function estimateFromProject(input: {
  projectId: string;
  refs: RefDocument[];
  pricePack?: typeof defaultClassroomPricePack;
}) {
  const bom = buildBomFromProject({ refs: input.refs });
  const pricePack = input.pricePack ?? defaultClassroomPricePack;
  const prices = new Map(pricePack.entries.map((entry) => [entry.id, entry]));
  const warnings = [...bom.warnings];

  const lines = bom.lines.map((line) => {
    const price = prices.get(line.id);
    if (!price) warnings.push(`Missing unit cost for ${line.id}; defaulted to 0 USD.`);
    const confidenceLevel = combineConfidence([
      line.confidence.level,
      price ? 'medium' : 'low',
    ]);
    return {
      id: line.id,
      kind: costLineKindForBom(line.kind),
      description: line.description,
      quantity: line.quantity,
      unitCost: price?.unitCost ?? 0,
      currency: price?.currency ?? pricePack.currency,
      confidence: {
        level: confidenceLevel,
        rationale: price
          ? `Cost from ${pricePack.id}; ${line.confidence.rationale}`
          : 'Missing price entry; zero cost placeholder lowers confidence.',
      },
      sourceRefs: price ? [price.source] : [],
    };
  });

  const totals = estimateTotals(lines);
  const lifecycle = lifecycleCost({
    horizonYears: 3,
    annualMaintenance: 12,
    replacementCost: 8,
    replacementIntervalYears: 1,
  });
  const estimate = CostEstimateSchema.parse({
    id: `${input.projectId}-classroom-cost-estimate`,
    projectId: input.projectId,
    lines,
    lifecycle: {
      horizonYears: lifecycle.horizonYears,
      operatingCost: 0,
      maintenanceCost: lifecycle.maintenanceCost,
      replacementReserve: lifecycle.replacementReserve,
      total: lifecycle.total,
      confidence: {
        level: 'low',
        rationale: 'Lifecycle assumptions are foundation classroom placeholders.',
      },
      assumptions: [
        'Three-year classroom horizon.',
        'Maintenance and replacement costs are conceptual placeholders.',
      ],
    },
    contingency: totals.contingency,
    total: totals.total,
    confidence: {
      level: combineConfidence(lines.map((line) => line.confidence.level)),
      rationale: warnings.length
        ? 'Some quantities or costs are defaulted or missing.'
        : 'All BOM lines matched default classroom price entries.',
    },
    assumptions: [
      'Educational/conceptual classroom estimate only.',
      'Not a quote, procurement instruction, permit-ready estimate, or professional review.',
      ...pricePack.entries.map((entry) => entry.assumption),
    ],
    sourceRefs: [...new Set(lines.flatMap((line) => line.sourceRefs))],
  });

  return { bom, totals, lifecycle: estimate.lifecycle, estimate, warnings };
}
