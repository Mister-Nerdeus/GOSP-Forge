# Issue 91 Pre-Audit

Date: 2026-05-14

## Scope

Issue #91 requires AI proposal draft-plane contracts.

## Current Behavior

- No `packages/contracts/src/ai/` contracts exist.
- No AI proposal docs or examples exist.
- The separate `packages/ai-proposals` package is an empty shell.

## Planned Files

- `packages/contracts/src/ai/aiProposal.ts`
- `packages/contracts/src/ai/aiProposalReview.ts`
- `packages/contracts/src/ai/aiProposal.test.ts`
- `packages/contracts/src/index.ts`
- `examples/ai/clean-water-ai-proposal.example.json`
- `docs/contracts/AI_PROPOSAL.md`
- `artifacts/batches/batch-91/issue-91-closeout.md`

## Review Notes

AI proposals must remain draft-plane artifacts. They cannot approve truth, safety, scoring, manufacturer verification, potable-water claims, or professional approval.
