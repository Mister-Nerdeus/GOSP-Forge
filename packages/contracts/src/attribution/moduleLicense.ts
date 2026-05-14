import { z } from 'zod';
export const ModuleLicenseSchema = z.object({
  id: z.enum([
    'MIT',
    'Apache-2.0',
    'CC-BY-4.0',
    'CC-BY-SA-4.0',
    'CERN-OHL-S-2.0',
    'ODbL-1.0',
    'Proprietary-Education-Use',
    'Unlicensed',
  ]),
  shareAlike: z.boolean().default(false),
  url: z.string().url().optional(),
});
