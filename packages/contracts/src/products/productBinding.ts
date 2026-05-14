import { z } from 'zod';
import { IdSchema, VersionSchema, ConfidenceSchema } from '../shared/primitives.js';
import { ProductSpecSchema } from './productSpec.js';
import { ProductProvenanceSchema } from './productProvenance.js';
import { SponsorDisclosureSchema } from './sponsorDisclosure.js';
export const ProductBindingSchema = z
  .object({
    kind: z.literal('ProductBinding'),
    id: IdSchema,
    version: VersionSchema,
    name: z.string().min(1),
    moduleIds: z.array(IdSchema).min(1),
    specs: z.array(ProductSpecSchema).min(1),
    provenance: ProductProvenanceSchema,
    sponsored: z.boolean().default(false),
    sponsorDisclosure: SponsorDisclosureSchema.optional(),
    confidence: ConfidenceSchema,
  })
  .superRefine((v, c) => {
    if (v.sponsored && !v.sponsorDisclosure)
      c.addIssue({ code: z.ZodIssueCode.custom, message: 'Sponsored products require disclosure' });
  });
