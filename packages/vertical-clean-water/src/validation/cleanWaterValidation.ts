export type CleanWaterValidationIssue = {
  severity: 'warning' | 'blocker';
  code: string;
  message: string;
  path?: string;
};

type ModuleLike = {
  id?: string;
  name?: string;
  type?: string;
  capabilities?: { capabilities?: string[] };
  safetyProfile?: { notes?: string[]; realWorldUseLimit?: string };
};

function textValues(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(textValues);
  if (typeof value === 'object' && value !== null) return Object.values(value).flatMap(textValues);
  return [];
}

function isCleanWaterModule(module: ModuleLike) {
  const text = [
    module.id,
    module.name,
    module.type,
    ...(module.capabilities?.capabilities ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return /\b(water|filter|tank|pump|turbidity)\b/.test(text);
}

function hasNoPotableClaimLanguage(value: string) {
  const normalized = value.toLowerCase();
  return (
    normalized.includes('no potable') ||
    normalized.includes('not potable') ||
    normalized.includes('does not certify potable') ||
    normalized.includes('without potable')
  );
}

export function validateCleanWaterModuleSafety(value: unknown): CleanWaterValidationIssue[] {
  const module = typeof value === 'object' && value !== null ? (value as ModuleLike) : {};
  if (!isCleanWaterModule(module)) return [];

  const issues: CleanWaterValidationIssue[] = [];
  const riskyClaim = textValues(module).some((line) => {
    const risky =
      /certif(?:y|ies|ied|ication).{0,40}potable/i.test(line) ||
      /potable.{0,40}certif(?:y|ies|ied|ication)/i.test(line) ||
      /\bsafe\s+to\s+drink\b/i.test(line) ||
      /\bdrinkable\b/i.test(line);
    return risky && !hasNoPotableClaimLanguage(line);
  });
  if (riskyClaim) {
    issues.push({
      severity: 'blocker',
      code: 'unsafe-potable-water-claim',
      message: 'Clean Water module text contains a potable-water certification or safety claim.',
    });
  }

  if (!module.safetyProfile) {
    issues.push({
      severity: 'blocker',
      code: 'missing-clean-water-safety-profile',
      message: 'Clean Water modules require a vertical safety profile.',
      path: 'safetyProfile',
    });
    return issues;
  }

  const safetyText = [
    module.safetyProfile.realWorldUseLimit,
    ...(module.safetyProfile.notes ?? []),
  ].join(' ');
  if (!hasNoPotableClaimLanguage(safetyText)) {
    issues.push({
      severity: 'blocker',
      code: 'missing-no-potable-claim',
      message: 'Clean Water module safety profiles must state no potable-water claim.',
      path: 'safetyProfile.realWorldUseLimit',
    });
  }
  return issues;
}

export function validateCleanWaterEducationGuide(
  content: string,
  kind: 'teacher' | 'student' | 'unknown' = 'unknown',
): CleanWaterValidationIssue[] {
  if (kind !== 'student' || hasNoPotableClaimLanguage(content)) return [];
  return [
    {
      severity: 'blocker',
      code: 'missing-no-potable-claim',
      message: 'Clean Water student guides must state no potable-water claim.',
    },
  ];
}
