import { z } from 'zod';
import { IdSchema, VersionSchema } from '../shared/primitives.js';
import { ConstraintSchema } from './constraint.js';
import { MetricSchema } from './metric.js';
import { BaselineSolutionSchema } from './baselineSolution.js';
export const ProblemDefinitionSchema = z
  .object({
    kind: z.literal('ProblemDefinition'),
    id: IdSchema,
    version: VersionSchema,
    title: z.string().min(1),
    summary: z.string().min(1),
    mode: z.enum(['dream', 'education', 'scoring', 'professional', 'research']).default('dream'),
    constraints: z.array(ConstraintSchema).default([]),
    metrics: z.array(MetricSchema).min(1),
    baselines: z.array(BaselineSolutionSchema).default([]),
    safetyNotes: z.array(z.string()).default([]),
  })
  .superRefine((v, c) => {
    if (v.mode === 'scoring' && v.baselines.length === 0)
      c.addIssue({ code: z.ZodIssueCode.custom, message: 'Scoring mode requires baselines' });
  });
