# STEM Foundation Slice A2 — Canonical System Map

Date: 2026-08-29 (America/New_York)
Issue: #5
Starting SHA: `8833d0872a03e00cb24b6deb8cd0f7c10ba1f655`
Implementation SHA: `e471beca3aa806428fcbeea3fc7307e25ffda8aa`
Branch: `cipher/stem-foundation`

## Result

Slice A2 resolves and renders a domain-neutral system map from canonical `Scenario`, `SystemElement`, and `Interface` records.

- Clean Water declares three resolved system elements and three typed interfaces in the vertical package.
- Sandbox deliberately renders `not-declared` because its canonical Scenario declares no system elements or interfaces.
- Submitted inputs, controlled values, changeable paths, calculated outputs, and measured-output status are derived by the API projection.
- Measured outputs remain `not-declared`; no observation is invented.
- The browser renders the projection and counts its declared records. It performs no physics, scoring, evidence, or readiness calculation.

The Clean Water declarations are synthetic educational system descriptions. They do not change the REP material input, solver identity, or result identity.

## Files changed

- `apps/web/src/App.test.ts`
- `apps/web/src/App.tsx`
- `apps/web/src/styles.css`
- `packages/api/src/phase1a/evaluatorRegistry.ts`
- `packages/api/src/phase1a/service.ts`
- `packages/api/src/phase1a/stemSystemProjection.test.ts`
- `packages/api/src/phase1a/stemSystemProjection.ts`
- `packages/api/src/server.ts`
- `packages/contracts/src/application/phase1a.ts`
- `packages/contracts/src/education/stemSystemProjection.ts`
- `packages/vertical-clean-water/src/education/stemSystemDefinition.ts`
- `packages/vertical-clean-water/src/index.ts`
- `packages/vertical-clean-water/src/vertical-clean-water.test.ts`

## Executed verification

Runtime:

```text
Node: v22.16.0
pnpm: 9.15.5
Command date/timezone: 2026-08-29, America/New_York
```

Commands executed after the implementation:

```text
git diff --check
pnpm --filter @gosp/contracts build
pnpm --filter @gosp/vertical-clean-water build
pnpm --filter @gosp/api build
pnpm --filter @gosp/web typecheck
pnpm --filter @gosp/vertical-clean-water test
pnpm --filter @gosp/api test -- stemSystemProjection.test.ts
pnpm --filter @gosp/web test
pnpm verify
pnpm dev:phase1a
pnpm install --frozen-lockfile
```

Observed results:

- affected builds and typechecks: pass;
- focused Clean Water tests: 1 file, 16 tests passed;
- focused API projection tests: 1 file, 3 tests passed;
- focused browser-view tests: 1 file, 1 test passed;
- intended test discovery: 33 of 33 files;
- full repository tests: 33 files, 150 tests passed;
- REP replay: input and result hashes matched;
- Clean Water example validation, simulation, and estimate: completed;
- foundation audit: GO, 23 pass, 0 warn, 0 fail;
- frozen lockfile install: completed, lockfile already up to date.

## Browser acceptance

The local command started the API at `http://127.0.0.1:3080`. Port 5173 was already occupied, so Vite selected `http://localhost:5174/` for this run.

Observed in the local browser:

- Sandbox showed a `not-declared` canonical system declaration, no system nodes, no inferred connections, and measured outputs as `not-declared`.
- Clean Water showed the exact Challenge/Scenario/Model boundary, three resolved system nodes, and three declared interfaces:
  - source to pump water resource in `L`;
  - source to pump power in `V`;
  - pump to filter water resource in `L/min`.
- Clean Water displayed submitted, controlled, changeable, calculated, and measured-output roles.
- The non-claim that the view introduces no browser-only physics, scoring, evidence, or readiness claim was visible.
- The page remained usable after switching from Sandbox to Clean Water.
- Browser console warnings/errors: none observed.

## Failures and recovery

- The initial browser connection timed out before a page was selected. The documented browser recovery path was used and the smoke then executed normally.
- The browser surface does not support `networkidle`; the unsupported wait did not execute. The smoke used `domcontentloaded` plus explicit visible-content waits instead.
- Stopping the two development processes with an interrupt reports them as failed; this is the expected result of ending the local smoke session, not an application verification failure.

## Architecture and truth review

- Core projection fields are domain-neutral.
- Clean Water declarations stay in the Clean Water vertical and flow into the application through the evaluator registry.
- The API owns record resolution and role extraction.
- The browser only renders API-provided values.
- Missing Sandbox declarations remain visible instead of being inferred.
- Model fidelity, evidence readiness, deployment readiness, and professional disposition remain separate.
- REP replay hashes matched; the educational system declaration did not alter material evaluation identity.
- No GitHub Actions, external outreach, canonical merge, force push, release, or unrelated-branch change occurred.

## Limitations and explicit non-claims

- The map is an educational declaration, not proof of physical completeness.
- Declared connectivity is not compatibility, safety, calibration, treatment efficacy, or validation.
- Clean Water remains a level-1 synthetic educational screening example and makes no potable-water claim.
- Sandbox has no canonical system declarations and therefore remains intentionally sparse.
- Measurements are not yet modeled; they remain `not-declared` until the experiment/observation work package.

## Next dependency

Issue #6, Show the Math, may now use the stable system and variable-role projection. It must preserve the recorded evaluation as the only numeric source of truth and must not calculate results in the browser.
