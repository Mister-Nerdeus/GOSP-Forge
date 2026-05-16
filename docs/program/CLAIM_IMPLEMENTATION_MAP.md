# Claim Implementation Map

Date: 2026-05-15

This map ties repository claims to committed implementation evidence. Claims not listed here remain non-claims unless a later issue adds implementation, tests, gates, and closeout evidence.

| Claim | Implementation evidence | Gate or review evidence | Status |
| --- | --- | --- | --- |
| pnpm monorepo foundation exists | `package.json`, `pnpm-workspace.yaml`, `packages/*/package.json`, `apps/web/package.json` | `pnpm -r build`, `pnpm -r typecheck`, `pnpm -r test` | Implemented foundation |
| Runtime policy is declared and verified | `package.json`, `.nvmrc`, `.tool-versions`, `scripts/controls/verify-runtime-version.mjs`, `docs/setup/RUNTIME_POLICY.md` | `node scripts/controls/verify-runtime-version.mjs` through local validation | Implemented foundation |
| Contracts package defines foundation schemas | `packages/contracts/src/**`, `docs/contracts/*.md` | `pnpm --filter @gosp/contracts test`, `pnpm -r typecheck` | Implemented foundation |
| Project validation checks schemas, duplicate IDs, and manifest refs | `packages/cli/src/commands/validate.ts`, `packages/cli/src/refResolver.ts`, `packages/cli/src/refKindValidators.ts`, `examples/projects/*.json`, `docs/cli/VALIDATION.md` | `pnpm validate:examples`, `pnpm --filter @gosp/cli test` | Implemented foundation |
| Validation results use structured diagnostics | `packages/contracts/src/validation/validationResult.ts`, `docs/contracts/VALIDATION_RESULT.md`, `packages/api/src/routes/validate.ts`, `packages/cli/src/commands/validate.ts` | `pnpm --filter @gosp/contracts test`, `pnpm --filter @gosp/api test`, `pnpm --filter @gosp/cli test` | Implemented foundation |
| Clean Water examples are manifest-driven fixtures | `examples/projects/automated-water-filter.project-v2.json`, `examples/modules/**`, `examples/products/**`, `examples/graphs/**`, `examples/problems/clean-water.problem.json` | `pnpm validate:examples` | Implemented foundation |
| Clean Water simulation is educational level-1 output | `packages/sim-core/src/cleanWater/**`, `packages/cli/src/commands/simulate.ts`, `docs/simulation/**` | `pnpm simulate:clean-water`, `pnpm -r test` | Implemented foundation |
| Clean Water graph consistency is checked at foundation level | `packages/sim-core/src/cleanWater/graphConsistency.ts`, `packages/sim-core/src/cleanWater/compileCleanWaterInput.ts`, `examples/graphs/*.json`, `docs/simulation/SIMULATION_CONFIDENCE_SUMMARY.md` | `pnpm --filter @gosp/sim-core test`, `pnpm simulate:clean-water` | Implemented educational consistency check |
| Clean Water estimate is educational/conceptual output | `packages/estimation/src/**`, `packages/fabrication/src/**`, `packages/cli/src/commands/estimate.ts`, `docs/contracts/PRICING_CONTRACTS.md` | `pnpm estimate:clean-water`, `pnpm -r test` | Implemented foundation |
| Estimate placeholders identify affected lines | `packages/estimation/src/estimateQualityReport.ts`, `packages/contracts/src/pricing/costEstimate.ts`, `docs/contracts/ESTIMATE_QUALITY_REPORT.md`, `artifacts/batches/batch-137/remaining-estimate-placeholders.md` | `pnpm --filter @gosp/estimation test`, `pnpm estimate:clean-water` | Implemented foundation; `filter-housing` zero parent line intentionally justified |
| Audit command checks required foundation files and risky claims | `packages/cli/src/commands/audit.ts`, `packages/cli/src/audit/**`, `docs/gates/NO_PROFESSIONAL_CLAIM_GATE.md` | `pnpm run audit` | Implemented foundation |
| API provides foundation health/version and validation route behavior | `packages/api/src/server.ts`, `packages/api/src/routes/validate.ts`, `packages/api/src/**/*.test.ts`, `docs/api/*.md` | `pnpm --filter @gosp/api test`, `pnpm -r test` | Implemented foundation, not production API |
| API validation modes are explicit | `packages/api/src/routes/validate.ts`, `packages/api/src/routes/validateRepoRefs.ts`, `docs/api/VALIDATION_ROUTE.md`, `docs/api/API_NON_CLAIMS.md`, `README.md` | `pnpm --filter @gosp/api test`, issue #131 closeout | Schema-only default; repo-ref mode local/dev or internal operator override only |
| Read-only builder UI shell exists | `apps/web/src/**`, `docs/product/BUILDER_UI_SHELL.md`, `docs/product/FOUNDATION_UI_INSPECTION.md` | `pnpm --filter @gosp/web build`, `pnpm --filter @gosp/web typecheck`, local Vite smoke evidence when UI changes | Implemented shell only |
| Local validation evidence is generated outside git and checked for currentness | `scripts/controls/write-local-validation.mjs`, `scripts/controls/verify-local-validation-current.mjs`, `artifacts/controls/local-validation/README.md`, `docs/gates/TRUTH_GATE_LOCAL_VALIDATION.md` | writer plus verifier commands | Implemented foundation |
| Sanitized validation evidence is safe for PR/release attachment | `scripts/controls/sanitize-local-validation.mjs`, `artifacts/controls/local-validation/README.md`, `docs/gates/TRUTH_GATE_LOCAL_VALIDATION.md`, `artifacts/batches/batch-134/sanitized-validation-sample.json` | sanitizer command plus issue #134 sample review | Implemented non-secret evidence |
| CI runs foundation proof commands | `.github/workflows/ci.yml`, `docs/gates/CI_GATE_POLICY.md` | CI config review plus local gates | Implemented foundation |
| CI uploads non-secret evidence artifacts | `.github/workflows/ci.yml`, `scripts/controls/write-ci-evidence.mjs`, `docs/gates/CI_GATE_POLICY.md` | `node scripts/controls/write-ci-evidence.mjs`, CI artifact upload configuration | Implemented workflow evidence only |
| Release evidence command gathers foundation proof | `packages/cli/src/commands/releaseEvidence.ts`, `packages/cli/src/commands/releaseEvidence.test.ts`, `docs/cli/RELEASE_EVIDENCE.md`, `artifacts/batches/batch-141/release-evidence-output.json` | `pnpm --filter @gosp/cli test`, `pnpm --filter @gosp/cli start release-evidence foundation` | Implemented evidence command; not release approval |
| Release promotion requires current evidence and audit GO | `docs/program/FOUNDATION_RELEASE_CHECKLIST.md`, `docs/program/DEVELOP_TO_MAIN_FOUNDATION_PROMOTION.md`, `docs/program/ROLLBACK_RECORD_TEMPLATE.md` | final audit and local validation currentness | Policy implemented |
| Branch protection expectations are recommended | `docs/program/BRANCH_PROTECTION_RECOMMENDATIONS.md`, `docs/program/FOUNDATION_RELEASE_CHECKLIST.md`, `docs/program/DEVELOP_TO_MAIN_FOUNDATION_PROMOTION.md` | `pnpm audit`, manual GitHub settings verification before any configured-claim | Recommendation only; configuration not claimed |

## Explicit Non-Claims

- No complete product UI.
- No CAD editor.
- No professional engineering workflow.
- No potable-water certification or validation.
- No production manufacturing approval.
- No manufacturer verification process.
- No public leaderboard.
- No production storage.
- No imported legacy code.
- No production deployment readiness.

These non-claims must remain visible in README, audits, UI docs, API docs, release docs, and gate docs until future implementation and review support a narrower claim.

## Hardening Batch Evidence

Evidence now covers API validation modes, structured validation diagnostics, refGroups canonical refs, graph consistency, simulation confidence summaries, estimate placeholder ID reporting, sanitized validation artifacts, CI artifacts, release evidence, branch protection recommendations, and UI smoke/non-claim checks.
