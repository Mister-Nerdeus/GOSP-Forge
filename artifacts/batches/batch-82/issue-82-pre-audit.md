# Issue 82 Pre-Audit

Date: 2026-05-14

## Scope

Issue #82 requires API tests for body parsing, content type, invalid JSON, oversized JSON, server behavior, and rate limiting.

## Current Behavior

- `api.test.ts` has limited coverage for wrong content type and oversized body.
- No dedicated `readJsonBody.test.ts`, `rateLimit.test.ts`, or `server.test.ts` files exist.
- Invalid JSON and deterministic rate-limit behavior are not directly tested.

## Planned Files

- `packages/api/src/http/readJsonBody.test.ts`
- `packages/api/src/http/rateLimit.test.ts`
- `packages/api/src/server.test.ts`
- `artifacts/batches/batch-82/issue-82-closeout.md`

## Review Notes

Tests should exercise controls without changing production behavior.
