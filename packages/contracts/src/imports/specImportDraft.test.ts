import { describe, expect, it } from 'vitest';
import { SpecImportDraftSchema } from './specImportDraft.js';

const baseDraft = {
  id: 'pump-spec-import-draft',
  productName: 'Classroom Diaphragm Pump',
  extractionMethod: 'ai-assisted',
  humanReviewRequired: true,
  manufacturerVerified: false,
  extractedFields: [
    {
      field: 'flow-rate',
      value: 2,
      sourceRef: 'datasheet-page-1',
      confidence: {
        level: 'medium',
        rationale: 'AI-assisted extraction; not manufacturer verified.',
      },
      assumed: false,
    },
  ],
  missingFields: ['current-draw'],
  assumedValues: [],
  contradictions: [],
  reviewStatus: 'draft',
};

describe('SpecImportDraftSchema', () => {
  it('accepts AI-assisted drafts that require human review', () => {
    const parsed = SpecImportDraftSchema.parse(baseDraft);

    expect(parsed.manufacturerVerified).toBe(false);
    expect(parsed.humanReviewRequired).toBe(true);
    expect(parsed.missingFields).toContain('current-draw');
  });

  it('rejects drafts that try to mark AI extraction as manufacturer verified', () => {
    expect(
      SpecImportDraftSchema.safeParse({
        ...baseDraft,
        manufacturerVerified: true,
      }).success,
    ).toBe(false);
  });

  it('keeps contradictions visible for needs-review drafts', () => {
    const parsed = SpecImportDraftSchema.parse({
      ...baseDraft,
      contradictions: ['Two source snippets disagree on flow rate.'],
      reviewStatus: 'needs-review',
    });

    expect(parsed.contradictions).toEqual(['Two source snippets disagree on flow rate.']);
  });

  it('rejects contradictory manufacturer-submitted drafts', () => {
    expect(
      SpecImportDraftSchema.safeParse({
        ...baseDraft,
        contradictions: ['Manufacturer submission conflicts with source snippet.'],
        reviewStatus: 'manufacturer-submitted',
      }).success,
    ).toBe(false);
  });
});
