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
  /approved.{0,40}(professional|production|real-world)/i,
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

function isElectricalModule(module: ModuleLike): boolean {
  const text = joinedModuleText(module);
  return /\b(battery|power|electrical|voltage)\b/.test(text);
}

function requiresSafetyProfile(module: ModuleLike): boolean {
  return (
    ['physical', 'hybrid', 'biological'].includes(module.type ?? '') ||
    isElectricalModule(module)
  );
}

function includesNoProfessionalClaimLanguage(value: string | undefined) {
  if (!value) return false;
  const normalized = value.toLowerCase();
  return (
    normalized.includes('no professional') ||
    normalized.includes('not professional') ||
    normalized.includes('does not provide professional') ||
    normalized.includes('professional-use claim') ||
    normalized.includes('professional approval is not')
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
      message: 'Module text contains a professional approval or production-readiness claim.',
    });
  }

  if (requiresSafetyProfile(module) && !module.safetyProfile) {
    issues.push({
      severity: 'blocker',
      code: 'missing-safety-profile',
      message: 'Physical or electrical safety-sensitive modules require a safety profile.',
      path: 'safetyProfile',
    });
  }

  if (requiresSafetyProfile(module) && module.safetyProfile) {
    const safetyText = [
      module.safetyProfile.realWorldUseLimit,
      ...(module.safetyProfile.notes ?? []),
    ].join(' ');

    if (!includesNoProfessionalClaimLanguage(safetyText)) {
      issues.push({
        severity: 'blocker',
        code: 'missing-no-professional-claim',
        message: 'Safety-sensitive module profiles must state no professional-use claim.',
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
