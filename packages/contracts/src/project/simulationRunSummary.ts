import { z } from 'zod';
import { IdSchema, ConfidenceSchema } from '../shared/primitives.js';
export const SimulationRunSummarySchema = z.object({
  runId: IdSchema,
  modelVersion: z.string().min(1),
  inputHash: z.string().min(16),
  outputHash: z.string().min(16),
  confidence: ConfidenceSchema,
});
