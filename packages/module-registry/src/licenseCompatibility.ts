import { LicenseIdSchema, LicenseProfileSchema } from '@gosp/contracts';
import type { LicenseProfile } from '@gosp/contracts';

export type LicenseCompatibilityDecision = 'allow' | 'block' | 'review';

export type LicenseCompatibility = {
  decision: LicenseCompatibilityDecision;
  publicImportAllowed: boolean;
  obligations: string[];
  warnings: string[];
};

const SHARE_ALIKE_LICENSES = new Set(['CC-BY-SA-4.0', 'CERN-OHL-S-2.0', 'ODbL-1.0']);

export function checkLicenseCompatibility(input: LicenseProfile | string): LicenseCompatibility {
  const profile =
    typeof input === 'string'
      ? LicenseProfileSchema.parse(defaultProfileForLicense(input))
      : LicenseProfileSchema.parse(input);

  if (profile.licenseId === 'Unlicensed') {
    return {
      decision: 'block',
      publicImportAllowed: false,
      obligations: ['Do not import unlicensed content as a public module.'],
      warnings: ['Reference-only use may still require separate review.'],
    };
  }

  const obligations: string[] = [];
  const warnings: string[] = [];

  if (profile.attributionRequired) obligations.push('Preserve attribution and source references.');
  if (profile.shareAlike) obligations.push('Preserve share-alike obligations in downstream public imports.');
  if (profile.dataBoundary) obligations.push('Keep ODbL/database-derived data boundaries explicit.');

  if (!profile.publicImportAllowed) {
    return {
      decision: 'review',
      publicImportAllowed: false,
      obligations,
      warnings: ['License profile blocks public import until a human review updates the record.'],
    };
  }

  return {
    decision: 'allow',
    publicImportAllowed: true,
    obligations,
    warnings,
  };
}

function defaultProfileForLicense(licenseId: string): LicenseProfile {
  const parsedLicense = LicenseIdSchema.parse(licenseId);
  const isShareAlike = SHARE_ALIKE_LICENSES.has(parsedLicense);
  const isOdbl = parsedLicense === 'ODbL-1.0';

  return {
    licenseId: parsedLicense,
    attributionRequired: !['MIT', 'Apache-2.0'].includes(parsedLicense),
    shareAlike: isShareAlike,
    dataBoundary: isOdbl,
    publicImportAllowed: parsedLicense !== 'Unlicensed',
  };
}
