import { z } from 'zod';
export const ModuleAttributionSchema = z.object({
  creators: z.array(z.object({ name: z.string().min(1), role: z.string().optional() })).min(1),
  sourceRefs: z.array(z.string()).default([]),
});
