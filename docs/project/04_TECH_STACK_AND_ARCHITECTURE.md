# Tech Stack and Architecture

## Architectural doctrine

GOSP Forge should be a deterministic, modular, data-driven simulation platform with optional 3D and fabrication representations.

The source of truth is not the renderer. The source of truth is the project manifest, module contracts, graphs, input parameters, product specs, and simulation models.

## Core technical principles

1. Contracts first.
2. Explicit units.
3. Deterministic when possible.
4. Multi-fidelity simulation.
5. Representation is optional.
6. Manufactured products and custom parts coexist.
7. AI proposes; humans verify; simulation explains.
8. Public schools stay free.
9. Sponsors do not control scoring.
10. Every output declares confidence.

## Recommended stack

| Layer | Recommended Tech |
|---|---|
| Language | TypeScript |
| Package manager | pnpm |
| Schemas/contracts | Zod |
| Runtime | Node.js |
| Web app | React + Vite |
| 3D preview | Three.js / React Three Fiber |
| Server/API | Node.js |
| Database | Postgres |
| Spatial later | PostGIS |
| Object storage | S3-compatible storage later |
| CLI | Node.js CLI |
| Testing | Node test/Vitest later |
| Data files | JSON, CSV, Markdown |
| 3D preview format | glTF |
| 3D print refs | STL |
| CNC refs | DXF/SVG |
| CAD later | STEP |
| Parametric CAD later | OpenSCAD, CadQuery, build123d |
| AI | provider-agnostic adapters |

## Package structure

```text
packages/contracts
  all shared schemas and types

packages/sim-core
  deterministic simulation kernels

packages/estimation
  pricing, BOM, quantity takeoff, lifecycle cost

packages/fabrication
  manufacturing route, material, labor, print/CNC estimation

packages/cli
  validation, simulation, scoring, export, fixture tools

packages/api
  module registry, project storage, product catalog, challenges

packages/module-registry
  package validation, publishing, trust, remix lineage

packages/ai-proposals
  AI import/proposal adapters, no truth authority

apps/web
  user-facing builder, registry, simulation, scoring
```

## System layers

```text
Problem Layer
  ProblemDefinition, constraints, metrics, baselines

Design Layer
  ProjectManifestV2, DesignDocument

Module Layer
  ModulePackage, capabilities, inputs/outputs, attribution

Graph Layer
  ModuleGraph, ResourceFlowGraph, ControlGraph, FabricationGraph

Product Layer
  ProductBinding, ProductSpec, ProductSpecMeaning

Estimation Layer
  PricePack, CostEstimate, QuantityTakeoff, LifecycleCost

Fabrication Layer
  AssetManifest, MaterialSpec, ManufacturingRoute, LaborProfile

Simulation Layer
  multi-fidelity engines

Representation Layer
  symbolic, node graph, proxy 3D, asset 3D, CAD/fabrication

Registry Layer
  module publishing, remixing, trust levels, licensing

Scoring Layer
  module scorecards, system scorecards, challenge scores
```

## Simulation engine registry

Different module types require different simulation engines.

| Engine | Use |
|---|---|
| ResourceFlowEngine | water, power, food, waste, data |
| LogicEngine | gates, controllers, state machines |
| NetworkEngine | bandwidth, latency, uptime |
| GeometryEngine | volume, footprint, collision, clearances |
| FabricationEngine | 3D print/CNC/manufacturing estimates |
| LaborEngine | people, roles, hours, schedule |
| CostEngine | material, equipment, lifecycle |
| OperationalEngine | runtime use, maintenance, failure |
| BiologicalEngine | plant growth, composting, microbial treatment |
| TrafficEngine | road/system flow |
| ScoringEngine | compare variants and baselines |

## Recommended early architecture

Start with:

```text
Contracts + simple deterministic engines + examples
```

Do not start with heavy 3D, full CAD, or advanced solvers.

## 3D architecture

3D should be layered:

| Representation Level | Description |
|---|---|
| none | no visual needed |
| symbolic-2d | diagram or icon |
| symbolic-3d | abstract block/node |
| proxy-3d | generic approximate shape |
| asset-3d | real glTF/STL preview |
| cad | STEP/source CAD reference |
| animated | behavior animation |
| dashboard | charts/panels |
| node-graph | logic/flow graph |

## Product binding architecture

Manufactured products should enter through:

```text
ProductCatalog
  ProductBinding
    ProductSpec[]
    datasheets
    geometry
    cost
    availability
    warranty
    lifecycle
    compatibility
    provenance
```

Manufacturer verification improves confidence, not score.

## Pricing architecture

Pricing should combine:

- product costs
- material prices
- custom fabrication costs
- machine time
- labor rates
- installation time
- local price packs
- shipping/taxes
- contingency
- lifecycle replacement
- maintenance

## AI architecture

AI should be used for:

- spec extraction
- design proposals
- explanation
- documentation
- student tutoring
- variant suggestions

AI must not:

- approve safety
- override scoring
- hide uncertainty
- silently invent specs
- control project truth

All AI output should include:

```text
source refs
confidence
missing fields
assumed fields
human verification status
```

## Security architecture

Required early controls:

- file size/type validation
- asset scanning
- no unsandboxed user code
- module trust levels
- signed official submissions
- rate limits
- abuse detection
- sponsor disclosure
- attribution/takedown process
- public school privacy controls

## Compute architecture

GOSP Forge should use local-first simulation where possible.

```text
local preview
→ server quick sim
→ official scoring run
→ advanced/professional batch
```

Use:

- input hashing
- cache
- compute quotas
- sponsored compute pools
- contribution credits
- queueing
- heavy-run controls
