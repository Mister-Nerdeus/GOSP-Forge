# Issue 86 Closeout

Date: 2026-05-14

## Changed Files

- `packages/module-registry/src/licenseCompatibility.ts`
- `packages/module-registry/src/licenseCompatibility.test.ts`
- `packages/contracts/src/imports/licenseProfile.ts`
- `docs/governance/LICENSE_AWARE_IMPORT_POLICY.md`
- `artifacts/batches/batch-86/issue-86-pre-audit.md`
- `artifacts/batches/batch-86/issue-86-closeout.md`

## Implementation Summary

- Replaced the compressed license helper with explicit `allow`, `review`, and `block` decisions.
- Added compatibility obligations for attribution, share-alike, and ODbL data-boundary imports.
- Added schema consistency checks for unlicensed public imports, share-alike licenses, and ODbL data boundaries.
- Added direct module-registry tests for unlicensed, share-alike, ODbL, and review-required cases.
- Updated policy docs with machine-readable outcomes and non-legal-advice language.

## Gate Output Summary

- `pnpm --filter @gosp/contracts build`: PASS
- `pnpm --filter @gosp/contracts test`: PASS
- `pnpm --filter @gosp/contracts typecheck`: PASS
- `pnpm --filter @gosp/module-registry test`: PASS
- `pnpm --filter @gosp/module-registry typecheck`: PASS
- `pnpm lint`: PASS
- `pnpm -r build`: PASS
- `pnpm -r typecheck`: PASS
- `pnpm -r test`: PASS
- `pnpm validate:examples`: PASS
- `pnpm simulate:clean-water`: PASS
- `pnpm estimate:clean-water`: PASS
- `pnpm audit`: PASS
- `node scripts/controls/write-local-validation.mjs`: PASS
- `node scripts/controls/verify-local-validation-current.mjs`: PASS
- `git diff --check`: PASS

## Code Review Notes

- Initial focused registry tests failed because `@gosp/contracts` resolves through built `dist`; rebuilding contracts fixed the stale export/runtime issue.
- Reviewed unlicensed handling to ensure it blocks public import rather than warning only.
- Reviewed ODbL handling to ensure data-boundary obligations are explicit.
- No unresolved defects remain.
