import { z } from 'zod';
export const ModuleCapabilitiesSchema = z.object({
  capabilities: z.array(z.string().min(1)).min(1),
  requiresFabrication: z.boolean().default(false),
  supportsSimulation: z.boolean().default(false),
  supportsEstimation: z.boolean().default(false),
});
