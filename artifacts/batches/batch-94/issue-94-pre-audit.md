# Issue 94 Pre-Audit

Date: 2026-05-14

## Scope

Issue #94 requires read-only UI inspection panels for foundation data.

## Current Behavior

- `apps/web` renders a minimal shell with project metadata, ref counts, required refs, and boundary text.
- No panel components exist under `apps/web/src/panels/`.
- The app does not yet inspect module, product, safety, education, or output-oriented foundation data.

## Planned Files

- `apps/web/src/panels/ProjectPanel.tsx`
- `apps/web/src/panels/ModulePanel.tsx`
- `apps/web/src/panels/ProductPanel.tsx`
- `apps/web/src/panels/SafetyPanel.tsx`
- `apps/web/src/panels/EducationPanel.tsx`
- `apps/web/src/panels/OutputPanel.tsx`
- `apps/web/src/App.tsx`
- `apps/web/src/styles.css`
- `docs/product/FOUNDATION_UI_INSPECTION.md`
- `artifacts/batches/batch-94/issue-94-closeout.md`

## Review Notes

The panels must remain inspection-only. They must show assumptions, confidence, and safety boundaries without adding editor, persistence, CAD, potable-water, professional, or production-manufacturing claims.
