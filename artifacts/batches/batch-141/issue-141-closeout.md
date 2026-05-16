# Issue 141 Closeout

Date: 2026-05-15

## Pre-Change Audit

- `releaseEvidenceCommand` already existed and was wired into `release-evidence`.
- The output did not include branch, runtime proof, detailed simulation confidence, graph consistency summary, audit counts, or claim scan result.
- No CLI regression test covered the command.

## Resolution

- Expanded `gosp release-evidence foundation` output with:
  - git SHA and branch;
  - Node and pnpm runtime proof;
  - validation summary and ref counts;
  - simulation confidence summary and graph consistency summary;
  - estimate quality report and mode gate;
  - audit decision, counts, and claim scan result.
- Added CLI tests for valid foundation evidence and unsupported targets.
- Updated release evidence docs.
- Wrote `release-evidence-output.json`.

## Gates

- `pnpm -r build` PASS
- `pnpm --filter @gosp/cli test` PASS
- `pnpm --filter @gosp/cli start release-evidence foundation` PASS

## Code Review

Reviewed command output, docs, and tests. No P0/P1 findings. The command gathers evidence only and does not approve a release or create professional, manufacturing, procurement, potable-water, or production claims.
