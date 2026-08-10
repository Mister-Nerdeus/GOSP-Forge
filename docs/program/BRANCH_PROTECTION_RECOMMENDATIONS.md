# Branch Protection Recommendations

> Historical foundation recommendation. The tiered, solo-owner-compatible policy in `BRANCH_PROTECTION_AND_REPOSITORY_CONTROL_POLICY_2026-08-09.md` supersedes this file for the selected Option A lineage. In particular, automatic status checks remain prohibited while local-only policy is active.

These are recommended GitHub branch protection settings for foundation promotion. They are not a statement that branch protection is currently configured; repository settings must be verified in GitHub before making that claim.

These recommendations are inactive while the local-only/no-GitHub-Actions policy is in force. Do not configure required Actions checks or restore automatic workflow triggers without explicit user authorization and a new policy review.

## Recommended Branch Rules

| Branch | Recommended PR rule | Recommended status checks | Direct push policy | Notes |
| --- | --- | --- | --- | --- |
| `develop` | Require a pull request before merge. | CI workflow `verify` job must pass. | Disable direct pushes except emergency maintainer break-glass. | Development integration branch for foundation work. |
| `staging` | Require a pull request and at least one reviewer. | CI workflow `verify` job, validation examples, Clean Water simulation, Clean Water estimate, dependency audit, and foundation audit must pass. | Disable direct pushes. | Optional promotion rehearsal branch. |
| `main` | Require a pull request, at least one reviewer, and resolved conversations before merge. | CI workflow `verify` job, release evidence command, final audit, and local validation currentness evidence must be reviewed. | Disable direct pushes. | Foundation handoff branch; no production-readiness claim implied. |

## Required CI Checks To Recommend

- `node scripts/controls/verify-runtime-version.mjs`
- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm -r build`
- `pnpm -r typecheck`
- `pnpm -r test`
- `pnpm validate:examples`
- `pnpm simulate:clean-water`
- `pnpm estimate:clean-water`
- `pnpm audit`
- `pnpm run audit`
- `node scripts/controls/write-ci-evidence.mjs`

## Manual Verification Checklist

Before claiming branch protection is configured, verify in GitHub repository settings:

- Branch protection rule exists for `develop`, `staging` if used, and `main`.
- Pull requests are required before merge.
- Required status checks include the CI `verify` job.
- Required reviews are enabled for `staging` and `main`.
- Stale approvals are dismissed when new commits are pushed, if available for the repository plan.
- Conversation resolution is required before merge, if available.
- Force pushes are disabled.
- Deletions are disabled.
- Direct pushes to `main` are blocked for normal contributors.
- Any admin bypass or emergency bypass process is documented outside release evidence.

## Non-Claims

This document recommends branch protection. It does not prove GitHub branch protection is configured, and it does not create production, professional, potable-water, manufacturing, storage, marketplace, leaderboard, or deployment-readiness claims.
