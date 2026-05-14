# Truth Gate Local Validation

Local validation artifacts prove that a developer ran the local truth gates against a specific git SHA. The artifact writer records git SHA, branch, runtime, command results, aggregate result, and timestamp.

## Artifact Policy

`artifacts/controls/local-validation/latest.json` is generated locally and is not committed. The directory, `.gitkeep`, and README are committed so reviewers know where local evidence is generated. Generated JSON artifacts may be attached to a pull request or handoff note when needed, but they remain outside git history.

Secret-bearing artifacts must never be committed. Local validation output should contain command summaries only and should not include `.env` values, tokens, credentials, API keys, or local private paths beyond the repository-relative artifact path.

## Currentness Gate

`node scripts/controls/verify-local-validation-current.mjs` fails when `latest.json` does not match `HEAD`. Run the writer first:

```powershell
node scripts/controls/write-local-validation.mjs
node scripts/controls/verify-local-validation-current.mjs
```

## Current Implementation Limits

This document describes foundation policy and contract intent. The current repository provides foundation packages, example fixtures, validation gates, and local validation currentness checks only. It does not claim production readiness, professional approval, potable-water certification, or production manufacturing approval.
