# Issue 73 Pre-Audit

Date: 2026-05-14

## Scope

Issue #73 requires fabrication estimates to be integrated into manifest-driven BOM and cost output.

## Current Behavior

- `packages/fabrication/src/estimateFabricationFromProfile.ts` does not exist.
- `buildBomFromProject` emits fabrication materials and a custom-part line, but does not expose machine time or labor time.
- `estimateFromProject` prices BOM lines but does not separate material, machine, and labor costs for fabricated modules.

## Planned Files

- `packages/fabrication/src/estimateFabricationFromProfile.ts`
- `packages/fabrication/src/index.ts`
- `packages/fabrication/src/fabrication.test.ts`
- `packages/estimation/src/bom/buildBomFromProject.ts`
- `packages/estimation/src/estimateFromProject.ts`
- `packages/estimation/src/price/defaultClassroomPricePack.ts`
- `packages/estimation/src/estimation.test.ts`
- `packages/estimation/package.json`
- `artifacts/batches/batch-73/issue-73-closeout.md`

## Review Notes

The output must keep material, machine, and labor costs separate and remain a conceptual classroom estimate.
