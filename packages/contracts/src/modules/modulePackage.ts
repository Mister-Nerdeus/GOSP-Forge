import { z } from 'zod';
import { IdSchema, VersionSchema } from '../shared/primitives.js';
import { ModuleTypeSchema } from './moduleType.js';
import { ModulePortSchema } from './modulePort.js';
import { ModuleCapabilitiesSchema } from './moduleCapabilities.js';
import { RepresentationProfileSchema } from './representationProfile.js';
import { ModuleAttributionSchema } from '../attribution/moduleAttribution.js';
import { ModuleLicenseSchema } from '../attribution/moduleLicense.js';
import { RemixLineageSchema } from '../attribution/remixLineage.js';
import { SafetyProfileSchema } from '../safety/safetyProfile.js';
import { EducationProfileSchema } from '../education/educationProfile.js';
import { FabricationProfileSchema } from '../fabrication/fabricationProfile.js';
export const ModulePackageSchema = z
  .object({
    kind: z.literal('ModulePackage'),
    id: IdSchema,
    version: VersionSchema,
    name: z.string().min(1),
    type: ModuleTypeSchema,
    attribution: ModuleAttributionSchema,
    license: ModuleLicenseSchema,
    remixLineage: RemixLineageSchema.optional(),
    capabilities: ModuleCapabilitiesSchema,
    representation: RepresentationProfileSchema.default({
      representations: ['none'],
      primary: 'none',
    }),
    validationStatus: z.enum([
      'draft',
      'simulated',
      'fabricated',
      'tested',
      'reviewed',
      'deprecated',
    ]),
    ports: z.array(ModulePortSchema).default([]),
    safetyProfile: SafetyProfileSchema.optional(),
    educationProfile: EducationProfileSchema.optional(),
    fabricationProfile: FabricationProfileSchema.optional(),
  })
  .superRefine((v, c) => {
    if (v.capabilities.requiresFabrication && !v.fabricationProfile)
      c.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Fabricated modules require fabricationProfile',
      });
    if (['physical', 'hybrid', 'biological'].includes(v.type) && !v.safetyProfile)
      c.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Physical safety-sensitive modules require safetyProfile',
      });
  });
