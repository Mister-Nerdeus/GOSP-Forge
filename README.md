# GOSP Forge

GOSP Forge is a problem-first foundation for classroom-scale STEM systems work. This repository currently contains contracts, examples, validation commands, Docker/local validation support, and foundation services. It does not yet provide a complete product UI, CAD tool, marketplace, game, professional engineering workflow, potable-water validation, or production manufacturing approval.

## Current State

Implemented now: a pnpm monorepo skeleton, TypeScript/Zod contract package, deterministic simulation helpers, estimation and fabrication placeholders, CLI commands, API health/version endpoints, local validation artifacts, CI config, Docker local validation, and Clean Water foundation examples.

Not implemented yet: full UI, full CAD, professional-grade simulation, manufacturer verification workflows, public leaderboards, production storage, or imported legacy code.

## Canonical Docs

- [Thesis](docs/product/GOSP_STEM_SYSTEMS_FORGE_THESIS.md)
- [North Star](docs/product/GOSP_FORGE_NORTH_STAR.md)
- [Non-goals](docs/product/WHAT_GOSP_FORGE_IS_NOT.md)
- [Product invariants](docs/governance/PRODUCT_INVARIANTS.md)
- [Anti-drift contract](docs/governance/ANTI_DRIFT_CONTRACT.md)
- [Runtime policy](docs/setup/RUNTIME_POLICY.md)
- [Issue contract standard](docs/program/ISSUE_CONTRACT_STANDARD.md)

## Local Gates

```powershell
pnpm install
pnpm lint
pnpm -r build
pnpm -r typecheck
pnpm -r test
pnpm validate:examples
pnpm simulate:clean-water
pnpm estimate:clean-water
node scripts/controls/write-local-validation.mjs
node scripts/controls/verify-local-validation-current.mjs
```

## Claim vs Implementation

The repository claims only a foundation implementation. All examples are educational fixtures with explicit confidence, assumptions, attribution, and safety limits.
