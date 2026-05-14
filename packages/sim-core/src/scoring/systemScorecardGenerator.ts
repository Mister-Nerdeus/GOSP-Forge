import { scoreCleanWater } from '../cleanWater/scoreCleanWater.js';
import type { ModuleScorecard } from './moduleScorecardGenerator.js';

type ScoringProfile = Parameters<typeof scoreCleanWater>[0];
type ConfidenceLevel = 'low' | 'medium' | 'high' | 'reviewed';

type PowerOutput = {
  compatible: boolean;
};

type FlowOutput = {
  cleanWaterLiters: number;
};

export type SystemScorecard = {
  projectId: string;
  profileId: string;
  profileVersion: string;
  score: number;
  confidence: {
    level: ConfidenceLevel;
    rationale: string;
  };
  componentScores: Record<string, number>;
  moduleScoreRefs: string[];
  rationale: string[];
};

export function generateSystemScorecard(input: {
  projectId: string;
  profile: ScoringProfile;
  flow: FlowOutput;
  power: PowerOutput;
  confidenceLevel: ConfidenceLevel;
  warningCount?: number;
  moduleScorecards: ModuleScorecard[];
}): SystemScorecard {
  const score = scoreCleanWater(input.profile, {
    cleanWaterLiters: input.flow.cleanWaterLiters,
    powerCompatible: input.power.compatible,
    confidenceLevel: input.confidenceLevel,
    warningCount: input.warningCount ?? 0,
  });
  const moduleConfidencePenalty = input.moduleScorecards.some(
    (scorecard) => scorecard.confidence.level === 'low',
  );

  return {
    projectId: input.projectId,
    profileId: score.profileId,
    profileVersion: score.profileVersion,
    score: score.score,
    confidence: {
      level: moduleConfidencePenalty || input.warningCount ? 'low' : score.confidence.level,
      rationale:
        moduleConfidencePenalty || input.warningCount
          ? 'System scorecard confidence lowered by module-level gaps or simulation warnings.'
          : score.confidence.rationale,
    },
    componentScores: score.componentScores,
    moduleScoreRefs: input.moduleScorecards.map((scorecard) => scorecard.moduleId),
    rationale: [
      ...score.rationale,
      'System scorecard is generated from simulation outputs and module scorecards.',
    ],
  };
}
