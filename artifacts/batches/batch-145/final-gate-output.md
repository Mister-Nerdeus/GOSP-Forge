# Batch #145 Final Gate Output

Date: 2026-05-15
Branch: `develop`

## Initial Full Gate Pass

Commit: `c1eebba69640f4f7eba6542fba753184bfd40a35`

| Command | Result | Evidence |
| --- | --- | --- |
| `pnpm lint` | PASS | ESLint completed with exit code 0. |
| `pnpm -r build` | PASS | Workspace packages and web app built successfully. |
| `pnpm -r typecheck` | PASS | TypeScript no-emit checks completed across workspace packages. |
| `pnpm -r test` | PASS | Workspace tests passed; web smoke test found 1 test and passed. |
| `pnpm validate:examples` | PASS | Clean Water project validation returned `ok: true`, `validationMode: repo-refs`, `declared: 20`, `resolved: 20`, no errors. |
| `pnpm simulate:clean-water` | PASS | Simulation returned `ok: true`, no defaulted inputs, no unknown inputs, no graph warnings, medium confidence. |
| `pnpm estimate:clean-water` | PASS | Estimate returned `ok: true`; quality report lists `zeroCostLineIds: ["filter-housing"]`, no defaulted quantity IDs, education-mode warning gate only. |
| `pnpm audit` | PASS | Dependency audit reported no known vulnerabilities. |
| `node scripts/controls/write-local-validation.mjs` | PASS | Wrote ignored local validation artifact for SHA `c1eebba69640f4f7eba6542fba753184bfd40a35`. |
| `node scripts/controls/sanitize-local-validation.mjs` | PASS | Wrote ignored sanitized validation artifact for SHA `c1eebba69640f4f7eba6542fba753184bfd40a35`. |
| `node scripts/controls/verify-local-validation-current.mjs` | PASS | Verified artifact result `PASS` against `HEAD`. |

## Final Tracked-Artifact Gate Pass

After adding `docs/audits/BATCH_131_145_FINAL_AUDIT.md`, `artifacts/batches/batch-145/final-gate-output.md`, `final-known-gaps.md`, and `final-handoff.md`, the full gate set was rerun before the final commit.

| Command | Result | Evidence |
| --- | --- | --- |
| `pnpm lint` | PASS | ESLint completed with exit code 0. |
| `pnpm -r build` | PASS | Workspace packages and web app built successfully. |
| `pnpm -r typecheck` | PASS | TypeScript no-emit checks completed across workspace packages. |
| `pnpm -r test` | PASS | Workspace tests passed; web smoke test found 1 test and passed. |
| `pnpm validate:examples` | PASS | Clean Water project validation returned `ok: true`, `validationMode: repo-refs`, `declared: 20`, `resolved: 20`, no errors. |
| `pnpm simulate:clean-water` | PASS | Simulation returned `ok: true`, no defaulted inputs, no unknown inputs, no graph warnings, medium confidence. |
| `pnpm estimate:clean-water` | PASS | Estimate returned `ok: true`; quality report lists `zeroCostLineIds: ["filter-housing"]`, no defaulted quantity IDs, education-mode warning gate only. |
| `pnpm audit` | PASS | Dependency audit reported no known vulnerabilities. |
| `node scripts/controls/write-local-validation.mjs` | PASS | Wrote ignored local validation artifact for SHA `c1eebba69640f4f7eba6542fba753184bfd40a35`. |
| `node scripts/controls/sanitize-local-validation.mjs` | PASS | Wrote ignored sanitized validation artifact for SHA `c1eebba69640f4f7eba6542fba753184bfd40a35`. |
| `node scripts/controls/verify-local-validation-current.mjs` | PASS | Verified artifact result `PASS` against `HEAD`. |

## Post-Commit Validation Requirement

Because the final commit changes `HEAD`, local validation evidence must be regenerated after the final commit and before push. The ignored local artifact, not this markdown file, is the currentness source of truth checked by `verify-local-validation-current.mjs`.
