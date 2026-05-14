type SponsorScoringComponent = {
  id: string;
  label?: string;
  formula?: string;
  source?: string;
};

export type SponsorInfluenceDiagnostic = {
  componentId: string;
  field: 'id' | 'label' | 'formula' | 'source';
  message: string;
};

const SponsorInfluencePattern = /\b(sponsor|sponsored|sponsorship|pay[- ]?to[- ]?win)\b/i;

export function findSponsorScoringInfluence(profile: {
  components?: SponsorScoringComponent[];
}): SponsorInfluenceDiagnostic[] {
  const diagnostics: SponsorInfluenceDiagnostic[] = [];

  for (const component of profile.components ?? []) {
    const fields = {
      id: component.id,
      label: component.label ?? '',
      formula: component.formula ?? '',
      source: component.source ?? '',
    } as const;

    for (const [field, value] of Object.entries(fields)) {
      if (SponsorInfluencePattern.test(value)) {
        diagnostics.push({
          componentId: component.id,
          field: field as SponsorInfluenceDiagnostic['field'],
          message: `Sponsor status cannot affect scoring component ${component.id}.`,
        });
      }
    }
  }

  return diagnostics;
}

export function assertNoSponsorScoringInfluence(profile: {
  components?: SponsorScoringComponent[];
}): void {
  const diagnostics = findSponsorScoringInfluence(profile);
  if (diagnostics.length > 0) throw new Error('Sponsor fields cannot affect scoring');
}
