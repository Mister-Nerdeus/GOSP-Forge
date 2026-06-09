# GOSP-Forge

GOSP-Forge is an AI-assisted, contract-first simulation workspace. The first product track is **HouseSim Challenge**: a web/mobile game and simulation platform where users compete to design better high-performance homes and micro-neighborhoods.

The repository is intentionally structured so AI coding agents can work safely through small GitHub issues, pull requests, CI checks, fixture validation, and evidence-based closeout.

## Product tracks

### HouseSim Challenge

HouseSim Challenge turns housing design into a proof-based competition loop:

1. Choose or create a house/community scenario.
2. Run deterministic simulations.
3. Inspect warnings, assumptions, and model maturity levels.
4. Submit to a leaderboard.
5. Earn public creator credit for real-world prototype candidates.

The first target is a Michigan-ready 2-3 bedroom modern home with a CNC-cut panelized shell, partial basement, cold-climate heat pump, ERV, heat-pump water heater, solar/battery/EV readiness, wired-first smart-home infrastructure, reduced water/sewer burden, and low-maintenance community living.

## Important boundaries

GOSP-Forge and HouseSim are planning and simulation tools only. They do not produce permit-ready documents, engineer-stamped assemblies, code-compliance certification, construction quotes, HVAC Manual J/S/D, solar interconnection approval, or fabrication-ready CNC files.

All simulation output must label the model level, inputs, assumptions, warnings, and limitations.

## AI operating model

AI agents may implement scoped issues, write tests, add fixtures, update docs, and open pull requests. AI agents must not silently change product direction, weaken guardrails, change scoring weights, add major dependencies, deploy production, or create prize/legal language without human approval.

The repo-level instructions live in:

- `AGENTS.md`
- `.github/copilot-instructions.md`
- `.github/instructions/*.instructions.md`
- `docs/architecture/ai-agent-operating-model.md`
- `docs/verification/evidence-rules.md`

## Required local commands

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm validate:fixtures
pnpm simulate:baseline
pnpm report:comparison
pnpm guardrails:wording
pnpm build
```

## Current 60-day target

By the first defined finish, the project should have:

- AI-operable GitHub repository.
- Contract-first HouseScenario fixtures.
- Deterministic baseline simulation.
- Scorecard and comparison reports.
- Railway-ready API/backend plan.
- Cloudflare/Nerdeus.com deployment plan.
- Web/mobile product path for Android and iOS.
- Public creator-credit award model.

See `docs/product/60-day-finish-line.md` for the working release target.
