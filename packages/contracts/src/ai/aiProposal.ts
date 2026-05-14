import { z } from 'zod';
import { ConfidenceSchema, IdSchema } from '../shared/primitives.js';
import { AIProposalReviewSchema } from './aiProposalReview.js';

const AiApprovedTerms = /\b(approved|verified|certified|validated|safe to drink)\b/i;

export const AIProposalSchema = z
  .object({
    kind: z.literal('AIProposal').default('AIProposal'),
    id: IdSchema,
    proposalType: z.enum([
      'module-draft',
      'product-spec-draft',
      'scoring-draft',
      'safety-draft',
      'education-draft',
    ]),
    draftStatus: z.literal('draft').default('draft'),
    truthStatus: z.literal('unreviewed-draft').default('unreviewed-draft'),
    sourceRefs: z.array(z.string().min(1)).min(1),
    confidence: ConfidenceSchema,
    missingData: z.array(z.string()).default([]),
    review: AIProposalReviewSchema,
    proposedChange: z.unknown(),
    limitations: z.array(z.string()).min(1),
  })
  .superRefine((proposal, ctx) => {
    const searchableText = [proposal.truthStatus, ...proposal.review.notes].join(' ');

    if (AiApprovedTerms.test(searchableText)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'AI proposals cannot approve truth, safety, scoring, or potable-water status',
      });
    }
  });
