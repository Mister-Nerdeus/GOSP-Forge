# Branch Protection and Repository Control Policy

Date: 2026-08-09 (America/New_York)

Status: Tier 1 configured on the authoritative branch on 2026-08-15; later tiers remain policy

## 2026-08-15 implementation overlay

Authenticated post-change inspection established that `canonical/verified-lineage` is the protected default branch. Force pushes and deletion are disabled, conversation resolution is required where applicable, no pull-request approval or remote status check is required, and administrator enforcement is disabled so the solo owner retains the documented direct maintenance path. PR #2 was closed as superseded without merge, and legacy branch refs were preserved. See the [current canonical authority status](../source-of-truth/GOSP_CANONICAL_AUTHORITY_STATUS_2026-08-15.md).

## Historical observation at policy selection

Authenticated GitHub inspection reports `main`, `develop`, `baseline/phase-0-rebaseline`, and `ai-001-verification-scaffold` as unprotected, with no repository rulesets. The repository is owned and maintained by one owner. GitHub Actions remain local-policy manual only in the selected candidate.

## Policy principles

- Protect the future authoritative branch without making the solo owner unable to maintain it.
- Do not require an approval the sole owner cannot obtain.
- Do not require a remote status check while the local-only/no-automatic-Actions policy applies.
- Block irreversible ref damage by default; document any emergency bypass.
- Apply new authority rules only after the new branch is published and its exact SHA is verified.
- Preserve legacy branches and checkpoint SHAs; protection policy must not rewrite history.

## Tier 1 — immediate solo-owner protection

Apply after the new authoritative branch is published and before it becomes the default branch:

| Control | Tier-1 policy | Rationale |
|---|---|---|
| Force pushes | Block | Preserves exact checkpoint and governance ancestry. |
| Branch deletion | Block | Prevents accidental loss of the selected public authority. |
| Pull request before merge | Prefer required if GitHub permits the owner to open and merge a PR without an independent approval | Creates a reviewable change record without inventing reviewer independence. If this is not workable for the solo owner, allow direct owner updates temporarily but require local gates and an issue/decision record. |
| Required approval count | Zero | A one-person repository cannot truthfully satisfy independent approval. |
| Conversation resolution | Require where available | Ensures recorded objections are resolved without requiring another approver. |
| Required status checks | None | Automatic Actions are prohibited and a manual workflow cannot be a reliable merge prerequisite. Local evidence is reviewed manually. |
| Creation/deletion patterns | Restrict deletion and force-update of the authoritative pattern; do not globally block creation of ordinary topic branches | Avoids owner lockout while protecting authority. |
| Owner bypass | Emergency only, documented in the change/recovery record | Supports recovery without normalizing bypass. |

Every Tier-1 authoritative update must record the exact base/head SHAs, execute applicable local verification, preserve a clean working tree, and state what was not run. A bypass is not evidence that review or verification occurred.

Legacy `main`, `develop`, PR #2, and AI-scaffold branches should initially be protected against force push/deletion or otherwise left unchanged. They need no required PR/check policy while retained as read-only history.

## Tier 2 — collaborator mode

Activate only when at least one independent reviewer is consistently available:

- require at least one approval;
- dismiss stale approvals after material changes;
- require conversation resolution;
- require CODEOWNER review for `packages/contracts`, REP/reference-runner and source-identity boundaries, source-of-truth documents, ADRs, verification/evidence policy, and workflows;
- restrict direct pushes to the authoritative branch;
- retain the documented owner emergency bypass for repository recovery only.

Approval is a repository-review control, not professional engineering approval, physical validation, certification, or independent reproduction evidence.

## Tier 3 — future CI-enabled mode

Activate only after an explicit policy change authorizes automatic remote CI and the exact workflow/check names are proven stable:

- require fresh checks against the exact proposed SHA;
- name each required check exactly rather than requiring a vague “CI” status;
- require dependency/security checks only after their automation and false-positive/availability behavior is governed;
- consider signed release artifacts and provenance attestations;
- keep local material-identity/reproduction evidence distinct from GitHub execution metadata.

No Tier-3 check may be configured while the corresponding workflow is manual-only or unavailable, because that could lock the sole owner out.

## Linear history

Do not use linear-history enforcement to rewrite or normalize existing history. The selected authoritative line is already linear and contains immutable evidence checkpoints. Unrelated remote histories remain separate by policy.

Tier 1 need not enforce GitHub's linear-history setting: blocking force pushes/deletion and prohibiting unrelated-history merges are the essential controls, and the owner must retain a workable recovery path. Re-evaluate linear-history enforcement in Tier 2. If enabled later, it governs only future merges into the authoritative branch; it does not authorize rebasing, squashing, or cherry-picking the preserved checkpoints.

## Signed commits and releases

Signed commits are optional future hardening. Do not require them until key ownership, rotation, recovery, contributor onboarding, and historical unsigned-commit treatment are documented. Release signing/attestation belongs in Tier 3 and does not replace source/evidence verification.

## Ruleset rollout and rollback

1. Publish and verify the new authoritative branch first.
2. Create a Tier-1 rule targeting that exact branch name without changing the default branch.
3. Verify the owner can create a topic branch, open a test draft PR if authorized, and reach an allowed merge path without running Actions.
4. If the rule locks out the owner, use the documented emergency bypass or disable only the newly added rule; do not force-update refs.
5. Record the effective ruleset ID/settings and the exact remote head before any default-branch transition.

No GitHub setting was changed during RR-211.
