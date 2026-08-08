import { z } from 'zod';

export const CleanWaterScenarioExtensionSchema = z
  .object({
    cleanWater: z
      .object({
        sourceLiters: z.number().positive(),
        runMinutes: z.number().positive(),
      })
      .optional(),
  })
  .passthrough();
