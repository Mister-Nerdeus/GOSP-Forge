import { describe, expect, it } from 'vitest';
import { StemHumanRelevanceProjectionSchema } from './stemHumanRelevanceProjection.js';

const names = ['cost','safety','energy','water','reliability','accessibility','maintenance','labor-skills','materials-waste','environment','infrastructure-community'] as const;
const categories = names.map((category) => category === 'water' ? {
  category, status: 'supported' as const,
  outcomes: [{ interpretation: 'benefit' as const, statement: 'Recorded model output is available for comparison.', measures: [{ quantityId: 'q', value: 64, unit: 'L' }], evidenceRefs: ['evidence.calculation@1'], limitations: ['Modeled output only.'] }],
} : { category, status: 'unknown' as const, outcomes: [], unknownReason: 'No supporting quantity and evidence are declared.' });
const base = { categories, stakeholderValues: [{ stakeholder: 'learner', value: 'Understand uncertainty.', status: 'authored-preference' as const }], technicalValueSeparation: true as const, disclosures: ['Not policy advice.','Not a lifecycle assessment.','Not environmental certification.','Not an economic forecast.','Not proof of social benefit.'] };

describe('StemHumanRelevanceProjectionSchema', () => {
  it('accepts evidence-linked support and explicit unknowns', () => expect(StemHumanRelevanceProjectionSchema.parse(base).categories).toHaveLength(11));
  it('rejects supported outcomes without evidence', () => expect(() => StemHumanRelevanceProjectionSchema.parse({ ...base, categories: categories.map((item) => item.category === 'water' ? { ...item, outcomes: item.outcomes.map((outcome) => ({ ...outcome, evidenceRefs: [] })) } : item) })).toThrow(/evidence/i));
  it('rejects outcome claims in an unknown category', () => expect(() => StemHumanRelevanceProjectionSchema.parse({ ...base, categories: categories.map((item) => item.category === 'cost' ? { ...item, outcomes: categories[3]!.outcomes } : item) })).toThrow(/cannot contain outcomes/i));
});
