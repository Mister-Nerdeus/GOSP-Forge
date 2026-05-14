# Issue 79 Closeout

Date: 2026-05-14

## Changed Files

- Added `docs/education/clean-water/TEACHER_GUIDE.md`.
- Added `docs/education/clean-water/STUDENT_GUIDE.md`.
- Added `packages/contracts/src/education/educationValidation.ts`.
- Added `education` ref-kind support in contracts and project manifest validation.
- Added Markdown ref loading for `education` refs in the CLI resolver.
- Linked teacher/student guides from `examples/projects/automated-water-filter.project-v2.json`.
- Added contract test coverage for education guide validation.
- Updated `simulate` to use resolved document values instead of rereading all refs as JSON.

## Gate Summary

- `pnpm --filter @gosp/contracts test` PASS
- `pnpm --filter @gosp/contracts typecheck` PASS
- `pnpm --filter @gosp/contracts build` PASS
- `pnpm --filter @gosp/cli typecheck` PASS
- `pnpm --filter @gosp/cli test` PASS
- `pnpm validate:examples` PASS
- `pnpm simulate:clean-water` PASS
- `pnpm estimate:clean-water` PASS
- `pnpm lint` PASS
- `pnpm -r build` PASS
- `pnpm -r typecheck` PASS
- `pnpm -r test` PASS
- `pnpm audit` PASS
- `node scripts/controls/write-local-validation.mjs` PASS
- `node scripts/controls/verify-local-validation-current.mjs` PASS
- `git diff --check` PASS

## Code Review Notes

- Verified teacher and student guides state free public-school use.
- Verified student guide includes supervised safety language and no potable-water claim language.
- Verified guide validation rejects payment prompts.
- Verified `education` refs resolve Markdown guide files without breaking simulation or estimation.
- Verified validation output includes guide refs and no guide validation errors.

## Findings Fixed

- `simulate` previously reread every resolved ref as JSON. That broke once education refs pointed at Markdown files, so it now uses `resolveProjectRefs(...).documents`.
