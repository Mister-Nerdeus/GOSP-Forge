# Issue 81 Pre-Audit

Date: 2026-05-14

## Scope

Issue #81 requires API `/validate` to perform real validation instead of echoing JSON.

## Current Behavior

- `packages/api/src/server.ts` handles `POST /validate` inline.
- The route reads JSON and returns `{ ok: true, received: body }` without validating.
- API body controls are handled by `readJsonBody`.
- Rate limiting is handled before route dispatch.

## Planned Files

- `packages/api/src/server.ts`
- `packages/api/src/routes/validate.ts`
- `packages/api/src/routes/validate.test.ts`
- `artifacts/batches/batch-81/issue-81-closeout.md`

## Review Notes

The API should reuse contract schema validation and return 422 for invalid project manifests while preserving existing body parsing, content-type, and rate-limit controls.
