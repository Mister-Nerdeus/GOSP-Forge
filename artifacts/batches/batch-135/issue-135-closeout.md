# Issue 135 Closeout

Date: 2026-05-15

## Pre-Change Audit

- `.github/workflows/ci.yml` uploaded artifacts, but it generated local-validation evidence in CI with `write-local-validation.mjs`.
- `docs/gates/CI_GATE_POLICY.md` said CI did not write local validation artifacts, which conflicted with the workflow.
- `scripts/controls/write-ci-evidence.mjs` did not exist.

## Resolution

- Added `scripts/controls/write-ci-evidence.mjs`.
- The script writes non-secret CI evidence under `artifacts/ci/`:
  - `runtime-proof.json`
  - `validation-output.json`
  - `simulate-output-summary.json`
  - `estimate-quality-report.json`
  - `audit-output.json`
  - `ci-evidence-summary.json`
- Updated CI to run the CI evidence writer and upload `artifacts/ci/` plus batch markdown artifacts through `actions/upload-artifact`.
- Updated CI policy docs to explain where artifacts are found and preserve local-validation separation.

## Gates

- `node scripts/controls/write-ci-evidence.mjs` PASS
- `pnpm lint` PASS
- `pnpm -r test` PASS
- `pnpm validate:examples` PASS
- `pnpm simulate:clean-water` PASS
- `pnpm estimate:clean-water` PASS
- `pnpm audit` PASS

## Code Review

Reviewed workflow, script, docs, and generated local `artifacts/ci/` output. No P0/P1 findings. Generated `artifacts/ci/` files were removed from the worktree before commit; CI uploads them as workflow artifacts and does not commit them.

## Boundary

CI artifact upload is non-secret evidence only. It does not create production, professional, potable-water, manufacturing, storage, hosting, marketplace, leaderboard, or release-approval claims.
