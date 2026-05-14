# Issue 74 Pre-Audit

Date: 2026-05-14

## Scope

Issue #74 requires lifecycle and replacement estimates to derive from product data.

## Current Behavior

- `estimateFromProject` uses hardcoded three-year maintenance and replacement assumptions.
- `packages/estimation/src/lifecycle/lifecycleFromProducts.ts` does not exist.
- Clean Water pump and filter media product bindings do not declare replacement intervals.

## Planned Files

- `packages/estimation/src/lifecycle/lifecycleFromProducts.ts`
- `packages/estimation/src/estimateFromProject.ts`
- `packages/estimation/src/index.ts`
- `packages/estimation/src/estimation.test.ts`
- `examples/products/filter-media-cartridge.product.json`
- `examples/products/classroom-diaphragm-pump.product.json`
- `artifacts/batches/batch-74/issue-74-closeout.md`

## Review Notes

Replacement intervals must be explicit assumptions or source-backed specs. Missing intervals should warn and lower confidence.
