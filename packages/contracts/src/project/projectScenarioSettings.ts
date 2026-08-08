import { z } from 'zod';
import { CanonicalJsonValueSchema, CanonicalObjectRefSchema } from '../canonical/identity.js';

export const ProjectScenarioSettingsSchema = z
  .object({
    scenarioRef: CanonicalObjectRefSchema.extend({ kind: z.literal('Scenario') }).optional(),
    parameters: z.record(CanonicalJsonValueSchema).default({}),
  })
  .passthrough();

export type ProjectScenarioSettings = z.infer<typeof ProjectScenarioSettingsSchema>;
