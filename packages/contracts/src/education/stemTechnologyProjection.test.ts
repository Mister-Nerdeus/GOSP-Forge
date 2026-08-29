import { describe, expect, it } from 'vitest';
import { StemTechnologyDefinitionSchema, StemTechnologyProjectionSchema } from './stemTechnologyProjection.js';

const node = {
  id: 'technology.solver',
  name: 'Recorded solver',
  category: 'solver' as const,
  purpose: 'Execute the declared model.',
  declarationStatus: 'declared' as const,
  purposeLinks: [{
    kind: 'model-step' as const,
    targetId: 'equation.result',
    explanation: 'Evaluates this relationship.',
    declarationStatus: 'declared' as const,
  }],
  propertyEvidence: [],
  productProvenanceStatus: 'not-applicable' as const,
  productSourceRefs: [],
  availabilityStatus: 'not-checked' as const,
  compatibilityStatus: 'not-checked' as const,
  safetyStatus: 'not-assessed' as const,
};

describe('StemTechnologyProjectionSchema', () => {
  it('accepts explicit technology purpose and truth states', () => {
    expect(StemTechnologyDefinitionSchema.parse({ nodes: [node], disclosures: ['No endorsement.'] }).nodes).toHaveLength(1);
  });

  it('rejects duplicate technology IDs', () => {
    expect(() => StemTechnologyDefinitionSchema.parse({ nodes: [node, node], disclosures: ['No endorsement.'] })).toThrow(/unique/);
  });

  it('requires projected link and element resolution states', () => {
    expect(() => StemTechnologyProjectionSchema.parse({ nodes: [node], disclosures: ['No endorsement.'] })).toThrow();
  });
});
