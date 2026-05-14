import { describe, expect, it } from 'vitest';
import { LicenseProfileSchema } from '@gosp/contracts';
import { checkLicenseCompatibility } from './licenseCompatibility.js';

describe('checkLicenseCompatibility', () => {
  it('blocks unlicensed public imports', () => {
    const result = checkLicenseCompatibility('Unlicensed');

    expect(result.decision).toBe('block');
    expect(result.publicImportAllowed).toBe(false);
    expect(result.obligations).toContain('Do not import unlicensed content as a public module.');
  });

  it('preserves share-alike obligations', () => {
    const result = checkLicenseCompatibility('CC-BY-SA-4.0');

    expect(result.decision).toBe('allow');
    expect(result.obligations).toContain('Preserve attribution and source references.');
    expect(result.obligations).toContain('Preserve share-alike obligations in downstream public imports.');
  });

  it('keeps ODbL data boundaries explicit', () => {
    const result = checkLicenseCompatibility('ODbL-1.0');

    expect(result.publicImportAllowed).toBe(true);
    expect(result.obligations).toContain('Keep ODbL/database-derived data boundaries explicit.');
  });

  it('requires review when the profile blocks public import', () => {
    const result = checkLicenseCompatibility({
      licenseId: 'CC-BY-4.0',
      attributionRequired: true,
      shareAlike: false,
      dataBoundary: false,
      publicImportAllowed: false,
    });

    expect(result.decision).toBe('review');
    expect(result.publicImportAllowed).toBe(false);
    expect(result.warnings).toContain('License profile blocks public import until a human review updates the record.');
  });
});

describe('LicenseProfileSchema', () => {
  it('rejects unlicensed profiles that allow public import', () => {
    expect(
      LicenseProfileSchema.safeParse({
        licenseId: 'Unlicensed',
        attributionRequired: false,
        shareAlike: false,
        publicImportAllowed: true,
      }).success,
    ).toBe(false);
  });

  it('rejects ODbL profiles without a data boundary', () => {
    expect(
      LicenseProfileSchema.safeParse({
        licenseId: 'ODbL-1.0',
        attributionRequired: true,
        shareAlike: true,
        dataBoundary: false,
        publicImportAllowed: true,
      }).success,
    ).toBe(false);
  });
});
