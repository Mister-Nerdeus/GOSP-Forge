# GOSP Forge Repository Instructions

## Governing direction

Read these files before changing the repository:

1. `docs/source-of-truth/GOSP_Forge_Project_Source_of_Truth_2026-08-07_R2.md`
2. `docs/source-of-truth/REPOSITORY_STATUS_RECONCILIATION_2026-08-07.md`
3. the current ADRs under `docs/adr/`
4. `docs/rep/REP_V0.1.md`
5. `docs/adr/0005-source-implementation-identity.md`
6. `docs/verification/LOCAL_PHASE_0B_VERIFICATION.md`

Revision 2 governs project direction. Its historical implementation and execution claims are superseded where the reconciliation record conflicts with them. Observed repository state and newly executed evidence control status claims.

## Current operating policy

- Work and verify locally only.
- Do not push, modify pull requests, or make other remote GitHub changes without explicit user authorization.
- Do not trigger GitHub Actions.
- Do not commit without explicit user authorization.
- Do not modify the `staging` branch.
- Do not install or substantially configure WSL, Docker, virtual machines, services, or major dependencies without explicit user authorization.
- Preserve repository history and historical validation artifacts.

## Architecture

- GOSP core is domain-neutral.
- Domain verticals may depend on core contracts and the REP runner.
- Core packages must not import or encode Clean Water, HouseSim, building, or other vertical-specific concepts.
- Keep model fidelity, evidence readiness, deployment readiness, and professional approval/certification distinct.
- Environment-specific execution evidence must not affect material-result hashes.

## Truthful reporting

Separate all status reporting into observed, implemented, executed, verified, historical evidence, inferred/proposed, and not verified. Never claim a command passed or a result reproduced unless that exact command or comparison was executed.
