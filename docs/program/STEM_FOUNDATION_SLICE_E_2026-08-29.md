# STEM Foundation Slice E — Show the Technology

Date: 2026-08-29 (America/New_York)
Issue: #9
Starting SHA: `2dbce1db6bbde54b078a2d11b62ca61c2d520155`
Implementation SHA: `ca180ae0d3daf2ebce5d96346534abc45b156ac0`
Branch: `cipher/stem-foundation`

## Result

Slice E adds a domain-neutral technology-purpose projection covering sensors, controllers, software, actuators, power, communication, fabrication, instruments, and solvers. Each node explains what it does, why it exists, whether its system element and purpose target resolve, which represented properties have evidence, and the separate states of product provenance, availability, compatibility, and safety assessment.

Clean Water owns its vertical technology declaration. Three roles resolve to declared system elements, the solver resolves to the declared model step, and planned sensor/control/monitoring roles remain visibly conceptual with undeclared purpose targets. No manufacturer or product source is invented.

## Files changed

- `apps/web/src/App.test.ts`
- `apps/web/src/App.tsx`
- `config/intended-tests.json`
- `packages/api/src/phase1a/evaluatorRegistry.ts`
- `packages/api/src/phase1a/service.ts`
- `packages/api/src/phase1a/stemSystemProjection.test.ts`
- `packages/api/src/phase1a/stemSystemProjection.ts`
- `packages/contracts/src/education/stemSystemProjection.ts`
- `packages/contracts/src/education/stemTechnologyProjection.test.ts`
- `packages/contracts/src/education/stemTechnologyProjection.ts`
- `packages/contracts/src/index.ts`
- `packages/sim-core/src/education/stemTechnologyDefinition.ts`
- `packages/sim-core/src/index.ts`
- `packages/sim-core/src/rep/rep.test.ts`
- `packages/vertical-clean-water/src/education/stemTechnologyDefinition.ts`
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
pnpm --filter @gosp/contracts test -- stemTechnologyProjection.test.ts
pnpm --filter @gosp/sim-core test -- rep.test.ts
pnpm --filter @gosp/vertical-clean-water test
pnpm --filter @gosp/api test -- stemSystemProjection.test.ts
pnpm --filter @gosp/web test
pnpm verify
pnpm install --frozen-lockfile
pnpm dev:phase1a
rg -n -i "clean[- ]water|solar|pump|filter" packages/contracts/src/education/stemTechnologyProjection.ts
git diff --check
```

Observed results:

- affected builds and typechecks: pass after the two corrections recorded below;
- focused technology contracts: 3/3;
- focused sim-core: 12/12;
- focused Clean Water: 20/20;
- focused API projection: 7/7;
- focused web: 1/1;
- intended discovery: 37/37 files;
- full repository: 37 files, 174 tests passed;
- REP replay input and result hashes matched;
- Clean Water validation, simulation, and estimate completed;
- foundation audit: GO, 23 pass, 0 warn, 0 fail;
- frozen install passed with an unchanged lockfile;
- core-boundary scan found no Clean Water, solar, pump, or filter terms in the technology contract;
- `git diff --check` reported no whitespace errors.

## Browser acceptance

API: `http://127.0.0.1:3080`. Browser: `http://localhost:5174/` because port 5173 was occupied.

Observed:

- Clean Water visibly rendered all nine required technology categories.
- Declared power, actuator, and fabrication roles resolved to `source`, `pump`, and `filter` system elements.
- Declared requirement and model-step links resolved.
- Conceptual sensor, controller, software, communication, and instrument roles visibly showed `not-declared` system elements and purpose targets.
- Synthetic voltage, flow, and efficiency values were labeled `assumed` with no source declared.
- Product provenance was `not-declared`, availability and compatibility were `not-checked`, and safety was `not-assessed`.
- The no-endorsement, no-availability, no-compatibility, no-safety-approval, and no-verification disclosure was visible.
- Browser console warnings/errors: none; only normal Vite connection debug messages appeared.

## Failures and recovery

- The first contracts build failed because a schema wrapped by `superRefine` cannot be extended through Zod's object API. The base object schema is now retained separately for the projected extension, while the definition schema keeps duplicate-ID refinement.
- The same build sequence exposed that the existing STEM math contract intentionally has no measurement role. The technology projection did not broaden that contract; measurement-purpose links remain explicitly `not-declared` until a measurement record exists.
- Stopping the development processes with an interrupt produced the expected nonzero teardown status; this was not an application failure.

## Architecture and truth review

- Technology categories and link semantics are domain-neutral.
- Sandbox technology remains in sim-core; Clean Water technology remains vertical-owned.
- The browser renders the server projection and performs no product, compatibility, safety, evidence, or readiness inference.
- Declared system-element, requirement, and model-step targets must resolve; unresolved declared targets fail projection construction.
- Conceptual nodes and missing measurements remain explicit rather than being promoted to canonical records.
- Product provenance, represented-property evidence, availability, compatibility, and safety status remain distinct.
- REP identities and material hashes did not change.
- No dependency, service, GitHub Action, external outreach, canonical merge, force push, release, or unrelated-branch change occurred.

## Explicit non-claims and limitations

- A listed role or component is not endorsed, available, compatible, safe, or verified merely because it appears.
- Conceptual roles are not declarations that physical or digital components exist in the current system.
- Assumed synthetic values are not manufacturer specifications or measurements.
- No manufacturer-submitted, manufacturer-verified, reviewed, procurement, or availability evidence exists in this demonstrator.
- No product selection, sourcing recommendation, physical integration, or safety assessment is made.

## Next dependency

Issue #10, Model Fidelity and How Do We Know?, can now trace consequential results across the system, math, science, engineering, technology, REP execution, evidence, contradictions, readiness, and unresolved proof obligations without confusing model complexity with evidence strength.
