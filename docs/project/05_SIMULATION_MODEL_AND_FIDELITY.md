# Simulation Model and Fidelity

## Core simulation thesis

GOSP Forge should provide the most realistic simulation possible given:

- available input parameters
- data source quality
- module fidelity
- model type
- validation evidence
- uncertainty
- safety risk
- user mode

The simulator should never claim more confidence than the data supports.

## Multi-fidelity ladder

### Level 0 — Conceptual

Used for early ideas, Dream Mode, young students, AI drafts.

Example:

```text
pump moves water
battery stores power
filter improves water quality
```

Outputs:

- rough warnings
- rough score
- no strong claims

### Level 1 — Rule-of-thumb

Uses simple algebraic formulas.

Examples:

```text
material_cost = mass × unit_cost
print_time = volume × print_rate
flow_output = pump_rating × efficiency
labor_hours = task_count × duration
```

Good for:

- classroom projects
- early STEM simulations
- quick estimates
- low-compute gaming

### Level 2 — Network / lumped parameter

Uses connected nodes and flows.

Examples:

```text
tank → pump → pipe → filter → tank
solar panel → inverter → battery → load
```

Good for:

- water systems
- energy systems
- internet/network systems
- process systems

### Level 3 — Time-step / discrete event

Adds time, schedules, queues, failures.

Examples:

- printer runs for 6 hours
- operator assembles for 20 minutes
- inspection fails 5% of units
- solar output changes hourly
- pump fails during demand spike

Good for:

- manufacturing
- labor scheduling
- construction
- operations
- gamer optimization

### Level 4 — Spatial / geometry-aware

Uses dimensions, volume, mass, placement, layout.

Examples:

- solar panel row spacing
- pipe length
- cabinet clearance
- material volume
- footprint
- access roads
- maintenance access

Good for:

- 3D parts
- facilities
- solar farms
- greenhouse layouts
- community planning

### Level 5 — External/advanced solver

Delegates or integrates specialized analysis.

Examples:

- FEA
- CFD
- thermal simulation
- traffic microsimulation
- professional energy modeling
- circuit simulation
- CAD/CAM toolchains

This is future work and should be attached through evidence and external solver interfaces.

## Simulation confidence

Every simulation result should declare confidence.

Suggested levels:

| Level | Meaning |
|---|---|
| Conceptual | qualitative only |
| Estimated | rule-of-thumb |
| Model-based | structured formulas/network model |
| Catalog-backed | uses real product specs |
| Manufacturer-verified | product specs confirmed |
| Tested | physical test data attached |
| Reviewed | expert/community review |
| Field-validated | real-world deployment data |

## Required output metadata

Every simulation should output:

```text
runId
projectId
moduleIds
inputHash
outputHash
modelVersion
fidelityLevel
assumptions
units
sourceDataRefs
unknownInputs
defaultedInputs
confidence
warnings
limitations
```

## Direct and downstream impacts

The simulation must distinguish:

### Direct impact

Immediate change caused by a module.

Example:

```text
Solar panel wattage increases output.
```

### Downstream impact

System-level changes caused by the direct change.

Example:

```text
Higher wattage changes inverter compatibility, wiring, battery charging, labor, cost, maintenance, and lifecycle output.
```

## Variant and swap simulation

Core feature:

> Swap anything and see the consequences.

Examples:

- swap solar panel
- swap battery
- swap pump
- swap filter media
- swap custom part for manufactured product
- swap 3D print for CNC process
- swap controller logic
- swap labor team size

Outputs:

- performance delta
- cost delta
- labor delta
- schedule delta
- compatibility issues
- maintenance delta
- safety delta
- lifecycle delta
- confidence delta

## Problem-first simulation

Simulation should begin with a problem, not an object.

Example:

```text
Problem: Provide clean water for 20 people under $200 with limited tools.
```

Then:

```text
constraints
baseline methods
available products
custom design options
solution graph
simulation
score
evidence
```

## Baseline comparison

Every serious problem pack should include baselines.

Example clean water baselines:

- commercial gravity filter
- sand filter
- pump + cartridge
- UV treatment
- boiling/chlorination

Example solar baselines:

- grid-only
- small solar + battery
- commercial solar farm configuration
- off-grid microgrid

Scoring should compare against baselines.

## Estimate realism policy

For pricing/large projects:

```text
Low confidence:
  generic/default prices

Medium confidence:
  product catalog and known labor rates

High confidence:
  manufacturer verified specs and local price pack

Professional confidence:
  quotes, expert review, and field data
```

## Gamers and compute

Gamers will run many simulations. Use:

- local previews
- cached deterministic runs
- rate limits
- contribution credits
- sponsored compute pools
- queued official scoring
- progressive fidelity

## Education fidelity

Students should see simplified but honest models.

Good student output:

```text
This estimate is simple. It assumes average print speed and does not model leaks.
```

## Engineering fidelity

Engineers should see assumptions and provenance.

Good engineering output:

```text
This estimate uses manufacturer pump rating, default pipe loss approximation, community-submitted filter media data, and no field validation.
```

## Final simulation doctrine

> GOSP Forge does not pretend to know everything. It shows what it knows, what it assumes, what is missing, how confident it is, and what changes when the design changes.
