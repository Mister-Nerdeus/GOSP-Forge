# Issue 75 Closeout

Date: 2026-05-14

## Changed Files

- `packages/contracts/src/pricing/costEstimateEnvelope.ts`
- `packages/contracts/src/index.ts`
- `packages/contracts/src/contracts.test.ts`
- `packages/estimation/src/createCostEstimateEnvelope.ts`
- `packages/estimation/src/estimateFromProject.ts`
- `packages/estimation/src/index.ts`
- `packages/estimation/src/estimation.test.ts`
- `packages/cli/src/commands/estimate.ts`
- `artifacts/batches/batch-75/issue-75-pre-audit.md`
- `artifacts/batches/batch-75/issue-75-closeout.md`

## Summary

- Added `CostEstimateEnvelopeSchema` with estimate class, confidence, assumptions, source refs, warnings, and limitations.
- Added `createCostEstimateEnvelope` and wrapped Clean Water estimate output.
- CLI estimate output now includes both the raw `estimate` and validated `envelope`.
- Envelope limitations explicitly reject professional estimate, procurement, quote, and permit-ready claims.

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

- Verified envelope warnings are machine-readable `WarningSchema` entries generated from estimate warnings.
- Verified output keeps educational/concept limitations visible.
- No professional, permit-ready, procurement, or potable-water claim was added.
