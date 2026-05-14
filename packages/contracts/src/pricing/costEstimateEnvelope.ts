import { z } from 'zod';
import { ConfidenceSchema, IdSchema, LimitationSchema, WarningSchema } from '../shared/primitives.js';
import { CostEstimateSchema } from './costEstimate.js';

export const CostEstimateEnvelopeSchema = z.object({
  kind: z.literal('CostEstimateEnvelope'),
  estimateClass: z.enum(['educational-concept', 'reviewed-concept']),
  estimate: CostEstimateSchema,
  confidence: ConfidenceSchema,
  assumptions: z.array(z.string().min(1)).min(1),
  sourceRefs: z.array(IdSchema).default([]),
  warnings: z.array(WarningSchema).default([]),
  limitations: z.array(LimitationSchema).min(1),
});

export type CostEstimateEnvelope = z.infer<typeof CostEstimateEnvelopeSchema>;
