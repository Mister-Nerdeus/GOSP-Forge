# Issue 131 Pre-Audit

Date: 2026-05-15

## Current Behavior Before Change

- `packages/api/src/routes/validate.ts` allowed repo-ref validation outside production and also allowed it in production when `GOSP_API_ENABLE_REPO_VALIDATION === "1"`.
- `docs/api/VALIDATION_ROUTE.md` said production repo-ref mode was blocked unless explicitly enabled, but did not label the override as internal/operator-only behavior.
- `README.md` described local/dev API repo-ref mode but did not mention the production override policy.
- `packages/api/src/routes/validate.test.ts` covered local repo-ref mode, path traversal blocking, optional missing refs, and wrong-kind refs. It did not cover production default blocking or production override behavior.

## Policy Decision

Repo-ref validation remains schema-only by default and local/dev bounded by known repository paths. Production repo-ref validation remains possible only through `GOSP_API_ENABLE_REPO_VALIDATION=1`, documented as an explicit internal operator override for controlled environments, not public production API behavior.

## Boundaries Preserved

- No change to `validateRepoRefs.ts` path bounds.
- No production storage, auth, hosting, public API, potable-water, professional engineering, or manufacturing claim introduced.
