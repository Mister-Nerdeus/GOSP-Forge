# ADR 0003: REP Material Results and Execution Evidence

- Status: Accepted for Phase-0B
- Date: 2026-08-07

## Context

Reproducibility requires an engineering result to remain stable when execution-only metadata changes.

## Decision

REP defines two separate records:

1. a material evaluation record derived from the exact challenge, submission, compiled scenario, components, model/solver, runner, contracts, datasets, assumptions, parameters, and material result;
2. execution evidence describing when, where, and how that evaluation ran.

The material-result hash is SHA-256 over normative canonical JSON. Object keys use Unicode code-point order. Timestamps, hostnames, usernames, local paths, process IDs, runtime details, and other execution-only metadata are excluded.

## Consequences

Execution evidence may differ between environments while material hashes remain identical. A mismatch is preserved as a failed reproducibility result and investigated rather than normalized away.
