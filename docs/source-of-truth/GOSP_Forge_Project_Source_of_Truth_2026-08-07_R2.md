---
title: "GOSP Forge Project Source of Truth"
subtitle: "Canonical Direction, Verified Local Baseline, STEM Mission, Trust Model, and Phase-0 Execution Plan"
date: "2026-08-07"
revision: "2"
status: "Canonical project source of truth as of August 7, 2026 — Revision 2"
supersedes: "GOSP Forge Project Source of Truth, 2026-08-07 (initial revision)"
research_cutoff_inherited_from_business_plan: "2026-08-06"
---

# GOSP Forge Project Source of Truth — Revision 2

## 0. Document status and precedence

This document is the **canonical project source of truth for GOSP Forge as of August 7, 2026, Revision 2**.

It updates the earlier August 7 source-of-truth document by incorporating:

- the August 6, 2026 GOSP Forge business plan;
- the August 7 STEM/education and imported-source doctrine;
- the Phase-0 GitHub repository rebaseline;
- the local ChatGPT Desktop/Codex verification work;
- the user's explicit instruction that current GOSP Forge development and verification are **local only** and must **not use GitHub Actions**;
- the recursive `node:test` discovery correction reported in the local session;
- and the next technical priority: canonical-model alignment, REP/runner hardening, and cross-environment local reproducibility.

### Precedence rule

Interpret project direction in this order:

1. **Later explicit user direction** controls all earlier project material.
2. **This Revision 2 source-of-truth document** controls project purpose, current execution policy, architecture, terminology, and current-phase interpretation as of August 7, 2026.
3. The **August 6, 2026 GOSP Forge business plan** remains the detailed strategic, market, governance, legal, financial, licensing, and long-range technical reference unless this file explicitly changes or narrows it.
4. The earlier **August 7 source-of-truth document** remains historical context but is superseded where this revision differs.
5. Earlier project chats provide design history and rationale when consistent with later direction.
6. Imported articles, videos, posts, images, papers, product claims, political arguments, marketing claims, and examples are **inputs for investigation**, not automatically accepted facts.
7. External consequential facts still require appropriate verification when used.

### Important status correction

The earlier August 7 source-of-truth document stated that the proposed software and workflows had not been implemented or tested. That statement is now **partly outdated**.

A Phase-0 repository baseline has since been created and, according to the user-provided ChatGPT Desktop/Codex execution report, locally executed and verified. However, the full GOSP Forge platform, external solver interoperability, building 3D vertical, customer validation, physical testing, legal structure, and commercial model remain unproven.

---

# 1. Project identity

**Working name:** GOSP Forge
**Recommended public descriptor:** Collaborative Engineering Challenge and Verification Network
**Project class:** Open, AI-assisted, multi-fidelity STEM problem-solving, engineering, simulation, challenge, verification, evidence, and reuse platform.

GOSP Forge is not fundamentally:

- a CAD program;
- an AI design generator;
- a physics solver;
- a school game;
- a marketplace;
- a certification body;
- or a replacement for engineers, teachers, laboratories, regulators, manufacturers, or mature engineering tools.

It is the **coordination, reasoning, experimentation, explanation, reproducibility, verification, provenance, and reuse layer** connecting those people and systems.

The long-term platform remains cross-domain. Modular buildings are the first recommended vertical, not the definition of the core.

---

# 2. Updated north star

The canonical working question is now:

> **Given this real-world problem, these constraints, these materials, these people, this time, and this budget: what solution works best, why does it work, which assumptions control the outcome, how confident are we, can someone else reproduce the result, and what evidence is still required?**

This is an improvement over asking only for “the best solution.” It forces GOSP Forge to expose:

- the problem;
- assumptions;
- governing relationships;
- alternatives;
- sensitivity;
- model fidelity;
- reproducibility;
- confidence;
- and the next proof obligation.

The core loop is:

**Define -> Structure -> Baseline -> Scenario -> Model -> Calculate/Simulate -> Compare -> Explain -> Test Sensitivity -> Reproduce -> Review -> Physically Test where appropriate -> Record Evidence -> Release/Reject -> Reuse -> Learn.**

---

# 3. Canonical mission

GOSP Forge exists to make real-world STEM and engineering problems:

- understandable enough to explore;
- structured enough for computers and solvers to evaluate;
- open enough for broad legitimate participation;
- rigorous enough that equations, assumptions, units, and limitations remain visible;
- reproducible enough that another person or environment can rerun the work;
- testable enough that computational predictions can be compared with reality;
- traceable enough that important claims are linked to evidence;
- reusable enough that validated work is not repeatedly rediscovered;
- and educational enough that the same authentic problem can serve learners from introductory STEM through professional research.

The platform is therefore built around:

> **Proof, explanation, reproducibility, and reuse — not AI-generated designs.**

---

# 4. STEM education remains a core mission

The earlier August 7 educational doctrine remains canonical:

> **One problem. Multiple levels of depth. Same underlying science.**

The preferred learning-depth model remains:

| Level | Primary experience | Typical access |
|---|---|---|
| Explore | Observe cause and effect | Geometry, animation, qualitative forces/flows, simple comparisons |
| Measure | Quantify and compare | Units, graphs, measurements, ratios, energy/cost totals |
| Model | Understand relationships | Variables, algebra, geometry, statistics, simplified models |
| Solve | Use formal STEM tools | Physics, chemistry, calculus, optimization, coding, simulation inputs |
| Verify | Challenge and reproduce | Solver settings, uncertainty, sensitivity, validation, test methods |
| Research / Professional | Extend and review | Full artifacts, APIs, provenance, validated workflows, domain review |

### New implementation consequence

Educational depth can no longer remain only a product aspiration. Phase-0 contracts and evidence records should be designed so later interfaces can expose:

**Explain -> Show the Math -> Inspect the Model -> Inspect the Evidence**

without creating a separate “toy” model disconnected from the actual evaluation.

---

# 5. Imported-source doctrine remains canonical

Imported material introduces a **problem, phenomenon, design idea, question, example, or evidence candidate** unless the user explicitly directs otherwise.

GOSP should separate:

1. observed/proposed phenomenon;
2. STEM question;
3. source claim;
4. evidence status;
5. non-STEM narrative or framing.

Marketing, clickbait, ideology, motive claims, causal stories, product claims, historical assertions, and political framing are not accepted merely because they appeared in the source.

This remains a foundational trust rule across the project.

---

# 6. Core doctrine

The following rules are canonical:

1. **Problem first.**
2. **AI proposes; evidence decides; humans govern.**
3. **Model fidelity must be explicit.**
4. **Reproducibility is a product feature, not just a testing practice.**
5. **Explainability is required for important results.**
6. **Scenarios must permit controlled comparison.**
7. **Sensitivity and uncertainty matter as much as optimization.**
8. **Integration comes before reinvention.**
9. **Simulation is not physical validation.**
10. **Failure is evidence.**
11. **Sponsors cannot buy technical conclusions.**
12. **Core remains domain-neutral.**
13. **Professional/legal approval is never inferred from a solver result.**
14. **Local verification claims must be tied to actual executed commands and artifacts.**
15. **Do not claim remote CI, cloud, deployment, or independent reproduction unless it actually occurred.**

---

# 7. Current development workflow policy

## 7.1 Standing local-only rule

As explicitly directed by the user during the August 7 ChatGPT Desktop handoff:

> **GOSP Forge development and verification are currently local only. Do not use GitHub Actions. Do not rely on CI. Do not perform remote GitHub writes unless the user explicitly requests them.**

This is the current execution policy.

It does **not** permanently remove cloud, CI, federation, or remote reproducibility from the product architecture. It controls the present development workflow.

## 7.2 Primary working environment

The preferred development workflow is:

**User -> ChatGPT Desktop/Codex -> local repository -> local tests/evidence -> user review**

Visual Studio is the inspection/debugging environment when needed for:

- project-tree inspection;
- diffs;
- TypeScript navigation;
- breakpoints;
- stepping through the runner;
- reviewing generated evidence;
- manual diagnosis;
- and later frontend/backend work.

Both tools should point to the **same local Git checkout**.

## 7.3 GitHub role under the current policy

GitHub remains useful as repository history, issue/PR planning context, backup/remote source control, later collaboration, and later release management.

But current verification authority is **local execution evidence**, not GitHub Actions.

Before any future remote push, the automatic workflow configuration should be reviewed so it cannot silently violate this standing no-GitHub-Actions rule.

---

# 8. Current technical baseline

## 8.1 Repository baseline created

A new Phase-0 baseline was created in the existing repository:

- repository: `Mister-Nerdeus/GOSP-Forge`;
- rebaseline branch: `baseline/phase-0-rebaseline`;
- draft PR context: PR #2;
- local verification task context: issue #3.

The rebaseline changed the repository from HouseSim-first framing to a **domain-neutral GOSP Forge foundation**, while retaining HouseSim as the first building vertical/legacy demonstrator.

The baseline introduced, at minimum:

- real TypeScript and ESLint verification rather than placeholder checks;
- domain-neutral challenge/submission/evaluation/claim/evidence/component-release contracts;
- REP v0.1;
- a deterministic reference runner;
- a synthetic safe benchmark (`sandbox-001`);
- canonical JSON and SHA-256 material hashing;
- separation of deterministic result data from execution-environment evidence;
- contract validation;
- deterministic replay tests;
- documentation and contribution/security controls;
- and namespaced HouseSim legacy commands.

## 8.2 Local verification result — user-provided execution record

According to the ChatGPT Desktop/Codex local execution report supplied in project chat, these commands executed successfully:

```bash
pnpm install
pnpm verify
pnpm evidence:ci
pnpm housesim:validate
pnpm housesim:baseline
pnpm housesim:comparison
```

The reported `pnpm verify` path covered ESLint, TypeScript typecheck, automated tests, contract validation, `sandbox-001`, and TypeScript build.

The same report stated that deterministic replay hashes matched, HouseSim validation/baseline/comparison passed, the core/HouseSim dependency boundary remained intact, and the working tree was initially clean.

## 8.3 Recursive test-discovery correction

A later local-only Codex session reported that `node:test` was recursively discovering tests in a way that produced a non-fatal warning and misleading test count.

The reported local correction changed the test command so only intended files under:

```text
tests/**/*.test.mjs
```

are executed.

Post-fix local report:

- 3/3 intended tests passed;
- warning removed;
- all six required verification commands passed again;
- deterministic result hash remained unchanged;
- no GitHub Actions were used;
- no remote GitHub updates were performed;
- the change remained local, uncommitted, and unpushed at the last explicitly reported state.

### Canonical interpretation

The test-discovery correction is **not a product-behavior change**. It improves verification truthfulness by ensuring the reported test count corresponds to intended tests.

The local fix should not be described as committed, pushed, merged, or part of the remote baseline unless that action is subsequently performed and recorded.

---

# 9. Current status matrix

| Area | Current status as of this revision |
|---|---|
| Domain-neutral repository rebaseline | Created |
| Local dependency install | Reported passed |
| Local lint/typecheck/test/contracts/build | Reported passed |
| Safe synthetic benchmark | Reported passed |
| Deterministic replay on same local environment | Reported passed |
| Material hash stability after test-runner fix | Reported unchanged |
| HouseSim legacy validation/baseline/comparison | Reported passed |
| Core -> HouseSim dependency boundary | Reported intact |
| Recursive test-discovery warning | Reported fixed locally |
| Local fix committed | **Not confirmed** |
| Local fix pushed | No, at last report |
| GitHub Actions | **Do not use under current policy** |
| Cross-environment local reproduction | Not yet verified |
| Independent external reproduction | Not verified |
| Full Engineering Program Graph object coverage | Needs alignment audit |
| Scenario first-class object in implementation | Needs verification/implementation |
| Explainable Engineering implementation | Not yet demonstrated |
| STEM learning-depth implementation | Not yet demonstrated |
| Customer interviews | Not reported as completed |
| Design-partner LOIs | Not reported |
| Paid discovery/pilot | Not reported |
| Legal/trademark/insurance work | Not reported |
| Building 3D/IFC/EnergyPlus demonstrator | Not yet demonstrated |
| Physical testing / external professional validation | Not performed |
| Component reuse by second project | Not demonstrated |

---

# 10. Phase-0 interpretation is now split into three tracks

The business plan's original Phase 0 mixed technical, customer, legal, and business validation. That remains strategically correct, but progress is easier to manage as three sub-phases.

## Phase 0A — Local technical baseline

**Purpose:** establish a truthful, deterministic local foundation.

Acceptance conditions:

- domain-neutral repository structure;
- real lint/typecheck/tests;
- contract validation;
- one deterministic safe benchmark;
- material hashing;
- evidence manifest;
- HouseSim retained behind a vertical boundary;
- all required local verification passes;
- no unexplained working-tree changes.

**Status:** substantially achieved according to the user-provided local execution reports, except the final disposition of the local test-discovery change is not yet confirmed.

## Phase 0B — Canonical protocol completeness and reproducibility

**Purpose:** make the repository match the full canonical source-of-truth model and prove the result survives more than one local execution environment.

Required work:

1. audit implementation against the canonical Engineering Program Graph;
2. add any missing core objects;
3. make `Scenario` first-class;
4. harden REP/runner identities and versioning;
5. ensure environment metadata cannot contaminate material result hashes;
6. add replay-from-recorded-input capability;
7. run the same evaluation in two genuinely distinct local environments where available;
8. produce a discrepancy report;
9. preserve local evidence for both environments.

**Status:** next technical milestone.

## Phase 0C — External problem/business validation

**Purpose:** prove someone outside the project cares enough to use or fund the workflow.

The August 6 business-plan requirements remain:

- structured interviews;
- design partners;
- legal/licensing review;
- at least one paid discovery or pilot commitment;
- sponsor/lab/engineering feedback on CDP/REP/evidence usefulness.

**Status:** not established by current project evidence.

### Important stage-gate correction

Passing local software verification does **not** mean “Phase 0 is complete” in the business-plan sense.

It means the **technical baseline portion of Phase 0 is locally working**.

Gate A still requires external organizational validation and willingness to pay.

---

# 11. Engineering Program Graph — implementation alignment requirement

The implementation should be audited against this minimum first-class object set:

- Engineering Program
- Requirement
- Constraint
- Hazard
- System Element
- Interface
- Scenario
- Claim
- Evidence
- Model
- Workflow
- Challenge
- Submission
- Evaluation
- Review
- Test Article
- Component Release
- Operational Observation

### Architectural boundary

Core packages must not import HouseSim, building-specific assumptions, bedrooms, wall R-values, heat pumps, Michigan, CNC sheet sizes, or any other vertical-specific concept.

Verticals consume the core. The core never consumes the vertical.

---

# 12. Scenario is a required first-class object

A Scenario binds:

- system/configuration;
- environment;
- materials/components;
- schedules;
- operating conditions;
- assumptions;
- parameters;
- dataset versions;
- model/solver choice;
- and applicable constraints.

The canonical comparison question is:

> **What changed, what stayed fixed, and which changes caused the result to move?**

Scenario should eventually power Swap Lab, Design Variant Lab, parameter exploration, baseline-vs-candidate comparison, educational experiments, and professional sensitivity analysis.

---

# 13. Explainable Engineering is now an acceptance criterion

Explainable Engineering remains a cross-cutting capability, not a seventh product.

Important results should support:

1. **Explain** — plain-language interpretation.
2. **Show the Math** — equations/relationships, variables, units, intermediate values.
3. **Inspect the Model** — fidelity, assumptions, solver/workflow, boundary conditions, numerical settings, convergence, calibration.
4. **Inspect the Evidence** — sources, reproductions, reviews, tests, contradictions, uncertainty, claim status.

### Phase-0 consequence

The contracts and evidence model should carry enough structure to support these four layers later.

Do not wait until Forge Studio to decide how equations, assumptions, model identity, sensitivity, evidence, and provenance are represented.

---

# 14. Model fidelity and evidence readiness are separate axes

GOSP must preserve the distinction between:

**Model fidelity:** how detailed or sophisticated the computational representation is.

and:

**Evidence readiness:** how strongly the claim is supported by reality.

A high-resolution simulation is not automatically high-confidence evidence.

The practical analysis ladder remains:

1. rule/sanity check;
2. analytical equation;
3. reduced-order model;
4. domain simulator;
5. high-resolution numerical solver;
6. independent computational reproduction;
7. controlled physical test;
8. accredited/qualified lab test where relevant;
9. representative field demonstration;
10. operational evidence.

The existing ERL/DRL maturity system remains valid, with professional approval and certification represented separately.

---

# 15. REP/runner hardening — next technical focus

The next runner milestone should prove:

> **The same challenge version + the same submission + the same deterministic runner version produce the same material result across distinct local execution environments.**

## 15.1 Material result hash

The material result hash must exclude non-material environmental data such as:

- timestamps;
- local file paths;
- usernames;
- hostnames;
- process IDs;
- temporary directories;
- machine identifiers;
- log ordering that does not affect the result;
- environment-report metadata.

## 15.2 Execution evidence

Environment-specific evidence should be preserved separately, including where relevant:

- OS;
- architecture;
- Node/runtime version;
- package versions;
- runner version;
- processor information where useful;
- locale/timezone if they can affect execution;
- command line;
- start/end time;
- artifact paths;
- resource usage;
- warnings.

Environment evidence may differ.

The material result must not.

## 15.3 Local replay

The runner should support an explicit local replay flow that can take recorded challenge version, submission, contract/schema version, runner version, and material input hashes, then rerun the evaluation without depending on ephemeral session state.

---

# 16. Cross-environment reproducibility under the local-only policy

The business plan originally proposed local Linux, a cloud worker, and another independent environment.

The current user instruction supersedes that workflow for now.

Preferred current proof:

- **Environment A:** native Windows Node 22+;
- **Environment B:** WSL2/Linux Node 22+ if already available;

or another genuinely distinct **local** environment already present on the machine.

Do not install or substantially reconfigure WSL, Docker, virtual machines, or another environment merely to satisfy the test without explicit user approval.

Current target:

```text
same challenge
+ same submission
+ same runner version
+ same material inputs
        |
        +--> local environment A --> material hash H
        |
        +--> local environment B --> material hash H
```

If hashes differ, the discrepancy is evidence and must be investigated, not hidden.

---

# 17. HouseSim remains a vertical and compatibility test

HouseSim should not be discarded.

Its value is now twofold:

1. preserve useful earlier work; and
2. prove that a real domain vertical can consume GOSP contracts without contaminating the core.

Desired direction:

```text
GOSP contracts / runner / evidence
             ^
             |
      HouseSim vertical
```

not:

```text
HouseSim assumptions
        |
        v
   GOSP core
```

HouseSim becomes the first serious test of domain neutrality after the synthetic benchmark.

---

# 18. The passive-cooling/courtyard case remains a model intake example

The problem is not:

> “Prove zero-cost cooling.”

The problem is:

> **How much can geometry, shading, thermal mass, natural ventilation, night flushing, and related passive strategies reduce cooling energy and improve comfort under controlled hot-weather conditions?**

A proper GOSP treatment controls floor area, weather/site data, occupancy, internal loads, material assumptions, glazing, schedules, comfort criteria, and cost basis, then varies courtyard geometry, orientation, shading, thermal mass, openings, wind, night flush, humidity, vegetation/evaporation where explicitly modeled, and mechanical assumptions.

This remains an excellent future educational demonstrator because it naturally scales from visual intuition through algebra, heat transfer, thermodynamics, airflow, simulation, uncertainty, economics, and physical validation.

It is **not** the next coding milestone. Reproducibility and contract completeness come first.

---

# 19. GitHub/desktop handoff model

A future Codex session should be able to start from a short instruction such as:

> Read the current canonical source-of-truth file and repository instructions. Work locally only. Do not use GitHub Actions or make remote changes. Verify the working tree and current local commits before modifying anything. Follow the current Phase-0B milestone and preserve exact execution evidence.

Repository handoff files should eventually include:

- `README.md`;
- `AGENTS.md`;
- this source-of-truth file;
- ADRs;
- REP specification;
- contract/schema documentation;
- local verification instructions;
- local evidence conventions;
- current phase/milestone file.

The source-of-truth document should be updated when direction materially changes rather than allowing contradictory chat instructions to accumulate.

---

# 20. Verification command naming should match reality

Because the current workflow is local-only, future cleanup should consider renaming:

```text
pnpm evidence:ci
```

to:

```text
pnpm evidence:local
```

or:

```text
pnpm evidence:verification
```

A compatibility alias can remain temporarily if useful.

The principle is semantic discipline:

- `typecheck` must typecheck;
- `lint` must lint;
- `test` must run intended tests;
- `verify` must execute the documented verification suite;
- `evidence:*` should describe where/how evidence is produced.

GOSP Forge's own development process should embody the evidence standards the product claims to value.

---

# 21. Recommended immediate next actions

In priority order:

## 21.1 Lock the reported local fix

Inspect the current local diff.

If the only intended change is the test-discovery correction:

- keep the post-fix verification evidence;
- rerun the full local suite once;
- confirm no unexplained files changed;
- create a **local commit only** if the user has authorized local commits;
- record the local commit SHA;
- do not push.

If the local fix has already been committed since the last report, record that fact instead of recommitting.

## 21.2 Canonical model alignment audit

Compare repository contracts against this source-of-truth document.

Explicitly verify support for Engineering Program, Scenario, Requirement, Constraint, Hazard, System Element, Interface, Model, Workflow, Review, Test Article, Operational Observation, claim typing, model-fidelity metadata, evidence readiness, provenance, and version identities.

Make the smallest coherent additions needed.

## 21.3 REP/runner hardening

Add stable runner identity/version, schema/contract identity, replay command, material-hash boundary tests, environment-evidence separation tests, and reproducibility documentation.

## 21.4 Cross-environment local replay

Use two already-available local environments if possible.

Produce environment A report, environment B report, material hashes, discrepancy report, and final conclusion.

## 21.5 HouseSim contract migration

After the domain-neutral contracts are stable enough:

- migrate HouseSim inputs/outputs behind the generic model;
- preserve all existing passing behavior;
- identify any building-specific leakage into core;
- fix the abstraction rather than teaching core about houses.

## 21.6 Only then begin the minimal challenge-facing product loop

Before a full Forge Studio, the next application layer should be the smallest useful:

**Challenge -> Submission -> Evaluation -> Evidence -> Comparison**

with explainability hooks already present.

---

# 22. What should not happen next

Do not:

- begin a large photorealistic Forge Studio build;
- add mobile clients;
- add marketplace/payment systems;
- add federation;
- add Kubernetes because the long-term plan mentions it;
- add many solvers;
- integrate Pascal/IFC/EnergyPlus before the core contract is stable enough;
- create empty architecture solely to look enterprise-ready;
- treat local same-machine determinism as independent reproducibility;
- equate passing tests with product-market validation;
- describe the whole Phase 0 as complete while Gate A business evidence is still absent;
- use GitHub Actions under the current local-only rule;
- or make remote repository changes unless explicitly authorized.

---

# 23. Business-plan alignment and unchanged strategy

The August 6 business plan remains strategically intact.

Still valid:

- six-product architecture;
- modular low-rise construction first vertical;
- water/energy second vertical;
- Engineering Program Graph;
- CDP and REP;
- claims/evidence model;
- ERL/DRL;
- adapter-first tool strategy;
- open/federated/data-portable direction;
- challenge staging;
- professional/laboratory separation;
- component reuse as network effect;
- open-core/services-enabled business model;
- stage-gated capital;
- Gate A-E logic.

### Current interpretation change

The technical implementation has advanced beyond the business plan's original “nothing built” status.

But business validation has **not** advanced merely because software runs.

The project must now track **technical proof** and **market/legal/partner proof** separately.

---

# 24. Phase-0 external gate remains unfulfilled until proven

The business plan's Gate A remains:

> At least three external organizations confirm that the CDP/REP/evidence package solves a real workflow problem, and at least one agrees to pay for a pilot.

Current project conversations do not establish that this gate has been met.

Therefore technical Phase 0A can be locally successful and Phase 0B can progress, but the project should not represent Gate A or funded-MVP readiness as achieved without real external evidence.

---

# 25. Updated definition of the first compelling demonstrator

The first compelling demonstrator should eventually prove:

1. real STEM question;
2. explicit baseline;
3. two or more controlled scenarios;
4. fast analytical/reduced model;
5. domain simulation where appropriate;
6. visualized results;
7. plain-language explanation;
8. governing math/units;
9. model identity/assumptions;
10. sensitivity/uncertainty;
11. evidence status;
12. reproducible package;
13. cost/labor/lifecycle effects where relevant;
14. explicit next proof obligations.

This remains the correct direction for the building vertical, but it follows the current Phase-0B work.

---

# 26. Current risk priorities — updated

The business plan's five major risks remain, with one development-process addition.

1. **False confidence** — scores or AI output mistaken for safety approval.
2. **No reusable result** — challenge output cannot be reused.
3. **Non-reproducible evaluation** — materially different outcomes across environments.
4. **Uncontrolled scope** — too many domains/tools/features before the loop works.
5. **Liability/conflict** — commercial incentives distort technical truth.
6. **Verification theater** — commands, test counts, CI labels, or artifacts imply validation that did not actually occur.

The recursive test-discovery correction is a small but important example of why verification theater must be explicitly guarded against.

---

# 27. Current unknowns and open questions

The following remain open until specifically resolved:

- Has the local test-discovery fix now been committed?
- Which second local execution environment is already available?
- Does the current core schema fully represent every canonical Engineering Program Graph object?
- Is `Scenario` implemented as a first-class object?
- How will model-fidelity metadata be represented?
- How will claim-type proof obligations be encoded?
- How will Explainable Engineering reference equations and intermediate values without coupling core to one solver?
- What is the minimal public CDP profile for `sandbox-001`?
- Which external organizations will be interviewed first?
- What is the first paid discovery target?
- Has the GOSP Forge name/trademark/domain been professionally cleared?
- When, if ever, should the current local-only/no-GitHub-Actions development policy be changed?

---

# 28. Change log from the initial August 7 source-of-truth

This Revision 2 adds or changes:

## 28.1 Software status

Changed from planning only/not implemented to a Phase-0 technical baseline that now exists and is reported as locally verified, while the broader platform remains unbuilt/unproven.

## 28.2 Local-only development rule

Added as a canonical current workflow constraint: no GitHub Actions, local work and local verification only, no remote writes unless explicitly requested.

## 28.3 Technical/business Phase-0 split

Added Phase 0A / 0B / 0C to prevent local technical progress from being confused with external market validation.

## 28.4 Repository alignment requirement

The canonical Engineering Program Graph is now an explicit implementation checklist.

## 28.5 REP hardening

Material result versus execution evidence is now an explicit reproducibility requirement.

## 28.6 Cross-environment local proof

Current reproducibility target is two genuinely distinct local environments when available, not cloud CI.

## 28.7 Verification truthfulness

The `node:test` recursive-discovery issue is incorporated as a process lesson: verification commands must report what they actually test.

## 28.8 Handoff workflow

ChatGPT Desktop/Codex is the primary local worker; Visual Studio is the inspection/debugging environment; both use the same local checkout.

---

# 29. Verification and provenance disclosure for this revision

## Directly grounded in uploaded project sources

This revision preserves and updates concepts from the August 6 business plan and the initial August 7 source-of-truth, including the STEM education doctrine, imported-source doctrine, Explainable Engineering, Scenario object, multi-fidelity modeling, sensitivity/uncertainty, claims/evidence model, first-vertical strategy, and stage-gated roadmap.

## Directly grounded in the current project conversation

This revision incorporates the reported desktop development history: repository rebaseline, local execution of the required command sequence, successful local verification report, user instruction prohibiting GitHub Actions and requiring local-only work/verification, local recursive test-discovery correction, post-fix 3/3 intended tests, unchanged deterministic hash, and no remote update after the local-only instruction.

## Not independently re-executed in this document

This document did not itself:

- run `pnpm install`;
- run `pnpm verify`;
- execute the benchmark;
- inspect the user's local working tree;
- confirm the current local commit graph;
- reproduce the reported hashes;
- run Windows/WSL comparisons;
- or independently validate the desktop session logs.

Therefore the software status is described as **reported local execution**, not independently reverified by this document.

## External research

No new external web research was performed for this Revision 2. The August 6 business plan's research cut-off remains the inherited external research baseline.

---

# 30. Compact canonical summary

**GOSP Forge is an open, AI-assisted, multi-fidelity STEM problem-solving and engineering network whose core value is the trustworthy chain from real-world problem to structured requirements, controlled scenarios, models, calculations/simulations, explanations, sensitivity, reproducibility, evidence, review, testing, and reusable knowledge. Imported material supplies problems and evidence candidates, not automatic truth. The same authentic STEM problem should support multiple learning depths from visual exploration to professional validation. AI may propose; models calculate; evidence determines confidence; qualified people govern consequential use.**

**As of August 7, 2026, a domain-neutral Phase-0 repository baseline has been created and is reported to pass the required local verification suite. A test-discovery issue was corrected locally and the post-fix suite reportedly passes with stable deterministic output. Current development policy is local work and local verification only: no GitHub Actions and no remote repository changes unless explicitly authorized. The next milestone is not Forge Studio. It is to align the implementation with the full canonical Engineering Program Graph, harden REP/runner reproducibility, prove identical material results across two distinct local environments where available, and then migrate HouseSim through the domain-neutral contracts. Technical progress does not satisfy the business-plan Gate A; external partner and paid-pilot validation remain separate required evidence.**
