# Phase 0 Baseline

## Purpose

Phase 0 converts the GOSP Forge business-plan architecture into the smallest technical system capable of testing the central thesis: a challenge can produce a reproducible, provenance-backed result without embedding one engineering vertical into the platform core.

## In scope

- versioned domain-neutral contracts;
- stable logical IDs and revisions;
- Challenge Definition Package subset;
- Reproducible Evaluation Package v0.1;
- deterministic reference runner;
- input/output hashing;
- execution evidence kept separate from deterministic results;
- one safe, synthetic, domain-neutral benchmark;
- CI that runs real lint/typecheck/tests/contract validation and preserves evidence artifacts;
- HouseSim retained as the first building vertical and later migration test.

## Explicitly deferred

- production Forge Studio;
- public challenge marketplace;
- payments and prizes;
- Kubernetes/HPC orchestration;
- arbitrary third-party executable submissions;
- IFC/EnergyPlus/OpenFOAM or other solver adapters;
- federation;
- mobile clients;
- enterprise control plane;
- laboratory marketplace/network;
- professional approval or certification workflows beyond data-model placeholders.

## Technical success criteria

Phase 0 is technically successful only when all of the following are demonstrated with recorded evidence:

1. `sandbox-001` validates against the published contracts.
2. The same challenge + submission produce an identical deterministic result on repeat execution.
3. Material input and output hashes are recorded.
4. Runtime/platform metadata are recorded separately from the deterministic result.
5. Invalid submissions fail deterministically with inspectable reasons.
6. The benchmark can be replayed in at least two independent execution environments and discrepancies are documented.
7. HouseSim can begin consuming core contracts without adding building-specific fields to the universal model.

## Product gate

Passing Phase 0 does not mean GOSP Forge is an MVP for engineering deployment. It means the core representation/evaluation/evidence architecture is credible enough to justify the next product phase.

Failure to reproduce results, preserve evidence, or keep the core domain-neutral is a stop-and-correct condition.
