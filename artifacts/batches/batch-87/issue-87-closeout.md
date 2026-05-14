# Issue 87 Closeout

Date: 2026-05-14

## Changed Files

- `examples/imports/open-know-how.example.json`
- `examples/imports/appropedia-reference.example.json`
- `examples/imports/unlicensed.invalid.json`
- `packages/cli/src/refKindValidators.ts`
- `packages/cli/src/refResolver.test.ts`
- `packages/contracts/src/imports/externalSourceRecord.ts`
- `packages/contracts/src/imports/importRecord.ts`
- `packages/contracts/src/shared/ref.ts`
- `docs/migration/EXTERNAL_SOURCE_IMPORTS.md`
- `artifacts/batches/batch-87/issue-87-pre-audit.md`
- `artifacts/batches/batch-87/issue-87-closeout.md`

## Implementation Summary

- Added external source/import example records with explicit attribution, license, and obligations.
- Added an invalid unlicensed import fixture that fails import schema validation.
- Added `import` ref kind support for project refs and CLI schema dispatch.
- Added direct resolver tests for valid import refs and invalid public import records.
- Added migration docs that distinguish public import from reference-only citation.

## Gate Output Summary

- `pnpm --filter @gosp/contracts build`: PASS
- `pnpm --filter @gosp/contracts test`: PASS
- `pnpm --filter @gosp/cli test`: PASS
- `pnpm --filter @gosp/cli typecheck`: PASS
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

- Reviewed examples for attribution/license clarity and no bulk-import implication.
- Verified reference-only Appropedia example remains non-importable.
- Verified unlicensed import fixture fails through the CLI ref resolver path.
- No unresolved defects remain.
