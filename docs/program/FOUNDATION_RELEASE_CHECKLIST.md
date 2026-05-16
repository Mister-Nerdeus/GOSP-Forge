# Foundation Release Checklist

Use this checklist before promoting the foundation slice from `develop` to `main`.

## Required Evidence

- Current branch is `develop`.
- Working tree is clean.
- Local validation evidence was generated for the exact promotion commit:

```powershell
node scripts/controls/write-local-validation.mjs
node scripts/controls/verify-local-validation-current.mjs
```

- Foundation audit has an explicit GO decision for foundation continuation.
- No unresolved P0/P1 review findings remain.
- Known gaps are documented in the release audit or handoff.
- Branch protection recommendations have been reviewed: `docs/program/BRANCH_PROTECTION_RECOMMENDATIONS.md`.

## Required Gates

```bash
pnpm lint
pnpm -r build
pnpm -r typecheck
pnpm -r test
pnpm validate:examples
pnpm simulate:clean-water
pnpm estimate:clean-water
pnpm audit
pnpm run audit
node scripts/controls/write-local-validation.mjs
node scripts/controls/verify-local-validation-current.mjs
```

## Release Decision

- GO: all required gates pass, local validation matches `HEAD`, foundation audit says GO, and known gaps are explicit.
- NO-GO: any required gate fails, current validation evidence is missing or stale, audit decision is NO-GO, or unresolved P0/P1 findings remain.
- Branch protection settings must not be claimed as configured unless they were manually verified in GitHub repository settings.

## Non-Claims

Foundation promotion does not certify potable water, provide professional approval, approve production manufacturing, verify manufacturer data, operate production storage, or declare product readiness.

## Evidence Bundle

Before promotion, run the release evidence command and attach sanitized validation evidence. Human review remains required.
