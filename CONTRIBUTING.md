# Contributing to GOSP Forge

GOSP Forge is a local-first foundation and early challenge-facing application. Contributions should improve the smallest trustworthy end-to-end loop instead of broadening scope without a governing decision.

## Before coding

1. Read `AGENTS.md` and Revision 3.
2. Read the relevant ADRs and REP documentation.
3. Keep work issue- or decision-scoped.
4. Identify whether the change belongs in domain-neutral core, an adapter, or a vertical.
5. Identify any material identity, evidence, safety, licensing, or remote-automation impact before implementation.

## Domain-neutral core test

Before adding a concept to core contracts, ask whether it remains meaningful across unrelated engineering domains. If it encodes a Clean Water, HouseSim, building, or other vertical-specific assumption, it belongs in a vertical or adapter.

## Verification

Run the applicable local gates, normally:

```bash
pnpm verify
```

Report exactly what ran, what passed or failed, and what was not run. Keep material results distinct from environment-specific execution evidence.

## Pull requests

Use the PR template. Include exact base/head SHAs, contract and material-identity impact, provenance, safety/non-claim boundaries, licensing effects, known limitations, and executed evidence. Small changes are preferred.

The current policy does not authorize automatic GitHub Actions. A remote check is not evidence unless it was explicitly authorized and actually executed.

## Licensing

The repository retains its MIT root license. Read `docs/licensing/strategy.md` before adding third-party code, assets, models, datasets, or standards text. Public availability does not establish redistribution or commercial-use rights.
