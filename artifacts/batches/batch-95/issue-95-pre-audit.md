# Issue 95 Pre-Audit

Date: 2026-05-14

## Scope

Issue #95 requires a browser smoke test strategy decision document before UI claims expand.

## Current Behavior

- `apps/web` has a Vite shell with build and typecheck gates.
- No browser smoke test strategy document exists.
- The foundation audit already names browser smoke tests as not established.

## Planned Files

- `docs/testing/BROWSER_SMOKE_TEST_STRATEGY.md`
- `artifacts/batches/batch-95/issue-95-closeout.md`

## Review Notes

The decision should avoid adding heavy browser automation prematurely, document the current manual/lightweight smoke expectation, and define a future Playwright gate trigger without claiming coverage that does not exist.
