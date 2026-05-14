# Issue 87 Pre-Audit

Date: 2026-05-14

## Scope

Issue #87 requires example external source and import records plus validation support.

## Current Behavior

- `ExternalSourceRecordSchema` and `ImportRecordSchema` exist.
- No `examples/imports/` directory or import examples exist.
- CLI ref-kind validation does not dispatch import schemas.
- Import docs are absent.

## Planned Files

- `examples/imports/open-know-how.example.json`
- `examples/imports/appropedia-reference.example.json`
- `examples/imports/unlicensed.invalid.json`
- `packages/cli/src/refKindValidators.ts`
- `packages/cli/src/refResolver.test.ts`
- `docs/migration/EXTERNAL_SOURCE_IMPORTS.md`
- `artifacts/batches/batch-87/issue-87-closeout.md`

## Review Notes

Examples must preserve attribution/license metadata and avoid implying bulk-import permission. Reference-only records must remain distinct from public imports.
