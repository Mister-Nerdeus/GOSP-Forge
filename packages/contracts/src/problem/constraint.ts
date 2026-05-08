import { z } from 'zod'; import { IdSchema } from '../shared/primitives.js';
export const ConstraintSchema=z.object({id:IdSchema,description:z.string().min(1),unit:z.string().optional(),min:z.number().optional(),max:z.number().optional()});
