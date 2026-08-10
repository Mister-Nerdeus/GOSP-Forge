# GOSP Repository Lineage Audit

Date: 2026-08-09 (America/New_York)

Status: completed read-only ancestry audit. No lineage migration is authorized by this document.

## Ref freshness and inventory

One explicitly authorized remote read/local-ref update was executed:

```text
git fetch --no-tags origin
exit 0
```

The fetch created current remote-tracking refs for `origin/main`, `origin/baseline/phase-0-rebaseline`, and `origin/ai-001-verification-scaffold`. It did not pull, merge, checkout, push, or write remotely.

| Ref | SHA | Upstream / tracking | Root | Parent(s) | Tree | Era / role |
|---|---|---|---|---|---|---|
| local `develop` | `d49e9d11116fd59e3f3f38c638dfe63c1bc02924` | `origin/develop`; ahead 3 | `b9bbce801a4b766392215bbaf6081b97ed917bd6` | `9f67e1745ae9ed56bd79237a429863213fc492c9` | `db8c2e049e02960a53aea1c023f748d07ce6063b` | Aug. 9 remediation of verified Phase-1A candidate |
| Phase-1A checkpoint | `9f67e1745ae9ed56bd79237a429863213fc492c9` | local commit | `b9bbce8…` | `2945361038ee63d26304b4279d703c11ed66d14b` | `3330eb286f5e5a0fb15247da6312327e613bb612` | Aug. 9 challenge/evaluation/evidence loop; immutable checkpoint |
| Phase-0B checkpoint | `2945361038ee63d26304b4279d703c11ed66d14b` | local commit | `b9bbce8…` | `8a416bed36c025a478d999c0a99939cdeadca837` | `652098be6d0865ae23b5d3da9629ee169d1037d7` | Aug. 7 canonical REP/reproducibility baseline; immutable checkpoint |
| `origin/develop` | `8a416bed36c025a478d999c0a99939cdeadca837` | remote-tracking ref | `b9bbce8…` | `c1eebba69640f4f7eba6542fba753184bfd40a35` | `eb1122aaf6c988ec12896f733d2f591f14bbd359` | May 15 issue-145 foundation handoff; exact parent of Phase-0B |
| local `staging` | `b9bbce801a4b766392215bbaf6081b97ed917bd6` | none | itself | none | `af1e9267cd8021692a4a4010e3138ea5809a9f0f` | May 8 root of develop/Phase-0B lineage; preserved and unmodified |
| `origin/main` | `6a7af8e1763fdbae7cce235b66435593424a5716` | remote default (`origin/HEAD`) | `62d01a58234a90fcbedcbd728895fc5d157c617e` | `fe9b5045bd01dcfa53b870d29a273a5aa2d6f9ff` | `be4a67364399a6103a416b037c1d6eaf4ffa0404` | June 9 starter HouseSim/tooling line |
| `origin/ai-001-verification-scaffold` | `fe9b5045bd01dcfa53b870d29a273a5aa2d6f9ff` | remote-tracking ref | `62d01a…` | `e5f094701fcb10be7c5c68ba27cf9f7875074dac` | `42817836aa7ce63a8e362ce645bc8de6dc41845b` | June 9 verification scaffold; direct ancestor of main |
| `origin/baseline/phase-0-rebaseline` | `e05ae283a1605c17efd9d6575cb8df642a098a34` | remote-tracking ref; PR #2 line in the work order | `62d01a…` | `5efb02382e278ee2d04ec167b87e8649fa5cd578` | `4ba880efaec0acb7a1e9a6751fab964188f53a31` | Aug. 6 alternative Phase-0 rebaseline, three commits after main |

There is no local `main` or local `baseline/phase-0-rebaseline` branch; conclusions use the freshly fetched `origin/*` refs. Branch names were not treated as ancestry evidence.

## Proven ancestry

| Pair | Merge base | Left/right unique commits |
|---|---|---|
| `origin/main...origin/baseline/phase-0-rebaseline` | `6a7af8e1763fdbae7cce235b66435593424a5716` | 0 / 3 |
| `origin/main...origin/develop` | none (merge-base exit 1) | 16 / 70 |
| `origin/baseline/phase-0-rebaseline...origin/develop` | none (exit 1) | 19 / 70 |
| `2945361…...origin/main` | none (exit 1) | 71 / 16 |
| `2945361…...origin/baseline/phase-0-rebaseline` | none (exit 1) | 71 / 19 |
| `2945361…...origin/develop` | `8a416bed36c025a478d999c0a99939cdeadca837` | 1 / 0 |
| `origin/ai-001-verification-scaffold...2945361…` | none (exit 1) | 15 / 71 |

The raw commit objects prove a linear local evidence chain:

```text
8a416bed36c025a478d999c0a99939cdeadca837  origin/develop
  |
2945361038ee63d26304b4279d703c11ed66d14b  Phase-0B
  |
9f67e1745ae9ed56bd79237a429863213fc492c9  Phase-1A
  |
d49e9d11116fd59e3f3f38c638dfe63c1bc02924  remediation
```

The alternative remote line is also linear:

```text
62d01a58234a90fcbedcbd728895fc5d157c617e  remote-main root
  ...
6a7af8e1763fdbae7cce235b66435593424a5716  origin/main
  |
61ad77f6fc449985894ee97cad54a61740a8dd2a  Phase-0 architecture rebaseline
  |
5efb02382e278ee2d04ec167b87e8649fa5cd578  contracts/runner/benchmark/evidence
  |
e05ae283a1605c17efd9d6575cb8df642a098a34  verification/contribution controls
```

These two diagrams are separate roots. Tree similarity cannot create ancestry between them.

## Direct tree comparisons

The required `git diff --stat` and `git diff --name-status` comparisons were executed even where merge bases do not exist.

| Tree comparison | Stat | Name-status counts |
|---|---|---|
| `origin/main` → `origin/develop` | 596 files; +23,073 / -901 | A 580, D 14, M 2 |
| `origin/baseline/phase-0-rebaseline` → `origin/develop` | 629 files; +23,049 / -2,312 | A 574, D 47, M 7, R 1 |
| Phase-0B → `origin/main` | 655 files; +891 / -29,600 | A 13, D 639, M 3 |
| Phase-0B → `origin/baseline/phase-0-rebaseline` | 688 files; +2,302 / -29,576 | A 46, D 633, M 8, R 1 |
| remediated Phase-1A → `origin/baseline/phase-0-rebaseline` | 709 files; +2,302 / -32,935 | A 46, D 654, M 8, R 1 |
| `origin/main` → `origin/baseline/phase-0-rebaseline` | 46 files; +1,611 / -176 | A/M as enumerated by the audit |

## Unique work and supersession

### Develop / Phase-0B / Phase-1A line

`origin/develop` has no commit unique from Phase-0B: it is wholly contained in the local lineage. Phase-0B adds one commit, Phase-1A adds one, and remediation adds one. This line contains the large May foundation implementation, the protected REP checkpoint, the challenge-facing loop, and the portability/local-scope fix. The exact-SHA evidence reviewed in RR-201R binds to this line.

### Main line

The 16-commit main line is unique by ancestry. Its tree includes a small HouseSim starter, four fixtures, validation/simulation scripts, starter checks, a license, Copilot instructions, and project command metadata not identically present in the remediated local tree. Much of its technical direction is superseded by the fuller develop/Phase-0B implementation, but unique license/governance and HouseSim material must be dispositioned rather than assumed disposable.

### PR #2 / remote rebaseline line

The three commits after main add an alternative Phase-0 architecture, runner/contracts, benchmark, evidence rules, CI and repository controls. Relative to the remediated local tree, 46 paths exist only or under different names on that remote tree, including CODEOWNERS, issue/PR templates, Dependabot, CONTRIBUTING, SECURITY, benchmark records, three alternate ADRs, licensing strategy, evidence rules, JSON schemas, an alternate runner, and HouseSim material. The protected local Phase-0B implementation supersedes the alternate material evaluator as the verified technical baseline; governance, licensing, templates, and any genuinely unique technical ideas require the later RR-208 content map.

## Reflog and unreachable-object inspection

`git reflog show --all --date=iso` corroborated creation of the three local commits and the current fetch. `git fsck --full --no-reflogs --unreachable --no-progress` found unreachable blobs and trees but no unreachable commits. No object was recovered or attached; none supplied an alternate lineage record.

## Mandatory conclusions

1. **Does main truly have no common ancestor with the local Phase-0B lineage?** Yes. Fresh `origin/main` and Phase-0B have no merge base; their roots are `62d01a…` and `b9bbce8…` respectively.
2. **Does remote develop share ancestry with Phase-0B?** Yes. `origin/develop` is an ancestor and the only merge base for that comparison.
3. **Is Phase-0B directly descended from remote develop, or from a local-only rewritten state?** Directly descended from current `origin/develop`. The Phase-0B commit object's sole parent is exactly `8a416bed…`. No rebase or rewritten intermediary exists between them.
4. **Is PR #2 ancestry related to Phase-0B?** No. The observed PR #2 head `e05ae283…` descends `origin/main` and has no common ancestor with Phase-0B.
5. **Which histories contain unique work absent from the Phase-0B/1A tree?** The remote main and PR #2 histories do. Main contains starter HouseSim/tooling and repository files; PR #2 adds an alternate Phase-0 implementation plus governance, security, licensing, templates, schemas, benchmark, and evidence material. Remote develop does not: it is fully contained in the local checkpoint line.
6. **Which exact SHAs must be preserved for evidence provenance?** At minimum: roots `b9bbce801a4b766392215bbaf6081b97ed917bd6` and `62d01a58234a90fcbedcbd728895fc5d157c617e`; remote heads `8a416bed36c025a478d999c0a99939cdeadca837`, `6a7af8e1763fdbae7cce235b66435593424a5716`, `fe9b5045bd01dcfa53b870d29a273a5aa2d6f9ff`, and `e05ae283a1605c17efd9d6575cb8df642a098a34`; PR #2 intermediate commits `61ad77f6fc449985894ee97cad54a61740a8dd2a` and `5efb02382e278ee2d04ec167b87e8649fa5cd578`; checkpoints `2945361038ee63d26304b4279d703c11ed66d14b` and `9f67e1745ae9ed56bd79237a429863213fc492c9`; remediation `d49e9d11116fd59e3f3f38c638dfe63c1bc02924`.

## Lineage decision implication

The audit provides no compelling reason to rewrite the verified local checkpoints. Because the remote main/PR #2 line is genuinely unrelated and contains unique material, the safest next action is an owner-selected new authoritative branch that preserves both histories as separate historical refs, followed by path-level disposition of unique remote work. No merge, transplant, ref replacement, or migration was performed.
