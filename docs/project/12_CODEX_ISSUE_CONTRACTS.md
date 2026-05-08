# Initial Codex Issue Stack

This document defines the first detailed issue stack for GOSP Forge.

## Issue #1 — Initialize GOSP Forge Monorepo

### Issue Contract

- Issue number: #1
- Batch: Foundation
- Owner: Codex
- Dependencies: none
- Blocking audit gate: Foundation audit

### Problem

The repo is currently a minimal shell. It needs a product-aligned monorepo structure.

### Files to touch or create

```text
README.md
package.json
pnpm-workspace.yaml
apps/web/.gitkeep
packages/contracts/package.json
packages/sim-core/package.json
packages/cli/package.json
packages/api/package.json
docs/product/GOSP_STEM_SYSTEMS_FORGE_THESIS.md
docs/program/ISSUE_CONTRACT_STANDARD.md
```

### Invariants

- No imported legacy code yet.
- No false claims of implementation.
- README distinguishes vision from current state.

### Plan

1. Add monorepo skeleton.
2. Add top-level README.
3. Add product thesis stub.
4. Add issue contract standard.
5. Add basic build placeholder.

### Required Output Structure

Minimal pnpm monorepo.

### Definition of Done

- `pnpm install` succeeds.
- package structure exists.
- docs exist.

### Acceptance Gates

- no broken package references
- README accurately states current implementation

### Closeout Evidence

- changed-files summary
- command log

### Risks / Open Questions

- package names may evolve.

---

## Issue #2 — Add GOSP Forge Thesis and Product Invariants

### Problem

The project needs a clear thesis before importing code.

### Files

```text
docs/product/GOSP_STEM_SYSTEMS_FORGE_THESIS.md
docs/product/GOSP_FORGE_NORTH_STAR.md
docs/governance/PRODUCT_INVARIANTS.md
README.md
```

### Invariants

- GOSP Forge is problem-first.
- Not all modules are physical.
- 3D is optional.
- Public school core access is free.
- Sponsors cannot control scoring.

### Definition of Done

Docs clearly define thesis, scope, non-goals, and invariants.

---

## Issue #3 — Add Sponsorship and Free Education Governance

### Files

```text
docs/sponsorship/SPONSORSHIP_OVERVIEW.md
docs/sponsorship/SPONSOR_TIERS.md
docs/sponsorship/SPONSOR_INDEPENDENCE_CHARTER.md
docs/sponsorship/MANUFACTURER_SPEC_SUBMISSION_PROGRAM.md
docs/education/PUBLIC_SCHOOL_FREE_ACCESS_POLICY.md
docs/governance/PAY_TO_WIN_PROHIBITION.md
docs/finance/CLASSROOM_COMMONS_FUNDING_MODEL.md
```

### Invariants

- Manufacturers can pay for verified specs.
- Manufacturers cannot pay for better scores.
- Students and public school teachers do not pay for core educational access.
- Sponsored products are labeled.

---

## Issue #4 — Import Selected `commons-sim` Foundations

### Files

```text
packages/contracts/
packages/sim-core/
packages/cli/
packages/api/
apps/web/
docs/migration/COMMONS_SIM_IMPORT.md
```

### Invariants

- Preserve attribution.
- Do not inherit narrow product thesis.
- Mark old docs as reference.
- Imported code must build.

### Definition of Done

- selected packages build
- import documentation exists
- no old README language used as new thesis

---

## Issue #5 — Add Truth Gate Local Validation

### Files

```text
scripts/controls/verify-runtime-version.mjs
scripts/controls/verify-local-validation-current.mjs
docs/gates/TRUTH_GATE_LOCAL_VALIDATION.md
```

### Invariants

- validation runtime must match expected version
- validation artifact must match current HEAD
- determinism must be preserved where applicable

---

## Issue #6 — Add ProblemDefinition, Metrics, Constraints, Baselines

### Files

```text
packages/contracts/src/problemDefinition.ts
packages/contracts/src/metricSet.ts
packages/contracts/src/constraintSet.ts
packages/contracts/src/baselineSolution.ts
docs/contracts/PROBLEM_DEFINITION.md
examples/problems/clean-water.problem.json
```

### Invariants

- project is problem-first
- baselines are required for scoring mode
- metrics have direction and units

---

## Issue #7 — Add ModePolicy

### Files

```text
packages/contracts/src/modePolicy.ts
packages/contracts/src/modeValidation.ts
docs/contracts/MODE_POLICY.md
examples/modes/dream.mode.json
examples/modes/scoring.mode.json
```

### Invariants

- Dream Mode warns, not blocks
- Scoring Mode can enforce
- Professional Mode requires provenance

---

## Issue #8 — Add ProjectManifestV2 and DesignDocument

### Files

```text
packages/contracts/src/projectManifestV2.ts
packages/contracts/src/designDocument.ts
docs/contracts/PROJECT_MANIFEST_V2.md
examples/projects/empty-dream.project-v2.json
```

### Invariants

- V2 can save incomplete designs
- compiled simulation is optional
- not tied to Scenario V1 only

---

## Issue #9 — Add ModuleCapabilities and RepresentationProfile

### Files

```text
packages/contracts/src/moduleCapabilities.ts
packages/contracts/src/representationProfile.ts
docs/contracts/MODULE_CAPABILITIES.md
docs/contracts/REPRESENTATION_PROFILE.md
examples/modules/logic-gate.module.json
examples/modules/filter-housing.module.json
```

### Invariants

- not all modules are physical
- 3D is optional
- symbolic representation is valid

---

## Issue #10 — Add Attribution and License Contracts

### Files

```text
packages/contracts/src/moduleAttribution.ts
packages/contracts/src/moduleLicense.ts
docs/contracts/MODULE_ATTRIBUTION.md
docs/contracts/MODULE_LICENSE.md
examples/modules/attribution.example.json
```

### Invariants

- every module has creator credit
- remix lineage is preserved
- license is explicit

---

## Issue #11 — Add Safety and Education Profiles

### Files

```text
packages/contracts/src/safetyProfile.ts
packages/contracts/src/educationProfile.ts
docs/contracts/SAFETY_PROFILE.md
docs/contracts/EDUCATION_PROFILE.md
```

### Invariants

- physical/safety-sensitive modules require safety profile
- public school use must be protected
- education profile includes difficulty and learning objectives

---

## Issue #12 — Add ProductBinding and ProductSpecMeaning

### Files

```text
packages/contracts/src/productBinding.ts
packages/contracts/src/productSpec.ts
docs/contracts/PRODUCT_BINDING.md
docs/contracts/PRODUCT_SPEC_MEANING.md
examples/products/pump.product.json
examples/products/battery.product.json
```

### Invariants

- specs explain meaning
- manufacturer verification improves confidence only
- sponsorship does not affect score

---

## Issue #13 — Add Pricing Contracts

### Files

```text
packages/contracts/src/pricePack.ts
packages/contracts/src/costEstimate.ts
packages/contracts/src/quantityTakeoff.ts
packages/contracts/src/lifecycleCost.ts
docs/contracts/PRICE_PACK.md
docs/contracts/COST_ESTIMATE.md
```

### Invariants

- estimates declare confidence
- source data is explicit
- professional claims are avoided

---

## Issue #14 — Add Fabrication, Manufacturing, Labor, BOM Contracts

### Files

```text
packages/contracts/src/assetManifest.ts
packages/contracts/src/geometryProfile.ts
packages/contracts/src/materialSpec.ts
packages/contracts/src/fabricationProfile.ts
packages/contracts/src/manufacturingRoute.ts
packages/contracts/src/laborProfile.ts
packages/contracts/src/bom.ts
docs/contracts/FABRICATION_PROFILE.md
docs/contracts/MANUFACTURING_ROUTE.md
docs/contracts/LABOR_PROFILE.md
docs/contracts/BOM.md
```

### Invariants

- fabrication optional
- non-physical modules remain valid
- custom parts can estimate material/time/labor

---

## Issue #15 — Add ModuleScorecard and SimulationConfidence

### Files

```text
packages/contracts/src/moduleScorecard.ts
packages/contracts/src/simulationConfidence.ts
docs/contracts/MODULE_SCORECARD.md
docs/contracts/SIMULATION_CONFIDENCE.md
```

### Invariants

- confidence shown
- score is not pay-to-win
- score source/rationale visible

---

## Issue #16 — Build Clean Water Problem Pack

### Files

```text
examples/problems/clean-water.problem.json
examples/baselines/clean-water/
docs/demos/CLEAN_WATER_PROBLEM_PACK.md
```

### Invariants

- includes baselines
- includes metrics
- includes constraints
- classroom-safe profile

---

## Issue #17 — Build Automated Water Filter System Example

### Files

```text
examples/projects/automated-water-filter.project-v2.json
examples/modules/water/
examples/modules/control/
examples/modules/digital/
docs/demos/AUTOMATED_WATER_FILTER_SYSTEM.md
```

### Invariants

- includes physical, logical, digital, and process modules
- includes manufactured and custom parts
- includes attribution and scorecards

---

## Issue #18 — Add Basic Simulation and Estimation for Clean Water Demo

### Files

```text
packages/sim-core/src/cleanWater/
packages/estimation/src/
packages/cli/src/commands/clean-water-sim.ts
```

### Invariants

- deterministic output
- confidence declared
- assumptions visible

---

## Issue #19 — Add Builder Shell MVP

### Files

```text
apps/web/src/ui/builder/
apps/web/src/ui/modules/
apps/web/src/ui/simulation/
apps/web/src/ui/scorecards/
apps/web/src/ui/attribution/
```

### Invariants

- Dream Mode warnings not blockers
- no heavy CAD
- no unsafe execution

---

## Issue #20 — Foundation Audit

### Files

```text
docs/audits/GOSP_FORGE_FOUNDATION_AUDIT.md
artifacts/batches/foundation/
```

### Invariants

- compare claims to repo state
- list known gaps
- list non-claims
- GO/NO-GO decision
