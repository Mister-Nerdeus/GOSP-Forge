# Issue 136 Closeout

Date: 2026-05-15

## Pre-Change Audit

- `ValidationResultSchema` allowed `warnings` as either raw strings or structured diagnostics.
- API schema-only mode returned a raw string warning.
- CLI repo-ref validation already emitted structured warning diagnostics.
- `docs/contracts/VALIDATION_RESULT.md` did not state that warnings must be structured.

## Resolution

- Changed `ValidationResultSchema.warnings` to `z.array(ValidationDiagnosticSchema)`.
- Converted the API schema-only warning to `api-schema-only-no-repo-refs` with `severity: "warning"` and `source: "mode"`.
- Added a contract test proving raw string warnings are rejected.
- Updated API and contract docs to describe structured warnings.

## Gates

- `pnpm --filter @gosp/contracts test` PASS
- `pnpm --filter @gosp/api test` PASS
- `pnpm --filter @gosp/cli test` PASS
- `pnpm validate:examples` PASS

## Code Review

Reviewed the diff and searched validation-result paths for `warnings: ["..."]` and the prior string union. No P0/P1 findings. CLI validation warnings remain machine-readable, and API schema-only limitations are now machine-readable.
