# CI Gate Policy

CI complements local evidence and runs the repository truth gates that do not write local validation artifacts.

## CI Gates

- Runtime policy verification: `node scripts/controls/verify-runtime-version.mjs`
- Frozen install: `pnpm install --frozen-lockfile`
- Static and package gates: `pnpm lint`, `pnpm -r build`, `pnpm -r typecheck`, `pnpm -r test`
- Dependency audit: `pnpm audit`
- Foundation proof commands: `pnpm validate:examples`, `pnpm simulate:clean-water`, `pnpm estimate:clean-water`, `pnpm run audit`

`pnpm audit` is pnpm's dependency-vulnerability audit. The repository foundation audit is a package script and must be invoked as `pnpm run audit` or via `pnpm --filter @gosp/cli start audit foundation`.

## Local-Only Evidence

CI intentionally does not run `node scripts/controls/write-local-validation.mjs` because that command writes local validation evidence under `artifacts/controls/local-validation/`. Local validation currentness is checked locally and may be attached to review evidence, but CI should not generate committed artifacts.

## Current Implementation Limits

This document describes foundation policy and contract intent. The current repository provides foundation packages, example fixtures, validation gates, and CI proof commands only. It does not claim production readiness, professional approval, potable-water certification, or production manufacturing approval.

## CI Artifacts

CI uploads sanitized local-validation and batch artifact markdown outputs as non-secret evidence. Local full validation remains separate from sanitized PR/release evidence.
