# Issue 131 Closeout

Date: 2026-05-15

## Resolution

Chose Option B: production repo-ref validation remains blocked by default and is allowed only with `GOSP_API_ENABLE_REPO_VALIDATION=1` as an explicit internal operator override for controlled environments.

## Files Changed

- `packages/api/src/routes/validate.ts`
- `packages/api/src/routes/validate.test.ts`
- `docs/api/VALIDATION_ROUTE.md`
- `docs/api/API_NON_CLAIMS.md`
- `README.md`

## Evidence

- Added tests for local/dev repo-ref validation, production default blocking, and production override allowance.
- Updated API route docs and README to state that production repo-ref validation is not public production API behavior.
- Kept `validateRepoRefs.ts` unchanged so existing path bounds remain intact.

## Gates

- `pnpm --filter @gosp/api test` PASS
- `pnpm audit` PASS
- `pnpm -r test` PASS

## Code Review

Reviewed the diff after gates. No P0/P1 findings. The remaining risk is intentionally documented: production override exists only as an internal operator control and does not create a public production validation claim.
