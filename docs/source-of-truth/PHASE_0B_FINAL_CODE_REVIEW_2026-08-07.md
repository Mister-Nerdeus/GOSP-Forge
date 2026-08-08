# Phase-0B Final Code Review — 2026-08-07

## Review decision

**NOT READY FOR CHECKPOINT COMMIT.**

The Phase-0B working tree is structurally coherent and the complete documented local gate passes, but the review found two blockers and several protocol-integrity issues that are not covered by the current tests. No implementation fix was made during this review.

This review applies to the uncommitted working tree based on:

- branch: `develop`;
- HEAD: `8a416bed36c025a478d999c0a99939cdeadca837`;
- `origin/develop`: `8a416bed36c025a478d999c0a99939cdeadca837`;
- initial review inventory: 45 tracked changes and 65 untracked files, 110 files total;
- staged changes: none.

## Severity-ranked findings

### B-01 — Blocker — Sparse arrays are not rejected by normative canonical JSON

Location: `packages/sim-core/src/hash/canonicalJson.ts:25`

The sparse-array guard uses `Array.prototype.some`. JavaScript array iteration skips holes, so the predicate is never called for the missing indexes it is intended to detect. A direct probe of the built implementation produced:

```json
{
  "rejected": false,
  "serialized": "[,7]"
}
```

`[,7]` is not valid JSON. This contradicts REP v0.1's normative statement that sparse arrays are rejected and permits invalid material serialization to be hashed. The current canonicalization test covers undefined, NaN, class instances, and Unicode ordering, but not a genuinely sparse array.

Required disposition: replace the guard with an index-presence check that actually visits every index, add sparse-array tests at the canonicalizer and REP boundary, and regenerate every material hash and cross-environment evidence record affected by the canonicalizer implementation identity.

### B-02 — Blocker — The asserted domain-neutral core boundary is incomplete

Locations:

- `packages/sim-core/src/boundary.test.ts:24`
- `packages/contracts/src/products/productSpecMeaning.ts:2`
- `packages/contracts/src/safety/safetyValidation.ts:54`
- `packages/contracts/src/education/educationValidation.ts:26`

The boundary test scans only `packages/sim-core/src`. `@gosp/contracts`, which is also a core package and is described by ADR 0001 as domain-neutral, still encodes Clean Water-specific product targets (`pumpFlowLpm`, `filterCapacityL`, `filterEfficiency`, and `turbidityRange`), detects water modules, and requires potable-water language in generic education validation.

The new canonical contract files themselves are domain-neutral and the dependency direction `vertical-clean-water -> sim-core/contracts` is correct. The package-wide architectural claim is nevertheless not yet true, and the current boundary test cannot detect this gap.

Required disposition: either move the vertical-specific legacy schemas and validators behind the Clean Water package or explicitly narrow the ADR and Phase-0B claim to the canonical and simulation-core surfaces. Add a boundary test that covers every package declared to be core.

### H-01 — High — REP accepts internally contradictory references and wrong identity kinds

Locations:

- `packages/contracts/src/rep/rep.ts:19`
- `packages/contracts/src/canonical/executionModel.ts:101`
- `packages/sim-core/src/rep/referenceRunner.ts:31`

`RepMaterialInputSchema` validates each object independently but does not establish referential consistency among them. The runner also does not verify those linkages. A direct probe changed `submission.challengeRef.id` to `challenge.different`; `runSandbox001` accepted the input and issued a material-result hash. A second probe changed an entry in `contractIdentities` to kind `dataset`; it was also accepted.

At minimum, REP must enforce exact agreement among:

- Submission -> Challenge;
- Submission -> compiled Scenario;
- Challenge -> evaluation Model and Workflow;
- Challenge permitted Scenario refs -> compiled Scenario;
- compiled Scenario -> Model;
- context-specific runner, solver, contract/schema, dataset, and component-data identity kinds.

Without these checks, a deterministic result can be attached to a semantically inconsistent or falsely typed material record.

### H-02 — High — Runner and solver content hashes are not bound to executable implementations

Locations:

- `packages/sim-core/src/rep/referenceRunner.ts:12`
- `packages/sim-core/src/rep/sandbox001Fixture.ts:11`
- `packages/vertical-clean-water/src/rep/cleanWaterRepAdapter.ts:72`

The reference runner identity is the SHA-256 hash of a hand-authored manifest constant. Solver and contract identities similarly hash small descriptors rather than the executable implementation or a reproducible build/source artifact. The implementation can therefore change without changing the claimed runner or solver `contentHash`.

This weakens the central REP assertion that the same exact runner/solver produced the compared result. Bind these identities to reviewed source/build content, or rename and document them as declaration hashes while adding a separate implementation artifact identity.

### M-01 — Medium — The professional-claim scanner can suppress affirmative claims

Location: `packages/cli/src/audit/noProfessionalClaimScanner.ts:42`

Adding `separate`, `separately`, and `distinct` as line-wide disclaimer tokens fixed documented false positives, but also creates false negatives. Direct probes returned no findings for both of these affirmative statements:

```text
Professional engineering approval is separate and approved for production use.
Professional engineering approval is distinct and validated for this design.
```

The scanner should recognize scoped negation/separation constructions rather than treating any occurrence of those words as a disclaimer for the whole line. Add adversarial positive and negative cases before relying on the audit as a truth gate.

### M-02 — Medium — The comparison utility does not establish that environments are distinct

Location: `scripts/phase-0b/compare-reproducibility.mjs:14`

The comparison checks paths, expected hashes, actual hashes, and replay booleans, but never requires different environment IDs, operating systems, runtimes, or another explicit independence criterion. Passing the same environment report twice would set `reproducible: true`.

The existing Windows Node 22 and Docker Linux Node 24 artifacts are visibly distinct and their hash comparison remains valid. The utility itself should reject identical reports or describe its conclusion as a hash match without asserting cross-environment reproduction.

### L-01 — Low — Local evidence captures `statusAfter` before writing its own artifact

Location: `scripts/phase-0b/write-local-evidence.mjs:45`

`git.statusAfter` is evaluated while building the evidence object, before `fs.writeFileSync` creates the new evidence file. The record therefore describes the state after verification but not the literal final working-tree state after evidence creation. Document this snapshot boundary or capture a final status in a small sidecar/finalization step.

## Verified strengths

- The canonical kind enum and discriminated union contain exactly the approved 18 kinds.
- Scenario, claims, evidence, readiness, professional disposition, explainability, sensitivity, uncertainty, and controlled comparison have concrete schemas.
- `@gosp/vertical-clean-water` depends on `@gosp/sim-core` and `@gosp/contracts`; neither package depends on the vertical.
- No workspace package has a self-dependency.
- The 17 moved Clean Water implementation files are unchanged except for the expected core import changes, scenario-extension validation, and exported scoring types. The old aggregate test was replaced by a vertical-owned test.
- The GitHub workflow has only `workflow_dispatch`; push and pull-request triggers are absent.
- Historical May evidence remains at `gitSha` `8a416bed36c025a478d999c0a99939cdeadca837`, timestamp `2026-05-16T01:11:49.930Z`, result `PASS`.
- `git diff --check` passed.

## Commands executed during this review

### Complete local gate

`pnpm verify` completed with exit status 0 on Windows, Node `v22.16.0`.

- runtime policy: pass;
- lint: pass;
- all workspace builds: pass;
- all typechecks: pass;
- intended-test discovery: 29 intended, 29 discovered, no missing or unlisted files;
- tests: 29 files and 119 tests passed;
- example validation: pass;
- recorded `sandbox-001` replay: pass;
- Clean Water simulation: pass, 8 modeled liters;
- Clean Water estimate: pass;
- foundation audit: `GO`, 23 pass, 0 warn, 0 fail.

### Adversarial review probes

The following behavior was executed directly against the built code and is not inferred:

- sparse array `[<hole>, 7]` was accepted and serialized as `[,7]`;
- a mismatched Submission -> Challenge ref was accepted by `runSandbox001`;
- a dataset identity placed in `contractIdentities` was accepted;
- two affirmative professional-approval sample lines containing `separate` or `distinct` produced zero scanner findings.

These probes explain why a passing suite does not clear the findings above.

## Existing evidence references

- final pre-review local evidence: `artifacts/phase-0b/local/execution-2026-08-08T00-38-55-631Z.json`;
- Windows report: `artifacts/phase-0b/reproducibility/windows-node22.json`;
- Linux report: `artifacts/phase-0b/reproducibility/linux-node24.json`;
- comparison: `artifacts/phase-0b/reproducibility/comparison.json`.

Those artifacts accurately show that the checked-in valid fixture produced matching hashes in the recorded environments. They do not demonstrate rejection of all invalid material inputs or bind the runner hash to executable code.

## Change-control confirmation

No source, configuration, package manifest, lockfile, test, fixture, implementation-status document, or evidence record was edited to address findings during this review. `pnpm verify` regenerated ignored build outputs. The only intentional repository addition made by the reviewer is this review artifact.

No commit, push, branch change, pull-request operation, remote write, or GitHub Actions execution occurred.

Before any future checkpoint commit, the documents that currently say the work is uncommitted must also be updated in the same authorized fix/checkpoint pass, and post-fix material hashes plus cross-environment evidence must be regenerated.

## Complete initial changed-file inventory

The following is the complete 110-file implementation/evidence input reviewed before this report was added.

### Modified tracked files (27)

- `.github/workflows/ci.yml`
- `README.md`
- `docs/README.md`
- `docs/contracts/PROJECT_SCENARIO_SETTINGS.md`
- `docs/gates/CI_GATE_POLICY.md`
- `docs/program/BRANCH_PROTECTION_RECOMMENDATIONS.md`
- `docs/program/CLAIM_IMPLEMENTATION_MAP.md`
- `docs/setup/RUNTIME_POLICY.md`
- `package.json`
- `packages/ai-proposals/package.json`
- `packages/api/package.json`
- `packages/cli/package.json`
- `packages/cli/src/audit/noProfessionalClaimScanner.test.ts`
- `packages/cli/src/audit/noProfessionalClaimScanner.ts`
- `packages/cli/src/cli.test.ts`
- `packages/cli/src/commands/simulate.ts`
- `packages/cli/src/main.ts`
- `packages/contracts/src/index.ts`
- `packages/contracts/src/project/projectManifestV2.ts`
- `packages/contracts/src/project/projectScenarioSettings.ts`
- `packages/estimation/package.json`
- `packages/fabrication/package.json`
- `packages/module-registry/package.json`
- `packages/sim-core/package.json`
- `packages/sim-core/src/hash/stableStringify.ts`
- `packages/sim-core/src/index.ts`
- `pnpm-lock.yaml`

### Deleted tracked paths moved out of generic sim-core (18)

- `packages/sim-core/src/assumptions/assumptionRegistry.ts`
- `packages/sim-core/src/assumptions/defaultAssumptions.ts`
- `packages/sim-core/src/cleanWater/baselineComparison.ts`
- `packages/sim-core/src/cleanWater/compileCleanWaterInput.ts`
- `packages/sim-core/src/cleanWater/controllerLogic.ts`
- `packages/sim-core/src/cleanWater/graphConsistency.ts`
- `packages/sim-core/src/cleanWater/impactReport.ts`
- `packages/sim-core/src/cleanWater/powerCompatibility.ts`
- `packages/sim-core/src/cleanWater/powerFlowEngine.ts`
- `packages/sim-core/src/cleanWater/scoreCleanWater.ts`
- `packages/sim-core/src/cleanWater/waterFlowEngine.ts`
- `packages/sim-core/src/cleanWater/waterFlowTypes.ts`
- `packages/sim-core/src/run/confidenceSummary.ts`
- `packages/sim-core/src/run/createSimulationRunEnvelope.ts`
- `packages/sim-core/src/scoring/moduleScorecardGenerator.ts`
- `packages/sim-core/src/scoring/systemScorecardGenerator.ts`
- `packages/sim-core/src/sim-core.test.ts`
- `packages/sim-core/src/specMeaning/applyProductSpecEffects.ts`

### Untracked files (65)

- `.dockerignore`
- `AGENTS.md`
- `Dockerfile.rep-replay`
- `artifacts/phase-0b/local/execution-2026-08-08T00-35-04-327Z.json`
- `artifacts/phase-0b/local/execution-2026-08-08T00-38-55-631Z.json`
- `artifacts/phase-0b/reproducibility/comparison.json`
- `artifacts/phase-0b/reproducibility/linux-node24.json`
- `artifacts/phase-0b/reproducibility/windows-node22.json`
- `config/intended-tests.json`
- `docs/adr/0001-domain-neutral-core-and-vertical-adapters.md`
- `docs/adr/0002-canonical-identity-versioning-and-lineage.md`
- `docs/adr/0003-rep-material-results-and-execution-evidence.md`
- `docs/adr/0004-local-only-verification.md`
- `docs/rep/REP_V0.1.md`
- `docs/source-of-truth/GOSP_Forge_Project_Source_of_Truth_2026-08-07_R2.md`
- `docs/source-of-truth/PHASE_0B_IMPLEMENTATION_STATUS_2026-08-07.md`
- `docs/source-of-truth/REPOSITORY_STATUS_RECONCILIATION_2026-08-07.md`
- `docs/verification/LOCAL_PHASE_0B_VERIFICATION.md`
- `docs/verticals/clean-water/SCENARIO_SETTINGS.md`
- `examples/rep/sandbox-001.replay.json`
- `packages/cli/src/commands/rep.test.ts`
- `packages/cli/src/commands/rep.ts`
- `packages/contracts/src/canonical/canonicalObject.ts`
- `packages/contracts/src/canonical/canonicalObjects.test.ts`
- `packages/contracts/src/canonical/executionModel.ts`
- `packages/contracts/src/canonical/identity.ts`
- `packages/contracts/src/canonical/programGraph.test.ts`
- `packages/contracts/src/canonical/programGraph.ts`
- `packages/contracts/src/canonical/truthModel.ts`
- `packages/contracts/src/rep/rep.ts`
- `packages/sim-core/src/boundary.test.ts`
- `packages/sim-core/src/hash/canonicalJson.ts`
- `packages/sim-core/src/rep/referenceRunner.ts`
- `packages/sim-core/src/rep/rep.test.ts`
- `packages/sim-core/src/rep/replay.ts`
- `packages/sim-core/src/rep/sandbox001.ts`
- `packages/sim-core/src/rep/sandbox001Fixture.ts`
- `packages/vertical-clean-water/package.json`
- `packages/vertical-clean-water/src/assumptions/assumptionRegistry.ts`
- `packages/vertical-clean-water/src/assumptions/defaultAssumptions.ts`
- `packages/vertical-clean-water/src/cleanWater/baselineComparison.ts`
- `packages/vertical-clean-water/src/cleanWater/compileCleanWaterInput.ts`
- `packages/vertical-clean-water/src/cleanWater/controllerLogic.ts`
- `packages/vertical-clean-water/src/cleanWater/graphConsistency.ts`
- `packages/vertical-clean-water/src/cleanWater/impactReport.ts`
- `packages/vertical-clean-water/src/cleanWater/powerCompatibility.ts`
- `packages/vertical-clean-water/src/cleanWater/powerFlowEngine.ts`
- `packages/vertical-clean-water/src/cleanWater/scenarioSettings.ts`
- `packages/vertical-clean-water/src/cleanWater/scoreCleanWater.ts`
- `packages/vertical-clean-water/src/cleanWater/waterFlowEngine.ts`
- `packages/vertical-clean-water/src/cleanWater/waterFlowTypes.ts`
- `packages/vertical-clean-water/src/index.ts`
- `packages/vertical-clean-water/src/rep/cleanWaterRepAdapter.ts`
- `packages/vertical-clean-water/src/run/confidenceSummary.ts`
- `packages/vertical-clean-water/src/run/createSimulationRunEnvelope.ts`
- `packages/vertical-clean-water/src/scoring/moduleScorecardGenerator.ts`
- `packages/vertical-clean-water/src/scoring/systemScorecardGenerator.ts`
- `packages/vertical-clean-water/src/specMeaning/applyProductSpecEffects.ts`
- `packages/vertical-clean-water/src/vertical-clean-water.test.ts`
- `packages/vertical-clean-water/tsconfig.json`
- `scripts/controls/verify-test-discovery.mjs`
- `scripts/phase-0b/compare-reproducibility.mjs`
- `scripts/phase-0b/read-material-results.mjs`
- `scripts/phase-0b/rep-environment-report.mjs`
- `scripts/phase-0b/write-local-evidence.mjs`
