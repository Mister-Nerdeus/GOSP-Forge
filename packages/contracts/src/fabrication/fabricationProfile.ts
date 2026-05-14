import { z } from 'zod';
import { MaterialSpecSchema } from './materialSpec.js';
import { ManufacturingRouteSchema } from './manufacturingRoute.js';
import { LaborProfileSchema } from './laborProfile.js';
export const FabricationProfileSchema = z.object({
  materials: z.array(MaterialSpecSchema).min(1),
  routes: z.array(ManufacturingRouteSchema).min(1),
  labor: LaborProfileSchema,
  safetyNotes: z.array(z.string().min(1)).min(1),
});
