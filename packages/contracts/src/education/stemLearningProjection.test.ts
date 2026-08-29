import { describe, expect, it } from 'vitest';
import { StemLearningProjectionSchema } from './stemLearningProjection.js';

const hash = 'a'.repeat(64);
const depths = ['explore', 'measure', 'model', 'solve', 'verify', 'research-professional'] as const;
const manifests = depths.map((depth) => ({ depth, label: depth, detailLevel: 'guided' as const, includedSections: ['system-map' as const], redactedSections: ['math' as const], disclosure: 'Presentation only.' }));
const base = {
  selectedDepth: 'explore' as const,
  canonicalIdentity: { evaluationId: 'evaluation.test', evaluationRevision: '1.0.0', materialInputHash: hash, materialResultHash: hash },
  selectedManifest: manifests[0], availableManifests: manifests, identityInvariant: true as const,
  disclosures: ['Depth is not mastery.'],
};

describe('StemLearningProjectionSchema', () => {
  it('accepts all six depth manifests', () => expect(StemLearningProjectionSchema.parse(base).availableManifests).toHaveLength(6));
  it('rejects a selected manifest mismatch', () => expect(() => StemLearningProjectionSchema.parse({ ...base, selectedDepth: 'solve' })).toThrow(/match/));
  it('rejects overlapping included and redacted sections', () => expect(() => StemLearningProjectionSchema.parse({ ...base, availableManifests: manifests.map((item, index) => index ? item : { ...item, redactedSections: ['system-map'] }) })).toThrow(/overlap/));
});
