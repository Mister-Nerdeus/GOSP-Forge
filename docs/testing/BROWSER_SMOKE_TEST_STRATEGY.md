# Browser Smoke Test Strategy

Date: 2026-05-14

## Decision

Postpone committed Playwright or equivalent browser automation until the UI has a user workflow beyond read-only inspection. For the foundation slice, browser validation is a lightweight manual or operator-run smoke check, not a required CI gate.

## Current Required Evidence

- `pnpm --filter @gosp/web build`
- `pnpm --filter @gosp/web typecheck`
- A local Vite HTTP smoke when UI files change:

```bash
pnpm --filter @gosp/web dev -- --host 127.0.0.1 --port 5173
```

Then request `http://127.0.0.1:5173` and record HTTP 200 evidence in the issue closeout.

## Why Not Add Heavy Browser Testing Yet

- The current UI has no editing, persistence, authentication, routing, or cross-browser workflow.
- The foundation claim is static inspection of bundled examples.
- A Playwright dependency and browser installation would add CI cost before there is enough behavior to justify it.

## Future Gate Trigger

Add Playwright or an equivalent browser smoke suite before any of the following claims are made:

- Editable builder workflow
- Persisted project state
- API-backed validation from the UI
- User submission workflow
- Authenticated or role-specific UI
- Production deployment readiness

## Future Minimum Smoke Cases

- App loads the Clean Water manifest summary.
- Project, module, product, safety, education, and output panels render without blank states.
- Safety and no-potable-water boundaries are visible.
- No persistence or editor controls appear when the product is still inspection-only.
- Viewport checks cover desktop and mobile widths.

## Non-Claims

This strategy does not claim browser automation coverage today. It documents why browser automation is postponed and what manual smoke evidence is expected until UI behavior expands.
