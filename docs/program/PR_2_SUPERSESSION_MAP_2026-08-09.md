# PR #2 Supersession and Preservation Map

Date: 2026-08-09 (America/New_York)

PR: `Mister-Nerdeus/GOSP-Forge#2`, “Phase 0: rebaseline GOSP Forge around contracts, reproducibility, and evidence”

Observed remote state: open, draft, unmerged; base `main` at `6a7af8e1763fdbae7cce235b66435593424a5716`; head `baseline/phase-0-rebaseline` at `e05ae283a1605c17efd9d6575cb8df642a098a34`; three commits; 46 changed files. No PR mutation was performed.

## Comparison method

The PR head was compared directly with Phase-0B `2945361038ee63d26304b4279d703c11ed66d14b`, original Phase-1A `9f67e1745ae9ed56bd79237a429863213fc492c9`, and remediated Phase-1A `d49e9d11116fd59e3f3f38c638dfe63c1bc02924` using file-level name/status, direct tree diffs, same-path Git blob hashes, whole-tree blob matches, and manual semantic review for renamed concepts.

All nonempty PR files have different blob identities from the current local tree. `evidence/ci/.gitkeep` has the universal empty-blob identity `e69de29…`, which is present at other `.gitkeep` paths. Absence of an identical blob is not treated as proof of unique semantics.

Classification meanings are those required by RR-208. “Integrate adapted” means carry the useful governance intent into the RR-212 control checkpoint without importing stale Phase-0 implementation claims.

## Complete 46-file disposition

| PR #2 path | PR blob | Classification | Local equivalent / disposition |
|---|---|---|---|
| `.github/CODEOWNERS` | `3892069…` | unique-and-required | Integrate adapted ownership for current contracts, REP/evidence, source-of-truth, ADR, and workflow boundaries. |
| `.github/ISSUE_TEMPLATE/architecture-decision.yml` | `2d8d6d6…` | unique-and-required | Integrate; the decision structure remains current. |
| `.github/ISSUE_TEMPLATE/config.yml` | `8005e32…` | unique-and-required | Integrate; prevents unstructured public issues while the repository is owner-controlled. |
| `.github/ISSUE_TEMPLATE/phase0-task.yml` | `b126dff…` | unique-but-no-longer-required | Phase-0-specific categories are stale. Preserve on PR branch; do not publish in the authoritative candidate. |
| `.github/PULL_REQUEST_TEMPLATE.md` | `346a13e…` | unique-and-required | Integrate adapted to `pnpm verify`, exact executed-evidence reporting, local-only policy, and current boundaries. |
| `.github/copilot-instructions.md` | `b2f364e…` | renamed/preserved | Governing intent is preserved and strengthened by `AGENTS.md`, R3, and current ADRs. Do not duplicate an independently drifting instruction surface. |
| `.github/dependabot.yml` | `788d8cf…` | unique-but-no-longer-required | Weekly PR creation conflicts with current local-first/no-unsolicited-automation policy. Preserve historically; do not integrate. |
| `.github/workflows/ci.yml` | `5012fe0…` | superseded-by-Phase0B | PR version triggers on PRs and pushes to main. Current workflow is manual `workflow_dispatch` only and uses current verification controls. |
| `.gitignore` | `efb772e…` | renamed/preserved | Current ignore file covers active artifacts; useful generic log/store/report exclusions are incorporated separately without restoring stale evidence layout. |
| `AGENTS.md` | `d7ec121…` | superseded-by-Phase0B | Current instructions preserve stricter local-only, checkpoint, domain-neutrality, and truthful-reporting policy; update governing source from R2 to tracked R3 in RR-212. |
| `CONTRIBUTING.md` | `28e0860…` | unique-and-required | Integrate adapted to R3 and the current verified technical head. |
| `README.md` | `55f1aa9…` | superseded-by-Phase1A | Current README describes the larger implemented foundation and Phase-1A product loop. Add current governance links, not the stale PR README. |
| `SECURITY.md` | `87f2e18…` | unique-and-required | Integrate. Its early-stage/sensitive-data/non-claim boundaries remain applicable. |
| `benchmarks/README.md` | `a49d5cd…` | superseded-by-Phase0B | Current REP, examples, and verification documentation supersede the alternate benchmark layout. |
| `benchmarks/sandbox-001/baseline-submission.json` | `99c4e7c…` | superseded-by-Phase0B | Superseded by canonical sandbox fixtures and replay record under `examples/`. |
| `benchmarks/sandbox-001/challenge.json` | `975e098…` | superseded-by-Phase0B | Superseded by current canonical challenge/scenario/model/workflow records. |
| `benchmarks/sandbox-001/invalid-submission.json` | `852a658…` | superseded-by-Phase1A | Current API/CLI validation tests and invalid-reference browser behavior cover this boundary under current contracts. |
| `benchmarks/sandbox-001/rep.json` | `5e17ecc…` | superseded-by-Phase0B | Superseded by REP v0.1, reference runner, replay records, and protected material hashes. |
| `docs/adr/0001-core-vertical-boundary.md` | `e6ad74d…` | renamed/preserved | Semantics preserved by current ADR 0001 with broader adapter guidance. |
| `docs/adr/0002-reproducibility-before-studio.md` | `bb8bbd8…` | renamed/preserved | Semantics preserved by R3, REP v0.1, ADRs 0003–0005, and local verification policy. |
| `docs/adr/0003-deterministic-result-vs-execution-evidence.md` | `45924ed…` | renamed/preserved | Semantics preserved by current ADR 0003 and source-identity ADR 0005. |
| `docs/architecture/repository-map.md` | `c015357…` | historical-only | Paths describe the alternate `packages/runner`/`benchmarks` structure. Preserve on PR branch; current docs index and project architecture govern. |
| `docs/licensing/strategy.md` | `2187da0…` | unique-and-required | Integrate unchanged as a planning/non-legal-advice note; preserve existing MIT license separately from remote main. |
| `docs/product/phase-0-baseline.md` | `53f8f53…` | superseded-by-Phase0B | Current source-of-truth/status/review records define achieved Phase-0B and its non-claims more precisely. |
| `docs/verification/evidence-rules.md` | `9585471…` | renamed/preserved | Append orientation, identity separation, status vocabulary, and negative evidence are preserved by ADRs 0002/0003/0005, REP v0.1, and local verification docs. |
| `eslint.config.mjs` | `60779a6…` | superseded-by-Phase0B | Current `eslint.config.js` and workspace scripts govern the verified tree. |
| `evidence/README.md` | `551b1b3…` | renamed/preserved | Current `artifacts/`, evidence scripts, REP docs, and verification records preserve the evidence distinction. |
| `evidence/ci/.gitkeep` | `e69de29…` | identical/preserved | Empty blob already exists at retained placeholder paths; obsolete evidence directory need not be recreated. |
| `package.json` | `75ff8e5…` | superseded-by-Phase1A | Current workspace scripts, exact package manager, Phase-0B verification, and Phase-1A evidence commands supersede it. |
| `packages/contracts/package.json` | `ddd5078…` | superseded-by-Phase0B | Current typed contracts package and dependency closure supersede it. |
| `packages/contracts/schemas/gosp-core.schema.json` | `5463f35…` | superseded-by-Phase0B | Alternate JSON schema is not the canonical typed contract source; importing it would create a second authority. |
| `packages/contracts/schemas/rep.schema.json` | `2c3fc17…` | superseded-by-Phase0B | Current REP TypeScript/Zod contracts and normative REP document supersede it. |
| `packages/contracts/src/index.ts` | `5c3ceb9…` | superseded-by-Phase1A | Current modular exports cover a much broader canonical model and application projection. |
| `packages/runner/package.json` | `3247df6…` | superseded-by-Phase0B | Current REP authority lives in `packages/sim-core`; duplicate package would split authority. |
| `packages/runner/src/cli.mjs` | `b65bf34…` | superseded-by-Phase0B | Current CLI delegates evaluation to the reference REP runner. |
| `packages/runner/src/lib.mjs` | `0dd2f4d…` | superseded-by-Phase0B | Protected reference runner/solver/canonicalization implementation supersedes the alternate runner. |
| `pnpm-workspace.yaml` | `843ba7c…` | superseded-by-Phase1A | Current workspace includes all verified packages and application surfaces. |
| `scripts/checks/lint.mjs` | `f1092fd…` | superseded-by-Phase0B | Current package scripts and ESLint configuration supersede the wrapper. |
| `scripts/checks/test.mjs` | `71db42f…` | superseded-by-Phase0B | Current recursive Vitest suite and exact discovery control supersede it and avoid its recorded recursive-test warning. |
| `scripts/checks/typecheck.mjs` | `18596d0…` | superseded-by-Phase0B | Current recursive workspace typecheck supersedes it. |
| `scripts/evidence/write-ci-evidence.mjs` | `1b838b7…` | superseded-by-Phase0B | Current `scripts/controls/write-ci-evidence.mjs` and local evidence writers are more complete. |
| `scripts/validation/validate-contracts.mjs` | `a75fb52…` | superseded-by-Phase0B | Current schema validation, examples validation, tests, and audit controls supersede it. |
| `tests/runner.test.mjs` | `f95f43f…` | superseded-by-Phase0B | Current sim-core REP tests, replay tests, source-identity checks, and Phase-1A integration tests supersede it. |
| `tsconfig.build.json` | `1d655ce…` | superseded-by-Phase0B | Current base and package-specific TypeScript configurations govern the verified source identity. |
| `tsconfig.json` | `81d7946…` | superseded-by-Phase0B | Current workspace configuration supersedes it. |
| `verticals/housesim/README.md` | `082e68a…` | historical-only | Useful historical vertical intent, but the referenced HouseSim starter implementation is absent from the selected tree and HouseSim is not the current vertical. Preserve branch; reconsider when a HouseSim vertical is explicitly scoped. |

## Feature-level conclusions

- **Contracts, runner, sandbox, evidence implementation:** superseded by the exact verified Phase-0B/Phase-1A implementation. Do not merge or copy these alternate authorities.
- **Architecture/evidence ADR intent:** semantically preserved in current ADRs and REP documentation.
- **Governance and public-repository hygiene:** CODEOWNERS, structured ADR issues, issue configuration, PR template, contribution policy, security policy, and licensing strategy are unique and still valuable. Integrate adapted/current versions in RR-212.
- **Automation:** do not integrate Dependabot or the PR's automatic push/PR workflow. The local candidate's manual-only workflow remains authoritative.
- **HouseSim:** preserve as historical remote content. It is not discarded, but it is not required for the present technical/publication candidate.

## Recommendation

**PR #2 CONTAINS UNIQUE WORK REQUIRING INTEGRATION**

After the listed governance items are integrated and verified in RR-212, PR #2 should be closed remotely as superseded only during a separately authorized publication/authority-transition stage. Its branch and exact commits must remain preserved according to the RR-209 plan. This issue made no remote PR change.
