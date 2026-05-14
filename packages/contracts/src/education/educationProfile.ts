import { z } from 'zod';
export const EducationProfileSchema = z.object({
  gradeBand: z.string().min(1),
  objectives: z.array(z.string().min(1)).min(1),
  estimatedTimeMinutes: z.number().int().positive(),
  teacherNotes: z.array(z.string().min(1)).min(1),
});
