# Issue 85 Pre-Audit

Date: 2026-05-14

## Scope

Issue #85 requires expanded registry trust levels and moderation states with documentation and tests.

## Current Behavior

- Trust levels already include `field-used`, `restricted`, and `removed`.
- Moderation statuses already include `restricted` and `removed`.
- Restricted trust level requires `safetyReason`.
- Moderation reason and removed audit-record requirements are not enforced.

## Planned Files

- `packages/contracts/src/registry/moduleTrustLevel.ts`
- `packages/contracts/src/registry/moderationStatus.ts`
- `packages/contracts/src/registry/moduleRegistryEntry.ts`
- `packages/contracts/src/registry/moduleRegistryEntry.test.ts`
- `docs/contracts/MODULE_REGISTRY.md`
- `artifacts/batches/batch-85/issue-85-closeout.md`

## Review Notes

Trust must remain visible. Restricted modules need reasons, and removed modules must preserve audit records.
