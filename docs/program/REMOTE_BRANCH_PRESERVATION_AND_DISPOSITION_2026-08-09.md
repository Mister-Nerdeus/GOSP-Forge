# Remote Branch Preservation and Disposition Plan

Date: 2026-08-09 (America/New_York)

Selected strategy: Option A — later publish the exact verified local lineage as a new remote branch. This plan performs no remote branch change and does not choose the publication branch name; RR-213 does that against the RR-212 candidate SHA.

## Observed remote inventory

The GitHub connector and freshly fetched Git refs agreed on four branches. GitHub currently reports `main` as the default branch and all four branches as unprotected.

| Remote branch | Head SHA | Root / ancestry | Last meaningful purpose | Open PR dependency | Unique content / evidence | Current authority | Disposition and future role |
|---|---|---|---|---|---|---|---|
| `main` | `6a7af8e1763fdbae7cce235b66435593424a5716` | Root `62d01a58234a90fcbedcbd728895fc5d157c617e`; 16-commit HouseSim starter line | Public starter command surface, HouseSim fixtures/scripts, MIT license, assistant instructions | Base of open PR #2 | Unique MIT license and historical HouseSim/tooling line; root of PR #2 | Current GitHub default, but not technical authority | `do-not-delete` and `retain-historical`. Keep unchanged through first publication. Before any future repoint/rename, create a SHA-specific legacy preservation ref if the owner authorizes it. |
| `develop` | `8a416bed36c025a478d999c0a99939cdeadca837` | Root `b9bbce801a4b766392215bbaf6081b97ed917bd6`; direct parent of Phase-0B | May foundation implementation/handoff | None observed | Entire history is ancestor of Phase-0B/1A; essential checkpoint provenance | Historical parent of selected authoritative line | `do-not-delete` and `retain-historical`. It remains the ancestry bridge to all selected checkpoints even after the new authoritative branch exists. |
| `baseline/phase-0-rebaseline` | `e05ae283a1605c17efd9d6575cb8df642a098a34` | Root `62d01a…`; three commits after `main` | Alternative Phase-0 contracts/runner/benchmark/governance rebaseline | Head of open draft PR #2 | 46-file PR contribution set; unique governance/licensing/security/templates plus superseded technical implementation | Non-authoritative alternative history | `retain-until-pr-close`, then `retain-historical`; optionally `archive-via-tag` in addition to the branch. Do not delete until RR-208 integrations are present, remote publication is verified, PR #2 is closed with a supersession record, and deletion receives separate owner authorization. |
| `ai-001-verification-scaffold` | `fe9b5045bd01dcfa53b870d29a273a5aa2d6f9ff` | Root `62d01a…`; direct ancestor of `main` | Starter lint/typecheck/verification scaffold | None observed | Its commits are already contained in `main`; SHA helps explain main ancestry | Historical only | `retain-historical` now. It may become `safe-to-delete-later` only after `main` is preserved by a named legacy ref/tag, an explicit unique-work check reconfirms no content outside main, and the owner separately authorizes deletion. |
| Future authoritative branch | RR-212 SHA, not yet created/published | Exact descendant of `d49e9d11116fd59e3f3f38c638dfe63c1bc02924` | Public selected lineage and reconciliation controls | New publication does not rely on an unrelated-history PR | Exact Phase-0B, original Phase-1A, remediation, and governance checkpoint | Selected future authority | `future-authoritative`. Exact name and push command are deferred to RR-213. It must be published before any default-branch or legacy-ref change. |

No additional remote branch was found.

## Preservation sequence

1. Leave every existing ref unchanged during reconciliation.
2. Create the local RR-212 governance checkpoint as a descendant of `d49e9d1…`.
3. In RR-213, select a new, unambiguous publication branch name and bind the plan to the exact RR-212 SHA.
4. At Owner Gate #2, request authorization only for the staged publication plan.
5. If later authorized, publish the new branch first and verify its exact remote SHA and lack of automation.
6. Only after successful first publication may a later action preserve legacy refs, close PR #2 as superseded, protect the new authority, and consider a default-branch transition.
7. No branch deletion occurs during first publication or authority transition. Any deletion is a separate cleanup decision after rollback refs and unique-work checks exist.

## Preservation refs recommended for a later authorized transition

Names remain proposals until the SHA-specific RR-213 plan:

- legacy main: a branch or annotated tag containing exact SHA `6a7af8e…`;
- PR #2 head: retain `baseline/phase-0-rebaseline` and optionally add a tag containing `e05ae283…`;
- verification scaffold: retain until the legacy-main preservation object is independently verified;
- remote develop: retain as a branch because it is the direct public ancestor of Phase-0B.

An archive tag does not replace a branch while an open PR depends on that branch. GitHub PR #2 should remain untouched until the authority transition explicitly addresses it.

## Destructive-action gate

No branch is presently classified for immediate deletion. A later `safe-to-delete-later` classification is not permission to delete: it requires a repeated unique-work check, an exact replacement/preservation ref, remote verification, and separate owner authorization.
