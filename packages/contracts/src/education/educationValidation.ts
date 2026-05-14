export type EducationGuideKind = 'teacher' | 'student' | 'unknown';

export type EducationValidationIssue = {
  severity: 'warning' | 'blocker';
  code: string;
  message: string;
};

const paymentPromptPatterns = [
  /\bpay\s+now\b/i,
  /\bcheckout\b/i,
  /\benter\s+(a\s+)?credit\s+card\b/i,
  /\bpurchase\s+required\b/i,
  /\bsubscription\s+required\b/i,
  /\bbuy\b.{0,30}\bcontinue\b/i,
];

function hasFreePublicSchoolUse(content: string) {
  const normalized = content.toLowerCase();
  return (
    normalized.includes('free for public-school use') ||
    normalized.includes('free for public school use')
  );
}

function hasStudentSafetyLanguage(content: string) {
  const normalized = content.toLowerCase();
  return (
    normalized.includes('safety') &&
    normalized.includes('supervised') &&
    normalized.includes('no potable-water claim')
  );
}

export function validateEducationGuide(
  content: string,
  kind: EducationGuideKind = 'unknown',
): EducationValidationIssue[] {
  const issues: EducationValidationIssue[] = [];

  if (!hasFreePublicSchoolUse(content)) {
    issues.push({
      severity: 'blocker',
      code: 'missing-free-public-school-use',
      message: 'Education guide must state that public-school use is free.',
    });
  }

  if (paymentPromptPatterns.some((pattern) => pattern.test(content))) {
    issues.push({
      severity: 'blocker',
      code: 'student-payment-prompt',
      message: 'Education guide must not include student payment prompts.',
    });
  }

  if (kind === 'student' && !hasStudentSafetyLanguage(content)) {
    issues.push({
      severity: 'blocker',
      code: 'missing-student-safety-language',
      message:
        'Student guide must include supervised safety language and no potable-water claim language.',
    });
  }

  if (kind === 'unknown') {
    issues.push({
      severity: 'warning',
      code: 'unknown-education-guide-kind',
      message: 'Education guide kind could not be inferred from ref id or path.',
    });
  }

  return issues;
}
