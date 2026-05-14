import { z } from 'zod';
import { IdSchema } from '../shared/primitives.js';
export const MaterialSpecSchema = z.object({
  id: IdSchema,
  name: z.string().min(1),
  unit: z.string().min(1),
  quantity: z.number().positive(),
  sourceRefs: z.array(IdSchema).default([]),
});
