export function createEstimateQualityReport(input: {
  lines: Array<{ id: string; unitCost: number; confidence?: { rationale?: string } }>;
  warnings: string[];
}) {
  const zeroCostLineIds = input.lines
    .filter((line) => line.unitCost === 0)
    .map((line) => line.id);
  const defaultCostLineIds = input.warnings
    .map((warning) => warning.match(/^Missing unit cost for (.+); defaulted to 0/i)?.[1])
    .filter((id): id is string => Boolean(id));
  const defaultedQuantityIds = input.warnings
    .map((warning) => warning.match(/^Missing quantity for (?:product|fabricated module) (.+);/i)?.[1])
    .filter((id): id is string => Boolean(id));

  return {
    zeroCostLineCount: zeroCostLineIds.length,
    defaultCostLineCount: defaultCostLineIds.length,
    defaultedQuantityCount: defaultedQuantityIds.length,
    zeroCostLineIds,
    defaultCostLineIds,
    defaultedQuantityIds,
    confidenceImpact:
      zeroCostLineIds.length > 0 || defaultCostLineIds.length > 0 || defaultedQuantityIds.length > 0
        ? 'lowers-confidence'
        : 'no-placeholder-costs-detected',
  };
}
