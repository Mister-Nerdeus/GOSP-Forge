# Issue 132 Closeout

Date: 2026-05-15

## Pre-Change Audit

- `apps/web/package.json` used `vitest run --passWithNoTests`.
- `apps/web/src/App.test.ts` already rendered the foundation inspection shell and asserted the Clean Water title, no-potable-water language, foundation inspection language, and core panels.
- `docs/testing/BROWSER_SMOKE_TEST_STRATEGY.md` did not state that zero discovered tests must fail the web package gate.

## Resolution

- Changed the web test script to `vitest run`.
- Added a smoke assertion for `no CAD editing` to reinforce the read-only inspection boundary.
- Updated the browser smoke strategy to document that missing or undiscovered web tests must fail.

## Gates

- `pnpm --filter @gosp/web test` PASS
- `pnpm --filter @gosp/web build` PASS
- `pnpm -r test` PASS
- `pnpm audit` PASS

## Code Review

Reviewed the diff after gates. No P0/P1 findings. The change removes silent zero-test success for the web package without adding CAD, editor, persistence, auth, deployment, or potable-water claims.
