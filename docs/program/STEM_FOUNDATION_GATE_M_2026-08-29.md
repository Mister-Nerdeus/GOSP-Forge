# STEM Foundation Gate M — second-vertical readiness checkpoint

- Date: 2026-08-29 America/New_York
- Issue: #16
- Branch: `cipher/stem-foundation`
- Starting SHA: `cea3e3fd95a4bb2747eef4dbc9babaf2c197c6d9`
- Standalone adapter checkpoint: `bab4235d965f2dbaa27ad609924ee42ea3733da0`
- Application integration checkpoint: `ccaebddbb9ebd4f5f90ccbe9d4cb1ce10f0fc648`
- Verified implementation SHA: `b61c9504b9ab96dd3dbd72232c3ce2f22f821dd0`

## Owner decision and scope

After the Issue #15 handoff explicitly stopped at Issue #16, the owner directed Cipher to “Advance the next work.” This direction was recorded on Issue #16 before solar work began and was treated as authorization to execute Gate M's repository-local retractable-solar contract-reuse validation.

It did not authorize a canonical merge, release, competition launch, external outreach, school or sponsor participation, manufacturer engagement, procurement, paid service, certification, or professional/public engineering claim.

## Result

Gate M passes for the scope represented by Issue #16:

- the accepted Clean Water foundation remains the primary end-to-end demonstrator;
- `@gosp/vertical-clean-water` and the new `@gosp/vertical-solar-deployment` both consume the existing public STEM contracts;
- the solar adapter supplies vertical-owned system, math, science, engineering, technology, experiment, and human-relevance declarations;
- the same generic API projection and browser application render the solar challenge without a solar field or schema change in core;
- canonical REP evaluation, comparison, learning-depth projection, parameter-change routing, evidence, readiness, and failure preservation remain server-side;
- solar is a synthetic validation vertical, not the foundation and not a competition implementation.

## Files changed from the accepted foundation checkpoint

```text
config/intended-tests.json
packages/api/package.json
packages/api/src/phase1a/evaluatorRegistry.ts
packages/api/src/phase1a/service.test.ts
packages/api/src/phase1a/service.ts
packages/api/src/phase1a/stemSystemProjection.test.ts
packages/api/src/server.test.ts
packages/sim-core/src/boundary.test.ts
packages/vertical-solar-deployment/package.json
packages/vertical-solar-deployment/src/education/stemEngineeringDefinition.ts
packages/vertical-solar-deployment/src/education/stemExperimentDefinition.ts
packages/vertical-solar-deployment/src/education/stemHumanRelevanceDefinition.ts
packages/vertical-solar-deployment/src/education/stemMathDefinition.ts
packages/vertical-solar-deployment/src/education/stemScienceDefinition.ts
packages/vertical-solar-deployment/src/education/stemSystemDefinition.ts
packages/vertical-solar-deployment/src/education/stemTechnologyDefinition.ts
packages/vertical-solar-deployment/src/index.ts
packages/vertical-solar-deployment/src/solarDeploymentRepAdapter.test.ts
packages/vertical-solar-deployment/src/solarDeploymentRepAdapter.ts
packages/vertical-solar-deployment/tsconfig.json
pnpm-lock.yaml
```

No file under `packages/contracts/src` changed during Gate M. The lockfile change registers the new workspace package and its existing workspace dependencies; no new external runtime package or infrastructure service was added.

## Exact verification executed

The following commands were executed locally. Commands are listed as run; failures are separated below.

```text
pnpm install --lockfile-only
pnpm install --frozen-lockfile
pnpm --filter @gosp/vertical-solar-deployment build
pnpm --filter @gosp/vertical-solar-deployment typecheck
pnpm --filter @gosp/vertical-solar-deployment test
pnpm --filter @gosp/sim-core test
pnpm verify
pnpm --filter @gosp/api build
pnpm --filter @gosp/api typecheck
pnpm --filter @gosp/api test
pnpm install --frozen-lockfile
pnpm verify
pnpm evidence:phase1a
git diff --check
rg -n -i "solar|photovoltaic|irradiance|stow|bend.radius" packages/contracts/src packages/sim-core/src -g '!*.test.ts'
git diff --name-only cea3e3fd95a4bb2747eef4dbc9babaf2c197c6d9..HEAD -- packages/contracts/src
```

Final results at `b61c9504b9ab96dd3dbd72232c3ce2f22f821dd0`:

- frozen-lockfile install: passed;
- lint, all workspace builds, and all workspace typechecks: passed;
- intended/discovered test files: 43/43;
- total tests: 200/200 passed;
- REP reference replay: input and result hashes matched;
- Clean Water validation, simulation, and estimate paths: completed;
- foundation audit: GO, 23 pass, 0 warn, 0 fail;
- claim scan: zero findings across 235 files;
- local evidence: PASS with clean before/after state and comparable execution;
- evidence artifact: `artifacts/phase-1a/local/execution-2026-08-30T01-03-09-276Z.json`.

The evidence artifact remains a local verification record. It is not independent reproduction or external validation.

## Browser acceptance actually observed

The local API started on `http://127.0.0.1:3080`; the browser application started on `http://localhost:5174/` because port 5173 was already occupied.

Observed results:

- an existing schema-version-1 durable workspace additively discovered the new solar evaluator without deleting or overwriting owner records;
- the Challenge selector exposed Sandbox, Clean Water, and synthetic retractable solar;
- the solar Explore view displayed three resolved canonical SystemElements and three declared Interfaces;
- Measure/Model/Verify/Research content was available through the same learning-depth control and used the same baseline evaluation, input hash, and result hash;
- math displayed `solar.power`, `solar.bend-margin`, and `solar.stow-margin` using values from canonical material input, recorded intermediates, and Evaluation results;
- science kept principles, reduced-order equations, assumptions, approximations, and the absence of physical observations distinct;
- engineering displayed separate power, storm-stow, and bend objectives and did not create a universal or composite winner;
- technology displayed declared and conceptual roles with no manufacturer or compatibility claim;
- the experiment view preserved an intentionally synthetic failing discrepancy and did not update evidence readiness;
- the Research/Professional view showed source/solver identity, open physical-validation and independent-reproduction obligations, `concept-only` deployment readiness, and `not-assessed` professional disposition;
- changing stow time from 16 s to 10 s through the browser created canonical Submission `submission.challenge.solar-deployment.synthetic.parameter-ea93367c7dfb@1.0.0`; the modeled stow margin changed from 6 s to 12 s through the registered server-side evaluator;
- the baseline material input hash remained `58c17fdbd35c21c1702f570be8c4279c87f5cd69b6f5e5bfcc978e4724fde3b5` and baseline material result hash remained `7887431461b9893c6e8cce76f179ce6ba348f05922aba9f79a04cafa5bb163d3` across learning depths;
- the acceptance tab recorded zero browser warnings or errors.

## Failures encountered and dispositions

1. The first API integration run failed three tests. Two asserted the previous two-evaluator/two-challenge fixture count. The third showed no solar system elements because the running package build was stale after a source change. Fixture counts were updated, the package was rebuilt, and the projector test then exposed only a floating-point assertion mismatch (`0.02500000000000001` versus `0.025`); the assertion was changed to an explicit tolerance.
2. The first browser run showed only Sandbox and Clean Water. Root cause: an existing durable workspace returned immediately when it saw schema version 1 and therefore never reconciled newly registered evaluator seeds. `ensureSeeded` now adds only missing templates, Challenges, seed Submissions, and references while preserving existing records. A regression test verifies preservation. The restarted browser then displayed solar and passed the acceptance path.
3. An initial browser wait targeted the evaluator label as standalone text and timed out because it appears inside a longer explanatory paragraph. A fresh DOM inspection confirmed the selection had succeeded. No product defect was inferred from that wait failure.
4. The first browser status wait after parameter evaluation timed out because the application replaces its shell after success. The resulting canonical candidate, changed input, and result delta were inspected directly and were present.

No failure was hidden or described as a passing check before rerun.

## Architecture review

- Gate M changed no file in `packages/contracts/src`.
- The runtime-source scan found no solar, photovoltaic, irradiance, stow, or bend-radius terminology in `packages/contracts/src` or runtime `packages/sim-core/src`.
- The only sim-core change adds prohibited solar terms to the generic boundary test, strengthening rather than weakening the vertical boundary.
- The solar package depends on `@gosp/contracts` and `@gosp/sim-core`; neither imports the solar package.
- The application registry may depend on vertical adapters as allowed by ADR 0007.
- Browser rendering remains generic and was not changed for solar.
- Model fidelity, evidence readiness, deployment readiness, and professional disposition remain separate.
- No public-contract, canonical-object, or REP identity rule was changed.

This is an internal read-only architecture/truth review. Independent third-party review is not claimed.

## Remaining limitations and non-claims

- All solar inputs, observations, and component properties are synthetic.
- The model is a deterministic reduced-order educational screen and is not calibrated.
- No structural wind load, fatigue, laminate, wiring-flex, actuator-force, fire, weather, energy-yield, inverter, reliability, or dynamic roll validation is present.
- A positive bend or stow margin is not a safety case, certification, deployment approval, or professional opinion.
- Local replay is not independent reproduction.
- No manufacturer specification, laboratory test, field test, school, sponsor, outreach, procurement, competition, or public program is represented.
- Gate M proves software contract reuse only. It does not authorize an advanced challenge or competition build.

## Next owner gate

Issue #16 may be closed as a completed readiness proof. Any canonical merge, release, external validation, physical design, or competition work requires a new explicit owner decision and separately scoped acceptance criteria.
