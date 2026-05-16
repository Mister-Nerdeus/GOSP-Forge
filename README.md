# GOSP Forge

GOSP Forge is a problem-first foundation for classroom-scale STEM systems work. This repository currently contains contracts, examples, validation commands, Docker/local validation support, foundation services, and a read-only builder UI shell. It does not yet provide a complete product UI, CAD tool, marketplace, game, professional engineering workflow, potable-water validation, or production manufacturing approval.

## Current State

Implemented now: a pnpm monorepo skeleton, TypeScript/Zod contract package, deterministic simulation helpers, educational estimation and fabrication outputs, CLI commands, API health/version and validation route behavior, local and sanitized validation artifacts, CI evidence config, Docker local validation, a read-only UI inspection shell, and Clean Water foundation examples.

Not implemented yet: full editor UI, full CAD, professional-grade simulation, manufacturer verification workflows, public leaderboards, production storage, production deployment readiness, or imported legacy code.

## Canonical Docs

- [Thesis](docs/product/GOSP_STEM_SYSTEMS_FORGE_THESIS.md)
- [Docs index](docs/README.md)
- [Claim implementation map](docs/program/CLAIM_IMPLEMENTATION_MAP.md)
- [North Star](docs/product/GOSP_FORGE_NORTH_STAR.md)
- [Non-goals](docs/product/WHAT_GOSP_FORGE_IS_NOT.md)
- [Product invariants](docs/governance/PRODUCT_INVARIANTS.md)
- [Anti-drift contract](docs/governance/ANTI_DRIFT_CONTRACT.md)
- [Runtime policy](docs/setup/RUNTIME_POLICY.md)
- [Issue contract standard](docs/program/ISSUE_CONTRACT_STANDARD.md)
- [Foundation release checklist](docs/program/FOUNDATION_RELEASE_CHECKLIST.md)
- [Release evidence command](docs/cli/RELEASE_EVIDENCE.md)
- [Branch protection recommendations](docs/program/BRANCH_PROTECTION_RECOMMENDATIONS.md)
- [Browser smoke strategy](docs/testing/BROWSER_SMOKE_TEST_STRATEGY.md)

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
pnpm audit
pnpm run audit
node scripts/controls/write-local-validation.mjs
node scripts/controls/verify-local-validation-current.mjs
```

## Claim vs Implementation

The repository claims only a foundation implementation. All examples are educational fixtures with explicit confidence, assumptions, attribution, and safety limits. See the [claim implementation map](docs/program/CLAIM_IMPLEMENTATION_MAP.md) before expanding README or product claims.

## Foundation Validation Scope

API validation is schema-only by default. CLI validation resolves repository refs. Local/dev API repo-ref mode is bounded to known repo paths; any production repo-ref mode requires an explicit internal operator override and is not public production API behavior.
