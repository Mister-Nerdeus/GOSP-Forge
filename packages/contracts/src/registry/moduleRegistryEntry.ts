import { z } from 'zod';
import { IdSchema } from '../shared/primitives.js';
import { ModuleLicenseSchema } from '../attribution/moduleLicense.js';
import { ModuleAttributionSchema } from '../attribution/moduleAttribution.js';
import { ModuleTrustLevelSchema } from './moduleTrustLevel.js';
import { ModerationStatusSchema } from './moderationStatus.js';

const RegistryAuditRecordSchema = z.object({
  at: z.string().datetime({ offset: true }),
  status: ModerationStatusSchema,
  reason: z.string().min(1),
});

export const ModuleRegistryEntrySchema = z
  .object({
    moduleId: IdSchema,
    version: z.string().min(1),
    trustLevel: ModuleTrustLevelSchema,
    moderationStatus: ModerationStatusSchema,
    license: ModuleLicenseSchema,
    attribution: ModuleAttributionSchema,
    safetyReason: z.string().optional(),
    moderationReason: z.string().optional(),
    auditRecord: z.array(RegistryAuditRecordSchema).default([]),
  })
  .superRefine((v, c) => {
    if (v.trustLevel === 'restricted' && !v.safetyReason)
      c.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Restricted modules require safety reason',
      });
    if (['restricted', 'removed'].includes(v.moderationStatus) && !v.moderationReason)
      c.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Restricted or removed moderation status requires moderation reason',
      });
    if ((v.trustLevel === 'removed' || v.moderationStatus === 'removed') && v.auditRecord.length < 1)
      c.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Removed modules require an audit record',
      });
  });
