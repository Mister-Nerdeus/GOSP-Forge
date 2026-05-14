import { z } from 'zod';

export const AIProposalReviewSchema = z.object({
  status: z.enum(['pending-human-review', 'needs-domain-review', 'human-rejected', 'human-accepted-draft']),
  reviewerType: z.enum(['human', 'domain-reviewer']).optional(),
  notes: z.array(z.string()).default([]),
});
