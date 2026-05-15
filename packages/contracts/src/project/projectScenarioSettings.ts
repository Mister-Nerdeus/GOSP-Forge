import { z } from 'zod';

export const ProjectScenarioSettingsSchema = z.object({
  cleanWater: z
    .object({
      sourceLiters: z.number().positive(),
      runMinutes: z.number().positive(),
    })
    .optional(),
});

export type ProjectScenarioSettings = z.infer<typeof ProjectScenarioSettingsSchema>;
