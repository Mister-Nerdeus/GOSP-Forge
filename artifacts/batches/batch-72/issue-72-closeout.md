# Issue 72 Closeout

Date: 2026-05-14

## Changed Files

- `packages/estimation/src/estimateFromProject.ts`
- `packages/estimation/src/price/defaultClassroomPricePack.ts`
- `packages/estimation/src/index.ts`
- `packages/estimation/src/estimation.test.ts`
- `packages/cli/src/commands/estimate.ts`
- `artifacts/batches/batch-72/issue-72-pre-audit.md`
- `artifacts/batches/batch-72/issue-72-closeout.md`

## Summary

- Added a default classroom price pack with explicit assumptions and USD unit costs.
- Added `estimateFromProject` to price the manifest-derived BOM and return a validated `CostEstimate`.
- Missing price entries default to `0 USD`, produce warnings, and lower estimate confidence.
- `estimateCommand` now returns manifest-derived BOM, priced totals, lifecycle assumptions, and a `CostEstimate` output.
- Cost assumptions explicitly state that the estimate is educational/conceptual and is not a quote, procurement instruction, permit-ready estimate, or professional review.

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

- Fixed a unit review issue for PLA pricing by using a per-gram unit cost.
- Verified `estimate:clean-water` after rebuild so output used current compiled price-pack code.
- No professional, potable-water, production manufacturing, or procurement claim was added.
