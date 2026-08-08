# Phase-0B Local Implementation Status — 2026-08-07

## Scope and status

This record describes uncommitted, unpushed local working-tree changes based on baseline commit `8a416bed36c025a478d999c0a99939cdeadca837`.

No GitHub Action, remote write, commit, branch change, or `staging` modification occurred during this work.

## Observed

- Revision 2's earlier rebaseline/runner/HouseSim status did not exist in the inspected checkout.
- The checkout used Vitest and contained a Clean Water-specific `sim-core`.
- The May 16 local validation artifact matched baseline HEAD and was preserved unchanged.
- Docker Desktop with a Linux engine was already installed and available.

## Implemented locally

- Repository instructions, discrepancy reconciliation, four initial ADRs, and local verification policy.
- Manual-only GitHub workflow trigger so a future push cannot automatically run Actions under the current policy.
- Shared stable identity, exact revision refs, provenance, typed relationships, creation metadata, and supersession lineage.
- Lean contracts for exactly 18 canonical objects.
- Typed claims, proof obligations, evidence, reviews, evidence readiness, deployment readiness, and professional disposition.
- Model identity/fidelity, solver/runner and contract/dataset identities, assumptions, boundary conditions, uncertainty, sensitivity, explainability, first-class Scenario, and controlled comparison.
- REP v0.1, Unicode-code-point canonical JSON, SHA-256 material hashing, separate execution evidence, replay records, and `sandbox-001`.
- Explicit intended-test manifest and discovery gate.
- `pnpm verify` and `pnpm evidence:local`.
- Clean Water moved from generic `@gosp/sim-core` into `@gosp/vertical-clean-water`.
- Clean Water REP adapter producing generic Evaluation output while preserving the existing screening result.
- Removal of three workspace self-dependencies.

## Executed and verified

### Windows local suite

`pnpm verify` completed with exit status 0 on Windows 10.0.26200, x64, Node `v22.16.0`, pnpm `9.15.5`.

The suite executed runtime-policy validation, lint, all builds, all typechecks, intended-test discovery, all package tests, project/ref validation, `sandbox-001` replay, Clean Water simulation, Clean Water estimation, and the foundation audit.

Test discovery found exactly 29 intended files. All 29 files and 119 tests passed.

The generated local evidence record is under `artifacts/phase-0b/local/` and does not overwrite the May artifact.

### Material results

| Evaluation | Material input hash | Material result hash |
|---|---|---|
| `sandbox-001` | `bebe2c8fe4dcbc0fdb327d44c5fffeee7864161f49c278a2c32ab5ca25d3af2e` | `3cfd0c28a321535667e55ee92a74788d68c1083cd76748348f54fb758fe05b95` |
| Clean Water REP adapter | `fd78e3708ea08905e775cca44066fee568ab2345b298acaa097ce2d86fe88756` | `d947135a2daaf6137ffc1a87ca85c364dd18e48244133b007d0ab1090242b24c` |

The preserved Clean Water output remained 8 modeled liters. Its legacy envelope hashes were:

- input: `2355da693fad75a3337887d0c9129df41e432de3824a70997f2673e9369441a6`
- output: `d500dfecaf0afa7a7ca6c9c6ff1dca97343f1f1f096a1798b3ba887d7d474bde`

### Cross-environment local replay

The same checked-in `sandbox-001` replay record was executed in:

- native Windows x64, Node `v22.16.0`, locale `en-US`, timezone `America/New_York`;
- Docker Linux x64 on WSL2 kernel, Node `v24.19.0`, locale `en-US`, timezone `UTC`.

Both environments produced the same material input and result hashes. The comparison record reports every check true:

- `artifacts/phase-0b/reproducibility/windows-node22.json`
- `artifacts/phase-0b/reproducibility/linux-node24.json`
- `artifacts/phase-0b/reproducibility/comparison.json`

This demonstrates cross-environment local reproducibility for `sandbox-001`; it is not independent external reproduction or physical validation.

## Preserved failures

- The first vertical-boundary test run failed because the moved test imported generic hash helpers from the vertical package. The boundary import was corrected; the rerun passed 14/14 vertical tests.
- The first full `pnpm verify` failed because the legacy claim scanner treated two explicit separation/non-claim statements as affirmative approval claims. Targeted scanner tests were added, the false positives were corrected, and the rerun passed.
- The first two `pnpm evidence:local` attempts failed before artifact creation because the evidence launcher did not resolve pnpm correctly on Windows. The script now invokes the active pnpm entrypoint through Node; the subsequent run wrote a PASS artifact.

## Historical evidence

`artifacts/controls/local-validation/latest.json` and `latest.sanitized.json` remain the May 16 evidence for baseline HEAD. They were not regenerated or relabeled.

## Not verified or explicitly deferred

- No local commit or remote publication.
- No HouseSim source or migration.
- No external independent reproduction.
- No physical test, professional approval, certification, deployment readiness, or business Gate A evidence.
- No Forge Studio, Pascal, IFC, EnergyPlus, marketplace, federation, Kubernetes, mobile, or broad solver work.
