# STEM Foundation Slice H — Learning-depth Projection

Date: 2026-08-29 (America/New_York)
Issue: #11
Starting SHA: `9a076338926f93ae7168b44f462327ee78432cc3`
Implementation SHA: `f9e25b69b7ba9b38cc8e4ccd916fcc4b22b8a9f3`
Branch: `cipher/stem-foundation`

## Result

Slice H adds six instructor-selected projection manifests: Explore, Measure, Model, Solve, Verify, and Research/Professional. Each manifest declares its included and redacted STEM sections and detail level over one unchanged canonical evaluation.

The browser applies the selected manifest to presentation. Explore shows the system map; subsequent depths progressively include math, science, engineering, technology, and the result-to-proof trace. The canonical evaluation ID, material input hash, material result hash, recorded result, evidence, and readiness do not change with depth.

## Files changed

- `apps/web/src/App.test.ts`
- `apps/web/src/App.tsx`
- `apps/web/src/phase1a/client.ts`
- `config/intended-tests.json`
- `packages/api/src/phase1a/service.ts`
- `packages/api/src/phase1a/stemSystemProjection.test.ts`
- `packages/api/src/phase1a/stemSystemProjection.ts`
- `packages/api/src/server.ts`
- `packages/contracts/src/education/stemLearningProjection.test.ts`
- `packages/contracts/src/education/stemLearningProjection.ts`
- `packages/contracts/src/education/stemSystemProjection.ts`
- `packages/contracts/src/index.ts`

## Executed verification

Runtime: Node v22.16.0; pnpm 9.15.5; 2026-08-29 America/New_York.

Commands executed:

```text
pnpm --filter @gosp/contracts build
pnpm --filter @gosp/api build
pnpm --filter @gosp/web typecheck
pnpm --filter @gosp/contracts test -- stemLearningProjection.test.ts
pnpm --filter @gosp/api test -- stemSystemProjection.test.ts
pnpm --filter @gosp/web test
pnpm verify
pnpm install --frozen-lockfile
pnpm dev:phase1a
rg -n -i "clean[- ]water|solar|pump|filter" packages/contracts/src/education/stemLearningProjection.ts
git diff --check
```

Observed results:

- affected builds and typecheck: pass;
- focused learning contracts: 3/3;
- focused API projection, identity invariance, and invalid-depth coverage: 10/10;
- focused web: 1/1;
- intended discovery: 39/39 files;
- full repository: 39 files, 183 tests passed;
- REP replay input and result hashes matched;
- Clean Water validation, simulation, and estimate completed;
- foundation audit: GO, 23 pass, 0 warn, 0 fail;
- frozen install passed with an unchanged lockfile;
- core-boundary scan found no Clean Water, solar, pump, or filter terms in the learning contract;
- `git diff --check` reported no whitespace errors.

## Browser acceptance

API: `http://127.0.0.1:3080`. Browser: `http://localhost:5174/` because port 5173 was occupied.

Observed for Clean Water:

- Explore selected `introductory`, displayed the System Map, and did not display Math or How Do We Know.
- Verify selected `verification` and displayed System Map, Math, Science, Engineering, Technology, and How Do We Know.
- Explore and Verify showed the identical evaluation identity.
- The material input hash remained `461ba85666044014cc17c49eb9167bd7f11ca1f5f9d8226014d14625c5fc4423`.
- The material result hash remained `774859a7687df74fe08063ace5a46bf9f6022aa11c9a4a521ee3e0c82dbf3b54`.
- Verify retained the recorded `result.flow.cleanWaterLiters = 64` result.
- Presentation-only and no-mastery/accreditation claims were visible.
- Browser console warnings/errors: none; only normal Vite connection debug messages appeared.

## Failures and recovery

- No focused or full verification check failed.
- Stopping the development processes with an interrupt produced the expected nonzero teardown status; this was not an application failure.

## Architecture and truth review

- Learning depth is a presentation manifest over the same server-built STEM projection and canonical evaluation.
- Depth selection is validated by the API; unknown values are rejected.
- All six manifests must be present exactly once, and included/redacted sections cannot overlap.
- The browser only includes or redacts declared sections; it performs no calculation, evidence, scoring, hash, or readiness logic.
- Challenge switching, comparison selection, and local authoring preserve the selected learning depth.
- Identity-invariance tests compare exact evaluation and trace material identities between Explore and Verify.
- REP identities and material hashes did not change.
- No dependency, service, GitHub Action, external outreach, canonical merge, force push, release, or unrelated-branch change occurred.

## Explicit non-claims and limitations

- A depth label is not grade alignment, curriculum accreditation, accessibility certification, or evidence of learner mastery.
- Measure currently exposes recorded quantities and the explicit absence of physical measurement; it does not invent observations.
- Research/Professional exposes full explanatory detail but does not confer professional review or approval.
- Redaction changes presentation only; it does not remove or weaken canonical truth records.

## Next dependency

Issue #12, Dynamic STEM and Visualization Primitives, can now add evaluator-routed interaction and data-available visual forms while preserving this learning-depth and identity boundary.
