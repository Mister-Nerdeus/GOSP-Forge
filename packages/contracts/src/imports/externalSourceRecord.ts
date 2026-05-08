import { z } from 'zod'; import { IdSchema } from '../shared/primitives.js'; import { LicenseProfileSchema } from './licenseProfile.js';
export const ExternalSourceRecordSchema=z.object({id:IdSchema,name:z.string().min(1),url:z.string().url(),license:LicenseProfileSchema,attributionText:z.string().min(1)});
