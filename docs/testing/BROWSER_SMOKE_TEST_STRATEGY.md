# Browser Smoke Test Strategy

Date: 2026-05-14

## Decision

Use a minimal committed Vitest DOM smoke for the read-only inspection shell. Full Playwright or equivalent browser automation remains postponed until the UI has a user workflow beyond read-only inspection.

## Current Required Evidence

- `pnpm --filter @gosp/web test`
- `pnpm --filter @gosp/web build`
- `pnpm --filter @gosp/web typecheck`

The web package test script is `vitest run` without `--passWithNoTests`; missing or undiscovered smoke tests must fail the gate.

A local Vite HTTP smoke may still be run when UI files change:

```bash
pnpm --filter @gosp/web dev -- --host 127.0.0.1 --port 5173
```

Then request `http://127.0.0.1:5173` and record HTTP 200 evidence in the issue closeout.

## Why Not Add Heavy Browser Testing Yet

- The current UI has no editing, persistence, authentication, routing, or cross-browser workflow.
- The foundation claim is static inspection of bundled examples.
- A Playwright dependency and browser installation would add CI cost before there is enough behavior to justify it.

## Current Minimum Smoke Cases

- App loads the Clean Water manifest summary.
- Project, module, product, safety, education, and output panels render without blank states.
- Safety, no-potable-water, read-only inspection, and no-CAD-editing boundaries are visible.
- No persistence, CAD, or editor workflow claim is introduced.

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

This strategy does not claim broad browser automation coverage today. The current test verifies render only and does not exercise editing, persistence, CAD, manufacturing, professional review, or potable-water certification workflows.
