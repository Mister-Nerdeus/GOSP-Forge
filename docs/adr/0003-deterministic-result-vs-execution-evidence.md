# ADR 0003: Separate deterministic result from execution evidence

- Status: Accepted for Phase 0
- Date: 2026-08-06

## Decision

Material evaluation results must be represented separately from execution-environment evidence.

## Rationale

A reproducible result should remain identical across valid environments. Runtime details such as operating system, Node version, architecture, CI run ID, and wall-clock timestamp are important provenance but necessarily differ between executions.

Mixing those fields into the scored result would make byte-for-byte replay impossible even when the engineering result is identical.

## Consequences

- The reference runner returns a deterministic evaluation record with material input hashes and metrics.
- CI writes a separate execution manifest that records runtime/platform metadata and the hash of the deterministic result.
- Reproducibility comparisons operate on the deterministic result or its canonical hash, not on the entire execution manifest.
