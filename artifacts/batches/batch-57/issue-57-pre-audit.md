# Issue 57 Pre-Audit

## Scope

Normalize TypeScript source formatting for reviewability without changing behavior.

## Current Behavior

- Many TypeScript files in scoped packages used compressed one-line implementation style.
- No Prettier config existed.
- Pre-format gates passed: `pnpm lint`, `pnpm -r test`, `pnpm simulate:clean-water`, and `pnpm estimate:clean-water`.

## Risk Notes

This issue is formatting-only. No schema, simulation, estimate, potable-water, professional approval, or manufacturing approval semantics should change.
