import { z } from 'zod'; import { ConfidenceSchema } from '../shared/primitives.js';
export const LifecycleCostSchema=z.object({horizonYears:z.number().positive(),operatingCost:z.number().nonnegative(),maintenanceCost:z.number().nonnegative(),replacementReserve:z.number().nonnegative(),total:z.number().nonnegative(),confidence:ConfidenceSchema,assumptions:z.array(z.string()).default([])});
