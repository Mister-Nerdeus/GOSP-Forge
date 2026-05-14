# Issue 92 Pre-Audit

Date: 2026-05-14

## Scope

Issue #92 requires a no-professional-claim content scanner in the audit command.

## Current Behavior

- `pnpm audit` checks required files and placeholders.
- Safety validation catches risky module text during example validation.
- No broad audit scanner checks docs/examples/source for risky potable-water, professional approval, or production manufacturing approval claims.

## Planned Files

- `packages/cli/src/audit/noProfessionalClaimScanner.ts`
- `packages/cli/src/audit/noProfessionalClaimScanner.test.ts`
- `packages/cli/src/commands/audit.ts`
- `docs/gates/NO_PROFESSIONAL_CLAIM_GATE.md`
- `artifacts/batches/batch-92/issue-92-closeout.md`

## Review Notes

The scanner must allow explicit disclaimers/non-claims while blocking affirmative certification/approval/production-readiness claims.
