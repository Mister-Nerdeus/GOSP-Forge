# ADR 0004: Local-Only Verification

- Status: Accepted under current user policy
- Date: 2026-08-07

## Context

Current project direction prohibits GitHub Actions and remote repository writes unless explicitly authorized. The inspected workflow automatically ran on pushes and pull requests.

## Decision

Phase-0B verification runs locally. `pnpm verify` is the complete documented gate and `pnpm evidence:local` records new Phase-0B execution evidence without overwriting historical evidence. GitHub Actions has no automatic trigger while this policy is active.

## Consequences

Local evidence must include the exact command, exit status, runtime, relevant hashes, and working-tree state. A future policy change requires an explicit decision and workflow review before automatic remote verification is restored.
