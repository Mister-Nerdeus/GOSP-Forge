import { z } from 'zod';
import { IdSchema } from '../shared/primitives.js';
export const ScoringComponentSchema = z.object({
  id: IdSchema,
  label: z.string().min(1),
  weight: z.number().positive(),
  formula: z.string().min(1),
  source: z.string().optional(),
});
