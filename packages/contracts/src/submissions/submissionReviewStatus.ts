import { z } from 'zod';
export const SubmissionReviewStatusSchema = z.enum([
  'draft',
  'submitted',
  'server-resimulated',
  'accepted',
  'rejected',
  'revoked',
]);
