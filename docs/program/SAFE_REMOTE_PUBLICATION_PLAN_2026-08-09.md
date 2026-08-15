# Safe Remote Publication Plan

Date: 2026-08-09 (America/New_York)

## Current-status overlay — 2026-08-14

This is a preserved historical Stage-1 plan. Its exact new-ref publication command was subsequently authorized and executed for `51df178bfc886f0102343b602b2653557f1c3b19`, and the resulting remote object was verified. Do not execute the Stage-1 command below again.

The remote branch `canonical/verified-lineage` was subsequently advanced by an owner-authorized, one-ref, non-force fast-forward from `51df178...` to exact commit `9db3839b8b4a0e5d222ef5e4c8edd1ef19086091`. Exact post-publication checks found no unexpected ref change or automation. See the [2026-08-14 canonical publication status](../source-of-truth/GOSP_CANONICAL_PUBLICATION_AND_PHASE_0C_STATUS_2026-08-14.md). Default-branch, protection, and PR #2 actions remain incomplete and separately gated.

The original plan is retained below as historical execution and rollback provenance.

Original status: local SHA-specific plan for Owner Gate #2. No command in this document had been executed when the plan was issued unless explicitly listed as a completed preflight observation.

## Exact identities

```text
publication_candidate_sha       51df178bfc886f0102343b602b2653557f1c3b19
publication_candidate_tree      a02a0e22ad64608155d3ce7548c167353ce00df1
publication_candidate_parent    d49e9d11116fd59e3f3f38c638dfe63c1bc02924
current_remote_main_sha          6a7af8e1763fdbae7cce235b66435593424a5716
current_remote_develop_sha       8a416bed36c025a478d999c0a99939cdeadca837
current_remote_rebaseline_sha    e05ae283a1605c17efd9d6575cb8df642a098a34
current_remote_ai_scaffold_sha   fe9b5045bd01dcfa53b870d29a273a5aa2d6f9ff
first_publication_ref            refs/heads/canonical/verified-lineage
```

`canonical/verified-lineage` is selected because it describes durable authority without tying the public branch name to a temporary reconciliation issue or a single product phase. The candidate `reconcile/phase-1a-authoritative` was rejected as too transitional for a possible future default branch.

This plan is necessarily outside the candidate commit: a commit cannot contain its own SHA without a self-reference paradox. The exact plan identity should be retained as Owner Gate #2 evidence; publication content is the exact committed governance candidate above.

## Stage 0 — preflight

Completed observations as of this plan:

- the candidate is a direct child of `d49e9d1…` and preserves Phase-0B/Phase-1A exactly;
- an exact detached checkout of `51df178…` was clean before and after verification;
- `pnpm install --offline --frozen-lockfile` and the full `pnpm verify` completed with exit code 0 in that checkout; the run discovered 31/31 intended test files, passed 139 tests, returned foundation audit `GO` with 23 pass and 0 warn/fail, and reproduced both material-result hash pairs;
- the protected implementation-path diff from `d49e9d1…` to the candidate is empty;
- fresh `git ls-remote --heads origin` returned the four remote SHAs above;
- `refs/heads/canonical/verified-lineage` does not currently exist;
- the candidate contains only manual `workflow_dispatch` Actions configuration and no Dependabot config;
- no remote write has occurred.

Immediately before any authorized push, execute from the canonical repository or an exact clean detached worktree:

```powershell
git rev-parse HEAD
git status --porcelain=v1 --untracked-files=all
git show --no-patch --format='%H%n%P%n%T%n%s' 51df178bfc886f0102343b602b2653557f1c3b19
git cat-file -t 2945361038ee63d26304b4279d703c11ed66d14b
git cat-file -t 9f67e1745ae9ed56bd79237a429863213fc492c9
git cat-file -t d49e9d11116fd59e3f3f38c638dfe63c1bc02924
git ls-remote --heads origin
git ls-remote --heads origin refs/heads/canonical/verified-lineage
```

Required results:

- exact candidate SHA/tree/parent match this plan;
- the publication worktree is clean;
- all three immutable checkpoints are commit objects;
- existing remote heads still match this plan;
- the publication ref remains absent.

If any value differs, stop. Refresh the lineage/publication analysis; do not “fix” the mismatch with force, rebase, or an updated generic command.

Record the UTC push-attempt timestamp and the current Actions run IDs immediately before Stage 1. Do not dispatch a workflow.

## Stage 1 — first publication

Owner action point: Owner Gate #2 must explicitly authorize this exact new-ref creation.

Exact command:

```powershell
git push --porcelain origin 51df178bfc886f0102343b602b2653557f1c3b19:refs/heads/canonical/verified-lineage
```

Properties:

- creates one new branch;
- contains no force flag;
- does not update `main`, `develop`, PR #2, tags, default branch, protection, or Actions;
- cannot merge the unrelated public-main history;
- pushes the exact local commit, not a mutable local branch name.

Expected transport result: a new branch `canonical/verified-lineage` at exactly `51df178…`.

Immediate validation:

```powershell
git ls-remote --heads origin refs/heads/canonical/verified-lineage
```

Expected output SHA: `51df178bfc886f0102343b602b2653557f1c3b19`.

Failure behavior:

- authentication/rejection/no ref created: preserve output and stop; retry only after diagnosing the unchanged remote;
- ref unexpectedly already exists: stop; do not force-update it;
- ref created at a different SHA: stop, record the observed ref, and request explicit rollback authority; do not delete or overwrite automatically;
- any existing ref changes: stop and treat as a repository-integrity incident.

## Stage 2 — remote verification

Perform only read operations after Stage 1:

```powershell
git ls-remote --heads origin
git fetch --no-tags origin canonical/verified-lineage
git rev-parse FETCH_HEAD
git diff --exit-code 51df178bfc886f0102343b602b2653557f1c3b19 FETCH_HEAD
gh api 'repos/Mister-Nerdeus/GOSP-Forge/actions/runs?branch=canonical%2Fverified-lineage&per_page=100'
gh pr list --repo Mister-Nerdeus/GOSP-Forge --state open --json number,title,headRefName,baseRefName,author,createdAt
gh api repos/Mister-Nerdeus/GOSP-Forge --jq '{default_branch,has_pages}'
gh api repos/Mister-Nerdeus/GOSP-Forge/releases --paginate
```

Required results:

- fetched SHA and tree equal the candidate exactly;
- no Actions run was created for the new branch/push timestamp;
- no Dependabot/bot PR or repository change appeared;
- branch contents include accepted R3, ADR 0006, reconciliation controls, and manual-only workflow;
- default branch remains `main`;
- old four refs remain at their recorded SHAs;
- PR #2 remains unchanged/open until the later transition action;
- Pages/releases/deployments remain absent.

If unexpected automation runs, disable/cancel it only with separate authority, preserve logs/state, classify the automation source, and mark publication unsafe. Do not continue to authority transition.

## Stage 3 — authority transition

These are separate remote writes. Owner Gate #2 may authorize them individually or defer them after first-publication inspection.

Recommended order:

1. Configure Tier-1 protection for `canonical/verified-lineage`: block force pushes/deletion, require conversation resolution, require PR only if the solo owner retains a workable merge path, require zero approvals, and require no status checks.
2. Verify the owner retains a documented update/recovery path without executing Actions.
3. Change the GitHub default branch from `main` to `canonical/verified-lineage`.
4. Verify the new default and confirm `main` itself remains unchanged at `6a7af8e…`; this unchanged branch is the immediate legacy-main preservation ref and rollback target.
5. Add corresponding no-force/no-delete preservation for historical `main`, `develop`, and `baseline/phase-0-rebaseline` where practical.
6. Close PR #2 as superseded with a comment linking its exact head, RR-208 integration map, and the new authoritative SHA. Do not delete its head branch.

Possible default-branch API action, only if explicitly authorized:

```powershell
gh api --method PATCH repos/Mister-Nerdeus/GOSP-Forge -f default_branch='canonical/verified-lineage'
```

Validation:

```powershell
gh api repos/Mister-Nerdeus/GOSP-Forge --jq '{default_branch}'
git ls-remote --heads origin
```

Expected default: `canonical/verified-lineage`; all recorded legacy SHAs unchanged.

Rollback for default transition: set the default branch back to `main`, which remains at `6a7af8e…`. Protection-rule rollback changes only the new rule/settings and never force-updates a ref. PR closure is reversible by reopening, but the supersession comment remains useful provenance.

## Stage 4 — cleanup

No remote branch deletion is part of the proposed publication authorization.

Any future deletion requires:

- verified authority transition and rollback path;
- exact backup/preservation refs where required;
- a repeated unique-work check;
- no open PR dependency;
- a separate owner authorization naming the exact ref and SHA.

`develop` and the three immutable checkpoints are `do-not-delete` evidence lineage. `main` and `baseline/phase-0-rebaseline` remain historical. `ai-001-verification-scaffold` is eligible only for later review after legacy main is durably preserved.

## Dry-run status

`git push --dry-run` was **NOT RUN — no remote publication transport was authorized before Owner Gate #2**. If the owner authorizes a dry run separately, use the same exact source/destination refspec as Stage 1 and recheck remote heads immediately afterward.
