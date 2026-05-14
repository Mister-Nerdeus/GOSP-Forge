# CI Gate Policy

CI complements local evidence and runs the repository truth gates that do not write local validation artifacts.

## CI Gates

- Runtime policy verification: `node scripts/controls/verify-runtime-version.mjs`
- Frozen install: `pnpm install --frozen-lockfile`
- Static and package gates: `pnpm lint`, `pnpm -r build`, `pnpm -r typecheck`, `pnpm -r test`
- Foundation proof commands: `pnpm validate:examples`, `pnpm simulate:clean-water`, `pnpm estimate:clean-water`, `pnpm audit`

## Local-Only Evidence

CI intentionally does not run `node scripts/controls/write-local-validation.mjs` because that command writes local validation evidence under `artifacts/controls/local-validation/`. Local validation currentness is checked locally and may be attached to review evidence, but CI should not generate committed artifacts.

## Current Implementation Limits

This document describes foundation policy and contract intent. The current repository provides foundation packages, example fixtures, validation gates, and CI proof commands only. It does not claim production readiness, professional approval, potable-water certification, or production manufacturing approval.
