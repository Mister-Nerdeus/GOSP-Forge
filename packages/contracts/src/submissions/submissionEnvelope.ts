import { z } from 'zod';
import { IdSchema } from '../shared/primitives.js';
export const SubmissionEnvelopeSchema = z.object({
  id: IdSchema,
  projectId: IdSchema,
  inputHash: z.string().min(16),
  modelVersion: z.string().min(1),
  scoringProfileId: IdSchema,
  submittedAt: z.string().datetime({ offset: true }),
});
