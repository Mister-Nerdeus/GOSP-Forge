# Issue 72 Pre-Audit

Date: 2026-05-14

## Scope

Issue #72 requires manifest-driven cost totals using refs or a classroom price pack.

## Current Behavior

- Issue #71 made the BOM manifest-driven.
- `estimateCommand` prices every BOM line at `0`, so totals are no longer hardcoded but are not meaningful.
- `packages/estimation/src/estimateFromProject.ts` does not exist.
- `packages/estimation/src/price/defaultClassroomPricePack.ts` does not exist.

## Planned Files

- `packages/estimation/src/estimateFromProject.ts`
- `packages/estimation/src/price/defaultClassroomPricePack.ts`
- `packages/estimation/src/index.ts`
- `packages/estimation/src/estimation.test.ts`
- `packages/cli/src/commands/estimate.ts`
- `artifacts/batches/batch-72/issue-72-closeout.md`

## Review Notes

The estimate must remain educational/conceptual and must not imply a quote, procurement approval, permit-ready estimate, or professional review.
