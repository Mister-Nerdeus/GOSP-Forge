import { z } from 'zod';
import { IdSchema, WarningSchema } from '../shared/primitives.js';

export const ImpactReportItemSchema = z.object({
  id: IdSchema,
  metric: z.string().min(1).optional(),
  value: z.unknown().optional(),
  unit: z.string().min(1).optional(),
  affectedArea: z.string().min(1).optional(),
  interpretation: z.string().min(1),
});

export const ImpactReportSchema = z.object({
  kind: z.string().min(1),
  direct: z.array(ImpactReportItemSchema).default([]),
  downstream: z.array(ImpactReportItemSchema).default([]),
  warnings: z.array(WarningSchema).default([]),
  limitations: z.array(z.string().min(1)).min(1),
});

export type ImpactReport = z.infer<typeof ImpactReportSchema>;
