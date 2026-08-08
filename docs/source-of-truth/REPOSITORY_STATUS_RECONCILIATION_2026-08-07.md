# Repository Status Reconciliation — 2026-08-07

## Purpose

This record preserves the discrepancy between Revision 2's intended architecture and historical execution narrative and the checkout directly inspected on August 7, 2026.

Revision 2 remains authoritative for direction. This record controls repository-status claims wherever observed state conflicts with Revision 2.

## Observed baseline before Phase-0B changes

- Branch: `develop`.
- HEAD: `8a416bed36c025a478d999c0a99939cdeadca837`.
- `develop` and `origin/develop` had no ahead/behind commits.
- No staged or unstaged tracked changes existed.
- Revision 2 existed locally as an untracked file at its intended location.
- No `AGENTS.md`, ADR directory, REP specification, `sandbox-001`, HouseSim package, HouseSim commands, `pnpm verify`, or `pnpm evidence:ci` command existed.
- Tests used Vitest. No `node --test` command or `tests/**/*.test.mjs` files existed.
- No reachable commit, reflog entry, or working-tree diff contained the previously reported recursive `node:test` discovery correction.
- Generic packages contained Clean Water-specific scenario and simulation code.
- `.github/workflows/ci.yml` automatically reacted to pushes and pull requests.

## Historical evidence

`artifacts/controls/local-validation/latest.json` and `latest.sanitized.json` record a PASS at the baseline HEAD with timestamp `2026-05-16T01:11:49.930Z`, Node `v22.16.0`, and pnpm `9.15.5`.

Those artifacts are historical evidence. They are not an August 7 execution and must not be overwritten or relabeled as one.

## Superseded status claims

The reported domain-neutral rebaseline, REP runner, `sandbox-001`, HouseSim commands, `node:test` correction, deterministic REP replay, and cross-environment reproduction were not present in the inspected checkout. Until locally implemented and verified, they are intended work rather than completed work.

## Phase-0B starting interpretation

The checkout provides a locally evidenced Clean Water foundation with useful contracts, deterministic helpers, validation, estimation, and audit behavior. Phase-0B starts by adding the canonical protocol and REP truth model additively, then separating Clean Water behind a vertical boundary without rewriting history or pretending the intended rebaseline already occurred.
