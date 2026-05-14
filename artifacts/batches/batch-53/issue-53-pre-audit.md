# Issue 53 Pre-Audit

## Scope

Remove `--passWithNoTests` from `@gosp/contracts` and strengthen core contract tests.

## Current Behavior

- `packages/contracts/package.json` allowed `vitest run --passWithNoTests`.
- A contracts test file existed, but coverage was compressed and did not include explicit positive and negative cases for every named contract in the issue.

## Risk Notes

Tests must remain local and deterministic. No network, wall-clock, potable-water certification, professional approval, or manufacturing approval claims are introduced.
