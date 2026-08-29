# STEM Foundation Slice B — Show the Math

Date: 2026-08-29 (America/New_York)
Issue: #6
Starting SHA: `722e41f37462ec3f299628aaecdca08c9cd97be3`
Implementation SHA: `dae57a6dced261612caf6d9aff96f08e4466e2d3`
Branch: `cipher/stem-foundation`

## Result

Slice B adds a domain-neutral, traceable math projection without changing canonical solver behavior.

- Evaluator-owned definitions declare stable quantity IDs, labels, symbols, units, roles, source paths, statuses, and result paths.
- The API resolves values from the recorded REP material input, recorded explainability intermediates, and canonical Evaluation result.
- Equation declarations bind exact recorded equation variables to quantities.
- The projection rejects definitions whose bindings do not exactly match the recorded REP equation variables.
- Missing source values remain `unavailable` and do not carry an invented value.
- Input-to-intermediate-to-output dependency links are explicit.
- Dimensional status is explicit: Sandbox is `not-applicable`; Clean Water is `not-checked`.
- The browser renders quantities, equations, substitutions, dependencies, assumptions, limitations, and dimensional status without recalculating the result.

## Files changed

- `apps/web/src/App.test.ts`
- `apps/web/src/App.tsx`
- `config/intended-tests.json`
- `packages/api/src/phase1a/evaluatorRegistry.ts`
- `packages/api/src/phase1a/service.ts`
- `packages/api/src/phase1a/stemSystemProjection.test.ts`
- `packages/api/src/phase1a/stemSystemProjection.ts`
- `packages/contracts/src/education/stemMathProjection.test.ts`
- `packages/contracts/src/education/stemMathProjection.ts`
- `packages/contracts/src/education/stemSystemProjection.ts`
- `packages/contracts/src/index.ts`
- `packages/sim-core/src/education/stemMathDefinition.ts`
- `packages/sim-core/src/index.ts`
- `packages/sim-core/src/rep/rep.test.ts`
- `packages/vertical-clean-water/src/education/stemMathDefinition.ts`
- `packages/vertical-clean-water/src/index.ts`
- `packages/vertical-clean-water/src/vertical-clean-water.test.ts`

## Executed verification

Runtime:

```text
Node: v22.16.0
pnpm: 9.15.5
Command date/timezone: 2026-08-29, America/New_York
```

Commands executed:

```text
git diff --check
pnpm --filter @gosp/contracts build
pnpm --filter @gosp/sim-core build
pnpm --filter @gosp/vertical-clean-water build
pnpm --filter @gosp/api build
pnpm --filter @gosp/web typecheck
pnpm --filter @gosp/contracts test -- stemMathProjection.test.ts
pnpm --filter @gosp/sim-core test -- rep.test.ts
pnpm --filter @gosp/vertical-clean-water test
pnpm --filter @gosp/api test -- stemSystemProjection.test.ts
pnpm --filter @gosp/web test
pnpm verify
pnpm install --frozen-lockfile
rg -n -i "clean[- ]water|solar|pump|filter" packages/contracts/src/education/stemMathProjection.ts packages/contracts/src/education/stemSystemProjection.ts
pnpm dev:phase1a
```

Final observed results:

- affected builds and typechecks: pass;
- focused contract tests: 3/3 passed;
- focused sim-core tests: 9/9 passed before the final repository gate;
- focused Clean Water tests: 17/17 passed;
- final focused API math/system projection tests: 5/5 passed;
- focused browser-view tests: 1/1 passed;
- intended test discovery: 34 of 34 files;
- full repository tests: 34 files, 157 tests passed;
- REP replay: input and result hashes matched;
- Clean Water example validation, simulation, and estimate: completed;
- foundation audit: GO, 23 pass, 0 warn, 0 fail;
- frozen lockfile install: completed, lockfile already up to date;
- core-boundary scan: no Clean Water, solar, pump, or filter terms in the STEM core contracts.

## Browser acceptance

The exact implementation SHA started the API at `http://127.0.0.1:3080`. Port 5173 was occupied, so Vite used `http://localhost:5174/`.

Observed:

- Sandbox displayed recorded offset `7`, recorded result `53`, the recorded weighted-sum relationship, unitless quantities, and dimensional status `not-applicable`.
- Clean Water displayed `sourceLiters = 100 L`, `pumpFlowLpm = 8 L/min`, `minutes = 10 min`, `filterEfficiency = 0.8`, recorded intermediate `pumpCapacityLiters = 80 L`, and canonical output `cleanWaterLiters = 64 L`.
- Clean Water displayed the exact recorded equation and dimensional status `not-checked`.
- The input-to-result dependency disclosure opened and showed the intermediate-to-output link.
- Assumptions, dimensional limitation, no-recalculation disclosure, and scientific/physical non-claim were visible.
- Switching from Sandbox to Clean Water remained usable.
- Browser console warnings/errors: none observed.

## Failures and recovery

- The first focused API run had 1 failure out of 4 tests: an unavailable source was labeled correctly but retained a `value: undefined` property. The projection was corrected to omit the property. The focused API gate then passed 4/4.
- A stricter recorded-variable equality check was subsequently added. Its focused API gate passed 5/5, followed by a clean full repository gate and post-commit browser smoke.
- Stopping each development session with an interrupt produced the expected nonzero process-end status; this was deliberate teardown, not an application failure.

## Architecture and truth review

- Core contracts contain only domain-neutral quantity, equation, dependency, and dimensional-status vocabulary.
- Sandbox math declarations remain in sim-core; Clean Water declarations remain in the vertical package.
- Definitions bind to existing REP explainability records and do not alter evaluation math.
- Values originate in material input, explainability intermediates, or Evaluation results; unavailable values remain absent.
- The API constructs the projection; the browser only formats and renders it.
- No dimensional correctness is claimed without a verifier.
- Model fidelity, evidence readiness, deployment readiness, and professional disposition remain separate.
- REP material input and result hashes still match their recorded fixtures.
- No GitHub Actions, external outreach, canonical merge, force push, release, or unrelated-branch change occurred.

## Limitations and explicit non-claims

- Clean Water dimensional consistency is `not-checked`; visible units are not a dimensional-analysis pass.
- The displayed equation is not proof of scientific completeness, calibration, treatment efficacy, or physical validity.
- The Clean Water values remain synthetic educational screening values, not observations or potable-water evidence.
- Sandbox remains a unitless deterministic protocol benchmark, not a physical model.
- The projection reproduces a recorded calculation path; it does not independently recompute or validate the solver result.

## Next dependency

Issue #7, Show the Science, can now link explicit principle classifications and applicability statements to stable equation IDs and quantity IDs. Principle declarations must remain vertical/model-owned, while Sandbox must explicitly remain a synthetic benchmark rather than being assigned physical science.
