# Phase-1A Checkpoint Reconciliation

Date: 2026-08-09 (America/New_York)

## Immutable checkpoints and remediation

- Phase-0B: `2945361038ee63d26304b4279d703c11ed66d14b`
- Original Phase-1A checkpoint: `9f67e1745ae9ed56bd79237a429863213fc492c9`
- Separate remediation descendant: `d49e9d11116fd59e3f3f38c638dfe63c1bc02924`

The two checkpoints were not amended, reset, rebased, squashed, cherry-picked, or otherwise rewritten.

## What the committed report said

`docs/source-of-truth/PHASE_1A_IMPLEMENTATION_REPORT_2026-08-09.md` records its observed starting `HEAD` as Phase-0B. Its final state says `HEAD` remained Phase-0B, the tree was intentionally dirty with Phase-1A changes, and no commit was created.

Those statements were accurate descriptions of the implementation session before the later checkpoint action. They are stale if read as the repository state after `9f67e174…` was created.

## Actual checkpoint status

Commit `9f67e174…` is the direct child of Phase-0B and contains the Phase-1A implementation and report. Exact-tree re-audit found two implementation defects: file-backed material text was line-ending-sensitive in a fresh Windows checkout, and the API listened on all interfaces. Commit `d49e9d1…`, a new direct child of `9f67e174…`, fixes both without rewriting either checkpoint.

The remediated exact tree passed the complete local verification, currentness evidence, REP replay, Clean Water regression, comparison boundary probes, claim scan, diff check, browser smoke, and listener inspection.

## Filename audit

The report already contains the actual paths:

- `docs/phase-0c/GOSP_FORGE_EXTERNAL_ONE_PAGE.md`
- `docs/phase-0c/EXTERNAL_INTERVIEW_SCRIPT.md`

It does not contain the alleged stale names `GOSP_FORGE_EXTERNAL_ONE_PAGER.md` or `STRUCTURED_EXTERNAL_INTERVIEW_SCRIPT.md`. No filename discrepancy was reproduced, so no filename correction should be invented.

## Requirements provenance

Phase-1A requirements came from an externally supplied work-order document and were not repository-tracked at checkpoint time. The observed attachment is SHA-256 `5fe363e9a58c22fa1920c4820094755e0561af84f3c555b0b1f619f3f16cbd34`. This provenance gap does not invalidate the checkpoint. Repository tracking is recommended prospectively in the canonical-document inventory.

## Truth impact

- Implementation truth: the report's stale final-state wording does not change the committed implementation. The two separately discovered implementation defects did affect operational truth at `9f67e174…` and were fixed only in `d49e9d1…`.
- Verification truth: the historical command claims remain historical evidence. New results are post-checkpoint re-audit evidence and do not replace or rewrite the original evidence.
- Documentation correction: future status documents must identify `9f67e174…` as the immutable original checkpoint, `d49e9d1…` as its remediation descendant, and distinguish pre-commit report observations from post-commit state.

## Readiness

Original checkpoint result: **PHASE-1A CHECKPOINT HAS REMEDIATION FINDINGS**.

Remediated descendant result: **PHASE-1A CHECKPOINT VERIFIED**.
