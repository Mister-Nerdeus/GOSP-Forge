import { z } from 'zod';
export const LicenseIdSchema = z.enum([
  'MIT',
  'Apache-2.0',
  'CC-BY-4.0',
  'CC-BY-SA-4.0',
  'CERN-OHL-S-2.0',
  'ODbL-1.0',
  'Unlicensed',
]);

export const LicenseProfileSchema = z
  .object({
    licenseId: LicenseIdSchema,
    attributionRequired: z.boolean(),
    shareAlike: z.boolean(),
    dataBoundary: z.boolean().default(false),
    publicImportAllowed: z.boolean(),
  })
  .superRefine((profile, ctx) => {
    if (profile.licenseId === 'Unlicensed' && profile.publicImportAllowed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Unlicensed content cannot be imported publicly',
        path: ['publicImportAllowed'],
      });
    }

    if (profile.licenseId === 'ODbL-1.0' && !profile.dataBoundary) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ODbL imports require an explicit data boundary',
        path: ['dataBoundary'],
      });
    }

    if (['CC-BY-SA-4.0', 'CERN-OHL-S-2.0', 'ODbL-1.0'].includes(profile.licenseId) && !profile.shareAlike) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Share-alike licenses require shareAlike=true',
        path: ['shareAlike'],
      });
    }
  });

export type LicenseProfile = z.infer<typeof LicenseProfileSchema>;
