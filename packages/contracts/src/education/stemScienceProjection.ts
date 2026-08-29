import { z } from 'zod';

export const StemScienceClassificationSchema = z.enum([
  'principle',
  'model-equation',
  'engineering-approximation',
  'empirical-relationship',
  'assumption',
  'observation',
]);

const StemScienceItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  classification: StemScienceClassificationSchema,
  statement: z.string().min(1),
  applicability: z.object({
    status: z.enum(['applicable', 'not-applicable', 'unknown', 'not-declared']),
    description: z.string().min(1),
  }),
  limitations: z.array(z.string().min(1)).min(1),
  sourceStatus: z.enum(['source-backed', 'model-declared', 'assumption-declared', 'not-declared', 'unavailable']),
  evidenceStatus: z.enum(['evidence-backed', 'model-only', 'assumption-only', 'not-declared', 'unavailable']),
  sourceRefs: z.array(z.string().min(1)).default([]),
  evidenceRefs: z.array(z.string().min(1)).default([]),
  equationIds: z.array(z.string().min(1)).default([]),
  quantityIds: z.array(z.string().min(1)).default([]),
});

export const StemScienceDefinitionSchema = z.object({
  treatment: z.enum(['physical-domain', 'synthetic-benchmark']),
  items: z.array(StemScienceItemSchema).min(1),
  disclosures: z.array(z.string().min(1)).min(1),
}).superRefine((definition, context) => {
  const ids = new Set<string>();
  definition.items.forEach((item, index) => {
    if (ids.has(item.id)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['items', index, 'id'],
        message: `Duplicate STEM science item id ${item.id}.`,
      });
    }
    ids.add(item.id);
    if (item.sourceStatus === 'source-backed' && !item.sourceRefs.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['items', index, 'sourceRefs'],
        message: `Source-backed science item ${item.id} requires a source reference.`,
      });
    }
    if (item.evidenceStatus === 'evidence-backed' && !item.evidenceRefs.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['items', index, 'evidenceRefs'],
        message: `Evidence-backed science item ${item.id} requires an evidence reference.`,
      });
    }
  });
});

export const StemScienceProjectionSchema = z.object({
  treatment: z.enum(['physical-domain', 'synthetic-benchmark']),
  modelRef: z.object({ id: z.string().min(1), revision: z.string().min(1) }),
  fidelityLevel: z.string().min(1),
  items: z.array(StemScienceItemSchema).min(1),
  disclosures: z.array(z.string().min(1)).min(1),
});

export type StemScienceDefinition = z.infer<typeof StemScienceDefinitionSchema>;
export type StemScienceProjection = z.infer<typeof StemScienceProjectionSchema>;
