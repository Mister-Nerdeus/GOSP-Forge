# Issue 56 Pre-Audit

## Scope

Decide and document local validation artifact handling.

## Current Behavior

- `latest.json` was ignored directly in `.gitignore`.
- `artifacts/controls/local-validation/.gitkeep` existed.
- No README documented the directory policy.
- `docs/gates/TRUTH_GATE_LOCAL_VALIDATION.md` described currentness but did not explicitly state whether `latest.json` is committed, attached externally, or generated locally.

## Policy Decision

Generated local validation JSON is generated locally and not committed. The evidence path and policy are committed through `.gitkeep`, `README.md`, and docs.
