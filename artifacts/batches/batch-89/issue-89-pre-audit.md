# Issue 89 Pre-Audit

Date: 2026-05-14

## Scope

Issue #89 requires sponsor influence checks in scoring validation.

## Current Behavior

- `ScoringProfileSchema` requires `sponsorNeutral: true`.
- Sponsor influence is rejected only when `sponsor` appears in a component id or source.
- Formula and label text are not checked by the shared helper.
- No direct scoring profile tests exist for sponsor influence.

## Planned Files

- `packages/contracts/src/sponsorship/sponsorInfluenceCheck.ts`
- `packages/contracts/src/scoring/scoringProfile.ts`
- `packages/contracts/src/scoring/scoringProfile.test.ts`
- `docs/governance/PAY_TO_WIN_PROHIBITION.md`
- `artifacts/batches/batch-89/issue-89-closeout.md`

## Review Notes

Sponsor disclosure must remain visible, but sponsor status cannot affect score formula, component weight, ranking, or eligibility.
