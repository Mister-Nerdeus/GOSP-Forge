import { z } from 'zod';
import { IdSchema } from './primitives.js';
export const RefSchema = z.object({
  id: IdSchema,
  kind: z.enum([
    'problem',
    'module',
    'product',
    'graph',
    'estimate',
    'simulation',
    'scorecard',
    'baseline',
    'education',
    'import',
  ]),
  path: z.string().min(1).optional(),
  required: z.boolean().default(true),
});
