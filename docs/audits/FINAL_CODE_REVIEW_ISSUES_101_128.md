# Final Code Review Issues 101-128

Findings: no P0/P1 blockers identified after targeted fixes.

Reviewed areas: API validation modes, shared validation contracts, manifest ref canonicalization, clean-water simulation inputs, estimate quality gates, evidence scripts, release evidence command, and UI smoke/non-claim text.

Residual risk: foundation outputs remain educational and depend on full gate evidence currentness before promotion.

## Corrective Review Addendum

Follow-up review after the batch commit found and fixed three P1/P2 parity issues:

- API repo-ref mode now treats missing optional refs as warnings, matching CLI behavior.
- API repo-ref mode no longer counts a ref as resolved when id or kind validation fails.
- API repo-ref mode now recognizes the same non-education ref schema families used by CLI validation: estimates, simulations, scorecards, baselines, and import records.
- Simulation confidence summaries no longer count invalid defaulted product specs as known inputs.

Regression coverage was added in API route tests and sim-core tests.
