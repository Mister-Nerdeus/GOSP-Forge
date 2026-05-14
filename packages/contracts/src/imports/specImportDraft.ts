import { z } from 'zod';
import { IdSchema } from '../shared/primitives.js';
import { ExtractedSpecFieldSchema } from './extractedSpecField.js';
import { ImportReviewStatusSchema } from './importReviewStatus.js';
export const SpecImportDraftSchema = z
  .object({
    id: IdSchema,
    productName: z.string().min(1),
    extractedFields: z.array(ExtractedSpecFieldSchema).min(1),
    missingFields: z.array(z.string()).default([]),
    assumedValues: z.array(z.string()).default([]),
    contradictions: z.array(z.string()).default([]),
    reviewStatus: ImportReviewStatusSchema,
  })
  .superRefine((v, c) => {
    if (v.reviewStatus === 'manufacturer-submitted' && v.contradictions.length > 0)
      c.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Contradictory drafts cannot be manufacturer-submitted',
      });
  });
