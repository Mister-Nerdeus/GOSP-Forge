# Issue 76 Pre-Audit

Date: 2026-05-14

## Scope

Issue #76 requires a versioned Clean Water scoring profile and a transparent scorer.

## Current Behavior

- `ScoringProfileSchema` exists with sponsor-neutral validation.
- No `examples/scoring/clean-water.scoring-profile.json` fixture exists.
- No `packages/sim-core/src/cleanWater/scoreCleanWater.ts` scorer exists.
- Sponsor neutrality is only schema-level; there is no scorer test proving sponsored status cannot affect score.

## Planned Files

- `examples/scoring/clean-water.scoring-profile.json`
- `packages/contracts/src/scoring/scoringProfile.ts`
- `packages/contracts/src/contracts.test.ts`
- `packages/sim-core/src/cleanWater/scoreCleanWater.ts`
- `packages/sim-core/src/index.ts`
- `packages/sim-core/src/sim-core.test.ts`
- `artifacts/batches/batch-76/issue-76-closeout.md`

## Review Notes

The scorer must be transparent, versioned, and sponsor-neutral. It must remain educational and must not claim professional validation or potable-water certification.
