import { z } from 'zod';
import { SubmissionEnvelopeSchema } from './submissionEnvelope.js';
import { SubmissionReviewStatusSchema } from './submissionReviewStatus.js';
export const SignedSubmissionSchema = z.object({
  envelope: SubmissionEnvelopeSchema,
  signature: z.object({
    algorithm: z.string().min(1),
    keyId: z.string().min(1),
    signature: z.string().min(1),
  }),
  reviewStatus: SubmissionReviewStatusSchema,
});
