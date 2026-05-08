import { z } from 'zod'; import { IdSchema } from '../shared/primitives.js';
export const MetricSchema=z.object({id:IdSchema,name:z.string().min(1),unit:z.string().min(1),direction:z.enum(['minimize','maximize','target']),baselineRefs:z.array(IdSchema).default([])});
