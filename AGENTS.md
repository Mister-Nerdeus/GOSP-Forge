# AGENTS.md

## Mission

Build GOSP Forge as a trustworthy, domain-neutral engineering challenge, evaluation, evidence, and reuse platform.

The current implementation phase is deliberately narrow: prove the contracts and reproducible evidence loop before expanding the UI, solver network, marketplace, federation, or additional engineering domains.

HouseSim Challenge is the first building vertical. It is **not** the core platform model.

## Non-negotiable architecture rule

**Core must never import a domain vertical.**

- `packages/contracts` must remain domain-neutral.
- `packages/runner` may understand only explicitly registered evaluation kinds, never hidden domain assumptions.
- `verticals/housesim` may depend on core contracts/runner.
- Future building, water, energy, mechanical, electrical, or robotics verticals may depend on core.
- Do not add house-, building-, Michigan-, HVAC-, CNC-, or code-specific fields to universal contracts merely to make HouseSim convenient.

If a vertical needs something new, determine whether it is truly universal before changing core.

## Truthfulness and evidence rules

- Never claim code was run, tested, fixed, deployed, merged, benchmarked, reproduced, or verified unless that exact action occurred and evidence exists.
- Never represent generated, inferred, estimated, synthetic, or placeholder data as measured or externally verified.
- A simulation result is not a physical test.
- A test is not automatically certification.
- AI output is a proposal until verified by the applicable process.
- Preserve contradictory and negative evidence; do not silently overwrite it.
- Keep deterministic result data separate from execution-environment evidence. Runtime/platform metadata may differ while the material deterministic result remains identical.

## Phase 0 priority order

1. Real repository verification: lint, typecheck, tests, contract validation.
2. Domain-neutral contracts and stable identifiers/revisions.
3. Reproducible Evaluation Package (REP) v0.1.
4. Deterministic reference runner.
5. Artifact hashing and provenance capture.
6. Safe domain-neutral benchmark.
7. CI evidence artifacts and replay checks.
8. HouseSim migration behind the same contracts.
9. Cross-environment reproduction report.
10. Phase 0 gate report.

Do not jump ahead to photorealistic UI, Kubernetes, marketplace/payment systems, mobile clients, HPC, or many solver integrations merely because they are part of the long-term plan.

## Required PR closeout

Every substantive PR must state:

1. Scope and issue/decision addressed.
2. Files changed.
3. Commands actually run.
4. Tests/checks actually passed or failed.
5. Evidence artifacts actually produced.
6. What was generated, inferred, or estimated.
7. Known limitations and unverified items.
8. Any contract, safety, license, scoring, or provenance implications.

If a command was not run, say so. Never substitute an expected result for an executed result.

## Required baseline commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm validate:contracts
pnpm benchmark:sandbox
pnpm build
```

Preferred aggregate command:

```bash
pnpm verify
```

Legacy HouseSim commands are namespaced and are not proof that the GOSP core is generic:

```bash
pnpm housesim:validate
pnpm housesim:baseline
pnpm housesim:comparison
```

## Change controls

Human approval is required before an AI agent may:

- change the project mission or product boundary;
- weaken safety, evidence, provenance, or licensing guardrails;
- change challenge scoring after a challenge is opened;
- add a major infrastructure or solver dependency;
- change the repository license or contribution/IP policy;
- publish contest/prize/legal/certification language;
- deploy production;
- claim professional approval, accreditation, or certification;
- introduce a new high-consequence domain.

## Working style

- Work in small, reviewable PRs.
- Prefer issue- or ADR-scoped changes.
- Contracts before UI.
- Deterministic evaluation before visual polish.
- Tests and fixtures accompany behavioral changes.
- Version material contracts.
- Hash material artifacts used to support claims.
- Document assumptions and limitations at the point of use.
- Add an ADR for a durable architecture decision instead of burying it in code.
