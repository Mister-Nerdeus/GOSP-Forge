# Vertical Slice: Automated Water Filter System

## Purpose

The Automated Water Filter System is the first complete GOSP Forge proof.

It demonstrates:

- real-world problem definition
- manufactured product specs
- custom parts
- digital/logical modules
- physical modules
- process modules
- pricing
- manufacturing
- labor
- simulation
- scorecards
- attribution
- safety
- education
- optional 3D representation

## Problem

Provide clean water for a small group under budget, tool, time, safety, and labor constraints.

## Target users

- public school students
- teachers
- makers
- beginner engineers
- gamers
- sponsors
- manufacturers

## Metrics

| Metric | Direction |
|---|---|
| cost per liter/gallon | minimize |
| build cost | minimize |
| build time | minimize |
| labor-hours | minimize |
| water output | maximize |
| safety | maximize |
| maintainability | maximize |
| education value | maximize |
| simulation confidence | maximize |
| fabricability | maximize |

## Constraints

Example:

```text
budget: $200
team size: 2 students
tools: 3D printer, basic hand tools
time: one class period for assembly, overnight print allowed
power: small battery or wall power
safety: classroom-safe or supervised
```

## Baseline solutions

- commercial gravity filter
- simple sand filter
- pump + cartridge filter
- boiling/chlorination
- UV treatment concept

## Modules

### Raw Water Tank

Type:

```text
physical
```

Capabilities:

- physical geometry
- resource storage
- optional representation
- material profile

### Pump

Type:

```text
manufactured physical/resource module
```

Uses ProductBinding:

- voltage
- flow rate
- current
- pressure/head
- cost
- weight
- dimensions
- lifecycle
- safety notes

### Filter Housing

Type:

```text
custom physical/fabricatable module
```

Includes:

- asset manifest
- material spec
- fabrication profile
- manufacturing route
- labor profile
- BOM
- scorecard

### Filter Media

Type:

```text
manufactured/consumable module
```

Includes:

- cost
- replacement interval
- performance assumptions
- safety notes

### Water Quality Sensor

Type:

```text
manufactured physical + digital output
```

Includes:

- measurement type
- accuracy
- power draw
- output signal
- cost
- calibration notes

### Controller Logic

Type:

```text
logical/digital module
```

No fabrication required.

Capabilities:

- control logic
- executable/simulatable behavior
- symbolic representation
- scoring profile

Example logic:

```text
if sensor reading exceeds threshold:
  turn on warning
  stop pump
else:
  allow flow
```

### Power Supply

Type:

```text
resource module
```

Could be:

- battery
- wall adapter
- solar + battery later

### Status Dashboard

Type:

```text
digital module
```

Representation:

- dashboard
- symbolic UI
- no physical geometry required

### Clean Water Tank

Type:

```text
physical storage module
```

## Simulation

### Resource flow

```text
raw water tank → pump → filter housing → clean water tank
```

### Data/control flow

```text
sensor → controller logic → pump/dashboard
```

### Power flow

```text
battery/power supply → pump + sensor + dashboard
```

## Outputs

- estimated water output
- energy use
- material cost
- equipment cost
- print time
- assembly time
- test time
- number of people required
- score
- confidence
- warnings
- known unknowns

## Manufacturing route example

```text
Step 1: print filter housing
  machine: FDM printer
  material: PETG
  run time: estimated
  operator: maker/student supervised

Step 2: post-process
  remove supports
  inspect threads
  clean surfaces

Step 3: assemble
  install gasket
  insert media
  connect tubing

Step 4: leak test
  run water
  inspect failure

Step 5: connect sensor/controller
```

## Scorecard

Score categories:

- functionality
- cost efficiency
- fabricability
- safety
- documentation
- maintainability
- education value
- simulation confidence
- remixability

## Safety

Safety profile should include:

- water may not be potable unless validated
- electrical parts should be supervised
- 3D printed plastic may not be food safe by default
- teacher supervision required
- no claims of real-world potable water unless tested

## Education profile

Learning objectives:

- water flow
- filtration
- sensors
- control logic
- power
- cost estimation
- materials
- manufacturing process
- engineering tradeoffs
- simulation confidence

## Sponsor fit

Possible sponsors:

- AI provider
- cloud provider
- 3D printer company
- sensor manufacturer
- microcontroller company
- water technology company
- STEM foundation

## Deliverable package

The example should include:

```text
problem definition
project manifest
module packages
product bindings
fabrication profile
BOM
labor profile
manufacturing route
simulation result
scorecard
teacher guide
student guide
safety notes
```

## Success criteria

The vertical slice is successful if it proves:

```text
problem-first workflow
manufactured + custom parts
physical + digital + logical modules
simulation + pricing + labor
optional 3D representation
creator credit
scorecard
public-school-friendly use
```
