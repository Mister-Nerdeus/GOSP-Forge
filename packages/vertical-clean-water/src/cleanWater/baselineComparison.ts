type Baseline = {
  id: string;
  name: string;
  description: string;
  confidence?: { level: string; rationale: string };
};

type Warning = { code: string; message: string; severity: 'info' | 'warning' | 'blocker' };

export function compareCleanWaterBaselines(input: {
  mode: string;
  baselines: Baseline[];
  simulatedCleanWaterLiters?: number;
}) {
  const warnings: Warning[] = [];
  if (input.mode === 'scoring' && input.baselines.length === 0) {
    warnings.push({
      code: 'scoring-baselines-required',
      message: 'Scoring mode requires baseline anchors.',
      severity: 'blocker',
    });
  } else if (input.baselines.length === 0) {
    warnings.push({
      code: 'missing-baseline-data',
      message: 'No baseline anchors were available for comparison.',
      severity: 'warning',
    });
  }

  return {
    kind: 'CleanWaterBaselineComparison',
    simulatedCleanWaterLiters: input.simulatedCleanWaterLiters,
    comparisonType: 'anchor-only-not-superiority-claim',
    baselines: input.baselines.map((baseline) => ({
      id: baseline.id,
      name: baseline.name,
      description: baseline.description,
      confidence: baseline.confidence,
      interpretation: 'Comparison anchor only; not a claim of superiority or potable-water safety.',
    })),
    warnings,
  };
}
