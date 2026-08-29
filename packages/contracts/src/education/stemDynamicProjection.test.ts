import { describe, expect, it } from 'vitest';
import { StemDynamicProjectionSchema } from './stemDynamicProjection.js';

const kinds = ['flow', 'vector-force', 'energy', 'electrical-control', 'time-series', 'uncertainty', 'sensitivity'] as const;
const base = {
  allowedParameters: [],
  visualPrimitives: kinds.map((kind) => ({ kind, status: 'unavailable' as const, provenance: 'not-declared' as const, description: 'No data declared.' })),
  causalHighlights: { status: 'not-declared' as const, changedInputs: [], changedResults: [] },
  timePlayback: { status: 'unavailable' as const, provenance: 'not-declared' as const, frameCount: 0, explanation: 'No series.' },
  disclosures: ['Animation is not measurement.'],
};

describe('StemDynamicProjectionSchema', () => {
  it('accepts explicit unavailable states', () => expect(StemDynamicProjectionSchema.parse(base).visualPrimitives).toHaveLength(7));
  it('rejects available primitives without data', () => expect(() => StemDynamicProjectionSchema.parse({ ...base, visualPrimitives: base.visualPrimitives.map((item, index) => index ? item : { ...item, status: 'available' }) })).toThrow(/require declared data/));
  it('rejects time playback without provenance', () => expect(() => StemDynamicProjectionSchema.parse({ ...base, timePlayback: { ...base.timePlayback, status: 'available' } })).toThrow(/provenance/));
});
