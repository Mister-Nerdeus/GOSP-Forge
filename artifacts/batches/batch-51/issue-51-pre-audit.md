# Issue 51 Pre-Audit

## Scope

Harden CLI reference validation for `validate` without expanding beyond project manifest refs.

## Current Behavior

- `packages/cli/src/commands/validate.ts` parsed `ProjectManifestV2` and returned duplicate example IDs.
- `packages/cli/src/refResolver.ts` scanned every example JSON for duplicate IDs.
- Required refs were not loaded from the manifest.
- Missing required refs did not fail.
- Missing optional refs did not warn.
- Wrong-kind refs were not detected.

## Risk Notes

Validation remains a foundation truth gate only. It does not make potable-water, professional engineering, or manufacturing approval claims.
