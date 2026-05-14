# Issue 77 Closeout

Date: 2026-05-14

## Changed Files

- Added `packages/sim-core/src/scoring/moduleScorecardGenerator.ts`.
- Added `packages/sim-core/src/scoring/systemScorecardGenerator.ts`.
- Updated `packages/cli/src/commands/simulate.ts` to emit module and system scorecards.
- Updated `packages/sim-core/src/index.ts` exports.
- Added sim-core test coverage for scorecard rationale, module refs, and confidence lowering.

## Gate Summary

- `pnpm --filter @gosp/sim-core test` PASS
- `pnpm --filter @gosp/sim-core typecheck` PASS
- `pnpm --filter @gosp/cli typecheck` PASS after rebuilding sim-core exports
- `pnpm --filter @gosp/cli test` PASS
- `pnpm lint` PASS
- `pnpm -r build` PASS
- `pnpm -r typecheck` PASS
- `pnpm -r test` PASS
- `pnpm validate:examples` PASS
- `pnpm simulate:clean-water` PASS
- `pnpm estimate:clean-water` PASS
- `pnpm audit` PASS
- `node scripts/controls/write-local-validation.mjs` PASS
- `node scripts/controls/verify-local-validation-current.mjs` PASS
- `git diff --check` PASS

## Code Review Notes

- Verified scorecards include explicit rationale and confidence.
- Verified defaulted inputs lower module and system scorecard confidence.
- Verified the system scorecard uses the sponsor-neutral Clean Water scorer.
- Verified simulation output includes scorecards at top level and in the envelope output hash.
- Verified output language remains educational and does not claim potable-water certification or professional validation.

## Findings Fixed

- Rebuilt sim-core before CLI typecheck so workspace package exports reflected the new generators.
- Fixed the CLI scoring profile type so TypeScript can pass it to the system scorecard generator.
