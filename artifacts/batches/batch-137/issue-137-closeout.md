# Issue 137 Closeout

Date: 2026-05-15

## Pre-Change Audit

- `createEstimateQualityReport` reported only counts for zero-cost lines, default-cost warnings, and defaulted quantities.
- `pnpm estimate:clean-water` showed `zeroCostLineCount = 1` and `defaultedQuantityCount = 1` but did not identify the affected line.
- The embedded `CostEstimateSchema.qualityReport` did not include ID arrays.

## Resolution

- Added `zeroCostLineIds`, `defaultCostLineIds`, and `defaultedQuantityIds` to the estimate quality report.
- Updated the cost estimate contract so embedded estimate/envelope output preserves the ID arrays.
- Added tests for line ID reporting.
- Recorded the remaining Clean Water placeholder in `remaining-estimate-placeholders.md`.

## Gates

- `pnpm --filter @gosp/estimation test` PASS
- `pnpm --filter @gosp/contracts test` PASS
- `pnpm -r build` PASS
- `pnpm estimate:clean-water` PASS

## Remaining Placeholder

`filter-housing` is the remaining zero-cost line and defaulted-quantity item. It remains visible in education mode and lowers confidence. No quote, procurement, professional estimate, or permit-ready claim is introduced.

## Code Review

Reviewed the diff and the clean-water estimate output after rebuilding. No P0/P1 findings.
