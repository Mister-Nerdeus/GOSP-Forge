# Phase-1A — Minimal Challenge-Facing Product Loop

## Status and scope

Phase-1A is implemented and locally verified as an application projection over the protected Phase-0B canonical and REP foundation. The demonstrated loop is:

`Challenge -> Submission -> Evaluation -> Evidence -> Comparison`

This report distinguishes implemented behavior and newly executed evidence from historical evidence, inference, and work that remains unverified. It does not claim full Phase 1, production readiness, external validation, or business Gate A completion.

## Starting point

- Observed branch before modification: `develop`.
- Observed starting `HEAD`: `2945361038ee63d26304b4279d703c11ed66d14b`.
- Observed local `origin/develop`: `8a416bed36c025a478d999c0a99939cdeadca837`.
- The expected Phase-0B checkpoint was therefore reconciled before implementation.
- The pre-existing untracked file `docs/source-of-truth/GOSP_Forge_Project_Source_of_Truth_2026-08-07_R3.md` was read as directed, treated as user-owned, and was not modified by this milestone.

## Sources read

The following were read before implementation:

- `AGENTS.md`
- the supplied Phase-1A work order
- `docs/source-of-truth/GOSP_Forge_Project_Source_of_Truth_2026-08-07_R2.md`
- `docs/source-of-truth/GOSP_Forge_Project_Source_of_Truth_2026-08-07_R3.md`
- `docs/source-of-truth/REPOSITORY_STATUS_RECONCILIATION_2026-08-07.md`
- `docs/source-of-truth/PHASE_0B_IMPLEMENTATION_STATUS_2026-08-07.md`
- `docs/source-of-truth/PHASE_0B_FINAL_CODE_REVIEW_2026-08-07.md`
- `docs/source-of-truth/PHASE_0B_FINAL_CODE_REVIEW_2026-08-07_R2.md`
- `docs/rep/REP_V0.1.md`
- `docs/verification/LOCAL_PHASE_0B_VERIFICATION.md`
- current ADRs `docs/adr/0001-*` through `docs/adr/0005-source-implementation-identity.md`
- the root and workspace package manifests and TypeScript configurations
- the existing web app, API server/storage, canonical contracts, REP contracts, reference runner, sandbox-001 solver/fixtures, CLI replay path, source-implementation identity code, test-discovery controls, and relevant package tests

## Architecture decisions

- Extended the existing plain-DOM Vite application and local Node API; no new frontend framework, state manager, database, service, or runtime was added.
- Kept Challenge, Submission, Evaluation, Claim, Evidence, REP, identity, and source-reference schemas authoritative. The new application types are derived read models only.
- Kept validation, identity/reference checks, REP invocation, evidence derivation, replay, and comparison on the API side. The browser contains no scoring or hashing implementation.
- Evaluations call the existing `runSandbox001` REP path. No sandbox-001 solver logic was duplicated.
- Used existing process-local memory and disclosed that it is non-durable and resets with the API process.
- Kept execution-environment evidence separate from material inputs and hashes.
- Defined the displayed hard gate as canonical successful completion: `constraint.sandbox-001.valid-completion` requires `evaluation.status == completed`. It is not an application-defined score threshold.
- Built deterministic comparison from flattened canonical material records. Comparison checks Challenge, Scenario, Model, solver, runner, contracts, and dataset boundaries and does not mutate source records.
- Left canonical schemas, hashing rules, the REP runner/solver, source-identity closure, toolchain, and Clean Water implementation unchanged.

## Canonical objects and contracts used

- `Challenge`, `Submission`, `Scenario`, `Model`, `Evaluation`, `Claim`, and `Evidence` canonical records.
- Exact canonical identity and revision references for Challenge, Submission, Model, solver, runner, schemas/contracts, and datasets.
- REP v0.1 material inputs, material result, execution evidence, replay record, and source-implementation manifests.
- Existing sandbox-001 model/solver and reference-runner identities.
- Derived `Phase1AWorkspace`, evaluation, comparison, explainability, evidence, replay, and export projections. These do not change canonical records.

## Files changed

No files were deleted.

Modified tracked files:

- `README.md`
- `apps/web/package.json`
- `apps/web/src/App.test.ts`
- `apps/web/src/App.tsx`
- `apps/web/src/main.tsx`
- `apps/web/src/styles.css`
- `apps/web/tsconfig.json`
- `config/intended-tests.json`
- `docs/README.md`
- `docs/product/BUILDER_UI_SHELL.md`
- `docs/testing/BROWSER_SMOKE_TEST_STRATEGY.md`
- `package.json`
- `packages/api/package.json`
- `packages/api/src/server.test.ts`
- `packages/api/src/server.ts`
- `packages/contracts/src/index.ts`
- `pnpm-lock.yaml`

Added intended milestone files:

- `apps/web/src/phase1a/client.ts`
- `apps/web/vite.config.ts`
- `artifacts/phase-1a/local/execution-2026-08-09T05-57-14-747Z.json`
- `artifacts/phase-1a/local/execution-2026-08-09T06-01-57-007Z.json`
- `docs/phase-0c/GOSP_FORGE_EXTERNAL_ONE_PAGE.md`
- `docs/phase-0c/EXTERNAL_INTERVIEW_SCRIPT.md`
- `docs/phase-0c/EXTERNAL_FEEDBACK_EVIDENCE_TEMPLATE.json`
- `docs/phase-0c/GATE_A_TRACKER.md`
- `docs/product/PHASE_1A_MINIMAL_PRODUCT_LOOP.md`
- `docs/source-of-truth/PHASE_1A_IMPLEMENTATION_REPORT_2026-08-09.md`
- `examples/phase-1a/challenge.sandbox-001.json`
- `examples/phase-1a/submission.reference.json`
- `examples/phase-1a/submission.candidate-low.json`
- `examples/phase-1a/submission.invalid-material-input.json`
- `examples/phase-1a/submission.invalid-mistyped-reference.json`
- `packages/api/src/phase1a/comparison.test.ts`
- `packages/api/src/phase1a/service.test.ts`
- `packages/api/src/phase1a/service.ts`
- `packages/contracts/src/application/phase1a.ts`
- `scripts/phase-1a/read-product-loop-results.mjs`
- `scripts/phase-1a/write-local-evidence.mjs`

The untracked Revision 3 source-of-truth file is intentionally excluded from the milestone-added list.

## Implemented behavior

- Challenge list/select/detail and canonical JSON creation with field-level validation.
- Requirements, constraints, objectives, assumptions, proof obligations, identities, and limitations display.
- Canonical Submission import/run with exact Challenge references, assumptions, candidate values, and agent/tool disclosure.
- Rejection of invalid material payloads, mistyped references, contradictions, and identity/version mismatches without silent repair.
- REP evaluation with material input/result hashes, execution evidence, identities, gates, metrics, claims, evidence, readiness, provenance, replay, and export.
- Two seeded valid submissions yielding distinct deterministic results.
- Deterministic comparison showing changed and fixed material inputs, result deltas, gate changes, readiness/evidence differences, and proof obligations.
- Four explanation layers: Explain, Show the Math, Inspect the Model, and Inspect the Evidence.
- Local API endpoints for workspace, Challenge creation, Submission creation, evaluation, comparison, and export.
- Phase-0C preparation documents with zero invented participants, interviews, endorsements, design partners, or commercial evidence. Gate A remains `NOT MET`.

## Tests and verification executed

Final authoritative verification:

- `pnpm evidence:phase1a` — PASS. This executed `pnpm verify`, exact discovery, product-loop extraction, Phase-0B material-result extraction, and wrote the final evidence artifact.
- `pnpm verify` within that run — exit 0; lint, build, typecheck, tests, example validation, REP replay, Clean Water simulation, estimation, and foundation audit passed.
- `node scripts/controls/verify-test-discovery.mjs` — PASS, 31 intended and 31 discovered test files, with no missing or unlisted tests.
- `node scripts/phase-1a/read-product-loop-results.mjs` — PASS.
- `node scripts/phase-0b/read-material-results.mjs` — PASS.
- `git diff --check` — PASS after implementation and again during final review.

Final test totals reported by `pnpm verify`:

- contracts: 8 files / 37 tests
- fabrication: 1 file / 3 tests
- web: 1 file / 1 test
- module-registry: 2 files / 7 tests
- sim-core: 2 files / 9 tests
- estimation: 1 file / 10 tests
- vertical-clean-water: 1 file / 15 tests
- API: 8 files / 34 tests
- CLI: 7 files / 21 tests
- total: 31 files / 137 tests

Final foundation audit: `GO`, 23 pass / 0 warn / 0 fail. Claim scan: 189 files scanned and 0 findings.

Additional targeted commands executed during implementation included:

- `pnpm --filter @gosp/contracts build`
- `pnpm --filter @gosp/api typecheck`
- `pnpm --filter @gosp/api test`
- `pnpm --filter @gosp/web typecheck`
- `pnpm --filter @gosp/web test`
- `pnpm --filter @gosp/cli exec vitest run src/commands/releaseEvidence.test.ts` — 1 file / 2 tests passed.

Browser smoke verification used the locally running API and web app. It observed the complete seeded loop, the two results and hashes, comparison, all four explanation layers, evidence/non-claims, a visible field-level error for an invalid Submission, and no browser-console warnings or errors. Temporary listeners were stopped after verification.

## Failures preserved as engineering evidence

- The first baseline `pnpm verify` wrapper exceeded its short process timeout; the unchanged baseline rerun completed successfully at 29/29 discovered test files and 125 tests.
- An initial Phase-1A service test used an invalid relationship enum value; the invalid fixture construction was corrected and the test reran successfully.
- Web typecheck initially found a test-only `never` property access; the fake was corrected.
- API integration initially found seed initialization occurred after Challenge reference resolution; initialization ordering was corrected.
- The first final `pnpm verify` found an unused import and variable; both were removed.
- The next full run reached 31/31 discovery and 136/137 tests but the claim scanner rejected ambiguous approval wording in documentation. The wording was changed to an explicit non-claim; the targeted release-evidence test and full verification passed.
- One CLI test invocation passed a Vitest option through the package test script incorrectly and failed with an unknown option. It was rerun with `pnpm --filter @gosp/cli exec vitest run src/commands/releaseEvidence.test.ts` and passed.
- Initial local browser launch attempts used an invalid shared stdout/stderr redirection and incorrect Vite argument forwarding; corrected local launch commands succeeded.
- Browser verification exposed that the API direct-execution guard did not work with Windows URL/path forms. It was corrected with `fileURLToPath(import.meta.url)` and covered by the passing integration path.
- The first read-only review found a medium integrity concern: an application-level `result >= 50` hard gate could be interpreted as scoring outside REP. Review stopped, the gate was replaced with the canonical completed-evaluation constraint, targeted and full evidence runs passed, and a fresh read-only review was started from the changed state.

## REP, replay, and material identities

Authoritative final local evidence: `artifacts/phase-1a/local/execution-2026-08-09T06-01-57-007Z.json` with result `PASS`. The earlier passing artifact is retained as intermediate evidence rather than overwritten.

Reference submission:

- evaluation: `evaluation.submission.sandbox-001.reference@0.1.0`
- result: `value=53`, `terms=[2,6,15]`, `weightedSum=23`
- material input hash: `72886e655374bcc81162f72fb3a942bb6e596164aea85025453feac0ada8b383`
- material result hash: `991b9464d74424297f88fe363a200d895147349a87b0377d5851945e0aa34c21`
- replay: input and result hashes match

Candidate-low submission:

- evaluation: `evaluation.submission.sandbox-001.candidate-low@0.1.0`
- result: `value=23`, `terms=[0,3,5]`, `weightedSum=8`
- material input hash: `92d014f850618400977ed29862391acae4c046c52ee00b24a6ec4c912157c11b`
- material result hash: `e2224d21bdaf7f0a58d0086ef04d0b0ae728cd787849a9783e846d8d2fc38985`
- replay: input and result hashes match

Preserved implementation identities:

- runner `gosp.rep.reference-runner@0.1.0`: `9b069e97fc2246b2be0ee21990b9200fb9536f3c9ce755143030319f18f1590d`
- solver `solver.sandbox-001@1.0.0`: `0997b38d17fc9d33951d0b63d085894cc645ff2428922279f1b658a260466946`

No canonicalization, runner, solver, source-identity closure, toolchain, or material hashing file changed.

## Comparison demonstration

The reference and candidate-low evaluations are comparable within the same Challenge, Scenario, Model, solver, runner, contract, and dataset boundaries.

- Changed paths: `submission.id` and `submission.materialPayload.values[0..2]`.
- Fixed material paths: 134.
- Result deltas: terms `-2`, `-3`, and `-10`; value `-30`; weighted sum `-15`.
- Hard-gate change: none; both valid evaluations completed and pass the canonical completion gate.
- Evidence Readiness remains `computationally-reproduced` for both.
- Deployment Readiness remains `concept-only` for both.
- Independent reproduction and physical validation proof obligations remain unresolved for both.
- Tests reject comparisons across incompatible identity, model, solver, runner, contract, dataset, Challenge, or Scenario boundaries and verify no source-record mutation.

## Explainability and evidence demonstration

- Explain: identifies the better result metric, structured input changes that account for the delta, limitations, and unresolved obligations.
- Show the Math: exposes real solver relationship `sandbox-001.weighted-sum`, term values, units, and intermediate `weighted-sum`, `scale`, and `offset` values.
- Inspect the Model: exposes Model, solver, runner, source-implementation, analytical fidelity, assumptions, boundary conditions, datasets, configuration, and limitations.
- Inspect the Evidence: exposes Claim/Evidence identities, evidence type/status, Evidence Readiness, Deployment Readiness, local reproduction status, provenance, contradictions, and unresolved proof obligations.
- Explicit non-claims state that this synthetic deterministic benchmark does not establish physical validity; local replay is not independent external reproduction; and no professional approval, certification, regulatory approval, or deployment readiness is claimed.

## Regression status

Newly executed Clean Water result: 8 liters.

- legacy input hash: `2355da693fad75a3337887d0c9129df41e432de3824a70997f2673e9369441a6`
- legacy output hash: `d500dfecaf0afa7a7ca6c9c6ff1dca97343f1f1f096a1798b3ba887d7d474bde`
- REP material input hash: `809bf1cad1f3b3d18e1c605fbd4550feb8346545c7fa10720a22a00f45f90d0c`
- REP material result hash: `0912de0a81bf5cc327663cfb31df0f97dd2f76102190521a912507cdae2ee5e6`

These match the protected Phase-0B boundary in the newly executed evidence.

## Docker/Linux status

Docker/Linux reproduction was not rerun. This milestone changes an application projection only. Read-only diff inspection confirmed that canonical schemas, REP contracts, canonical JSON and SHA-256 code, runner, sandbox solver, source-implementation identity closure, TypeScript toolchain boundary, and Clean Water material implementation were unchanged. The latest Windows evidence reproduced the protected sandbox and Clean Water material hashes. Under the work order, no cross-platform rerun is required for this unchanged material evaluator boundary.

## Security and dependency observations

- No new third-party dependency, dependency version, Node version, pnpm version, framework, database, service, account, credential, or cloud dependency was introduced.
- Lockfile changes contain only workspace links from web to `@gosp/contracts` and API to `@gosp/sim-core`.
- Existing API request-body limit and rate limiting remain in place. Phase-1A accepts structured JSON and does not accept caller-selected filesystem paths.
- UI rendering uses DOM text/value APIs for untrusted content rather than HTML injection.
- Historical Phase-0B development-tool advisory observations remain in their separate workstream. They were not suppressed, upgraded, or re-scanned as part of this milestone, so this report makes no new current advisory-count claim.

## Final read-only review

The restarted final review inspected all tracked changes and intended untracked files, canonical boundaries, REP use, comparison behavior, explainability derivation, identity/reference validation, input errors, mutation risk, security-sensitive handling, claims, tests, and scope.

Final findings after remediation:

- blocker: none
- high: none
- medium: none
- low: none

The earlier medium hard-gate finding is recorded above, was remediated before the restarted review, and is not an open finding. No silent fixes were made during the restarted review.

## Known limitations and deferred work

- Evaluation support is intentionally limited to `sandbox-001`; this is not a generalized solver marketplace.
- Storage is process-local memory and is neither durable nor production storage.
- Production authentication, authorization, tenancy, database architecture, deployment, observability, and service hardening are not implemented.
- The seeded UI demonstrates one Challenge. Locally created Challenge records live only for the API process, and evaluation remains limited to the supported sandbox identity.
- Independent external reproduction, physical validation, professional review, certification, and regulatory approval remain unverified/not established.
- Phase-0C materials are prepared only. External organization count, confirmed workflow-value count, design-partner count, and paid-pilot commitments are all zero; Gate A is `NOT MET`.
- Full Forge Studio, 3D/CAD, Pascal, IFC, EnergyPlus, HouseSim, marketplace/payment, federation, Kubernetes, mobile, SSO, production persistence, accredited-test integrations, and external outreach remain explicit non-goals.

## Working tree and remote actions

- Current branch remains `develop`; `HEAD` remains `2945361038ee63d26304b4279d703c11ed66d14b`.
- The tree is intentionally dirty with the Phase-1A tracked modifications and intended untracked files listed above.
- The pre-existing user-owned untracked Revision 3 source-of-truth file remains preserved.
- No commit was created.
- No push, pull, PR change, remote branch change, GitHub Actions run, other remote CI, publish, deployment, external contact, or credential operation occurred.

## Recommendation

READY FOR LOCAL CHECKPOINT
