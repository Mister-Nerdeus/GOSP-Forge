export function evaluateEstimateModeGate(input: {
  mode: string;
  qualityReport: {
    zeroCostLineCount: number;
    defaultCostLineCount: number;
    defaultedQuantityCount: number;
  };
}) {
  const issueCount =
    input.qualityReport.zeroCostLineCount +
    input.qualityReport.defaultCostLineCount +
    input.qualityReport.defaultedQuantityCount;

  if (input.mode === 'professional') {
    return {
      ok: false,
      severity: 'blocker' as const,
      message: 'Professional estimate mode remains blocked in the foundation build.',
    };
  }
  if (input.mode === 'scoring' && issueCount > 0) {
    return {
      ok: false,
      severity: 'blocker' as const,
      message: 'Scoring estimate mode blocks zero-cost, default-cost, or defaulted quantity lines.',
    };
  }
  return {
    ok: true,
    severity: issueCount > 0 ? ('warning' as const) : ('info' as const),
    message:
      issueCount > 0
        ? 'Education estimate mode reports placeholders as confidence warnings.'
        : 'Estimate mode gate found no placeholder cost or quantity blockers.',
  };
}
