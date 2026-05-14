# Issue 79 Pre-Audit

Date: 2026-05-14

## Scope

Issue #79 requires teacher/student guide files, manifest refs, and education validation.

## Current Behavior

- `EducationProfileSchema` validates module education metadata only.
- `ProjectManifestV2.refGroups.education` exists but `RefSchema` does not include an `education` ref kind.
- CLI ref resolution assumes referenced files are JSON, so Markdown guide refs cannot be loaded.
- No teacher or student guide files exist under `docs/education/clean-water/`.
- No validation checks public-school free use, student safety language, or payment-prompt boundaries.

## Planned Files

- `docs/education/clean-water/TEACHER_GUIDE.md`
- `docs/education/clean-water/STUDENT_GUIDE.md`
- `packages/contracts/src/education/educationValidation.ts`
- `packages/contracts/src/index.ts`
- `packages/contracts/src/shared/ref.ts`
- `packages/contracts/src/project/projectManifestV2.ts`
- `packages/contracts/src/contracts.test.ts`
- `packages/cli/src/exampleRegistry.ts`
- `packages/cli/src/refKindValidators.ts`
- `packages/cli/src/refResolver.ts`
- `examples/projects/automated-water-filter.project-v2.json`
- `artifacts/batches/batch-79/issue-79-closeout.md`

## Review Notes

Guide validation must keep the Clean Water experience educational, free for public-school use, and explicit about supervised safety and no potable-water claims.
