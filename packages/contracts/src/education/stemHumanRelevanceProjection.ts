import { z } from 'zod';
import { CanonicalJsonValueSchema } from '../canonical/identity.js';

export const StemHumanRelevanceCategorySchema = z.enum([
  'cost', 'safety', 'energy', 'water', 'reliability', 'accessibility',
  'maintenance', 'labor-skills', 'materials-waste', 'environment', 'infrastructure-community',
]);

export const StemHumanRelevanceDefinitionSchema = z.object({
  declarations: z.array(z.object({
    category: StemHumanRelevanceCategorySchema,
    status: z.enum(['supported', 'unknown']),
    quantityIds: z.array(z.string().min(1)).default([]),
    interpretations: z.array(z.enum(['benefit', 'tradeoff', 'uncertainty'])).default([]),
    unknownReason: z.string().min(1).optional(),
  })).length(11),
  stakeholderValues: z.array(z.object({
    stakeholder: z.string().min(1),
    value: z.string().min(1),
    status: z.literal('authored-preference'),
  })).default([]),
  nonClaims: z.array(z.string().min(1)).min(5),
}).superRefine((definition, context) => {
  if (new Set(definition.declarations.map((item) => item.category)).size !== 11) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'All human-relevance categories must be declared exactly once.' });
  }
  definition.declarations.forEach((item, index) => {
    if (item.status === 'supported' && (!item.quantityIds.length || !item.interpretations.length)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['declarations', index], message: 'Supported relevance requires quantities and interpretations.' });
    }
    if (item.status === 'unknown' && !item.unknownReason) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['declarations', index], message: 'Unknown relevance requires a reason.' });
    }
  });
});

export const StemHumanRelevanceProjectionSchema = z.object({
  categories: z.array(z.object({
    category: StemHumanRelevanceCategorySchema,
    status: z.enum(['supported', 'unknown']),
    outcomes: z.array(z.object({
      interpretation: z.enum(['benefit', 'tradeoff', 'uncertainty']),
      statement: z.string().min(1),
      measures: z.array(z.object({ quantityId: z.string().min(1), value: CanonicalJsonValueSchema, unit: z.string().min(1).optional() })).min(1),
      evidenceRefs: z.array(z.string().min(1)).min(1),
      limitations: z.array(z.string().min(1)).min(1),
    })).default([]),
    unknownReason: z.string().min(1).optional(),
  })).length(11),
  stakeholderValues: z.array(z.object({ stakeholder: z.string().min(1), value: z.string().min(1), status: z.literal('authored-preference') })),
  technicalValueSeparation: z.literal(true),
  disclosures: z.array(z.string().min(1)).min(5),
}).superRefine((projection, context) => {
  if (new Set(projection.categories.map((item) => item.category)).size !== 11) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'All categories must be projected exactly once.' });
  }
  projection.categories.forEach((item, index) => {
    if (item.status === 'supported' && !item.outcomes.length) context.addIssue({ code: z.ZodIssueCode.custom, path: ['categories', index], message: 'Supported categories require evidence-linked outcomes.' });
    if (item.status === 'unknown' && (item.outcomes.length || !item.unknownReason)) context.addIssue({ code: z.ZodIssueCode.custom, path: ['categories', index], message: 'Unknown categories require a reason and cannot contain outcomes.' });
  });
});

export type StemHumanRelevanceDefinition = z.infer<typeof StemHumanRelevanceDefinitionSchema>;
