import { z } from 'zod';

export const StemTechnologyCategorySchema = z.enum([
  'sensor',
  'controller',
  'software',
  'actuator',
  'power',
  'communication',
  'fabrication',
  'instrument',
  'solver',
]);

const PurposeLinkSchema = z.object({
  kind: z.enum(['requirement', 'measurement', 'control-action', 'model-step', 'test-purpose']),
  targetId: z.string().min(1),
  explanation: z.string().min(1),
  declarationStatus: z.enum(['declared', 'not-declared']),
});

const PropertyEvidenceSchema = z.object({
  property: z.string().min(1),
  representedValue: z.string().min(1),
  status: z.enum(['source-backed', 'authored', 'assumed', 'unavailable', 'not-declared']),
  sourceRefs: z.array(z.string().min(1)).default([]),
});

const StemTechnologyDefinitionObjectSchema = z.object({
  nodes: z.array(z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    category: StemTechnologyCategorySchema,
    purpose: z.string().min(1),
    declarationStatus: z.enum(['declared', 'conceptual', 'not-declared']),
    systemElementId: z.string().min(1).optional(),
    purposeLinks: z.array(PurposeLinkSchema).min(1),
    propertyEvidence: z.array(PropertyEvidenceSchema).default([]),
    productProvenanceStatus: z.enum([
      'not-applicable',
      'not-declared',
      'community-submitted',
      'manufacturer-submitted',
      'manufacturer-verified',
      'reviewed',
    ]),
    productSourceRefs: z.array(z.string().min(1)).default([]),
    availabilityStatus: z.enum(['available', 'unavailable', 'unknown', 'not-checked']),
    compatibilityStatus: z.enum(['compatible', 'incompatible', 'unknown', 'not-checked']),
    safetyStatus: z.enum(['assessed', 'not-assessed']),
  })).min(1),
  disclosures: z.array(z.string().min(1)).min(1),
});

export const StemTechnologyDefinitionSchema = StemTechnologyDefinitionObjectSchema.superRefine((value, context) => {
  const ids = value.nodes.map((node) => node.id);
  if (new Set(ids).size !== ids.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Technology node IDs must be unique.' });
  }
});

export const StemTechnologyProjectionSchema = StemTechnologyDefinitionObjectSchema.extend({
  nodes: StemTechnologyDefinitionObjectSchema.shape.nodes.element.extend({
    systemElementResolution: z.enum(['resolved', 'not-declared']),
    purposeLinks: z.array(PurposeLinkSchema.extend({
      resolutionStatus: z.enum(['resolved', 'not-declared']),
    })).min(1),
  }).array().min(1),
});

export type StemTechnologyDefinition = z.infer<typeof StemTechnologyDefinitionSchema>;
export type StemTechnologyProjection = z.infer<typeof StemTechnologyProjectionSchema>;
