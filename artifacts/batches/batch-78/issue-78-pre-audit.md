# Issue 78 Pre-Audit

Date: 2026-05-14

## Scope

Issue #78 requires Clean Water safety validation rules for module refs and documentation of safety/use boundaries.

## Current Behavior

- `ModulePackageSchema` blocks physical modules without `safetyProfile`.
- CLI ref validation dispatches module refs through `ModulePackageSchema`.
- No reusable safety validator scans module text for potable-water, professional approval, or production-readiness claims.
- Validation does not surface education-mode safety warnings.
- Clean Water water modules have safety profiles, but their notes do not explicitly state that education mode is not approval.

## Planned Files

- `packages/contracts/src/safety/safetyValidation.ts`
- `packages/contracts/src/index.ts`
- `packages/contracts/src/contracts.test.ts`
- `packages/cli/src/refKindValidators.ts`
- `packages/cli/src/refResolver.ts`
- `examples/modules/water/*.module.json`
- `docs/governance/SAFETY_AND_USE_POLICY.md`
- `artifacts/batches/batch-78/issue-78-closeout.md`

## Review Notes

Validation must fail unsafe claims, require safety profiles for physical/water/electrical modules, and warn that education profiles are instructional context only.
