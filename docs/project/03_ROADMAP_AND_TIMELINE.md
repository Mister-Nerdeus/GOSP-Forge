# Roadmap and Timeline

## Overview

This roadmap is designed for a 24-month first program cycle with optional 36-month expansion. The goal is to create a credible, useful, sponsor-ready, education-friendly, modular STEM systems forge.

The first proof is not a city or a full CAD engine. The first proof is a complete hybrid STEM system.

## Phase 0 — Repository Foundation

**Time frame:** Week 1–2  
**Goal:** Create a clean GOSP Forge project structure.

### Deliverables

- README with thesis
- monorepo skeleton
- package naming
- program docs
- issue contract standard
- contribution guide
- project invariants
- relationship to `commons-sim`
- basic validation scripts

### Suggested repo structure

```text
GOSP-Forge/
  apps/
    web/
  packages/
    contracts/
    sim-core/
    cli/
    api/
    estimation/
    fabrication/
    module-registry/
    ai-proposals/
  examples/
    modules/
    projects/
    products/
    challenges/
    education/
  docs/
    product/
    architecture/
    contracts/
    governance/
    sponsorship/
    finance/
    education/
    audits/
    program/
  artifacts/
    controls/
    batches/
```

### Exit criteria

- Repo has clear thesis.
- Repo builds minimal skeleton.
- Roadmap and issue process exist.
- Current state is honest: repo is new and foundational.

---

## Phase 1 — Import and Reframe Useful Foundations

**Time frame:** Week 2–4  
**Goal:** Import useful foundations from `commons-sim` without inheriting the old narrow thesis.

### Import candidates

- shared contracts → `packages/contracts`
- engine → `packages/sim-core`
- CLI → `packages/cli`
- server → `packages/api`
- web app → `apps/web`
- examples/modules and graphs → `examples/`
- validation/audit patterns → `docs/program/reference`

### Reframe as

- `commons-sim` = first deterministic simulation kernel and contract incubator
- GOSP Forge = broad product ecosystem

### Exit criteria

- Imported packages build.
- Source attribution is documented.
- Old community-only language is not used as new thesis.

---

## Phase 2 — Governance, Sponsorship, Free Education

**Time frame:** Month 1–2  
**Goal:** Make the project sponsor-ready and education-safe.

### Deliverables

```text
docs/sponsorship/SPONSORSHIP_OVERVIEW.md
docs/sponsorship/SPONSOR_TIERS.md
docs/sponsorship/SPONSOR_INDEPENDENCE_CHARTER.md
docs/sponsorship/MANUFACTURER_SPEC_SUBMISSION_PROGRAM.md
docs/sponsorship/IN_KIND_SPONSOR_LEDGER_POLICY.md
docs/education/PUBLIC_SCHOOL_FREE_ACCESS_POLICY.md
docs/governance/OPEN_LICENSING_POLICY.md
docs/governance/MODULE_ATTRIBUTION_POLICY.md
docs/governance/PAY_TO_WIN_PROHIBITION.md
docs/governance/SAFETY_AND_USE_POLICY.md
docs/finance/CLASSROOM_COMMONS_FUNDING_MODEL.md
```

### Exit criteria

- Sponsors cannot buy control.
- Public schools are core-free by policy.
- Manufacturers can pay to verify specs but not rank better.
- Safety and licensing policies exist.

---

## Phase 3 — Core Problem and Module Contracts

**Time frame:** Month 2–4  
**Goal:** Build the contract layer for problem-first modular systems.

### Deliverables

```text
ProblemDefinition
MetricSet
ConstraintSet
BaselineSolution
ModePolicy
ProjectManifestV2
DesignDocument
ModuleCapabilities
RepresentationProfile
ModuleAttribution
ModuleLicense
SafetyProfile
EducationProfile
SimulationConfidence
```

### Exit criteria

- Physical, digital, logical, process, and service modules can all validate.
- 3D is optional.
- Attribution is required.
- Public school mode is expressible.
- Dream Mode and Scoring Mode are distinguishable.

---

## Phase 4 — Product Specs and Pricing Contracts

**Time frame:** Month 4–6  
**Goal:** Enable real-world manufactured products and pricing estimates.

### Deliverables

```text
ProductBinding
ProductSpec
ProductSpecMeaning
PricePack
CostEstimate
QuantityTakeoff
LifecycleCost
AvailabilityProfile
WarrantyProfile
CompatibilityRule
```

### Exit criteria

- A battery, solar panel, pump, router, or sensor can be represented as a manufactured product.
- Product specs explain their meaning and effect.
- Manufacturer verified vs community submitted data is distinguished.
- Pricing estimates declare confidence.

---

## Phase 5 — Fabrication, Manufacturing, and Labor Contracts

**Time frame:** Month 5–7  
**Goal:** Model custom parts and production processes.

### Deliverables

```text
AssetManifest
GeometryProfile
MaterialSpec
FabricationProfile
ManufacturingRoute
LaborProfile
BOM
ModuleScorecard
EvidenceBundle
RemixLineage
```

### Exit criteria

- Custom fabricated parts can be simulated for material, machine time, labor, and cost.
- Manufactured and custom parts can coexist.
- Module scorecards exist.
- Remix lineage exists.

---

## Phase 6 — First Vertical Slice: Clean Water Problem Solver

**Time frame:** Month 7–10  
**Goal:** Prove the platform with one complete hybrid STEM system.

### Demo

# Automated Water Filter System

### Includes

- manufactured pump
- manufactured sensor
- manufactured battery/power supply
- custom filter housing
- controller logic
- dashboard
- process module for assembly/test
- BOM
- materials
- labor
- manufacturing route
- simulation
- cost estimate
- scorecard
- attribution
- safety
- education guide

### Exit criteria

- User can inspect each module.
- User can see specs and what they mean.
- User can run simulation.
- User can see cost/time/labor estimates.
- User can compare baseline vs custom design.
- User can export project package.
- User can see creator credit.

---

## Phase 7 — Builder Shell MVP

**Time frame:** Month 10–13  
**Goal:** Create first usable interface.

### Deliverables

- mode selector
- problem selection
- module library
- solution graph canvas
- representation viewer
- cost/simulation panels
- BOM panel
- labor/time panel
- scorecard panel
- attribution panel
- safety/education panel

### Exit criteria

- Clean Water demo is usable in UI.
- Dream Mode does not block incomplete designs.
- Scoring Mode runs official comparison.
- Student/teacher friendly views exist.

---

## Phase 8 — Product Catalog and Manufacturer Spec Pipeline

**Time frame:** Month 13–16  
**Goal:** Enable manufacturer and community product data.

### Deliverables

- product catalog API
- product binding validation
- AI spec import prototype
- manufacturer review workflow
- community-submitted product status
- sponsored disclosure labels

### Exit criteria

- Manufacturer spec submission workflow exists.
- AI extracts fields with confidence.
- Manufacturer can verify specs.
- Sponsored product disclosure exists.
- Product score is not pay-to-win.

---

## Phase 9 — Module Registry Prototype

**Time frame:** Month 16–19  
**Goal:** Publish, remix, and credit modules.

### Deliverables

- module package API
- module trust levels
- publish module
- remix module
- report module
- attribution display
- license display
- scorecard display
- sponsor label display

### Exit criteria

- Users can publish a module.
- Users can remix a module.
- Creator credit is preserved.
- License is preserved.
- Trust level is visible.

---

## Phase 10 — Sponsored Education Challenge

**Time frame:** Month 18–21  
**Goal:** Launch sponsor-ready public challenge.

### First campaign

# Open Clean Water STEM Challenge

### Sponsors can provide

- AI credits
- cloud hosting
- sensors
- microcontrollers
- 3D printers
- materials
- cash
- domain expert review

### Exit criteria

- sponsor deck exists
- student guide exists
- teacher guide exists
- challenge rules exist
- public education remains free
- sponsor limits are clear

---

## Phase 11 — Domain Expansion

**Time frame:** Month 21–24  
**Goal:** Expand to more systems.

### Domain packs

- solar microgrid / solar farm
- greenhouse automation
- wastewater/septic
- internet/networking
- traffic/logistics
- simple structure/building kit
- polygon community utilities

### Exit criteria

- Variant/swap simulation works for at least one larger system.
- Pricing engine can estimate a larger system.
- Manufactured products can be swapped and compared.
- Module/system/community rollups work.

---

## Optional Phase 12 — Advanced Fidelity

**Time frame:** Month 24–36

Add:

- advanced 3D viewers
- glTF assemblies
- STL/DXF previews
- STEP support
- parametric CAD experiments
- professional reports
- external solver integration
- research mode
- uncertainty bands
- field validation datasets

## Immediate 10-step execution order

1. Create thesis docs.
2. Create governance/sponsor/free education docs.
3. Import selected `commons-sim` foundations.
4. Build core contracts.
5. Build product/pricing contracts.
6. Build fabrication/labor contracts.
7. Build Clean Water demo data.
8. Add simulation/estimation for Clean Water.
9. Build UI shell.
10. Prepare sponsored challenge.
