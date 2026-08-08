# ADR 0001: Domain-Neutral Core and Vertical Adapters

- Status: Accepted for Phase-0B
- Date: 2026-08-07

## Context

The inspected repository placed Clean Water scenario fields and engines in packages described as generic core. Revision 2 requires the dependency direction `vertical -> core`.

## Decision

GOSP contracts, canonicalization, REP evaluation, and evidence primitives are domain-neutral. Clean Water is a vertical package that consumes those primitives. Core packages must not import or encode vertical terminology.

Compatibility behavior may be preserved through vertical-owned adapters. HouseSim is not scaffolded until its real source is available.

## Consequences

- Existing Clean Water behavior is migrated, not discarded.
- A synthetic domain-neutral challenge proves REP before a domain vertical uses it.
- Boundary tests scan generic source for prohibited vertical imports and concepts.
