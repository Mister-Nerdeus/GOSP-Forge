# No Professional Claim Gate

The audit command scans repository text for affirmative claims that foundation outputs certify potable water, provide professional approval, approve production manufacturing, or produce permit-ready results.

## Gate Behavior

- Explicit non-claims and disclaimers are allowed.
- Affirmative potable-water certification or safety claims fail audit.
- Affirmative professional approval claims fail audit.
- Affirmative production manufacturing approval/readiness claims fail audit.
- Permit-ready output claims fail audit.

## Scope

The scanner covers `README.md`, `docs/`, `examples/`, and package source files while skipping generated output and test fixtures.

## Non-Claims

This gate is a text-risk scanner. Passing it does not prove the repository is legally complete, professionally reviewed, potable-water safe, or production-ready. It is a guard against accidental overclaiming in foundation content.
