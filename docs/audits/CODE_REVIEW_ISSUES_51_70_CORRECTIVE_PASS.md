# Code Review Issues 51-70 Corrective Pass

Review date: 2026-05-14

## Scope

Reviewed the implemented foundation slice for issues #51-#70 against the issue contracts, gate policy, and no-professional/no-potable-water claim constraints.

Issues #71-#100 have no implementation artifacts in this branch and remain unstarted, not partially complete.

## Findings Fixed

- P1: Clean Water impact output was added after `SimulationRunEnvelopeSchema.parse`, so the public simulation output included an unvalidated `impacts` field. Fixed by adding `ImpactReportSchema`, exporting it from contracts, and validating `impacts` inside `SimulationRunEnvelopeSchema`.
- P1: CI used `pnpm audit` as if it were the foundation audit. In pnpm this is the dependency-vulnerability audit. Fixed CI and policy docs so CI runs both `pnpm audit` and `pnpm run audit`.
- P2: The foundation audit command wrote `artifacts/batches/<name>/audit.*` by default, which made the gate non-read-only. Fixed by making artifact writing explicit with `GOSP_WRITE_AUDIT_ARTIFACTS=1`.

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

## Decision

GO for the implemented #51-#70 slice after the corrective pass.

NO-GO for representing #71-#100 as complete. Those issue contracts still require implementation, review, closeout evidence, and gates.
