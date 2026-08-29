import { describe, expect, it } from 'vitest';
import { StemScienceDefinitionSchema } from './stemScienceProjection.js';

const item = {
  id: 'science.example',
  title: 'Example principle',
  classification: 'principle',
  statement: 'An example statement.',
  applicability: { status: 'unknown', description: 'Applicability has not been established.' },
  limitations: ['Example only.'],
  sourceStatus: 'unavailable',
  evidenceStatus: 'not-declared',
  sourceRefs: [],
  evidenceRefs: [],
  equationIds: [],
  quantityIds: [],
};

describe('STEM science contracts', () => {
  it('supports every required science/model distinction', () => {
    const classifications = [
      'principle', 'model-equation', 'engineering-approximation',
      'empirical-relationship', 'assumption', 'observation',
    ];
    const result = StemScienceDefinitionSchema.parse({
      treatment: 'physical-domain',
      items: classifications.map((classification, index) => ({
        ...item,
        id: `science.${index}`,
        classification,
      })),
      disclosures: ['A declaration is not validation.'],
    });
    expect(result.items.map((entry) => entry.classification)).toEqual(classifications);
  });

  it('rejects source-backed and evidence-backed claims without references', () => {
    expect(() => StemScienceDefinitionSchema.parse({
      treatment: 'physical-domain',
      items: [{ ...item, sourceStatus: 'source-backed' }],
      disclosures: ['Disclosure.'],
    })).toThrow(/requires a source reference/i);
    expect(() => StemScienceDefinitionSchema.parse({
      treatment: 'physical-domain',
      items: [{ ...item, evidenceStatus: 'evidence-backed' }],
      disclosures: ['Disclosure.'],
    })).toThrow(/requires an evidence reference/i);
  });

  it('allows missing science sources to remain explicitly unavailable', () => {
    const result = StemScienceDefinitionSchema.parse({
      treatment: 'physical-domain',
      items: [item],
      disclosures: ['Source remains unavailable.'],
    });
    expect(result.items[0]).toMatchObject({
      sourceStatus: 'unavailable',
      sourceRefs: [],
      evidenceStatus: 'not-declared',
    });
  });
});
