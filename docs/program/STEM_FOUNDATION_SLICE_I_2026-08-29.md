# STEM Foundation Slice I — Dynamic STEM and Visualization Primitives

Date: 2026-08-29 (America/New_York)
Issue: #12
Starting SHA: `df63e46d1b3c3df86fa48104b22f0f4867a33ec9`
Implementation SHA: `3b86a3677a5e0dcc561d2550efaf6abe5ece2e16`
Branch: `cipher/stem-foundation`

## Result

Slice I adds seven domain-neutral visualization primitives: flow, vector/force, energy, electrical/control, time series, uncertainty, and sensitivity. Each primitive reports availability and provenance and requires declared data before it can be available.

The Dynamic STEM panel exposes only design variables marked `allowed-for-comparison`. A parameter change is sent to the API, which creates a canonical Submission with a content-derived identity, executes the registered evaluator, and returns the canonical comparison and STEM projection. The browser performs no engineering calculation.

Clean Water provides declared flow and power interfaces, recorded uncertainty and sensitivity, and explicit unavailable states for vectors, energy, and time series. Time playback is disabled because no recorded or model-generated time series exists.

## Files changed

- `apps/web/src/App.test.ts`
- `apps/web/src/App.tsx`
- `apps/web/src/phase1a/client.ts`
- `config/intended-tests.json`
- `packages/api/src/phase1a/service.ts`
- `packages/api/src/phase1a/stemSystemProjection.test.ts`
- `packages/api/src/phase1a/stemSystemProjection.ts`
- `packages/api/src/server.ts`
- `packages/contracts/src/education/stemDynamicProjection.test.ts`
- `packages/contracts/src/education/stemDynamicProjection.ts`
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
pnpm --filter @gosp/contracts test -- stemDynamicProjection.test.ts
pnpm --filter @gosp/api test -- stemSystemProjection.test.ts
pnpm --filter @gosp/web test
pnpm --filter @gosp/api exec tsx -e <parameter-route diagnostic>
pnpm verify
pnpm install --frozen-lockfile
pnpm dev:phase1a
rg -n -i "clean[- ]water|solar|pump|filter" packages/contracts/src/education/stemDynamicProjection.ts
git diff --check
```

Observed results:

- affected builds and typecheck: pass;
- focused dynamic contracts: 3/3;
- focused API projection, evaluator routing, and rejected-parameter coverage: 12/12 after the corrections below;
- focused web: 1/1;
- intended discovery: 40/40 files;
- full repository: 40 files, 188 tests passed;
- REP replay input and result hashes matched;
- Clean Water validation, simulation, and estimate completed;
- foundation audit: GO, 23 pass, 0 warn, 0 fail;
- frozen install passed with an unchanged lockfile;
- core-boundary scan found no Clean Water, solar, pump, or filter terms in the dynamic contract;
- `git diff --check` reported no whitespace errors.

## Browser interaction acceptance

API: `http://127.0.0.1:3080`. Browser: `http://localhost:5174/` because port 5173 was occupied.

Executed interaction:

1. Selected Clean Water.
2. Selected Solve depth.
3. Confirmed filter efficiency was the only allowed scalar comparison parameter and its current baseline was 0.8.
4. Entered 0.75 and selected `Evaluate parameter change`.

Observed:

- a new canonical candidate named `submission.challenge.clean-water-local-demo.parameter-218271e1f5f9@1.0.0` was created;
- the registered server evaluator produced 60 L, compared with the 64 L baseline;
- the canonical comparison showed `filterEfficiency: 0.8 → 0.75`;
- the result delta showed `result.flow.cleanWaterLiters: 64 → 60 (Δ -4)`;
- flow and electrical/control primitives were available from canonical Interface records;
- uncertainty and sensitivity were available from recorded model/evaluation metadata;
- vector/force, energy, and time series were unavailable;
- time playback was disabled with zero frames and `not-declared` provenance;
- animation, smooth-motion, and browser-calculation non-claims were visible;
- browser console warnings/errors: none; only normal Vite connection debug messages appeared.

## Failures and recovery

- The first focused API run had 2 failures and 10 passes. One was an asymmetric nested-array matcher that rejected valid additional primitive records; assertions now inspect the relevant primitive entries directly.
- The parameter route initially returned 500 because canonical comparison paths can be present on only one side, producing `undefined` for baseline or candidate. Causal highlights now preserve each side with explicit `available` or `unavailable` status and optional values instead of forcing missing data into canonical JSON.
- The first diagnostic `tsx -e` command failed because top-level await was unavailable in its CJS evaluation mode. The same diagnostic was rerun inside an async function and exposed the causal-highlight schema error above.
- Stopping the development processes with an interrupt produced the expected nonzero teardown status; this was not an application failure.

## Architecture and truth review

- Visualization and dynamic-projection contracts contain no vertical fields.
- Allowed parameter identity and path come from the server-owned engineering definition.
- The server restricts changes to `submission.materialPayload`, preserves type, rejects non-finite numbers, creates a canonical Submission, and runs the registered evaluator.
- Candidate IDs are content-derived from the baseline identity, parameter ID, and proposed value.
- Before/after highlighting is copied from the canonical comparison record; the browser does not infer causality or calculate deltas.
- Available primitives require declared data and provenance. Missing-side comparison values carry explicit availability.
- Playback can only become available from recorded or model-generated time-series data.
- Learning depth includes Dynamic STEM at Solve and above without changing canonical identity.
- No dependency, service, GitHub Action, external outreach, canonical merge, force push, release, or unrelated-branch change occurred.

## Explicit non-claims and limitations

- Animation is not measurement.
- Smooth motion is not solver fidelity.
- A browser transition is not an engineering calculation.
- Causal highlighting identifies a controlled recorded difference; it does not establish general physical causation.
- The changed efficiency remains an unsupported synthetic model input, not a measured or manufacturer-verified property.
- No time-series playback, force/vector view, or energy view is claimed without corresponding data.

## Next dependency

Issue #13, Simulation to Experiment, can now connect the recorded prediction to explicitly classified observations and discrepancy evidence while preserving failed, negative, synthetic, and unavailable states.
