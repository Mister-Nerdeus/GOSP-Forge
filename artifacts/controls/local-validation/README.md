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

Run node scripts/controls/sanitize-local-validation.mjs after write-local-validation to produce latest.sanitized.json. The sanitized file keeps commit SHA and gate results while redacting local paths.
