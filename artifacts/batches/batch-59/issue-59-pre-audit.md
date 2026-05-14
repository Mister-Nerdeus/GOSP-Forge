# Issue 59 Pre-Audit

## Scope

Expand the CLI audit command to check required foundation files and emit machine-readable pass/warn/fail counts.

## Current Behavior

- `audit foundation` checked only `README.md`, `package.json`, and `docs/audits/GOSP_FORGE_FOUNDATION_CLOSEOUT_AUDIT.md`.
- The audit report did not include counts.
- Missing required docs/packages/scripts beyond the three-file list were not represented.
- Placeholder status was not named as a warning.

## Risk Notes

Audit warnings may name intentional placeholders, but missing required foundation files must fail the CLI audit.
