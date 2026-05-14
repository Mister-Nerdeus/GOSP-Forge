import { z } from 'zod';
export const IdSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9][a-z0-9._:-]*$/);
export const VersionSchema = z.string().min(1);
export const ConfidenceSchema = z.object({
  level: z.enum(['low', 'medium', 'high', 'reviewed']),
  rationale: z.string().min(1),
});
export const WarningSchema = z.object({
  code: IdSchema,
  message: z.string().min(1),
  severity: z.enum(['info', 'warning', 'blocker']),
});
export const LimitationSchema = z.object({ id: IdSchema, description: z.string().min(1) });
export const AssumptionSchema = z.object({
  id: IdSchema,
  description: z.string().min(1),
  value: z.unknown().optional(),
  unit: z.string().optional(),
  sourceRefs: z.array(z.string()).default([]),
});
