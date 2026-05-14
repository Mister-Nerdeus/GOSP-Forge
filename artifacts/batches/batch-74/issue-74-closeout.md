# Issue 74 Closeout

Date: 2026-05-14

## Changed Files

- `packages/estimation/src/lifecycle/lifecycleFromProducts.ts`
- `packages/estimation/src/estimateFromProject.ts`
- `packages/estimation/src/index.ts`
- `packages/estimation/src/estimation.test.ts`
- `examples/products/filter-media-cartridge.product.json`
- `examples/products/classroom-diaphragm-pump.product.json`
- `packages/sim-core/src/specMeaning/applyProductSpecEffects.ts`
- `packages/sim-core/src/cleanWater/compileCleanWaterInput.ts`
- `packages/sim-core/src/sim-core.test.ts`
- `artifacts/batches/batch-74/issue-74-pre-audit.md`
- `artifacts/batches/batch-74/issue-74-closeout.md`

## Summary

- Added product-driven lifecycle compilation from replacement interval and annual maintenance specs.
- Added replacement interval specs for the filter media cartridge and pump.
- Added annual maintenance cost spec for the pump.
- Missing replacement intervals now produce warnings and lower lifecycle confidence.
- Updated estimate output to use product-driven lifecycle results.
- Updated simulation spec mapping to ignore cost-only specs so lifecycle metadata does not degrade simulation confidence.

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

- Fixed a review finding where cost-only lifecycle specs caused irrelevant simulation warnings.
- Verified `simulate:clean-water` after rebuild; simulation warnings returned to empty.
- Lifecycle output now has explicit horizon, assumptions, warnings for missing intervals, and low confidence when data is incomplete.
