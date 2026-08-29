# STEM Foundation Slice D — Show Engineering

Date: 2026-08-29 (America/New_York)
Issue: #8
Starting SHA: `084b921defe8e62a5aa02275b40b04afb3a198f9`
Implementation SHA: `dc87f884e8a766273f2b76ca5a906b9c68e8dd86`
Branch: `cipher/stem-foundation`

## Result

Slice D adds a domain-neutral engineering-decision projection for requirements, hard gates, design variables, hazards, margins, separate objective outcomes, revision explanations, tradeoffs, and unresolved proof obligations.

The browser presents failed gates and unresolved proof obligations before objective outcomes. Clean Water deliberately demonstrates a real tradeoff: increasing the unsupported filter-efficiency input improves the calculated output objective while violating the objective that preserves an unsupported assumption. The projection therefore reports `conflict` and `no-universal-winner`; it does not create a composite score or silently choose a value judgment.

## Files changed

- `apps/web/src/App.test.ts`
- `apps/web/src/App.tsx`
- `config/intended-tests.json`
- `packages/api/src/phase1a/evaluatorRegistry.ts`
- `packages/api/src/phase1a/service.ts`
- `packages/api/src/phase1a/stemSystemProjection.test.ts`
- `packages/api/src/phase1a/stemSystemProjection.ts`
- `packages/contracts/src/education/stemEngineeringProjection.test.ts`
- `packages/contracts/src/education/stemEngineeringProjection.ts`
- `packages/contracts/src/education/stemSystemProjection.ts`
- `packages/contracts/src/index.ts`
- `packages/sim-core/src/education/stemEngineeringDefinition.ts`
- `packages/sim-core/src/index.ts`
- `packages/sim-core/src/rep/rep.test.ts`
- `packages/vertical-clean-water/src/education/stemEngineeringDefinition.ts`
- `packages/vertical-clean-water/src/index.ts`
- `packages/vertical-clean-water/src/vertical-clean-water.test.ts`

## Executed verification

Runtime: Node v22.16.0; pnpm 9.15.5; 2026-08-29 America/New_York.

Commands executed:

```text
pnpm --filter @gosp/contracts build
pnpm --filter @gosp/sim-core build
pnpm --filter @gosp/vertical-clean-water build
pnpm --filter @gosp/api build
pnpm --filter @gosp/web typecheck
pnpm --filter @gosp/contracts test -- stemEngineeringProjection.test.ts
pnpm --filter @gosp/sim-core test -- rep.test.ts
pnpm --filter @gosp/vertical-clean-water test
pnpm --filter @gosp/api test -- stemSystemProjection.test.ts
pnpm --filter @gosp/web test
pnpm verify
pnpm install --frozen-lockfile
pnpm dev:phase1a
rg -n -i "clean[- ]water|solar|pump|filter" packages/contracts/src/education/stemEngineeringProjection.ts
git diff --check
```

Observed results:

- affected builds and typechecks: pass after the TypeScript correction recorded below;
- focused engineering contracts: 3/3;
- focused sim-core: 11/11;
- focused Clean Water: 19/19;
- focused API projection: 7/7 after correcting the test assertion recorded below;
- focused web: 1/1;
- intended discovery: 36/36 files;
- full repository: 36 files, 169 tests passed;
- REP replay input and result hashes matched;
- Clean Water validation, simulation, and estimate completed;
- foundation audit: GO, 23 pass, 0 warn, 0 fail;
- frozen install passed with an unchanged lockfile;
- core-boundary scan found no Clean Water, solar, pump, or filter terms in the engineering contract;
- `git diff --check` reported no whitespace errors.

## Browser acceptance

API: `http://127.0.0.1:3080`. Browser: `http://localhost:5174/` because port 5173 was occupied.

Observed:

- Sandbox showed a passing nonnumeric gate with `margin not-applicable`, proof obligations before the single objective, one design variable, one hazard, and a baseline-preferred outcome.
- Clean Water showed the filter-efficiency design variable changing from 0.8 to 0.9.
- Clean Water showed the potability-misinterpretation and electrical wet-environment hazards.
- The calculated-volume objective preferred the candidate; the unsupported-assumption preservation objective preferred the baseline.
- The tradeoff was visibly `CONFLICT · no-universal-winner`.
- Unresolved proof obligations appeared before objective outcomes in the rendered document order.
- Passing modeled gates was visibly disclaimed as safety approval, deployment readiness, certification, or professional review.
- Browser console warnings/errors: none; only normal Vite connection debug messages appeared.

## Failures and recovery

- The first affected-package build failed in the API package because TypeScript did not preserve discriminated-union narrowing inside two nested callbacks. The builder now captures the numeric threshold and preserved input path before entering those callbacks; the API build and web typecheck then passed.
- The first focused API run had 1 failure and 6 passes. The returned engineering projection was correct, but an asymmetric nested matcher incorrectly rejected additional valid gate metadata. The assertion was narrowed to the intended gate and tradeoff properties; the rerun passed 7/7.
- Stopping the development processes with an interrupt produced the expected nonzero teardown status; this was not an application failure.

## Architecture and truth review

- Engineering schemas and projection behavior are domain-neutral.
- Sandbox declarations remain in sim-core; Clean Water decisions and hazards remain vertical-owned.
- The browser only renders server-projected engineering data; it performs no physics, scoring, evidence, readiness, or winner calculation.
- Requirements are derived application records for the selected evaluator definition; material REP Challenge identities and hashes did not change.
- Failed gate state, missing numeric margin state, hazards, and unresolved proof obligations remain explicit.
- Objective preferences remain separate. A conflict cannot validate as a universal winner.
- Model fidelity, evidence readiness, deployment readiness, and professional disposition remain separate concepts.
- No GitHub Actions, external outreach, canonical merge, force push, release, or unrelated-branch change occurred.

## Explicit non-claims and limitations

- Passing modeled gates is not safety approval, deployment readiness, certification, or professional review.
- Hazard identification is not a completed risk assessment, mitigation verification, or permission to build or operate a physical system.
- A modeled objective improvement is not physical validation, treatment-efficacy evidence, or a potable-water claim.
- The Clean Water efficiency change is a synthetic comparison input unsupported by new evidence.
- No composite score, universal winner, or professional value judgment is asserted.
- Nonnumeric gates report numeric margin as `not-applicable`; additional numeric engineering gates remain future declarations.

## Next dependency

Issue #9, Show Technology, can now map sensors, controllers, software, actuators, power, communication, fabrication, instruments, and solvers to the system roles, requirements, measurements, control actions, model steps, and test purposes they serve, with provenance and availability states preserved.
