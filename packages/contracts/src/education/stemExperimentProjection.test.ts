import { describe, expect, it } from 'vitest';
import { StemExperimentProjectionSchema } from './stemExperimentProjection.js';

const base = {
  definitionId: 'experiment.example',
  title: 'Example experiment',
  testPlan: {
    status: 'planned' as const,
    controls: ['Hold the boundary fixed.'],
    instruments: [{ id: 'instrument.example', name: 'Example instrument', status: 'declared' as const, measurementKind: 'quantity' }],
    procedure: ['Record an observation.'],
    repetitions: { planned: 3, completed: 0 },
    uncertainty: { status: 'declared' as const, value: 1, unit: 'unit', basis: 'Synthetic teaching allowance.' },
    acceptanceCriterion: { kind: 'absolute-discrepancy-at-most' as const, threshold: 2, unit: 'unit', falsificationStatement: 'A larger discrepancy fails this teaching criterion.' },
  },
  prediction: { status: 'available' as const, quantityId: 'quantity.example', value: 10, unit: 'unit', source: 'canonical-evaluation' as const },
  observation: { status: 'available' as const, id: 'observation.example', classification: 'synthetic' as const, value: 7, unit: 'unit', uncertainty: 1, repetitions: 1, source: 'Authored teaching fixture.' },
  discrepancy: { status: 'available' as const, signed: -3, absolute: 3, relativePercent: -30, unit: 'unit', criterionOutcome: 'fail' as const, failureState: 'negative-result' as const },
  canonicalTruthBoundary: { evaluationStatus: 'completed', contradictionIds: [], preservedFailureState: 'preserved' as const, evidenceReadinessBefore: 'source-backed', evidenceReadinessAfter: 'source-backed', readinessUpdate: 'not-applied' as const },
  disclosures: ['A test plan is not a completed test.', 'Synthetic observations are not measurements.', 'One observation is not validation.'],
};

describe('StemExperimentProjectionSchema', () => {
  it('preserves an explicitly synthetic negative result', () => expect(StemExperimentProjectionSchema.parse(base).discrepancy.failureState).toBe('negative-result'));
  it('rejects readiness mutation through the educational projection', () => expect(() => StemExperimentProjectionSchema.parse({ ...base, canonicalTruthBoundary: { ...base.canonicalTruthBoundary, evidenceReadinessAfter: 'validated' } })).toThrow(/cannot mutate/i));
  it('rejects a classified unavailable observation', () => expect(() => StemExperimentProjectionSchema.parse({ ...base, observation: { status: 'not-declared', classification: 'synthetic' } })).toThrow(/must be available/i));
});
