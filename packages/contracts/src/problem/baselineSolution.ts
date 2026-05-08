import { z } from 'zod'; import { IdSchema, ConfidenceSchema } from '../shared/primitives.js';
export const BaselineSolutionSchema=z.object({id:IdSchema,name:z.string().min(1),description:z.string().min(1),confidence:ConfidenceSchema,sourceRefs:z.array(IdSchema).default([])});
