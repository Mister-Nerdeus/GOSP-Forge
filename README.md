# GOSP Forge

**Collaborative Engineering Challenge and Verification Network**

GOSP Forge is a proposed open, federated engineering coordination platform. It is intended to turn bounded real-world needs into machine-readable challenges, let humans and AI develop candidate solutions, execute deterministic evaluations, preserve claims and evidence, route appropriate work through qualified review and physical validation, and publish reusable engineering components with explicit scope and provenance.

This repository is the **Phase 0 technical baseline**. It is intentionally smaller than the long-term product vision.

## Core loop

```text
Need
  -> Engineering Program Graph
  -> Challenge Definition
  -> Human / AI candidate
  -> Reproducible Evaluation
  -> Claims + Evidence
  -> Qualified / physical validation when required
  -> Component Release
  -> Reuse + new evidence
```

## Phase 0 goal

Prove one trustworthy software loop before building a broad engineering platform:

1. represent a challenge with versioned contracts;
2. accept a valid submission;
3. evaluate it deterministically;
4. hash the material inputs and outputs;
5. produce an auditable evidence record;
6. replay the same evaluation independently;
7. demonstrate that the core is not specific to buildings.

The first domain-neutral proof is `benchmarks/sandbox-001`. The existing **HouseSim Challenge** work is retained as the first building vertical and migration test, not as the definition of GOSP Forge.

## Architectural boundary

The most important dependency rule is:

> **GOSP core must never import HouseSim or another domain vertical.**

Verticals and adapters may depend on GOSP contracts and the reference runner. Core contracts and evidence logic must remain domain-neutral.

```text
                  apps (later)
                      |
            +---------+---------+
            |                   |
        verticals            adapters
            |                   |
            +---------+---------+
                      |
                 GOSP core
                      |
          contracts + evidence
```

## Repository map

```text
packages/
  contracts/       Domain-neutral Engineering Program Graph, Challenge, Evidence, REP types/schemas
  runner/          Small deterministic reference evaluator
verticals/
  housesim/        Existing housing work, progressively migrated behind GOSP contracts
benchmarks/
  sandbox-001/     Safe domain-neutral Phase 0 benchmark
docs/
  adr/             Architecture decisions
  product/         Phase and product definitions
  verification/    Evidence and truthfulness rules
  licensing/       License strategy notes; not legal advice
evidence/           Local/CI evidence conventions; generated CI evidence is not committed
.github/             CI and contribution workflow
```

## Development

Requires Node.js 22+ and pnpm 10+.

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm validate:contracts
pnpm benchmark:sandbox
pnpm build
```

Run the baseline verification sequence with:

```bash
pnpm verify
```

The legacy HouseSim checks remain available under explicitly namespaced commands:

```bash
pnpm housesim:validate
pnpm housesim:baseline
pnpm housesim:comparison
```

## Trust boundaries

GOSP Forge is not an engineer of record, architect of record, laboratory accreditation body, product certification body, authority having jurisdiction, or substitute for qualified professional judgment.

- AI output is a proposal, not a fact.
- A deterministic score is not physical validation.
- Peer review is not professional approval.
- A laboratory test is not automatically product certification.
- Open-source status is not a safety certification.
- A passing software benchmark creates no deployment claim.
- Material engineering claims must expose scope, evidence, revision, provenance, uncertainty/limitations, and status.

## Current status

This repository does **not** yet contain the complete Forge Studio, Challenge Lab, Solver Mesh, Evidence Ledger, Component Commons, Verification Network, federation layer, enterprise platform, accredited testing network, or production deployment described by the business plan.

Phase 0 exists to prove the contracts, reproducibility, evidence model, and core/vertical separation before those systems are built.

See [`docs/product/phase-0-baseline.md`](docs/product/phase-0-baseline.md).
