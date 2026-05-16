# Issue 140 Closeout

Date: 2026-05-15

## Pre-Change Audit

- `confidenceSummary` counted known, defaulted, unknown, and total warnings.
- Graph consistency warnings from #139 lowered confidence only indirectly through total warning count.
- The summary did not expose `graphWarningCount` or name graph consistency as a downgrade reason.

## Resolution

- Added `graphWarningCount` to the simulation run envelope contract.
- `createSimulationRunEnvelope` now counts graph consistency warnings by diagnostic code.
- `createSimulationConfidenceSummary` lowers confidence when graph warnings are present and includes graph consistency in the rationale.
- `compileCleanWaterInput` now uses a graph-specific confidence rationale when graph consistency warnings are present.
- Updated simulation confidence docs.

## Gates

- `pnpm -r build` PASS
- `pnpm --filter @gosp/sim-core test` PASS after rebuild
- `pnpm simulate:clean-water` PASS
- `pnpm lint` PASS

## Evidence

Clean Water fixture output reports `confidenceSummary.graphWarningCount = 0`. Regression coverage verifies a missing graph node warning produces `graphWarningCount = 1`, `level = "low"`, and a rationale containing graph consistency warnings.

## Code Review

Reviewed contract, summary logic, compiler rationale, envelope construction, docs, and tests. No P0/P1 findings. Graph consistency remains foundation-level coverage checking and does not imply professional validation.
