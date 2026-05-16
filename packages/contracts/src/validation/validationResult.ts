import { z } from 'zod';

export const ValidationModeSchema = z.enum(['schema-only', 'repo-refs']);

export const ValidationDiagnosticSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  severity: z.enum(['warning', 'blocker']).default('blocker'),
  source: z.enum(['schema', 'refs', 'registry', 'mode', 'filesystem']).default('schema'),
  path: z.string().optional(),
  refId: z.string().optional(),
  refKind: z.string().optional(),
});

export const ValidationResultSchema = z.object({
  ok: z.boolean(),
  schema: z.literal('ProjectManifestV2'),
  validationMode: ValidationModeSchema,
  projectId: z.string().optional(),
  mode: z.string().optional(),
  file: z.string().optional(),
  refs: z
    .object({
      declared: z.number().int().nonnegative().optional(),
      resolved: z.number().int().nonnegative().optional(),
    })
    .optional(),
  errors: z.array(ValidationDiagnosticSchema).default([]),
  warnings: z.array(ValidationDiagnosticSchema).default([]),
});

export type ValidationMode = z.infer<typeof ValidationModeSchema>;
export type ValidationDiagnostic = z.infer<typeof ValidationDiagnosticSchema>;
export type ValidationResult = z.infer<typeof ValidationResultSchema>;
