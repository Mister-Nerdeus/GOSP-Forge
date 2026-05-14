import { z } from 'zod';
export const RemixLineageSchema = z
  .object({
    parentModuleIds: z.array(z.string().min(1)).default([]),
    remixNotes: z.string().optional(),
  })
  .superRefine((v, c) => {
    if (v.remixNotes && v.parentModuleIds.length === 0)
      c.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Remix modules require at least one parent reference',
      });
  });
