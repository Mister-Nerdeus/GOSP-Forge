# STEM Foundation Slice L — End-to-End Clean Water Demonstrator

Date: 2026-08-29 (America/New_York)
Issue: #15
Starting SHA: `1d77284d733d712cd9147360b4d901349eed129b`
Verified implementation SHA: `ea3441f73ee15f81f07657aae3853baebb15e3da`
Branch: `cipher/stem-foundation`

## Result

Slice L integrates Issues #5–#14 into one documented local Clean Water path:

```text
see -> understand -> measure -> math -> science -> engineering change
    -> canonical evaluation -> evidence -> uncertainty -> prediction/observation
```

The setup and acceptance procedure is `docs/product/STEM_FOUNDATION_CLEAN_WATER_DEMONSTRATOR.md`. It answers all thirteen non-expert questions from Issue #4 and provides an advanced drill-down over the same exact evaluation identity. Challenge and Learning Depth selectors received explicit accessible names after the final smoke exposed that omission.

## Files changed in this work package

- `README.md`
- `apps/web/src/App.test.ts`
- `apps/web/src/App.tsx`
- `docs/product/PHASE_1A_MINIMAL_PRODUCT_LOOP.md`
- `docs/product/STEM_FOUNDATION_CLEAN_WATER_DEMONSTRATOR.md`

## Final executed verification

Runtime: Node v22.16.0; pnpm 9.15.5; 2026-08-29 America/New_York.

Commands executed for the verified implementation:

```text
pnpm --filter @gosp/web build
pnpm --filter @gosp/web test
pnpm install --frozen-lockfile
pnpm verify
pnpm dev:phase1a
pnpm evidence:phase1a
git diff --check
git diff --name-only origin/canonical/verified-lineage...HEAD -- .github
git log --merges --oneline origin/canonical/verified-lineage..HEAD
git diff --name-only --diff-filter=D origin/canonical/verified-lineage...HEAD -- packages/contracts packages/sim-core packages/api apps/web
git diff --name-only origin/canonical/verified-lineage...HEAD -- package.json pnpm-lock.yaml .github
rg -n -i "clean[- ]water|pump|filter|solar|photovoltaic|building" packages/contracts/src/education packages/sim-core/src/education
```

Observed final gate:

- frozen install: pass; lockfile unchanged;
- affected web build/test after accessible-name correction: 1 file, 1 test passed;
- full repository: 42 intended / 42 discovered files, 195 tests passed;
- REP replay input/result hashes matched;
- Clean Water validation, simulation, and estimate completed;
- foundation audit: GO, 23 pass, 0 warn, 0 fail;
- professional-claim scan: zero findings across 234 files;
- local evidence writer: PASS at exact SHA `ea3441f73ee15f81f07657aae3853baebb15e3da` with clean status before and after verification;
- local evidence artifact: `artifacts/phase-1a/local/execution-2026-08-30T00-15-21-312Z.json`;
- product-loop evidence comparison: comparable; both recorded evaluations replayed successfully;
- `git diff --check`: pass.

## Executed browser acceptance

API: `http://127.0.0.1:3080`. Browser: `http://localhost:5174/` because port 5173 was occupied.

The exact baseline identity stayed invariant through all depths:

- Evaluation: `evaluation.submission.clean-water-local-demo.current@0.1.0`;
- material input: `461ba85666044014cc17c49eb9167bd7f11ca1f5f9d8226014d14625c5fc4423`;
- material result: `774859a7687df74fe08063ace5a46bf9f6022aa11c9a4a521ee3e0c82dbf3b54`.

Observed by depth:

- Explore: declared three-element map, resource/power interfaces, input/control/output roles, water relevance supported, ten relevance categories unknown, stakeholder values separate.
- Measure: source 100 L, flow 8 L/min, time 10 min, efficiency 0.8, intermediate capacity 80 L, calculated output 64 L; measured outputs remained not-declared.
- Model: recorded equation, bindings, substitutions, dimensional status, assumptions, limitations, science classifications, and missing-evidence states were visible.
- Solve: engineering gates/objectives/variables/hazards/tradeoffs, technology purposes, and dynamic primitives were visible. Changing efficiency 0.8 to 0.75 created canonical candidate `submission.challenge.clean-water-local-demo.parameter-218271e1f5f9@1.0.0`; comparison showed 64 L to 60 L, delta -4, and the exact changed payload path.
- Verify: fidelity `rule-check`, calibration `not-calibrated`, evidence readiness `computationally-reproduced`, deployment readiness `concept-only`, professional disposition `not-assessed`, accepted Evidence, exact runner/solver identities, local replay, and open obligations were visible. Experiment showed prediction 64 L, synthetic observation 58 ±2 L, discrepancy -6 L, criterion fail, negative result preserved, and readiness unchanged/not-applied.
- Research / Professional: complete model, numerical settings, identities, evidence, replay, limitations, and proof obligations remained available without changing the truth chain.
- Accessibility smoke: Challenge and Learning Depth selectors were discoverable by explicit accessible names and operated successfully.
- Browser console warnings/errors for final clean-tab smokes: none.

## Architecture and truth review

Fresh read-only review of the full branch delta found no blocking architecture or truth defect:

- no files were deleted from contracts, simulation core, API, or web relative to `origin/canonical/verified-lineage`;
- no `.github`, root dependency manifest, or lockfile change occurred;
- no merge commit occurred in the branch range;
- STEM contracts are additive and domain-neutral; vertical definitions depend on core, not the reverse;
- no Clean Water, pump, filter, solar, photovoltaic, or building term occurs in generic education contracts or Sandbox definitions; `water` exists only as an intentional generic relevance category;
- no nineteenth canonical object or REP identity-rule change was introduced;
- browser code renders server projections and sends allowed parameter requests; it does not calculate physics, scoring, evidence, readiness, or material hashes;
- fidelity, evidence readiness, deployment readiness, and professional disposition remain distinct;
- failed/negative, unavailable, unknown, contradiction, and proof-obligation states remain visible;
- no independent third-party review, cross-browser certification, accessibility certification, or external reproduction is claimed.

## Failures and recovery

- The initial architecture comparison used nonexistent local ref `canonical/verified-lineage`; Git rejected it. The check was rerun successfully against `origin/canonical/verified-lineage`.
- Initial browser startup logged transient proxy errors because Vite attempted requests before the API listener was ready. Final acceptance used fresh tabs after API readiness; those tabs had no warning/error logs.
- Final acceptance found unlabeled Challenge and Learning Depth selectors. Accessible names were added, affected build/test and browser selection passed, and the complete evidence gate was rerun at the corrected SHA.
- A pre-correction evidence artifact exists at `artifacts/phase-1a/local/execution-2026-08-30T00-10-35-516Z.json`; it applies to SHA `528e710b187eddc42b9bac255b35267d6348b659`, not the final checkpoint.
- Development-process interrupts produced expected nonzero teardown statuses; they were not application failures.

## Explicit non-claims and limitations

- Clean Water is a synthetic educational level-1 fixture, not proof of potability, treatment efficacy, field performance, public-health suitability, physical validation, certification, regulatory acceptance, deployment readiness, or professional approval.
- The observation is synthetic and the test plan is not completed.
- Local replay is not independent external reproduction.
- Browser acceptance is not cross-browser or formal accessibility certification.
- Local filesystem storage is not production persistence, authentication, tenancy, or a multi-user service.
- Solar remains a later validation vertical and was not used as the foundation.

## Completion boundary

Issue #15 acceptance passes and the branch is ready for owner review. This does not authorize Issue #16, advanced competition work, a release, or a merge/publish action to `canonical/verified-lineage`.
