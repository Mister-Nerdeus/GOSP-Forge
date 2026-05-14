export type SafetyValidationIssue = {
  severity: 'warning' | 'blocker';
  code: string;
  message: string;
  path?: string;
};

type ModuleLike = {
  id?: string;
  name?: string;
  type?: string;
  capabilities?: {
    capabilities?: string[];
  };
  safetyProfile?: {
    category?: string;
    notes?: string[];
    realWorldUseLimit?: string;
  };
  educationProfile?: unknown;
};

const riskyClaimPatterns = [
  /certif(?:y|ies|ied|ication).{0,40}potable/i,
  /potable.{0,40}certif(?:y|ies|ied|ication)/i,
  /\bsafe\s+to\s+drink\b/i,
  /\bdrinkable\b/i,
  /approved.{0,40}(drinking|potable|professional|production|real-world)/i,
  /professional.{0,40}(approval|approved|certified|validated)/i,
  /production.{0,40}(approved|ready)/i,
];

function textValues(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(textValues);
  if (typeof value === 'object' && value !== null) {
    return Object.values(value).flatMap(textValues);
  }
  return [];
}

function joinedModuleText(module: ModuleLike): string {
  return [
    module.id,
    module.name,
    module.type,
    ...(module.capabilities?.capabilities ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function isWaterOrElectricalModule(module: ModuleLike): boolean {
  return isWaterModule(module) || isElectricalModule(module);
}

function isWaterModule(module: ModuleLike): boolean {
  const text = joinedModuleText(module);
  return /\b(water|filter|tank|pump|sensor)\b/.test(text);
}

function isElectricalModule(module: ModuleLike): boolean {
  const text = joinedModuleText(module);
  return /\b(battery|power|electrical|voltage)\b/.test(text);
}

function requiresSafetyProfile(module: ModuleLike): boolean {
  return (
    ['physical', 'hybrid', 'biological'].includes(module.type ?? '') ||
    isWaterOrElectricalModule(module)
  );
}

function includesNoClaimLanguage(value: string | undefined, claim: 'potable' | 'professional') {
  if (!value) return false;
  const normalized = value.toLowerCase();
  return (
    normalized.includes(`no ${claim}`) ||
    normalized.includes(`not ${claim}`) ||
    normalized.includes(`does not ${claim}`) ||
    normalized.includes(`${claim}-water or professional-use claim`) ||
    normalized.includes(`${claim}-use claim`)
  );
}

export function validateModuleSafety(value: unknown): SafetyValidationIssue[] {
  const module = typeof value === 'object' && value !== null ? (value as ModuleLike) : {};
  const issues: SafetyValidationIssue[] = [];
  const textLines = textValues(module);

  if (
    textLines.some((line) => {
      const normalized = line.toLowerCase();
      const isDisclaimer =
        /\b(no|not|does not|without)\b.{0,50}\b(claim|approval|approved|certif|ready|safe to drink|drinkable)\b/.test(
          normalized,
        ) || /\b(no|not|does not|without)\b/.test(normalized);
      return !isDisclaimer && riskyClaimPatterns.some((pattern) => pattern.test(line));
    })
  ) {
    issues.push({
      severity: 'blocker',
      code: 'unsafe-real-world-claim',
      message:
        'Module text contains a potable-water, professional approval, or production-readiness claim.',
    });
  }

  if (requiresSafetyProfile(module) && !module.safetyProfile) {
    issues.push({
      severity: 'blocker',
      code: 'missing-safety-profile',
      message: 'Physical, water, or electrical modules require a safety profile.',
      path: 'safetyProfile',
    });
  }

  if (isWaterOrElectricalModule(module) && module.safetyProfile) {
    const safetyText = [
      module.safetyProfile.realWorldUseLimit,
      ...(module.safetyProfile.notes ?? []),
    ].join(' ');

    if (isWaterModule(module) && !includesNoClaimLanguage(safetyText, 'potable')) {
      issues.push({
        severity: 'blocker',
        code: 'missing-no-potable-claim',
        message: 'Water or electrical module safety profile must state no potable-water claim.',
        path: 'safetyProfile.realWorldUseLimit',
      });
    }

    if (!includesNoClaimLanguage(safetyText, 'professional')) {
      issues.push({
        severity: 'blocker',
        code: 'missing-no-professional-claim',
        message: 'Water or electrical module safety profile must state no professional-use claim.',
        path: 'safetyProfile.realWorldUseLimit',
      });
    }
  }

  if (module.educationProfile) {
    issues.push({
      severity: 'warning',
      code: 'education-mode-not-approval',
      message: 'Education profile is instructional context, not safety approval.',
      path: 'educationProfile',
    });
  }

  return issues;
}
