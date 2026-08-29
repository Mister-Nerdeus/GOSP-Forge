# STEM Foundation — Slice A: Show the System

Date: 2026-08-28
Branch: `cipher/stem-foundation`
Issue: #4
Status: **A1 implemented and locally verified; A2 remains required for the complete Show-the-System gate**

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

This implemented seam is now named **A1**. It does not close all of Phase A. **A2** must resolve learner-readable system elements, declared interactions/interfaces/flows, inputs and outputs, and a browser System Map. Connections that are absent from canonical records must remain explicitly undeclared rather than being inferred by the projection.

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

Executed locally on 2026-08-28 in an isolated worktree at branch tip `f062a1c638ecad1ae4d1616bb694b0420b57521f`:

- Node `v22.16.0`;
- pnpm `9.15.5`;
- `pnpm install --frozen-lockfile` — pass;
- `pnpm verify` — pass;
- intended test discovery — 33 intended, 33 discovered;
- tests — 149 passed;
- REP replay — input hash and result hash matched;
- Clean Water validation, simulation, and estimate — completed;
- foundation audit — 23 pass, 0 warn, 0 fail.

The first attempt to execute only `pnpm --filter @gosp/api test -- stemSystemProjection.test.ts` occurred before dependencies were installed/built and did not run tests because `@gosp/contracts` could not be resolved. That precondition failure is not counted as a test result. The repository's official `pnpm verify` sequence subsequently built workspace packages and passed all API tests, including the STEM projection tests.

No browser System Map exists yet, so no Slice A browser acceptance is claimed. No local evidence artifact was generated. No GitHub Actions workflow was triggered. No canonical merge is authorized or performed.

The full initiative roadmap and recurring verification gate are recorded in:

- `docs/program/STEM_FOUNDATION_EXECUTION_PLAN_2026-08-28.md`;
- `docs/program/STEM_FOUNDATION_VERIFICATION_CHECKLIST.md`.

## Next slice

Proceed with two coordinated work packages:

1. **A2 — Complete Show the System** with resolved elements, declared interactions/flows, and a learner-facing System Map.
2. **B — Show the Math foundation** with domain-neutral quantities, equations, units, substitutions, provenance/status, intermediate values, and dependency links without replacing the canonical model or solver.
