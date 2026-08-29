# STEM Foundation Execution Plan

Date: 2026-08-28
Initiative: GitHub Issue #4
Working branch: `cipher/stem-foundation`
Authority base: `canonical/verified-lineage` at `e73243568619a5a4d52ab8326b97c6adea8cf2a8`
Status: **Approved direction translated into staged local work; no canonical merge authorized**

## Outcome

GOSP Forge will make one canonical engineering system understandable from initial exploration through research/professional inspection without creating a second educational truth model. A learner must be able to follow:

```text
system -> quantities -> math -> science -> engineering -> technology
       -> model/fidelity -> evidence -> experiment -> human relevance
```

Advanced competitions and the retractable-solar vertical consume and validate this infrastructure only after the foundation gates pass. They do not define core contracts.

## Authority and guardrails

This plan implements Issue #4 under Revision 3, ADRs 0001 through 0007, REP v0.1, and the current repository operating policy.

- Core contracts and projections remain domain-neutral.
- Vertical packages may declare domain content but core may not import it.
- Educational views project canonical Challenge, Scenario, Model, Workflow, Evaluation, Claim, Evidence, and REP records.
- Browser views do not calculate physics, scores, readiness, or evidence status independently.
- Model fidelity, evidence readiness, deployment readiness, and professional disposition remain separate.
- Failure, contradiction, uncertainty, and unresolved proof obligations remain visible.
- Verification is local. GitHub Actions are not used.
- No external outreach is part of this initiative.
- No merge or authority change to `canonical/verified-lineage` occurs without explicit owner authorization.
- Solar remains a later validation vertical; no solar-specific field enters a core schema.

## Slice A reconciliation

### A1 — Canonical system projection seam

Observed on branch at `f062a1c638ecad1ae4d1616bb694b0420b57521f`:

- `StemSystemProjectionSchema` is domain-neutral.
- the API projection derives from canonical workspace/evaluation records;
- Sandbox and Clean Water use the same endpoint;
- the endpoint introduces no new engineering calculation;
- evidence/readiness and open proof obligations remain visible;
- test discovery includes the new test file.

Executed on 2026-08-28:

- `pnpm install --frozen-lockfile` — pass;
- `pnpm verify` — pass;
- 33 of 33 intended test files discovered;
- 149 tests passed;
- REP replay input and result hashes matched;
- Clean Water validation/simulation/estimate completed;
- foundation audit: 23 pass, 0 warn, 0 fail.

The first attempt to run the API test alone did not execute because the fresh worktree had no installed/built workspace dependencies. It is not counted as a test result. The official full verification sequence subsequently built dependencies and passed all API tests, including the STEM projection coverage.

### A1 decision

**A1 is implemented and locally verified.** It establishes the projection seam, not the complete Show-the-System experience.

### A2 — Resolve and render the system map

A2 remains required because A1 currently returns system-element references but does not resolve learner-readable element definitions, interactions, interfaces, flows, input/output roles, or a browser System Map.

A2 is complete only when Sandbox and Clean Water can render a system boundary and connected elements from canonical records, with missing relationships disclosed rather than inferred.

## Delivery sequence

| Stage | Work packages | Depends on | Exit gate |
| --- | --- | --- | --- |
| 0 — Reconcile | A1 verified; A2 defined | canonical branch and Issue #4 | R0 |
| 1 — STEM Foundation | A2, B, C, D, E, F/G | A1; package-level dependencies below | R1 |
| 2 — Learning Projection | H | R1 | R2 |
| 3 — Dynamic STEM | I | R2 and dependency graph from B | R3 |
| 4 — Simulation to Reality | J and K | R1; J also depends on I | R4 |
| 5 — Foundation Demonstrator | L | R1 through R4 | R5 |
| 6 — Advanced Challenge Readiness | M | R5 plus explicit owner go/no-go | R6 |

Repository tracking:

| Work package | GitHub issue |
| --- | --- |
| A2 | #5 |
| B | #6 |
| C | #7 |
| D | #8 |
| E | #9 |
| F/G | #10 |
| H | #11 |
| I | #12 |
| J | #13 |
| K | #14 |
| L | #15 |
| M | #16 |

## Work packages

### A2 — Show the System: resolved system map

Deliver:

- resolved system elements with learner-readable names and roles;
- declared interfaces/interactions and typed flows where canonical records supply them;
- inputs, outputs, controlled values, changeable values, and measured outputs;
- browser System Map for Sandbox and Clean Water;
- explicit `unknown`/`not-declared` treatment instead of inferred connections.

Dependencies: A1.
Acceptance: a non-expert can identify the boundary, parts, connections, and controlled/changeable quantities without source code.
Non-claims: diagram completeness does not establish physical completeness, safety, or validation.

### B — Show the Math

Deliver:

- quantity schema with stable ID, label, symbol, value, unit, role, source/status, and result path;
- equation nodes with expression, variable bindings, substitutions, intermediate values, output, assumptions, and limitations;
- dependency links from inputs to intermediate values to results;
- dimensional-consistency status of `checked`, `not-checked`, or `not-applicable`—never an implied pass;
- Sandbox and Clean Water projections from existing REP explainability records;
- learner-facing Show-the-Math view.

Dependencies: A1; coordinate with A2 for shared quantity identifiers.
Acceptance: the displayed numeric path reproduces the recorded result without a browser-only calculation.
Non-claims: displayed equations do not establish scientific completeness, calibration, or physical validity.

### C — Show the Science

Deliver:

- domain-neutral principle declaration owned by vertical/model content;
- classification of governing principle, model equation, engineering approximation, empirical relationship, assumption, and observation;
- applicability, limitation, fidelity, and source/evidence status;
- links from principles to B equation/model nodes;
- Clean Water example plus a synthetic Sandbox `not-applicable`/benchmark treatment.

Dependencies: B.
Acceptance: the learner can distinguish nature, representation, approximation, and observation.
Non-claims: a declared principle is not proof that a model implements it adequately.

### D — Show Engineering

Deliver:

- requirements, hard gates, objectives, design variables, margins, hazards, and tradeoffs;
- revision-to-revision decision explanation using canonical comparisons;
- failed-gate and unresolved-obligation visibility before optimization results;
- no universal score where objectives conflict.

Dependencies: A2 and B.
Acceptance: a learner can explain what may change, what must not fail, and why one revision differs.
Non-claims: passing modeled gates is not safety approval or deployment readiness.

### E — Show Technology

Deliver:

- technology nodes categorized as sensor, controller, software, actuator, power, communication, fabrication, instrument, or solver;
- links to the requirement, measurement, control action, model step, or test purpose they serve;
- provenance/status for sourced product data;
- Clean Water example without introducing water fields into core.

Dependencies: A2 and D.
Acceptance: the learner can answer what each technology does and why it exists.
Non-claims: listing a component is not endorsement, availability, compatibility, or verification.

### F/G — Model Fidelity and How Do We Know?

Deliver:

- visible model/evidence ladder without equating computational complexity to evidentiary strength;
- trace graph from result through equation/model, inputs, sources, assumptions, implementation identity, execution, evidence, contradictions, readiness, and proof obligations;
- explicit broken-link and unavailable states;
- material and execution identity separation preserved.

Dependencies: A1 and B; existing REP and truth contracts.
Acceptance: one consequential Sandbox and Clean Water result can be traced end to end.
Non-claims: local replay is not independent reproduction; fidelity is not evidence readiness.

### H — Learning-depth projection

Deliver:

- Explore, Measure, Model, Solve, Verify, and Research/Professional manifests;
- inclusion/redaction rules over the same canonical projection;
- instructor-selected depth with no change to underlying material result;
- tests proving projection depth does not alter canonical inputs or hashes.

Dependencies: R1.
Acceptance: two depths show different explanatory detail for the same exact evaluation identity.
Non-claims: a depth label is not grade alignment, curriculum accreditation, accessibility certification, or learner mastery.

### I — Dynamic STEM and visualization grammar

Deliver:

- reusable visual primitives for flow, force/vector, energy, electrical, control, time-series, uncertainty, and sensitivity when data exists;
- parameter-change requests routed through the canonical evaluator;
- before/after causal highlighting from canonical comparison results;
- time playback only for recorded or model-generated time data.

Dependencies: B, H, and canonical comparison/evaluator paths.
Acceptance: changing an allowed Clean Water parameter produces a new evaluation and visibly traces what changed.
Non-claims: animation is not measurement; smooth motion is not solver fidelity.

### J — Simulation to Experiment and failure preservation

Deliver:

- test-plan contract: claim/prediction, measurements, controls, instruments, procedure, repetitions, uncertainty, and acceptance/falsification criteria;
- prediction-versus-observation record and discrepancy analysis;
- failed evaluations, negative results, and contradictions retained;
- evidence/readiness updates only through canonical truth rules.

Dependencies: F/G and I.
Acceptance: a teaching problem can record a prediction and a synthetic or explicitly labeled measured observation, with discrepancy and uncertainty visible.
Non-claims: a test plan is not a completed test; synthetic observations are not measurements.

### K — Human relevance

Deliver:

- measurable impact claims linked to canonical quantities/evidence;
- category vocabulary for cost, safety, energy, water, reliability, accessibility, maintenance, labor/skills, materials/waste, environment, and community/infrastructure;
- stakeholder/value choices shown separately from technical results;
- unsupported categories omitted or marked unknown.

Dependencies: A2, D, and F/G.
Acceptance: Clean Water explains at least one supported benefit, tradeoff, and uncertainty without advocacy language.
Non-claims: the projection is not policy advice, lifecycle assessment, environmental certification, or proof of social benefit.

### L — End-to-end foundation demonstrator

Use the existing Clean Water educational vertical as the first understandable teaching problem. Sandbox remains the deterministic protocol benchmark. Solar does not become the demonstrator.

Deliver one browser path:

```text
see -> understand -> measure -> math -> science -> engineering change
    -> evaluate -> inspect evidence -> inspect uncertainty -> compare with observation
```

Dependencies: R1 through R4.
Acceptance: a non-expert and an advanced reviewer can answer Issue #4's acceptance questions from the same exact evaluation.
Non-claims: the Clean Water demonstrator does not claim potability, treatment efficacy, field performance, or professional approval.

### M — Advanced challenge readiness gate

This is a gate and validation plan, not authorization to build or launch a competition.

Deliver:

- evidence that L passes with at least two domain adapters;
- architecture review proving no vertical fields entered core;
- explicit owner go/no-go;
- only after go: use retractable solar as a validation vertical for system, math, science, engineering, technology, fidelity, evidence, and experiment views.

Dependencies: R5 and explicit owner authorization.
Acceptance: solar consumes the same public contracts without changing core for solar terminology.
Non-claims: no school participation, sponsor involvement, manufacturer validation, physical competition, or national-scale program is implied.

## Verification gates

### R0 — Baseline reconciled

- [x] exact base and branch tips recorded;
- [x] A1 architecture reviewed against governance;
- [x] A1 limitations separated into A2;
- [x] `pnpm verify` executed successfully on the branch;
- [x] no GitHub Actions used;
- [x] no canonical merge performed.

### R1 — STEM Foundation

- [ ] A2 through F/G acceptance criteria pass for Sandbox and Clean Water;
- [ ] contract/projection negative tests reject incomplete or contradictory inputs;
- [ ] core-domain boundary scan passes;
- [ ] intended-test discovery passes;
- [ ] `pnpm verify` passes;
- [ ] browser smoke covers System, Math, Science, Engineering, Technology, and Trace views;
- [ ] material identity changes, if any, are explained and replay fixtures intentionally reconciled;
- [ ] all non-claims are visible in the UI and handoff record.

### R2 — Learning Projection

- [ ] all six depth manifests validate;
- [ ] at least two depths render the same evaluation identity;
- [ ] depth changes do not change material input/result hashes;
- [ ] `pnpm verify` and depth-specific browser smoke pass.

### R3 — Dynamic STEM

- [ ] parameter changes create canonical evaluations rather than local UI results;
- [ ] causal highlighting matches canonical comparison records;
- [ ] uncertainty/sensitivity/time displays distinguish unavailable data;
- [ ] `pnpm verify` and interaction smoke pass.

### R4 — Simulation to Reality

- [ ] test plan, observation, discrepancy, failure, and contradiction paths are covered;
- [ ] synthetic versus measured status is unmistakable;
- [ ] readiness changes require canonical evidence rules;
- [ ] `pnpm verify` and evidence-path smoke pass.

### R5 — Foundation Demonstrator

- [ ] Issue #4 non-expert questions pass as a documented manual acceptance script;
- [ ] advanced drill-down reaches exact model, math, identities, evidence, and unknowns;
- [ ] accessibility and failure-state smoke are recorded as observed results, not inferred;
- [ ] local evidence record is generated only after a clean full gate;
- [ ] independent review finds no blocking truth/architecture defect.

### R6 — Advanced challenge readiness

- [ ] R5 accepted by owner;
- [ ] second vertical proves contract reuse;
- [ ] solar validation plan reviewed;
- [ ] explicit owner authorization recorded before advanced-challenge implementation or outreach.

## Change-control rules

Stop and request owner direction when a slice requires a breaking public contract, a material canonical-object change, a REP identity-rule change, a push/PR/merge, external contact, paid service, professional judgment, or a claim beyond recorded evidence.

Routine additive schemas, projections, tests, local UI work, and local verification may proceed within the currently authorized STEM milestone, subject to repository instructions.

## Definition of done for every work package

A package is not done because code exists. It is done only when:

1. dependency and scope are explicit;
2. contract and projection behavior are implemented;
3. positive, negative, and missing-data tests exist;
4. intended-test discovery includes new tests;
5. `pnpm verify` passes after the change;
6. UI work receives a local browser smoke;
7. architecture and truth boundaries are reviewed;
8. non-claims are documented and visible where users could misread results;
9. failure and unknown states remain preserved;
10. the issue records exact executed evidence and remaining obligations.

## Current next action

Begin A2 and B as separate, coordinated work packages. A2 completes the system boundary and interaction view. B establishes quantity/equation dependency identifiers that later science, engineering, traceability, learning-depth, and dynamic views consume.
