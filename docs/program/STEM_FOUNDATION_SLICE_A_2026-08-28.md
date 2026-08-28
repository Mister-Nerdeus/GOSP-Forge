# STEM Foundation — Slice A: Show the System

Date: 2026-08-28
Branch: `cipher/stem-foundation`
Issue: #4
Status: **Working implementation; local verification not yet executed**

## Purpose

This slice begins the foundational STEM work before advanced competition layers. It adds a domain-neutral projection that lets GOSP expose what system is being evaluated, what boundary is controlled, what model and workflow are in use, what engineering requirements and constraints apply, and what evidence/readiness state supports the current result.

The projection is deliberately additive. It does not create a new physics engine, score, claim, evidence state, or browser-only source of truth.

## Implemented

### Contract

Added `StemSystemProjectionSchema` under `packages/contracts/src/education/`.

The first projection carries:

- problem title and statement;
- exact Challenge / Scenario / Model / Workflow boundary;
- declared Scenario system elements;
- controlled environment, operating conditions, and parameters;
- material assumptions;
- engineering requirements and constraints;
- model type, fidelity, calibration status, solver identity, and limitations;
- workflow steps;
- current claim, evidence readiness, deployment readiness, professional disposition;
- evidence records and unresolved proof obligations;
- an explicit disclosure that the view is a projection of canonical GOSP records.

The learning depth is initially fixed to `explore`. Later slices will project the same canonical system through `measure`, `model`, `solve`, `verify`, and `research-professional` views.

### API projection

Added `buildStemSystemProjection(...)` in the Phase-1A API package. It derives the view from the existing canonical workspace and a recorded evaluation. It performs no new engineering calculation.

Added local endpoint:

```text
GET /api/phase1a/stem-system
GET /api/phase1a/stem-system?challengeId=<id>&challengeRevision=<revision>
```

The endpoint can project the default Sandbox challenge or another registered Challenge such as Clean Water.

### Test intent

Added focused tests for:

- projection of the canonical Sandbox workspace;
- preservation of model fidelity/workflow/evidence state;
- unresolved proof obligations remaining visible;
- endpoint exposure for Sandbox and Clean Water;
- rejection of incomplete Challenge selection.

The new test file was added to `config/intended-tests.json` so repository test-discovery controls include it.

## What this slice does not yet do

This is not yet the complete learner-facing STEM experience. It does not yet provide:

- a dedicated browser System Map panel;
- a quantity/unit engine;
- equation substitution or dimensional analysis;
- scientific-principle registry;
- technology map;
- learning-depth selector;
- time playback;
- sensitivity/uncertainty visualization;
- experiment/test-plan representation;
- societal-impact projection.

Those remain later slices under Issue #4.

## Verification status

No local command was executed by this chat environment. No claim is made that build, typecheck, tests, `pnpm verify`, browser smoke, or evidence generation has passed.

No GitHub Actions workflow should be triggered for this work.

Recommended local verification:

```powershell
git fetch origin
git switch cipher/stem-foundation
pnpm install --frozen-lockfile
pnpm verify
pnpm --filter @gosp/api test
pnpm evidence:local
```

After local verification, inspect the endpoint for both Sandbox and Clean Water and confirm the projection contains only canonical data already represented by the selected workspace/evaluation.

## Next slice

**Slice B — Show the Math foundation** should add a domain-neutral quantity/equation explanation contract that can expose expression, variables, units, current values, intermediate values, assumptions, provenance/status, and dependency links without replacing the canonical model or solver.
