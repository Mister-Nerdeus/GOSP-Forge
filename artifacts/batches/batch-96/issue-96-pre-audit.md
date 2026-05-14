# Issue 96 Pre-Audit

Date: 2026-05-14

## Scope

Issue #96 requires release hygiene documents before any develop-to-main foundation promotion.

## Current Behavior

- `docs/program/` contains audit and issue standards but no foundation release checklist.
- No rollback record template exists.
- No develop-to-main promotion policy exists.
- Local validation policy already requires `latest.json` to match `HEAD`.

## Planned Files

- `docs/program/FOUNDATION_RELEASE_CHECKLIST.md`
- `docs/program/ROLLBACK_RECORD_TEMPLATE.md`
- `docs/program/DEVELOP_TO_MAIN_FOUNDATION_PROMOTION.md`
- `artifacts/batches/batch-96/issue-96-closeout.md`

## Review Notes

Promotion must require current validation evidence and an audit GO decision. Rollback criteria must be explicit and must not imply production readiness.
