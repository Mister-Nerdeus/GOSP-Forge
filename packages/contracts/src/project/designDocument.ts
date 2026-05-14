import { z } from 'zod';
export const DesignDocumentSchema = z.object({
  title: z.string().min(1),
  status: z.enum(['incomplete', 'draft', 'reviewed']),
  notes: z.array(z.string()).default([]),
});
