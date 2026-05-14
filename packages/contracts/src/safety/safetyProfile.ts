import { z } from 'zod';
export const SafetyProfileSchema = z.object({
  category: z.enum([
    'classroom-safe',
    'supervised',
    'restricted',
    'professional-only',
    'not-for-real-world-use',
  ]),
  notes: z.array(z.string().min(1)).min(1),
  realWorldUseLimit: z.string().min(1),
});
