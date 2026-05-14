# Issue 54 Pre-Audit

## Scope

Add the user-facing foundation proof commands to CI and document CI/local gate differences.

## Current Behavior

- CI ran runtime verification, frozen install, lint, build, typecheck, and tests.
- CI omitted `pnpm validate:examples`, `pnpm simulate:clean-water`, `pnpm estimate:clean-water`, and `pnpm audit`.
- CI did not run local artifact writers.

## Risk Notes

CI must fail on broken examples but must not generate local validation artifacts.
