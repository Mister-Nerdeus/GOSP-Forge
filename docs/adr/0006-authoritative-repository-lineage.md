# ADR 0006: Authoritative Repository Lineage

- Status: Accepted — Option A selected at Owner Gate #1
- Date: 2026-08-09
- Decision owner: repository owner
- Evidence: `docs/program/GOSP_REPOSITORY_LINEAGE_AUDIT_2026-08-09.md`

## Context

The verified local line and the current public-main line are unrelated Git histories.

The verified line is:

```text
8a416bed36c025a478d999c0a99939cdeadca837  origin/develop
  |
2945361038ee63d26304b4279d703c11ed66d14b  Phase-0B checkpoint
  |
9f67e1745ae9ed56bd79237a429863213fc492c9  Phase-1A checkpoint
  |
d49e9d11116fd59e3f3f38c638dfe63c1bc02924  verified remediation
```

`origin/main` is `6a7af8e1763fdbae7cce235b66435593424a5716` on root `62d01a58234a90fcbedcbd728895fc5d157c617e`. The PR #2/rebaseline head `e05ae283a1605c17efd9d6575cb8df642a098a34` is three commits after that main SHA. Neither has a merge base with Phase-0B.

The local checkpoints are exact evidence anchors. Rebase, cherry-pick, patch replay, or clean-history reconstruction would change their commit IDs and require evidence re-baselining. The remote histories also contain unique material that must remain inspectable and later receive path-level disposition.

## Decision criteria and scoring

Scores are 1 (poor) through 5 (strong). For “non-destructive remote action,” a higher score means less destructive. Scores guide the recommendation; they are not proof of equivalence.

| Criterion | A: new authoritative branch | B: replace main after backup | C: transplant onto main | D: merge unrelated histories | E: new clean root |
|---|---:|---:|---:|---:|---:|
| Exact verified SHA preservation | 5 | 5 | 1 | 5 | 1 |
| Evidence continuity | 5 | 5 | 1 | 4 | 1 |
| Auditability | 5 | 4 | 3 | 2 | 3 |
| Historical honesty | 5 | 4 | 3 | 2 | 3 |
| Non-destructive remote action | 5 | 1 | 3 | 2 | 2 |
| Preserve unique remote work | 5 | 5 | 4 | 4 | 3 |
| Future contributor clarity | 5 | 3 | 4 | 2 | 4 |
| PR workflow implications | 4 | 2 | 4 | 2 | 3 |
| Branch-protection implications | 4 | 1 | 3 | 2 | 3 |
| Rollback simplicity | 5 | 4 | 3 | 2 | 3 |
| **Total / 50** | **48** | **34** | **29** | **27** | **26** |

## Options

### Option A — publish the verified local lineage as a new authoritative remote branch

This preserves `2945361…`, `9f67e17…`, and `d49e9d1…` exactly. The old main, develop, AI scaffold, and Phase-0 rebaseline refs remain historical evidence. After the unique-work disposition is complete, the owner can make the new branch the default and apply protection rules to it.

GitHub cannot open an ordinary merge PR between histories with no merge base without explicitly joining or transplanting them. Under this option that is a truthful constraint, not a defect: publication of the verified branch and later default-branch selection are repository-administration operations, while useful old-line content is ported only through reviewed, provenance-recorded follow-up commits.

Consequences:

- exact checkpoint evidence remains valid;
- no unrelated-history merge pretends the roots share ancestry;
- legacy refs provide rollback and inspection;
- PR #2 cannot simply be merged into the new line and instead receives the RR-208 supersession/preservation map;
- the remote will temporarily show multiple intentionally distinct historical lines;
- default-branch settings, open PR targets, branch protection, and contributor guidance must be updated later with explicit remote authorization.

### Option B — replace remote main with the verified local line after preserving legacy main

This also preserves verified checkpoint SHAs, but changes what `main` means and likely requires a non-fast-forward ref update or equivalent administrative operation. Branch protection may block it. A mistake affects the public default ref directly, so named backup refs and SHA-specific rollback instructions would be mandatory.

This is viable only if the owner requires the conventional `main` name immediately and accepts the larger destructive-action surface. It offers little evidentiary advantage over Option A.

### Option C — transplant verified source onto main ancestry

Cherry-picking, patch replay, or rebuilding commits would yield conventional ancestry from current main, but would not preserve either verified checkpoint SHA. All commit-bound evidence, manifests, currentness records, and claims would need regeneration against new commits, followed by independent source-equivalence review. This weakens the strongest existing evidence without an ancestry-driven technical need.

### Option D — merge unrelated histories

An unrelated-history merge can retain all existing commit objects, but it creates a new artificial relationship and a very large reconciliation surface. The merge commit would be easy to misread as an ordinary integration, complicate blame and bisect, and expose hundreds of conflicting/superseded paths. GitHub PR and review behavior around such a merge does not solve the provenance problem. This option is high risk and not recommended.

### Option E — create a new root / clean history

A clean root could present a curated tree, but sacrifices both histories' continuity and invalidates exact checkpoint evidence. It would require the strongest provenance migration and evidence regeneration, while legacy refs would still be necessary to avoid information loss. The lineage audit found no irreparable corruption that justifies this cost.

## Decision

**AUTHORITATIVE LINEAGE SELECTED: OPTION A — publish the verified local lineage as a new authoritative remote branch.**

Exact reasons:

1. It alone maximizes exact-SHA preservation, evidence continuity, historical honesty, non-destructive action, unique-work preservation, and rollback simplicity together.
2. Phase-0B is a direct child of current `origin/develop`; its local history is not a rewritten approximation.
3. The unrelated remote main and PR #2 histories can remain intact and named, without implying they were merged into the evidence line.
4. Unique old-line material can be evaluated path by path in RR-208 and ported only where it remains useful.
5. Default-branch and protection changes can be staged after local controls are complete and only with separate remote authorization.

## Selected implementation direction

The future authoritative history will be the exact local line ending at the eventual reconciliation/control candidate descended from `d49e9d11116fd59e3f3f38c638dfe63c1bc02924`. Publication will use a new remote branch name chosen in RR-209. Existing public refs will first be recorded and preserved; no unrelated-history merge will occur. Changing the default branch remains a separate explicitly authorized remote action.

## Owner Gate #1 record

The repository owner explicitly selected Option A on 2026-08-09 after reviewing the RR-201R verification result, RR-205 inventory, RR-206 lineage proof, and this option analysis. The owner authorized local continuation through RR-214 but did not authorize any remote write.

The preserved immutable commits are:

- `2945361038ee63d26304b4279d703c11ed66d14b` — Phase-0B;
- `9f67e1745ae9ed56bd79237a429863213fc492c9` — original Phase-1A checkpoint with visible remediation provenance;
- `d49e9d11116fd59e3f3f38c638dfe63c1bc02924` — verified Phase-1A remediation descendant.

No rebase, cherry-pick, squash, amend, graft, unrelated-history merge, remote ref change, default-branch change, or protection change is authorized by this decision. Remote publication remains gated by RR-214 and Owner Gate #2.
