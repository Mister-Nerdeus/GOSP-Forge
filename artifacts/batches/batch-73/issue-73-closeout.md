# Issue 73 Closeout

Date: 2026-05-14

## Changed Files

- `packages/fabrication/src/estimateFabricationFromProfile.ts`
- `packages/fabrication/src/index.ts`
- `packages/fabrication/src/fabrication.test.ts`
- `packages/estimation/src/bom/buildBomFromProject.ts`
- `packages/estimation/src/estimateFromProject.ts`
- `packages/estimation/src/price/defaultClassroomPricePack.ts`
- `packages/estimation/src/estimation.test.ts`
- `packages/estimation/package.json`
- `pnpm-lock.yaml`
- `artifacts/batches/batch-73/issue-73-pre-audit.md`
- `artifacts/batches/batch-73/issue-73-closeout.md`

## Summary

- Added `estimateFabricationFromProfile` to separate material quantities, machine time, route labor, profile labor, and total labor.
- Integrated fabrication profile output into BOM generation as distinct `material`, `process`, and `labor` lines.
- Updated the classroom price pack so fabricated housing material, machine time, and labor are priced separately.
- Updated cost output so fabrication material/machine/labor costs remain visible as separate lines.
- Added tests for profile estimation and BOM/cost integration.

## Gate Evidence

Passed:

- `pnpm lint`
- `pnpm -r build`
- `pnpm -r typecheck`
- `pnpm -r test`
- `pnpm validate:examples`
- `pnpm simulate:clean-water`
- `pnpm estimate:clean-water`
- `pnpm audit`
- `pnpm run audit`
- `node scripts/controls/write-local-validation.mjs`
- `node scripts/controls/verify-local-validation-current.mjs`

## Code Review Notes

- Fixed TypeScript narrowing in `buildBomFromProject` before full gates.
- Refreshed `pnpm-lock.yaml` after adding the estimation-to-fabrication workspace dependency.
- No professional fabrication, production manufacturing, potable-water, or procurement claim was added.
