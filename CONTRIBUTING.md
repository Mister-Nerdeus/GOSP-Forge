# Contributing to GOSP Forge

GOSP Forge is in Phase 0. Contributions should improve the smallest trustworthy end-to-end loop rather than broaden scope prematurely.

## Before coding

1. Read `AGENTS.md`.
2. Check the relevant ADRs under `docs/adr/`.
3. Keep work issue- or decision-scoped.
4. Identify whether the change belongs in domain-neutral core, an adapter, or a vertical.

## Core test

Before adding something to `packages/contracts`, ask:

> Would this concept still make sense for a building, pump, fixture, water process, electronics assembly, and software/control workflow?

If not, it probably belongs in a vertical or adapter.

## Verification

Run:

```bash
pnpm verify
```

Report exactly what ran and what did not. Do not claim a check passed without an executed result.

## Pull requests

Use the PR template. Include contract compatibility, provenance, safety, and licensing effects where applicable. Small PRs are preferred.

## Licensing

The current repository license is not changed by the Phase 0 rebaseline. See `docs/licensing/strategy.md` before adding third-party code or assets. Third-party availability on GitHub does not itself establish redistribution or commercial-use rights.
