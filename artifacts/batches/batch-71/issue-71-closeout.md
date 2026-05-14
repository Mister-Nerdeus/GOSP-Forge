# Issue 71 Closeout

Date: 2026-05-14

## Changed Files

- `packages/estimation/src/bom/buildBomFromProject.ts`
- `packages/estimation/src/index.ts`
- `packages/estimation/src/estimation.test.ts`
- `packages/cli/src/commands/estimate.ts`
- `packages/cli/src/commands/validate.ts`
- `packages/cli/src/refResolver.ts`
- `packages/cli/src/cli.test.ts`
- `artifacts/batches/batch-71/issue-71-pre-audit.md`
- `artifacts/batches/batch-71/issue-71-closeout.md`

## Summary

- Added `buildBomFromProject` to compile BOM lines from resolved manifest refs.
- Product bindings become `product` lines.
- Fabricated modules become `custom-part` lines, and their fabrication materials become `material` lines.
- Missing product or fabricated-module quantities default to `1 each`, produce warnings, and lower line confidence.
- `estimateCommand` now reads and resolves the supplied project manifest instead of using hardcoded BOM lines.
- `resolveProjectRefs` now returns loaded ref documents for downstream compilers while `validateCommand` keeps validation output focused on metadata, errors, and warnings.

## Gates

Passed:

- `pnpm lint`
- `pnpm -r build`
- `pnpm -r typecheck`
- `pnpm -r test`
- `pnpm validate:examples`
- `pnpm simulate:clean-water`
- `pnpm estimate:clean-water`
- `pnpm audit`
- `pnpm run audit`
- `node scripts/controls/write-local-validation.mjs`
- `node scripts/controls/verify-local-validation-current.mjs`

## Code Review Notes

- Fixed a review finding where loaded ref documents briefly appeared in `validate` output.
- Totals intentionally use zero unit costs until issue #72 adds a manifest/price-pack cost estimate.
- No professional-use, potable-water, or production manufacturing claims were added.
