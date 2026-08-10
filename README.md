# GOSP Forge

GOSP Forge is a problem-first, domain-neutral protocol foundation for reproducible STEM and engineering evaluation. This repository contains canonical contracts, REP v0.1, a deterministic synthetic benchmark, local evidence tooling, foundation services, a Clean Water vertical, and a minimal local Challenge → Submission → Evaluation → Evidence → Comparison application slice. It does not provide a complete product UI, CAD tool, marketplace, professional engineering workflow, potable-water validation, certification, production persistence, or production manufacturing approval.

## Current State

Implemented in the current verified local technical lineage: the 18 canonical Engineering Program Graph object contracts, typed claims/proof obligations/evidence, separate fidelity and readiness metadata, domain-neutral Scenario and controlled comparison structures, REP v0.1, normative canonical JSON, `sandbox-001`, recorded replay, material/execution-evidence separation, truthful local verification commands, a Clean Water vertical adapter consuming generic core, and the minimal Phase-1A Challenge → Submission → Evaluation → Evidence → Comparison loop.

The protected Phase-0B `sandbox-001` material hash matches in native Windows/Node 22 and Docker Linux/Node 24. The Phase-1A checkpoint and its separately committed remediation descendant have been locally re-audited. The selected lineage remains unpublished remotely.

Not implemented yet: full editor UI, full CAD, professional-grade simulation, manufacturer verification workflows, public leaderboards, production storage, production deployment readiness, or imported legacy code.

## Canonical Docs

- [Revision 3 source of truth](docs/source-of-truth/GOSP_Forge_Project_Source_of_Truth_2026-08-07_R3.md)
- [Revision 2 source of truth (historical)](docs/source-of-truth/GOSP_Forge_Project_Source_of_Truth_2026-08-07_R2.md)
- [Observed repository reconciliation](docs/source-of-truth/REPOSITORY_STATUS_RECONCILIATION_2026-08-07.md)
- [Current Phase-0B implementation status](docs/source-of-truth/PHASE_0B_IMPLEMENTATION_STATUS_2026-08-07.md)
- [REP v0.1](docs/rep/REP_V0.1.md)
- [Repository instructions](AGENTS.md)
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
- [Authoritative-lineage ADR](docs/adr/0006-authoritative-repository-lineage.md)
- [Repository lineage audit](docs/program/GOSP_REPOSITORY_LINEAGE_AUDIT_2026-08-09.md)
- [Reconciliation work-order provenance](docs/program/WORK_ORDER_PROVENANCE_2026-08-09.md)
- [Browser smoke strategy](docs/testing/BROWSER_SMOKE_TEST_STRATEGY.md)

## Local Gates

```powershell
pnpm install
pnpm verify
pnpm evidence:local
```

The current policy is local-only. The GitHub Actions workflow has no automatic push or pull-request trigger.

## Claim vs Implementation

The repository claims only a foundation implementation. All examples are educational fixtures with explicit confidence, assumptions, attribution, and safety limits. See the [claim implementation map](docs/program/CLAIM_IMPLEMENTATION_MAP.md) before expanding README or product claims.

## Foundation Validation Scope

API validation is schema-only by default. CLI validation resolves repository refs. Local/dev API repo-ref mode is bounded to known repo paths; any production repo-ref mode requires an explicit internal operator override and is not public production API behavior.
