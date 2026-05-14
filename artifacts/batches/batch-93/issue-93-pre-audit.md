# Issue 93 Pre-Audit

Date: 2026-05-14

## Scope

Issue #93 requires a minimal builder UI package shell.

## Current Behavior

- `apps/web/` exists only as `.gitkeep`.
- Workspace already includes `apps/*`.
- No UI package, entrypoint, styles, or product doc exists.

## Planned Files

- `apps/web/package.json`
- `apps/web/index.html`
- `apps/web/src/main.tsx`
- `apps/web/src/App.tsx`
- `apps/web/src/styles.css`
- `apps/web/tsconfig.json`
- `docs/product/BUILDER_UI_SHELL.md`
- `artifacts/batches/batch-93/issue-93-closeout.md`

## Review Notes

The UI must remain a read-only shell. It must not claim CAD editing, persistence, production use, professional approval, or potable-water certification.
