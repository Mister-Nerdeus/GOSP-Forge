# ADR 0001: Core and vertical dependency boundary

- Status: Accepted for Phase 0
- Date: 2026-08-06

## Decision

Domain-neutral core packages must not import or encode a specific engineering vertical.

Allowed direction:

```text
vertical / adapter -> GOSP core
```

Forbidden direction:

```text
GOSP core -> HouseSim/building/water/energy/etc.
```

## Rationale

The original repository began around HouseSim. The broader GOSP Forge plan requires an Engineering Program Graph capable of representing many engineering programs. Without a hard dependency boundary, housing assumptions would become accidental universal semantics.

## Consequences

- HouseSim-specific geometry, HVAC, CNC-sheet, climate, and code concepts remain in the HouseSim vertical.
- Universal contracts contain only concepts that are defensible across domains.
- New domain requirements may cause core extension only after an explicit architecture decision.
