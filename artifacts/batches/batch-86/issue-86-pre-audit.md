# Issue 86 Pre-Audit

Date: 2026-05-14

## Scope

Issue #86 requires license-aware import compatibility checks for external imports.

## Current Behavior

- `LicenseProfileSchema` records license metadata but does not enforce consistency.
- `checkLicenseCompatibility` exists, but it is compressed and accepts arbitrary license strings.
- Existing tests only cover unlicensed blocking and share-alike obligations through a broad registry test.
- Policy docs state intent but do not define machine-readable outcomes.

## Planned Files

- `packages/module-registry/src/licenseCompatibility.ts`
- `packages/module-registry/src/licenseCompatibility.test.ts`
- `packages/contracts/src/imports/licenseProfile.ts`
- `docs/governance/LICENSE_AWARE_IMPORT_POLICY.md`
- `artifacts/batches/batch-86/issue-86-closeout.md`

## Review Notes

The implementation must block unlicensed public imports, preserve attribution and share-alike obligations, and make ODbL data-boundary obligations explicit without claiming legal review.
