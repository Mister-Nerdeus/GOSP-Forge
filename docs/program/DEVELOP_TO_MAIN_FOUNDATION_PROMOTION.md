# Develop To Main Foundation Promotion

This policy governs promotion of the foundation slice from `develop` to `main`.

## Promotion Preconditions

- `develop` contains the complete foundation closeout evidence for the intended scope.
- The final local validation artifact is generated locally for the exact `develop` `HEAD`.
- `node scripts/controls/verify-local-validation-current.mjs` passes.
- The latest foundation audit gives a GO decision for foundation continuation.
- Release checklist items in `docs/program/FOUNDATION_RELEASE_CHECKLIST.md` are complete.
- Branch protection recommendations in `docs/program/BRANCH_PROTECTION_RECOMMENDATIONS.md` have been reviewed, and any claim that protections are configured has been manually verified in GitHub.
- Rollback owner and rollback criteria are named before promotion.

## Promotion Steps

1. Confirm `develop` is up to date with origin.
2. Confirm a clean working tree.
3. Run all required gates from the foundation release checklist.
4. Write or update the final audit and handoff documents.
5. Attach or reference local validation evidence for the promotion commit.
6. Confirm promotion uses a pull request and required checks when branch protection is configured.
7. Merge or fast-forward `develop` into `main` only after GO evidence is present.
8. Tag or note the promoted commit in the handoff record.

## Rollback Criteria

Rollback is required when any of the following are discovered after promotion:

- Required gate failure was missed.
- Local validation evidence does not match the promoted commit.
- Audit decision was incorrect or omitted a known P0/P1 blocker.
- README or docs claim production readiness, potable-water certification, professional approval, production manufacturing approval, manufacturer verification, or public leaderboard operation without implementation and review.
- A security or secret-handling issue is found in committed artifacts.

## Post-Promotion Duties

- Keep known gaps visible.
- Do not remove local validation or audit policy docs.
- Do not expand claims without a new issue, gates, review, and closeout evidence.

## Non-Claims

Promotion to `main` is a repository hygiene milestone for the foundation slice. It is not production readiness, professional review, potable-water certification, production manufacturing approval, or manufacturer verification.
