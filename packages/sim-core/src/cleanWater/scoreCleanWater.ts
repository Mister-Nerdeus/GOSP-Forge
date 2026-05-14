type ScoringProfile = {
  id: string;
  version: string;
  sponsorNeutral: true;
  components: Array<{
    id: string;
    weight: number;
  }>;
};

type CleanWaterScoreInput = {
  cleanWaterLiters: number;
  powerCompatible: boolean;
  confidenceLevel: 'low' | 'medium' | 'high' | 'reviewed';
  warningCount?: number;
  sponsored?: boolean;
};

const confidenceScores = {
  low: 35,
  medium: 70,
  high: 90,
  reviewed: 100,
} as const;

function componentValue(id: string, input: CleanWaterScoreInput): number {
  if (id === 'clean-water-volume') return Math.min(input.cleanWaterLiters / 10, 1) * 100;
  if (id === 'power-compatibility') return input.powerCompatible ? 100 : 0;
  if (id === 'confidence') return confidenceScores[input.confidenceLevel];
  if (id === 'warning-penalty') return Math.max(0, 100 - (input.warningCount ?? 0) * 15);
  return 0;
}

export function scoreCleanWater(profile: ScoringProfile, input: CleanWaterScoreInput) {
  const totalWeight = profile.components.reduce((sum, component) => sum + component.weight, 0);
  const componentScores: Record<string, number> = {};
  let weightedScore = 0;

  for (const component of profile.components) {
    const value = Number(componentValue(component.id, input).toFixed(2));
    componentScores[component.id] = value;
    weightedScore += value * component.weight;
  }

  const score = totalWeight > 0 ? Number((weightedScore / totalWeight).toFixed(2)) : 0;
  return {
    profileId: profile.id,
    profileVersion: profile.version,
    score,
    componentScores,
    confidence: {
      level: input.warningCount ? ('low' as const) : ('medium' as const),
      rationale: input.warningCount
        ? 'Warnings reduce scoring confidence.'
        : 'Score computed from explicit Clean Water scoring profile.',
    },
    rationale: [
      'Score uses weighted, documented components only.',
      'Sponsor status is ignored and cannot affect the score.',
      'Educational score only; no potable-water or professional validation claim.',
    ],
  };
}
