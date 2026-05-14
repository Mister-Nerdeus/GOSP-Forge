# Issue 71 Pre-Audit

Date: 2026-05-14

## Scope

Issue #71 requires a manifest-driven BOM compiler for Clean Water estimation.

## Current Behavior

- `packages/cli/src/commands/estimate.ts` ignores the supplied project file and emits hardcoded BOM lines for pump, filter media, and housing.
- `packages/estimation/src/bom/buildBomFromProject.ts` does not exist.
- `packages/cli/src/refResolver.ts` validates refs but only returns ref metadata, so estimate cannot reuse loaded manifest ref documents without re-reading files.
- Existing `buildBom` can roll up distinguishable line kinds and warn on unknown quantities.

## Files Planned

- `packages/estimation/src/bom/buildBomFromProject.ts`
- `packages/estimation/src/index.ts`
- `packages/cli/src/commands/estimate.ts`
- `packages/cli/src/refResolver.ts`
- `packages/estimation/src/estimation.test.ts`
- `artifacts/batches/batch-71/issue-71-closeout.md`

## Review Notes

No professional, potable-water, or production manufacturing claims are needed for this issue.
