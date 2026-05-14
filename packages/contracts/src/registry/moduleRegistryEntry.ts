import { z } from 'zod';
import { IdSchema } from '../shared/primitives.js';
import { ModuleLicenseSchema } from '../attribution/moduleLicense.js';
import { ModuleAttributionSchema } from '../attribution/moduleAttribution.js';
import { ModuleTrustLevelSchema } from './moduleTrustLevel.js';
import { ModerationStatusSchema } from './moderationStatus.js';
export const ModuleRegistryEntrySchema = z
  .object({
    moduleId: IdSchema,
    version: z.string().min(1),
    trustLevel: ModuleTrustLevelSchema,
    moderationStatus: ModerationStatusSchema,
    license: ModuleLicenseSchema,
    attribution: ModuleAttributionSchema,
    safetyReason: z.string().optional(),
  })
  .superRefine((v, c) => {
    if (v.trustLevel === 'restricted' && !v.safetyReason)
      c.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Restricted modules require safety reason',
      });
  });
