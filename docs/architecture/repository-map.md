# Repository Map

## Phase 0 ownership model

| Path | Responsibility | May depend on domain-specific concepts? |
|---|---|---|
| `packages/contracts` | Universal IDs, program/challenge/evidence/component contracts | No |
| `packages/runner` | Minimal deterministic reference evaluation infrastructure | Only through explicit evaluator kinds; no hidden vertical assumptions |
| `benchmarks` | Safe reproducibility/conformance fixtures | Yes, but Phase 0 starts synthetic/domain-neutral |
| `verticals/housesim` | Building-specific product logic and migration | Yes |
| `scripts/validation` | Contract/fixture conformance | No hidden domain assumptions |
| `scripts/evidence` | Execution manifests and artifact hashes | No |
| `docs/adr` | Durable architecture decisions | N/A |
| `evidence` | Generated proof conventions | N/A |

## Future paths are not promises of implementation

The long-term plan includes Forge Studio, Challenge Lab, Solver Mesh, Evidence Ledger, Component Commons, Verification Network, federation, self-hosting, solver adapters, and enterprise deployment. Those names describe roadmap products. They should not be represented by empty source trees until a funded/approved phase creates working code and tests for them.
