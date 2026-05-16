# Local Validation Evidence

This directory is the local output target for `node scripts/controls/write-local-validation.mjs`.

Generated evidence files, including `latest.json`, are intentionally ignored by git. Commit only this README and `.gitkeep`. Attach generated evidence to review or handoff records when a human process needs it, but do not commit secret-bearing artifacts.

Expected non-secret proof fields:

- git SHA and branch
- Node and pnpm versions
- command names and pass/fail results
- aggregate result
- timestamp

## Sanitized Artifact

Run the writer and sanitizer together:

```powershell
node scripts/controls/write-local-validation.mjs
node scripts/controls/sanitize-local-validation.mjs
```

The sanitized file keeps commit SHA, branch, runtime, command results, aggregate PASS/FAIL, and timestamp while redacting local paths and secret-like environment assignments. `latest.sanitized.json` is still ignored by git; attach it to PRs/releases or copy a reviewed sample into an issue-specific artifact path when static audit evidence is required.
