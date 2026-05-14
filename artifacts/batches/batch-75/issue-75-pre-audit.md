# Issue 75 Pre-Audit

Date: 2026-05-14

## Scope

Issue #75 requires a CostEstimate output envelope with assumptions, source refs, confidence, warnings, and limitations.

## Current Behavior

- `CostEstimateSchema` exists and validates estimate lines, lifecycle, confidence, assumptions, and source refs.
- No `CostEstimateEnvelopeSchema` exists.
- Estimate command returns warnings beside the estimate, but warnings and limitations are not part of a validated envelope.

## Planned Files

- `packages/contracts/src/pricing/costEstimateEnvelope.ts`
- `packages/contracts/src/index.ts`
- `packages/contracts/src/contracts.test.ts`
- `packages/estimation/src/createCostEstimateEnvelope.ts`
- `packages/estimation/src/estimateFromProject.ts`
- `packages/estimation/src/index.ts`
- `packages/estimation/src/estimation.test.ts`
- `artifacts/batches/batch-75/issue-75-closeout.md`

## Review Notes

The envelope must preserve educational/concept limitations and must not imply permit-ready, professional, or procurement approval.
