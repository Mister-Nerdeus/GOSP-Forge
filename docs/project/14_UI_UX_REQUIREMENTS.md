# UI and UX Requirements

## UX goal

GOSP Forge should make complex STEM systems understandable without hiding the technical depth.

The UI should support:

- students
- teachers
- gamers
- makers
- engineers
- manufacturers
- sponsors
- professional users

## Core UX workflow

```text
Choose a problem
→ choose mode
→ inspect baselines
→ pick modules
→ connect modules
→ run simulation
→ compare alternatives
→ inspect cost/labor/materials
→ view representations
→ score results
→ save/share/remix
```

## Modes

### Dream Mode

- free creative building
- warnings instead of blockers
- supports incomplete projects
- good for gamers and brainstorming

### Soft Simulation

- supported models run
- unsupported sections warn
- confidence shown

### Scoring Mode

- strict rules
- baseline comparison
- official runs
- server verification
- locked assumptions

### Professional Mode

- provenance required
- confidence required
- reports
- no unsupported claims

### Research Mode

- reproducible runs
- model versions
- sweeps
- data exports

### Education Mode

- public school free access
- teacher/student views
- safe module catalog
- guided explanations

## Main screens

### 1. Problem Browser

Shows:

- clean water
- solar farm
- greenhouse automation
- wastewater treatment
- internet access
- traffic
- STEM fabrication projects

### 2. Project Builder

Panels:

```text
left: module library
center: build/connection canvas
right: inspector
bottom: simulation timeline/output
```

### 3. Module Inspector

Shows:

- what it does
- who made it
- license
- module type
- capabilities
- inputs
- outputs
- specs
- representation
- fabrication
- score
- confidence
- safety
- education notes

### 4. Representation Viewer

Supports:

- no visual
- icon
- symbolic 2D
- symbolic 3D
- node graph
- dashboard
- proxy 3D
- asset 3D
- CAD/fabrication reference

### 5. Simulation Panel

Shows:

- run mode
- assumptions
- confidence
- metrics
- warnings
- bottlenecks
- direct impacts
- downstream impacts

### 6. Pricing Panel

Shows:

- BOM
- product costs
- custom fabrication costs
- labor
- manufacturing route
- lifecycle cost
- confidence
- missing data

### 7. Swap Lab

Core feature.

User selects a module or product and swaps alternatives.

Shows:

- cost delta
- performance delta
- labor delta
- schedule delta
- compatibility issues
- lifecycle delta
- score delta
- confidence delta

### 8. Attribution Panel

Shows:

- creator
- contributors
- sponsor
- license
- remix lineage
- citation text

### 9. Safety Panel

Shows:

- safety level
- hazards
- PPE
- warnings
- review requirements

### 10. Education Panel

Shows:

- grade band
- learning objectives
- build time
- materials
- teacher notes
- student guide

## UI design principles

1. Show, do not hide, assumptions.
2. Use plain language first, technical details second.
3. Always show confidence.
4. Make creator credit visible.
5. Separate sponsor support from scoring.
6. Show direct and downstream effects.
7. Use warnings in Dream Mode.
8. Give students explanations.
9. Give engineers data.
10. Give gamers optimization feedback.

## Non-physical modules

Not all modules are physical.

UI must support:

| Module | Representation |
|---|---|
| logic gate | node, chip icon, truth table |
| controller | control block, state machine |
| dashboard | UI panel |
| cost model | calculator card |
| labor process | timeline |
| internet service | network node |
| policy constraint | rule card |

## Gamer UX

Gamers need:

- fast feedback
- visible bottlenecks
- meaningful optimization
- variant comparison
- leaderboards
- badges
- contribution credits
- creative freedom
- challenges

## Teacher UX

Teachers need:

- safe mode
- project templates
- class time estimates
- materials lists
- learning objectives
- rubric
- student privacy
- no payment prompts

## Engineer UX

Engineers need:

- detailed specs
- units
- assumptions
- provenance
- confidence
- exportable reports
- variant comparison
- source data

## Manufacturer UX

Manufacturers need:

- spec submission flow
- AI extraction review
- product page
- verification status
- sponsor disclosure
- usage analytics
- no scoring control

## Sponsor UX

Sponsors need:

- impact metrics
- disclosure
- supported modules/challenges
- free school impact
- no control over scoring

## Accessibility

Early requirements:

- keyboard navigation
- colorblind-safe indicators
- readable charts
- text alternative for 3D
- simple mode for students
- advanced mode for engineers

## First UI MVP

The first UI should support:

- loading the Automated Water Filter System
- inspecting modules
- viewing symbolic/proxy representations
- running simulation
- seeing cost/labor/material estimates
- seeing scorecards
- viewing attribution
- exporting project manifest

Do not build full CAD editor first.
