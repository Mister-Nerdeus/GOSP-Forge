import { z } from 'zod'; import { IdSchema, ConfidenceSchema } from './primitives.js';
export const SourceRefSchema=z.object({id:IdSchema,title:z.string().min(1),url:z.string().url().optional(),citation:z.string().optional(),retrievedAt:z.string().datetime({offset:true}).optional(),confidence:ConfidenceSchema.optional()});
