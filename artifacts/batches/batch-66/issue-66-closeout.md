# Issue 66 Closeout

## Changed Files

- `packages/sim-core/src/cleanWater/compileCleanWaterInput.ts`
- `packages/sim-core/src/index.ts`
- `packages/cli/src/commands/simulate.ts`
- `packages/cli/src/cli.test.ts`
- `artifacts/batches/batch-66/issue-66-pre-audit.md`
- `artifacts/batches/batch-66/issue-66-closeout.md`

## Gate Output Summary

- `pnpm lint` passed.
- `pnpm -r build` passed.
- `pnpm -r typecheck` passed.
- `pnpm -r test` passed.
- `pnpm validate:examples` passed.
- `pnpm simulate:clean-water` passed.
- `pnpm estimate:clean-water` passed.
- `pnpm audit` passed.
- `node scripts/controls/write-local-validation.mjs` passed.
- `node scripts/controls/verify-local-validation-current.mjs` passed.

## Code Review Notes

- `simulateCommand` now parses the project manifest, resolves refs, loads referenced files, and compiles Clean Water inputs from product specs.
- Pump flow and battery voltage derive from product spec meanings.
- Missing pump-flow or voltage specs warn and lower compiler confidence.
- Level-1 defaults are visible in `defaultedInputs`.
- Updated CLI smoke test to pass the project manifest into the now manifest-driven simulate command.
- No potable-water, professional approval, or production-use claims were added.

## Result

Issue #66 is complete with passing gates, review evidence, and closeout evidence.
