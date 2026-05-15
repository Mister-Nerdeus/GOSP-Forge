export function createEstimateQualityReport(input: {
  lines: Array<{ unitCost: number; confidence?: { rationale?: string } }>;
  warnings: string[];
}) {
  const zeroCostLineCount = input.lines.filter((line) => line.unitCost === 0).length;
  const defaultCostLineCount = input.warnings.filter((warning) =>
    warning.toLowerCase().includes('defaulted to 0'),
  ).length;
  const defaultedQuantityCount = input.warnings.filter((warning) =>
    warning.toLowerCase().includes('missing quantity'),
  ).length;

  return {
    zeroCostLineCount,
    defaultCostLineCount,
    defaultedQuantityCount,
    confidenceImpact:
      zeroCostLineCount > 0 || defaultCostLineCount > 0 || defaultedQuantityCount > 0
        ? 'lowers-confidence'
        : 'no-placeholder-costs-detected',
  };
}
