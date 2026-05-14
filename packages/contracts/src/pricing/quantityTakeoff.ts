import { z } from 'zod';
import { IdSchema, ConfidenceSchema } from '../shared/primitives.js';
export const QuantityTakeoffSchema = z.object({
  id: IdSchema,
  itemId: IdSchema,
  quantity: z.number().nonnegative(),
  unit: z.string().min(1),
  derivedFrom: IdSchema.optional(),
  confidence: ConfidenceSchema,
});
