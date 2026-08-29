import { z } from 'zod';

const InstrumentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  status: z.enum(['declared', 'not-declared']),
  measurementKind: z.string().min(1),
});

const CriterionSchema = z.object({
  kind: z.literal('absolute-discrepancy-at-most'),
  threshold: z.number().finite().nonnegative(),
  unit: z.string().min(1),
  falsificationStatement: z.string().min(1),
});

const TestPlanSchema = z.object({
  status: z.enum(['planned', 'completed']),
  controls: z.array(z.string().min(1)).min(1),
  instruments: z.array(InstrumentSchema).min(1),
  procedure: z.array(z.string().min(1)).min(1),
  repetitions: z.object({ planned: z.number().int().positive(), completed: z.number().int().nonnegative() }),
  uncertainty: z.object({
    status: z.enum(['declared', 'not-declared']),
    value: z.number().finite().nonnegative().optional(),
    unit: z.string().min(1).optional(),
    basis: z.string().min(1),
  }),
  acceptanceCriterion: CriterionSchema,
});

export const StemExperimentDefinitionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  predictionQuantityId: z.string().min(1),
  testPlan: TestPlanSchema,
  observations: z.array(z.object({
    id: z.string().min(1),
    classification: z.enum(['synthetic', 'measured']),
    value: z.number().finite(),
    unit: z.string().min(1),
    uncertainty: z.number().finite().nonnegative(),
    repetitions: z.number().int().positive(),
    source: z.string().min(1),
  })).default([]),
  nonClaims: z.array(z.string().min(1)).min(3),
}).superRefine((definition, context) => {
  if (definition.testPlan.status === 'completed' && !definition.observations.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'A completed test plan requires an observation.' });
  }
  if (definition.testPlan.uncertainty.status === 'declared'
    && (definition.testPlan.uncertainty.value === undefined || !definition.testPlan.uncertainty.unit)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Declared uncertainty requires a value and unit.' });
  }
});

export const StemExperimentProjectionSchema = z.object({
  definitionId: z.string().min(1),
  title: z.string().min(1),
  testPlan: TestPlanSchema,
  prediction: z.object({
    status: z.enum(['available', 'unavailable']),
    quantityId: z.string().min(1),
    value: z.number().finite().optional(),
    unit: z.string().min(1).optional(),
    source: z.literal('canonical-evaluation'),
  }),
  observation: z.object({
    status: z.enum(['available', 'not-declared']),
    id: z.string().min(1).optional(),
    classification: z.enum(['synthetic', 'measured']).optional(),
    value: z.number().finite().optional(),
    unit: z.string().min(1).optional(),
    uncertainty: z.number().finite().nonnegative().optional(),
    repetitions: z.number().int().positive().optional(),
    source: z.string().min(1).optional(),
  }),
  discrepancy: z.object({
    status: z.enum(['available', 'not-assessed']),
    signed: z.number().finite().optional(),
    absolute: z.number().finite().nonnegative().optional(),
    relativePercent: z.number().finite().optional(),
    unit: z.string().min(1).optional(),
    criterionOutcome: z.enum(['pass', 'fail', 'not-assessed']),
    failureState: z.enum(['negative-result', 'none', 'not-assessed']),
  }),
  canonicalTruthBoundary: z.object({
    evaluationStatus: z.string().min(1),
    contradictionIds: z.array(z.string().min(1)),
    preservedFailureState: z.enum(['preserved', 'none-declared']),
    evidenceReadinessBefore: z.string().min(1),
    evidenceReadinessAfter: z.string().min(1),
    readinessUpdate: z.literal('not-applied'),
  }),
  disclosures: z.array(z.string().min(1)).min(3),
}).superRefine((projection, context) => {
  if (projection.canonicalTruthBoundary.evidenceReadinessBefore !== projection.canonicalTruthBoundary.evidenceReadinessAfter) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'An educational experiment projection cannot mutate canonical evidence readiness.' });
  }
  if (projection.observation.classification === 'synthetic' && projection.observation.status !== 'available') {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'A classified observation must be available.' });
  }
});

export type StemExperimentDefinition = z.infer<typeof StemExperimentDefinitionSchema>;
export type StemExperimentProjection = z.infer<typeof StemExperimentProjectionSchema>;
