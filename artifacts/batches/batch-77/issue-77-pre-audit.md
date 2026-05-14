# Issue 77 Pre-Audit

Date: 2026-05-14

## Scope

Issue #77 requires module and system scorecard generation and inclusion in the Clean Water simulation output.

## Current Behavior

- `ModuleScorecardSchema` and `SystemScorecardSchema` exist, but no sim-core generators exist.
- `simulate` returns input, flow, power, and envelope only.
- Clean Water scoring exists from issue #76, but it is not connected to scorecard output.
- Missing/defaulted data appears in input and warnings, but no scorecard confidence is derived from it.

## Planned Files

- `packages/sim-core/src/scoring/moduleScorecardGenerator.ts`
- `packages/sim-core/src/scoring/systemScorecardGenerator.ts`
- `packages/sim-core/src/index.ts`
- `packages/sim-core/src/sim-core.test.ts`
- `packages/cli/src/commands/simulate.ts`
- `artifacts/batches/batch-77/issue-77-closeout.md`

## Review Notes

The scorecards must remain read-only and educational. They must include rationale and confidence, and missing/defaulted data must reduce confidence without making professional or potable-water claims.
