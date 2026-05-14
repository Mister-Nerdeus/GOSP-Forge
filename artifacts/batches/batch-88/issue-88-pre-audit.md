# Issue 88 Pre-Audit

Date: 2026-05-14

## Scope

Issue #88 requires manufacturer spec import draft examples and tests.

## Current Behavior

- `SpecImportDraftSchema` exists with extracted fields, missing fields, assumptions, contradictions, and review status.
- No manufacturer spec import examples exist.
- No direct contract tests cover AI extraction, missing fields, contradiction visibility, or manufacturer verification limits.
- Program docs state intent but not the workflow boundary.

## Planned Files

- `examples/imports/pump-spec-import-draft.json`
- `examples/imports/pump-spec-import-with-contradiction.json`
- `packages/contracts/src/imports/specImportDraft.ts`
- `packages/contracts/src/imports/specImportDraft.test.ts`
- `docs/sponsorship/MANUFACTURER_SPEC_SUBMISSION_PROGRAM.md`
- `artifacts/batches/batch-88/issue-88-closeout.md`

## Review Notes

AI extraction must remain draft-plane only. Missing fields, contradictions, and human review requirements must be visible in machine-readable records.
