import { z } from 'zod';
import { CanonicalJsonValueSchema } from '../canonical/identity.js';

export const StemVisualizationKindSchema = z.enum([
  'flow', 'vector-force', 'energy', 'electrical-control', 'time-series', 'uncertainty', 'sensitivity',
]);

export const StemDynamicProjectionSchema = z.object({
  allowedParameters: z.array(z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    inputPath: z.string().min(1),
    currentValue: CanonicalJsonValueSchema,
    valueType: z.enum(['number', 'string', 'boolean']),
    rationale: z.string().min(1),
  })),
  visualPrimitives: z.array(z.object({
    kind: StemVisualizationKindSchema,
    status: z.enum(['available', 'unavailable', 'not-declared']),
    provenance: z.enum(['canonical-interface', 'evaluation-result', 'model-metadata', 'recorded-series', 'model-generated-series', 'not-declared']),
    description: z.string().min(1),
    data: CanonicalJsonValueSchema.optional(),
  })).length(7),
  causalHighlights: z.object({
    status: z.enum(['available', 'not-declared']),
    changedInputs: z.array(z.object({
      path: z.string().min(1),
      baseline: CanonicalJsonValueSchema.optional(),
      candidate: CanonicalJsonValueSchema.optional(),
      baselineAvailability: z.enum(['available', 'unavailable']),
      candidateAvailability: z.enum(['available', 'unavailable']),
    })),
    changedResults: z.array(z.object({ resultPath: z.string().min(1), baseline: z.number(), candidate: z.number(), delta: z.number() })),
  }),
  timePlayback: z.object({
    status: z.enum(['available', 'unavailable']),
    provenance: z.enum(['recorded-series', 'model-generated-series', 'not-declared']),
    frameCount: z.number().int().nonnegative(),
    explanation: z.string().min(1),
  }),
  disclosures: z.array(z.string().min(1)).min(1),
}).superRefine((projection, context) => {
  const kinds = projection.visualPrimitives.map((primitive) => primitive.kind);
  if (new Set(kinds).size !== 7) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Each visualization primitive kind must appear exactly once.' });
  }
  projection.visualPrimitives.forEach((primitive, index) => {
    if (primitive.status === 'available' && primitive.data === undefined) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['visualPrimitives', index, 'data'], message: 'Available visualization primitives require declared data.' });
    }
  });
  if (projection.timePlayback.status === 'available' && projection.timePlayback.provenance === 'not-declared') {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Available time playback requires recorded or model-generated provenance.' });
  }
});

export type StemDynamicProjection = z.infer<typeof StemDynamicProjectionSchema>;
