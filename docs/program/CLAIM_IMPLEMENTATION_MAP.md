# Claim Implementation Map

Date: 2026-08-14
Status: Current local implementation and publication-state map

## Precedence and repository state

This map is subordinate to Revision 3, the dated remote-publication status record, the checkpoint reconciliation records, and newly executed evidence. Historical implementation reports remain provenance and do not override later exact-SHA observations.

The verified lineage is:

```text
8a416bed36c025a478d999c0a99939cdeadca837  legacy origin/develop
  |
2945361038ee63d26304b4279d703c11ed66d14b  Phase-0B checkpoint
  |
9f67e1745ae9ed56bd79237a429863213fc492c9  original Phase-1A checkpoint
  |
d49e9d11116fd59e3f3f38c638dfe63c1bc02924  Phase-1A remediation
  |
51df178bfc886f0102343b602b2653557f1c3b19  published Stage-1 governance checkpoint
  |
6ef362b2324f562420d8f4b6d1a4c3af7305cf83  published documentation-remediation descendant
  |
9db3839b8b4a0e5d222ef5e4c8edd1ef19086091  current published canonical checkpoint
```

`canonical/verified-lineage` is publicly reachable at `9db3839b8b4a0e5d222ef5e4c8edd1ef19086091`. The GitHub default branch remains legacy `main`; branch-protection transition and PR #2 disposition have not been completed. Publication does not establish remote CI reproduction, deployment, external validation, professional approval, physical validation, certification, or production readiness.

## Implemented and evidenced claims

Claims not listed here remain non-claims unless later implementation, tests, gates, and evidence support them.

| Claim | Implementation evidence | Gate or review evidence | Current status |
| --- | --- | --- | --- |
| pnpm monorepo foundation exists | `package.json`, `pnpm-workspace.yaml`, workspace package manifests | `pnpm verify` | Implemented foundation |
| Runtime policy is declared and enforced | `package.json`, `.nvmrc`, `.tool-versions`, `scripts/controls/verify-runtime-version.mjs` | Runtime-policy step in `pnpm verify` | Implemented; Node 24 preferred and Node 22 temporarily supported |
| Canonical contracts define exactly 18 first-class object kinds | `packages/contracts/src/canonical/**` | Contract tests, exact test discovery, Phase-0B review evidence | Implemented Phase-0B foundation |
| Claims, proof obligations, evidence, model fidelity, and readiness remain distinct | `packages/contracts/src/canonical/**`, `packages/contracts/src/rep/**` | Contract and REP tests | Implemented foundation |
| REP v0.1 separates material results from execution evidence | `packages/contracts/src/rep/**`, `packages/sim-core/src/rep/**`, `docs/rep/REP_V0.1.md` | `pnpm rep:replay`, material-result reader, Phase-0B evidence | Implemented local reference protocol |
| Runner and solver identities bind to deterministic source closures | `packages/sim-core/src/rep/sourceImplementationIdentity.ts`, ADR 0005 | REP tests and recorded source manifests | Implemented Phase-0B identity strategy |
| `sandbox-001` replays deterministically | `examples/rep/sandbox-001.replay.json`, REP runner | `pnpm rep:replay` | Verified local replay; historical Windows/Linux material reproduction preserved |
| Core implementation remains domain-neutral | `packages/contracts/src/**`, `packages/sim-core/src/**` | `packages/sim-core/src/boundary.test.ts` | Implemented boundary; tests may use vertical fixtures without making them runtime contracts |
| Clean Water is owned by a vertical adapter | `packages/vertical-clean-water/src/**` | vertical tests, core-boundary test, Clean Water commands | Implemented educational vertical |
| Clean Water simulation is educational level-1 output | `packages/vertical-clean-water/src/cleanWater/**`, `packages/cli/src/commands/simulate.ts`, `docs/simulation/**` | `pnpm simulate:clean-water`, workspace tests | Implemented educational output only |
| Clean Water graph consistency is checked | `packages/vertical-clean-water/src/cleanWater/graphConsistency.ts`, `packages/vertical-clean-water/src/cleanWater/compileCleanWaterInput.ts` | vertical tests and `pnpm simulate:clean-water` | Implemented educational consistency check |
| Clean Water estimate is educational/conceptual output | `packages/estimation/src/**`, `packages/fabrication/src/**`, `packages/cli/src/commands/estimate.ts` | `pnpm estimate:clean-water`, workspace tests | Implemented educational estimate |
| Project validation checks schemas, duplicate IDs, and manifest refs | `packages/cli/src/commands/validate.ts`, `packages/cli/src/refResolver.ts`, `packages/cli/src/refKindValidators.ts` | `pnpm validate:examples`, CLI tests | Implemented foundation |
| API validation modes are explicit and repo-ref access is bounded | `packages/api/src/routes/validate.ts`, `packages/api/src/routes/validateRepoRefs.ts`, API documentation | API tests | Implemented local/foundation behavior, not a production API |
| Phase-1A implements Challenge -> Submission -> Evaluation -> Evidence -> Comparison | `packages/contracts/src/application/phase1a.ts`, `packages/api/src/phase1a/**`, `apps/web/src/phase1a/**`, `apps/web/src/App.tsx` | Phase-1A tests, product-loop reader, checkpoint reconciliation | Implemented local minimal loop |
| Phase-1A exposes explanation, math, model inspection, and evidence inspection | Phase-1A API service and web projection | Phase-1A tests and product-loop evidence | Implemented for `sandbox-001` only |
| Phase-1A comparison preserves fixed/changed input boundaries | `packages/api/src/phase1a/comparison.test.ts`, `packages/api/src/phase1a/service.ts` | comparison tests and adversarial probes | Implemented for supported local evaluator |
| Phase-1A can select, rerun, and compare any two process-local Submissions | `packages/contracts/src/application/phase1a.ts`, `packages/api/src/phase1a/service.ts`, `packages/api/src/server.ts`, `apps/web/src/App.tsx` | API/service tests and 2026-08-14 live local browser smoke | Implemented locally for `sandbox-001`; storage remains non-durable |
| Phase-1A storage is process-local and non-durable | `packages/api/src/storage/localMemoryStorage.ts`, Phase-1A documentation | API tests and product-loop reader | Implemented local storage boundary; not production persistence |
| Audit command checks required files and risky claims | `packages/cli/src/commands/audit.ts`, `packages/cli/src/audit/**` | `pnpm run audit` | Implemented foundation audit |
| Exact test discovery is enforced | `config/intended-tests.json`, `scripts/controls/verify-test-discovery.mjs` | `pnpm test` through `pnpm verify` | Implemented local gate |
| Local evidence writers preserve historical validation records | `scripts/phase-0b/**`, `scripts/phase-1a/**`, evidence documentation | recorded local evidence and currentness checks | Implemented local evidence workflow |
| A manual-only GitHub Actions workflow exists | `.github/workflows/ci.yml`, ADR 0004, `docs/gates/CI_GATE_POLICY.md` | workflow inspection | Configured for manual dispatch only; no remote CI claim |
| Verified lineage is publicly reachable | `docs/source-of-truth/GOSP_CANONICAL_PUBLICATION_AND_PHASE_0C_STATUS_2026-08-14.md` | exact detached verification, non-force fast-forward, and current read-only remote observation | Published at `9db3839...`; authority transition incomplete |
| Branch-protection and default-branch controls are specified | ADR 0006 and repository-control documents | local policy review | Policy prepared; remote configuration not established |
| Phase-0C historical evidence is preserved | `docs/phase-0c/**` | Gate A tracker and verified first-wave Sent Mail | Five discovery messages were sent; no human feedback or Gate-A evidence; all further outreach closed by owner direction |

## Explicit non-claims and unresolved gates

- The application is not a complete product UI or CAD editor.
- `sandbox-001` is synthetic and does not establish physical validity.
- Local replay is not independent external reproduction.
- Clean Water outputs are educational and do not establish potable-water validation.
- No professional engineering, certification, or regulatory approval is established.
- No production authentication, tenancy, durable storage, deployment, or manufacturing readiness is established.
- No manufacturer-verification process, public leaderboard, marketplace, or imported HouseSim implementation exists.
- Phase-0C Gate A is not met: recorded organization confirmations and paid-pilot commitments remain zero.
- External outreach, replies, follow-ups, scheduling, and other project communications are prohibited by current owner direction; Phase-0C materials are historical/internal only.

## Maintenance and evidence qualifications

- The complete and production-only dependency audits currently report zero advisories after the 2026-08-14 patch/minor development-tool refresh. This is a package-audit result, not a general security certification.
- The published canonical ref remains exact commit `9db3839...`; the post-action reconciliation and selectable-comparison increment are local-only in the descendant commit containing this map and have not been published remotely.
- Reconciliation review packages are preserved on a separate local-only checkpoint and are intentionally excluded from this privacy-safe publication candidate. A raw batch-state artifact containing private Codex attachment paths also remains local-only. Neither local preservation nor this candidate establishes an external immutable archive.
