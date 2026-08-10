# GOSP Forge Repository Instructions

## Governing direction

Read these files before changing the repository:

1. `docs/source-of-truth/GOSP_Forge_Project_Source_of_Truth_2026-08-07_R3.md`
2. `docs/source-of-truth/REPOSITORY_STATUS_RECONCILIATION_2026-08-07.md`
3. `docs/program/PHASE_1A_CHECKPOINT_RECONCILIATION_2026-08-09.md`
4. the current ADRs under `docs/adr/`
5. `docs/rep/REP_V0.1.md`
6. `docs/adr/0005-source-implementation-identity.md`
7. `docs/verification/LOCAL_PHASE_0B_VERIFICATION.md`

Revision 3 governs project direction. Revision 2 and historical implementation reports remain provenance; their implementation and execution claims are superseded where exact-SHA reconciliation records or newly executed evidence conflict with them. Observed repository state and newly executed evidence control current status claims.

## Current operating policy

- Work and verify locally only.
- Do not push, modify pull requests, or make other remote GitHub changes without explicit user authorization.
- Do not trigger GitHub Actions.
- Do not commit without explicit user authorization.
- Do not modify the `staging` branch.
- Do not install or substantially configure WSL, Docker, virtual machines, services, or major dependencies without explicit user authorization.
- Preserve repository history and historical validation artifacts.
- Preserve immutable checkpoints `2945361038ee63d26304b4279d703c11ed66d14b`, `9f67e1745ae9ed56bd79237a429863213fc492c9`, and `d49e9d11116fd59e3f3f38c638dfe63c1bc02924` and their remediation provenance.
- The selected authoritative-lineage strategy is ADR 0006 Option A. Do not merge unrelated histories or change remote authority without the applicable owner gate.

## Architecture

- GOSP core is domain-neutral.
- Domain verticals may depend on core contracts and the REP runner.
- Core packages must not import or encode Clean Water, HouseSim, building, or other vertical-specific concepts.
- Keep model fidelity, evidence readiness, deployment readiness, and professional approval/certification distinct.
- Environment-specific execution evidence must not affect material-result hashes.

## Truthful reporting

Separate all status reporting into observed, implemented, executed, verified, historical evidence, inferred/proposed, and not verified. Never claim a command passed or a result reproduced unless that exact command or comparison was executed.
