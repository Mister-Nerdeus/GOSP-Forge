type Confidence = {
  level: 'low' | 'medium' | 'high' | 'reviewed';
  rationale: string;
};

type ScorecardWarning = {
  code: string;
  message: string;
  severity: 'info' | 'warning' | 'blocker';
};

export type ModuleScorecard = {
  moduleId: string;
  profileId: string;
  score: number;
  confidence: Confidence;
  componentScores: Record<string, number>;
  rationale: string[];
};

function confidenceFromDataGaps(dataGapCount: number): Confidence {
  if (dataGapCount > 0) {
    return {
      level: 'low',
      rationale: 'Module scorecard confidence lowered by warnings or defaulted inputs.',
    };
  }

  return {
    level: 'medium',
    rationale: 'Module scorecard derived from resolved manifest refs and screening outputs.',
  };
}

export function generateModuleScorecards(input: {
  moduleIds: string[];
  profileId: string;
  warnings?: ScorecardWarning[];
  defaultedInputs?: string[];
}): ModuleScorecard[] {
  const dataGapCount = (input.warnings?.length ?? 0) + (input.defaultedInputs?.length ?? 0);
  const dataCompleteness = Math.max(0, 100 - dataGapCount * 10);
  const score = Number(((100 + dataCompleteness) / 2).toFixed(2));
  const confidence = confidenceFromDataGaps(dataGapCount);
  const rationale = [
    'Module is present in resolved project manifest refs.',
    'Data completeness reflects simulation warnings and defaulted inputs.',
    'Educational scorecard only; no potable-water or professional validation claim.',
  ];

  return input.moduleIds.map((moduleId) => ({
    moduleId,
    profileId: input.profileId,
    score,
    confidence,
    componentScores: {
      manifestCoverage: 100,
      dataCompleteness,
    },
    rationale,
  }));
}
