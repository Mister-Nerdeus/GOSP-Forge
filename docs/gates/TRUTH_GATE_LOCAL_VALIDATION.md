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

## Sanitized Evidence Workflow

For PR or release review, generate the full local artifact and then create the sanitized artifact:

```powershell
node scripts/controls/write-local-validation.mjs
node scripts/controls/sanitize-local-validation.mjs
node scripts/controls/verify-local-validation-current.mjs
```

The sanitized artifact includes commit SHA, branch, runtime versions, command names, command PASS/FAIL state, output summaries, aggregate PASS/FAIL, and timestamp. It redacts repository-local absolute paths, home/user paths, Windows absolute paths, Unix home paths, and secret-like environment assignments. The full local artifact remains uncommitted.

## Current Implementation Limits

This document describes foundation policy and contract intent. The current repository provides foundation packages, example fixtures, validation gates, and local validation currentness checks only. It does not claim production readiness, professional approval, potable-water certification, or production manufacturing approval.

## Sanitized Evidence

Sanitized validation evidence is for PR and release attachment. Currentness verification still uses the full local artifact at `artifacts/controls/local-validation/latest.json`. A sanitized sample may be committed under an issue-specific `artifacts/batches/batch-*/` path when a static audit needs proof that the sanitizer output shape is safe to inspect.
