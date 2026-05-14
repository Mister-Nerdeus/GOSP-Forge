import { z } from 'zod';
import { IdSchema } from '../shared/primitives.js';
import { ProductSpecMeaningSchema } from './productSpecMeaning.js';
export const ProductSpecSchema = z.object({
  id: IdSchema,
  name: z.string().min(1),
  value: z.union([z.string(), z.number(), z.boolean()]),
  unit: z.string().optional(),
  meaning: ProductSpecMeaningSchema,
  simulationUse: z.string().min(1),
});
