# STEM Foundation Slice J — Simulation to Experiment and Failure Evidence

Date: 2026-08-29 (America/New_York)
Issue: #13
Starting SHA: `04541d30f2981632f2b7aaad7228a018367058df`
Implementation SHA: `47d68dfd04a991f105e0b248915650fb4ffee87e`
Branch: `cipher/stem-foundation`

## Result

Slice J adds a domain-neutral experiment definition and projection covering a prediction, controls, instruments, procedure, repetitions, uncertainty, acceptance/falsification criteria, observation classification, discrepancy, and failure state. Verify and Research/Professional learning views include the experiment section; shallower views redact it without changing the evaluation identity.

The Clean Water teaching fixture compares the canonical 64 L model prediction with an explicitly synthetic 58 ±2 L observation. The absolute 6 L discrepancy fails the authored 3 L teaching criterion and remains a visible negative result. The test plan remains `planned`, both instruments remain `not-declared`, and zero of three planned repetitions are recorded as completed.

The projection copies canonical Evaluation status, contradiction identities, and Claim evidence readiness. It cannot update readiness: the schema requires before and after readiness to match and records `readinessUpdate: not-applied`. A synthetic observation is not added to measured outputs or canonical Evidence.

## Files changed

- `apps/web/src/App.test.ts`
- `apps/web/src/App.tsx`
- `config/intended-tests.json`
- `packages/api/src/phase1a/evaluatorRegistry.ts`
- `packages/api/src/phase1a/service.ts`
- `packages/api/src/phase1a/stemSystemProjection.test.ts`
- `packages/api/src/phase1a/stemSystemProjection.ts`
- `packages/contracts/src/education/stemExperimentProjection.test.ts`
- `packages/contracts/src/education/stemExperimentProjection.ts`
- `packages/contracts/src/education/stemLearningProjection.ts`
- `packages/contracts/src/education/stemSystemProjection.ts`
- `packages/contracts/src/index.ts`
- `packages/sim-core/src/education/stemExperimentDefinition.ts`
- `packages/sim-core/src/index.ts`
- `packages/vertical-clean-water/src/education/stemExperimentDefinition.ts`
- `packages/vertical-clean-water/src/index.ts`

## Executed verification

Runtime: Node v22.16.0; pnpm 9.15.5; 2026-08-29 America/New_York.

Commands executed:

```text
pnpm --filter @gosp/contracts build
pnpm --filter @gosp/sim-core build
pnpm --filter @gosp/vertical-clean-water build
pnpm --filter @gosp/api build
pnpm --filter @gosp/web build
pnpm exec vitest run packages/contracts/src/education/stemExperimentProjection.test.ts packages/api/src/phase1a/stemSystemProjection.test.ts apps/web/src/App.test.ts
pnpm verify
pnpm install --frozen-lockfile
pnpm dev:phase1a
rg -n -i "clean.water|water|solar|photovoltaic|building" packages/contracts/src/education/stemExperimentProjection.ts packages/sim-core/src/education/stemExperimentDefinition.ts packages/api/src/phase1a/stemSystemProjection.ts
git diff --check
```

Observed results:

- affected builds: pass after the corrections below;
- focused experiment, API projection, failure-preservation, and web coverage: 3 files, 17 tests passed;
- intended discovery: 41/41 files;
- full repository: 41 files, 191 tests passed;
- REP replay input and result hashes matched;
- Clean Water validation, simulation, and estimate completed;
- foundation audit: GO, 23 pass, 0 warn, 0 fail;
- frozen install passed and the lockfile remained unchanged;
- domain-neutral boundary scan found no Clean Water, water, solar, photovoltaic, or building terms in the experiment contract, Sandbox definition, or generic API projection;
- `git diff --check` reported no whitespace errors.

## Browser evidence-path acceptance

API: `http://127.0.0.1:3080`. Browser: `http://localhost:5174/` because port 5173 was occupied.

Executed interaction:

1. Opened the local application.
2. Selected Clean Water.
3. Selected Verify depth.
4. Inspected the Simulation to Experiment panel and browser console.

Observed:

- prediction: 64 L, sourced from the canonical Evaluation;
- observation: 58 L, labeled `synthetic`, with ±2 L authored teaching uncertainty;
- signed discrepancy: -6 L;
- acceptance criterion: absolute discrepancy at most 3 L;
- criterion outcome: fail;
- failure state: negative-result and preserved;
- test plan: planned, 0 completed / 3 planned repetitions;
- both proposed instruments: not-declared;
- evidence readiness: `computationally-reproduced → computationally-reproduced`;
- readiness update: not-applied;
- test-plan, synthetic-observation, single-observation, potable-water, calibration, certification, and professional-approval non-claims were visible;
- browser console warnings/errors: none.

## Failures and recovery

- The first affected build found that a refined Zod schema does not expose `.shape`, which also caused downstream unknown types and stale workspace exports. The shared test-plan schema was extracted before refinement and the dependent packages were rebuilt in order.
- The browser runtime does not support waiting for `networkidle`; the smoke used the supported `domcontentloaded` state and explicit element waits.
- The first post-selection wait targeted option text, which existed but was correctly invisible inside the native selector. A fresh DOM snapshot confirmed the selected Clean Water view, and the smoke continued using the visible panel heading.
- Stopping the local development processes with an interrupt produced the expected nonzero teardown status; this was not an application failure.

## Architecture and truth review

- The experiment contract contains no domain terms and creates no nineteenth canonical object.
- Vertical packages own their teaching definitions; the application registry supplies them to the generic projection.
- Prediction values come from the existing math projection of the canonical Evaluation. The browser calculates no discrepancy, evidence state, or readiness.
- Synthetic observations remain separate teaching fixtures, are unmistakably classified, and do not populate measured outputs.
- Failed criteria, failed Evaluation status, and canonical contradiction identities are preserved by tests.
- Evidence readiness, deployment readiness, model fidelity, and professional disposition remain distinct.
- No new dependency, infrastructure service, GitHub Action, external outreach, canonical merge, force push, release, or unrelated-branch change occurred.

## Explicit non-claims and limitations

- A test plan is not a completed test.
- A synthetic observation is not a measurement.
- One observation is not validation.
- The authored ±2 L allowance is not instrument calibration evidence.
- The failed teaching criterion is not a physical test result or model validation finding.
- The comparison does not establish potable-water safety, treatment efficacy, field performance, certification, regulatory acceptance, or professional approval.

## Next dependency

Issue #14 can add human relevance only where a category is supported by canonical quantities or evidence, while keeping stakeholder values separate from technical results and marking unsupported categories unknown.
