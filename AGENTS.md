# AGENTS.md

## Mission

Build `GOSP-Forge` as an AI-assisted, contract-first simulation and game platform.

The first product is `HouseSim Challenge`: a web and mobile game where users compete to design better high-performance homes and micro-neighborhoods using deterministic simulation, scorecards, leaderboards, proof reports, and real-world creator credit.

## HouseSim baseline

HouseSim treats a home as a repeatable manufactured shell platform rather than a one-off drawing.

Default anchor:

- 28 ft x 48 ft footprint.
- 1,344 sq ft main floor.
- 2-3 bedrooms.
- 2 bathrooms.
- Partial basement options: 24 ft x 28 ft or 28 ft x 28 ft.
- CNC sheet comparison: 4x8 vs 4x12.
- Panelized high-performance wall cartridges.
- Cold-climate heat pump.
- ERV.
- Heat-pump water heater.
- Solar/battery/EV-ready electrical design.
- Wired-first smart-home infrastructure.

## Absolute rules

- Contracts before UI.
- Deterministic simulation before visual polish.
- Every simulation output must expose inputs, assumptions, method, model level, warnings, and limitations.
- Keep scoring assumptions visible.
- Do not use unseeded randomness in simulation or scoring.
- Do not change scoring weights silently.
- Do not add major dependencies without a dependency decision record.
- Production deploys require human approval.
- Legal, contest, prize, app-store, construction, franchise, and certification language requires human approval.

## Required closeout for every PR

Every PR must include:

1. Files changed.
2. Commands run.
3. Tests passed or failed.
4. Evidence artifacts produced.
5. Known limitations.
6. Screenshots or JSON output if UI/report behavior changed.

## Required commands

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm validate:fixtures
pnpm simulate:baseline
pnpm report:comparison
pnpm guardrails:wording
pnpm build
```

If a command cannot run because the repo is not ready yet, document why and add an issue to close that gap.

## Preferred architecture

- `apps/web`: browser product.
- `apps/api`: Railway API.
- `apps/mobile`: Expo/React Native Android and iOS app.
- `apps/worker`: background simulation/report jobs.
- `packages/contracts`: shared schemas and types.
- `packages/simulation`: deterministic simulation engines.
- `packages/scoring`: scorecard and ranking logic.
- `packages/fixtures`: approved test scenarios.
- `packages/validation`: fixture and runtime validation.
- `docs`: product, architecture, legal, verification, deployment, and franchise documentation.
- `evidence`: local and CI proof artifacts.

## AI agent behavior

- Work in small PRs.
- Prefer issue-scoped changes.
- Add or update tests with every engine change.
- Add or update fixtures before declaring a simulation feature complete.
- Never weaken guardrails to make tests pass.
- Update docs when behavior or contracts change.
- Keep generated outputs auditable.
