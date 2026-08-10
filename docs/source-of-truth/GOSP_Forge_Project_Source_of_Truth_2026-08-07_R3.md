---
title: "GOSP Forge Project Source of Truth"
subtitle: "Canonical Direction, Phase-0B Checkpoint, Autonomous Execution Model, and Phase-0C / Minimal Product Loop Plan"
date: "2026-08-07"
revision: "3"
status: "Canonical project source of truth as of August 7, 2026 — Revision 3"
supersedes: "GOSP Forge Project Source of Truth, 2026-08-07 — Revision 2"
research_cutoff_inherited_from_business_plan: "2026-08-06"
phase_0b_checkpoint_commit: "2945361038ee63d26304b4279d703c11ed66d14b"
remote_develop_at_checkpoint: "8a416bed36c025a478d999c0a99939cdeadca837"
---

# GOSP Forge Project Source of Truth — Revision 3

## 0. Document status and precedence

This document is the **canonical project source of truth for GOSP Forge as of August 7, 2026, Revision 3**.

It supersedes Revision 2 where this document changes status, execution policy, milestone interpretation, or next-step direction. The August 6, 2026 business plan remains the detailed strategic, market, governance, legal, financial, licensing, and long-range technical-planning reference unless explicitly narrowed here.

### Precedence rule

Interpret project direction in this order:

1. **Later explicit user direction** controls all earlier project material.
2. **This Revision 3 source-of-truth document** controls project purpose, current technical status, execution policy, milestone interpretation, and immediate next-phase direction as of August 7, 2026.
3. The **August 6, 2026 business plan** remains the detailed strategic and long-range reference unless this document explicitly changes it.
4. Revision 2 remains historical context and is superseded where this revision differs.
5. Earlier project chats remain useful for design rationale when consistent with later direction.
6. Imported external material remains **problem/evidence input, not automatic truth**.
7. Consequential external technical, legal, regulatory, financial, historical, or market claims must still be verified from appropriate sources when used.

---

# 1. Project identity

**Working name:** GOSP Forge  
**Recommended public descriptor:** Collaborative Engineering Challenge and Verification Network  
**Project class:** Open, AI-assisted, multi-fidelity STEM problem-solving, engineering, simulation, challenge, verification, evidence, and reuse platform.

GOSP Forge is not fundamentally a CAD program, AI design generator, physics solver, school game, marketplace, certification body, or replacement for teachers, engineers, laboratories, manufacturers, regulators, or mature engineering tools.

It is the **coordination, reasoning, experimentation, explanation, reproducibility, verification, provenance, and reuse layer** connecting those people and systems.

The core remains cross-domain. Modular low-rise construction remains the recommended first major vertical. Water and energy remain the recommended adjacent verticals.

---

# 2. North star

The canonical working question remains:

> **Given this real-world problem, these constraints, these materials, these people, this time, and this budget: what solution works best, why does it work, which assumptions control the outcome, how confident are we, can someone else reproduce the result, and what evidence is still required?**

The canonical loop is:

**Define -> Structure -> Baseline -> Scenario -> Model -> Calculate/Simulate -> Compare -> Explain -> Test Sensitivity -> Reproduce -> Review -> Physically Test where appropriate -> Record Evidence -> Release/Reject -> Reuse -> Learn.**

---

# 3. Canonical mission

GOSP Forge exists to make real-world STEM and engineering problems:

- understandable enough to explore;
- structured enough for computers and solvers to evaluate;
- open enough for broad legitimate participation;
- rigorous enough that assumptions, equations, units, models, and limitations remain visible;
- reproducible enough that another person or environment can rerun the work;
- testable enough that computational predictions can be compared with reality;
- traceable enough that material claims are linked to evidence;
- reusable enough that validated work is not repeatedly rediscovered;
- and educational enough that the same authentic problem can serve learners from introductory STEM through research and professional practice.

The project is built around:

> **Proof, explanation, reproducibility, and reuse — not AI-generated designs.**

---

# 4. STEM education remains a core mission

The canonical educational doctrine remains:

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

Important results should ultimately support:

**Explain -> Show the Math -> Inspect the Model -> Inspect the Evidence**

This is a cross-cutting product requirement, not a separate product.

---

# 5. Imported-source doctrine remains canonical

Imported material introduces a **problem, phenomenon, design idea, question, example, or evidence candidate** unless the user explicitly directs otherwise.

GOSP should separate:

1. observed/proposed phenomenon;
2. STEM question;
3. source claim;
4. evidence status;
5. non-STEM narrative or framing.

Marketing, clickbait, ideology, motive claims, product claims, causal stories, political framing, and historical assertions are not accepted merely because they appear in the source.

---

# 6. Core doctrine

The following rules remain canonical:

1. **Problem first.**
2. **AI proposes; evidence decides; humans govern.**
3. **Model fidelity must be explicit.**
4. **Reproducibility is a product feature, not merely a testing practice.**
5. **Explainability is required for important results.**
6. **Scenarios must permit controlled comparison.**
7. **Sensitivity and uncertainty matter as much as optimization.**
8. **Integration comes before reinvention.**
9. **Simulation is not physical validation.**
10. **Failure is evidence.**
11. **Sponsors cannot buy technical conclusions.**
12. **Core remains domain-neutral.**
13. **Professional/legal approval is never inferred from a solver result.**
14. **Verification claims must correspond to actual executed commands and preserved evidence.**
15. **Do not claim remote CI, cloud execution, deployment, independent reproduction, professional approval, or physical validation unless those actions actually occurred.**
16. **Passing tests do not override a failed code review.**
17. **A clean code review does not substitute for external customer, professional, legal, or physical validation.**

---

# 7. Phase-0B checkpoint — completed local milestone

## 7.1 Canonical checkpoint

Phase-0B is now **locally checkpointed** at:

```text
2945361038ee63d26304b4279d703c11ed66d14b
```

Commit message:

```text
feat: establish Phase-0B canonical REP and reproducibility baseline
```

At the time of checkpoint:

- local branch: `develop`;
- local working tree: clean;
- staged changes: none;
- unstaged changes: none;
- untracked changes: none;
- local `develop` was one commit ahead of `origin/develop`;
- remote `origin/develop` remained at `8a416bed36c025a478d999c0a99939cdeadca837`;
- no push occurred;
- no pull request was opened;
- no remote write occurred;
- no GitHub Actions workflow was run.

## 7.2 Checkpoint contents

The reported checkpoint contains:

- repository guardrails;
- ADRs;
- reconciliation/status documentation;
- exactly 18 canonical first-class object kinds;
- stable identity/revision/lineage/provenance/content-hash/relationship foundations;
- typed claims and proof obligations;
- Evidence Readiness and Deployment Readiness;
- Model fidelity;
- uncertainty/sensitivity structures;
- assumptions and boundary conditions;
- explainability and controlled-comparison contracts;
- REP v0.1;
- deterministic canonical JSON;
- material input/result boundaries;
- execution-evidence separation;
- replay;
- `sandbox-001`;
- deterministic source-closure executable identity;
- exact test discovery;
- `pnpm verify`;
- `pnpm evidence:local`;
- REP CLI flows;
- Clean Water extracted into `@gosp/vertical-clean-water`;
- domain-neutral core;
- local-only GitHub workflow policy;
- and preserved review/remediation evidence.

## 7.3 Canonical object set

The canonical first-class object set is exactly **18 objects**:

1. Engineering Program
2. Requirement
3. Constraint
4. Hazard
5. System Element
6. Interface
7. Scenario
8. Claim
9. Evidence
10. Model
11. Workflow
12. Challenge
13. Submission
14. Evaluation
15. Review
16. Test Article
17. Component Release
18. Operational Observation

Do not invent a nineteenth object merely to preserve an older count.

---

# 8. Phase-0B verification status

## 8.1 Reported final verification

According to the local execution record supplied during the project session:

- targeted remediation verification: **18 files / 82 tests passed**;
- full Windows `pnpm verify`: **exit 0**;
- exact test discovery: **29 intended / 29 discovered**;
- full suite: **29 files / 125 tests passed**;
- lint: passed;
- build: passed;
- typecheck: passed;
- contract/example validation: passed;
- REP replay: passed;
- Clean Water simulation: passed;
- estimation: passed;
- foundation audit: **GO — 23 pass / 0 warn / 0 fail**;
- final claim scan: **175 files / zero findings**;
- `git diff --check`: passed;
- post-checkpoint evidence currentness: **PASS**.

## 8.2 Cross-environment local reproducibility

The same material evaluation was reported as reproduced in:

**Environment A**
- Windows 11;
- Node `v22.16.0`.

**Environment B**
- Docker/Linux under WSL2 kernel;
- Node `v24.19.0`.

Reported result:

- REP replay passed in both;
- all nine comparison checks passed;
- source manifests matched;
- material input hashes matched;
- material result hashes matched;
- reproducibility conclusion: `true`.

This establishes **two-environment local deterministic reproduction**.

It does **not** establish independent external reproduction, cloud reproducibility, professional review, laboratory validation, product certification, physical validation, or production readiness.

---

# 9. Executable identity decision

Phase-0B adopted:

```text
source-implementation
```

as the normative executable identity strategy.

The identity is a deterministic source-closure manifest containing, as applicable:

- exact runtime source files;
- relevant contract/schema sources;
- normalized UTF-8/LF file hashes;
- relevant TypeScript/compiler configuration;
- exact relevant dependency/toolchain versions;
- repository-relative paths only.

It excludes timestamps, absolute host paths, usernames, hostnames, process IDs, temporary paths, environment-report metadata, and other non-material execution data.

The purpose is to bind REP evaluation identity to the actual reviewed implementation without contaminating the material result with platform-specific build output.

A future released/signed distribution may add a separate compiled/package executable identity. That is not required for Phase-0B.

---

# 10. Phase-0B review/remediation outcome

The first final code review found seven material issues:

1. sparse canonical arrays;
2. Clean Water leakage into generic contracts;
3. contradictory canonical references and mistyped REP identities;
4. runner/solver identity tied only to descriptive constants;
5. professional-claim scanner suppression behavior;
6. reproducibility comparison not requiring distinct environments;
7. misleading evidence-status timing semantics.

All seven were reported as remediated.

A second read-only final review found no remaining Phase-0B defect within authorized scope.

This project should preserve both the failing review and the passing second review as provenance. The earlier defects are part of the engineering history and should not be erased.

---

# 11. Known maintenance issue: dependency advisories

A package-manager advisory scan reports:

- **16 development-tool dependency advisories**;
- **12 high**;
- **3 moderate**;
- **1 low**.

Dependency upgrades were explicitly outside the Phase-0B remediation scope.

Canonical interpretation:

- this does not retroactively invalidate Phase-0B;
- it is a separate maintenance/security workstream;
- advisories should be triaged for applicability and reachability;
- upgrades should not be performed merely to eliminate advisory counts;
- any dependency change must preserve deterministic behavior and rerun appropriate verification.

---

# 12. Current development policy

## 12.1 Local-first rule remains in force

Current development and verification remain **local first**.

Do not push, open or update a pull request, modify remote branches, run GitHub Actions, or perform other remote GitHub writes unless explicitly authorized.

The committed GitHub workflow is restricted to manual `workflow_dispatch`, which prevents automatic execution on push or pull request. Manual GitHub Actions execution still requires explicit authorization.

## 12.2 Phase-level approval model

The user should no longer be required to approve routine implementation steps.

The canonical operating model is:

> **User approves phases, consequential decisions, external actions, and irreversible boundaries. Agents perform routine local implementation, testing, review, documentation, and evidence collection autonomously within those boundaries.**

Routine work should continue without asking for approval unless one of the stop conditions in Section 18 is triggered.

---

# 13. What Phase-0B now proves

Phase-0B establishes a credible local technical foundation for the GOSP thesis:

- the core can remain domain-neutral;
- a real vertical can consume the generic contracts;
- Challenge -> Submission -> Evaluation can be represented generically;
- evaluation identity can be tied to reviewed source implementation;
- material engineering results can be separated from execution evidence;
- replay can be explicit;
- canonical material hashes can reproduce across two distinct local runtime environments;
- failed reviews can expose defects missed by passing tests;
- and verification evidence can remain traceable to a specific commit.

This is a **technical proof milestone**.

It is not market proof, professional proof, physical proof, or product completion.

---

# 14. Phase-0C — external problem and business validation

Phase-0C begins the transition from internal technical correctness to external usefulness.

## 14.1 Purpose

Prove that people outside the project recognize enough value in the GOSP workflow to spend time with it, give structured feedback, provide a real problem, participate as reviewer/tester/partner, or pay for a discovery/pilot engagement.

## 14.2 Gate A remains the governing business condition

The August 6 business-plan Gate A remains:

> At least three external organizations confirm that the CDP/REP/evidence package solves a real workflow problem, and at least one agrees to pay for a pilot.

Phase-0B completion does not satisfy Gate A.

## 14.3 Recommended first Phase-0C participant groups

Prioritize:

1. engineering educators and university faculty;
2. modular construction or prefab manufacturers;
3. engineering consultancies;
4. university laboratories;
5. water/energy engineering groups;
6. manufacturing/process organizations;
7. government innovation/program offices;
8. professional reviewers/test organizations.

The first conversations should test the workflow, not pitch the entire five-year vision.

## 14.4 External validation questions

Ask external participants:

- What engineering evidence is hardest to preserve or reproduce today?
- Where do requirements, models, assumptions, test evidence, and decisions become disconnected?
- Would a structured Challenge / Submission / Evaluation / Evidence package reduce real work?
- Which information would need to exist before they trusted a reproduced result?
- What would make them reject the workflow?
- Which real but bounded problem could be used as a pilot?
- What would they pay to reduce: rework, repeated analysis, evidence reconstruction, review preparation, challenge administration, configuration mistakes, or handoff friction?
- What must remain private?
- What professional or regulatory boundaries matter?
- Which parts should be open/public?
- Would they participate in a paid pilot?

Record negative feedback as evidence.

---

# 15. Minimal GOSP product loop — next technical application layer

The next software milestone is not full Forge Studio.

It is the smallest useful product loop:

```text
Challenge
   |
   v
Submission
   |
   v
Evaluation
   |
   v
Evidence
   |
   v
Comparison
```

## 15.1 Required behaviors

A minimal usable implementation should allow a user to:

1. create or open a Challenge;
2. inspect requirements, constraints, objectives, assumptions, and evidence obligations;
3. create/import a Submission;
4. run an Evaluation through the REP runner;
5. inspect material and execution identities;
6. view result metrics;
7. inspect Claim/Evidence status;
8. compare at least two evaluations/scenarios;
9. see what changed and what remained fixed;
10. expose plain-language explanation;
11. expose relevant math/variables/units where available;
12. inspect model identity/fidelity;
13. inspect evidence/provenance;
14. see unresolved proof obligations;
15. export/replay the evaluation.

## 15.2 Explicit non-goals for this milestone

Do not yet build:

- full photorealistic Forge Studio;
- marketplace/payment;
- federation;
- mobile;
- Kubernetes;
- broad solver catalog;
- full Pascal integration;
- full IFC workflow;
- EnergyPlus integration;
- full HouseSim migration;
- accreditation/certification workflow;
- physical-test automation;
- enterprise SSO/security suite.

The application layer should exercise the canonical contracts rather than outrun them.

---

# 16. Explainability acceptance criteria for the minimal loop

The minimal loop should prove that the canonical contracts can support the four-layer explanation progression.

## Explain

Show what happened, which candidate performed better, the main reason, and important limitations.

## Show the Math

Where a benchmark or vertical provides the information, expose equation/relationship identifier, variables, values, units, intermediate values, and derived outputs.

## Inspect the Model

Expose model/solver identity, runner identity, model fidelity, assumptions, boundary conditions, dataset identities, relevant numerical/configuration settings, and known limitations.

## Inspect the Evidence

Expose Claim, Evidence, Evidence Readiness, Deployment Readiness, reproductions, reviews, contradictions, unresolved proof obligations, and current status.

The UI may initially be simple. The data chain must remain real.

---

# 17. Maintenance/security track

The maintenance track is separate from feature development.

Immediate maintenance priorities:

1. triage the 16 development-tool advisories;
2. classify each as reachable/material, dev-only/non-reachable, transitive, fix available, breaking upgrade, or accepted temporarily;
3. avoid blanket upgrades;
4. add tests before any upgrade that could affect canonicalization, hashing, TypeScript emit, test discovery, or REP behavior;
5. rerun Windows verification after material dependency changes;
6. rerun two-environment reproduction if toolchain/runtime identity changes.

No security advisory should be dismissed solely because it is development-only, but no advisory count should drive uncontrolled dependency churn.

---

# 18. Autonomous execution model and stop conditions

Routine work may proceed autonomously within the approved milestone.

Agents should stop and request owner direction only if one of the following occurs:

## Architecture

- a material canonical-object change is required;
- a public contract must be broken;
- domain neutrality cannot be preserved without significant redesign;
- REP identity rules require a new normative standard;
- a solver/model boundary requires irreversible coupling.

## Repository / remote

- a push is needed;
- a PR must be opened/updated/merged;
- GitHub Actions or another remote execution system is needed;
- history rewrite, force push, branch deletion, or destructive Git action is proposed.

## Infrastructure / cost

- new infrastructure must be installed;
- a new paid service is required;
- substantial cloud compute is needed;
- a material recurring cost is introduced.

## External / legal / professional

- an external organization must be contacted;
- a contract, NDA, payment, sponsorship, or legal commitment is required;
- a professional engineering/legal/regulatory judgment is needed;
- a public claim or press/marketing statement materially changes project exposure.

## Verification

- material hashes differ unexpectedly;
- a cross-environment reproduction fails;
- a code review finds a blocker;
- evidence cannot support a claimed result;
- a fix would change intended behavior rather than correct implementation;
- working-tree changes cannot be explained.

Everything else should proceed without requiring owner micromanagement.

---

# 19. Recommended next execution sequence

## Track A — preserve Phase-0B

1. Treat commit `2945361038ee63d26304b4279d703c11ed66d14b` as the local technical baseline.
2. Do not modify Phase-0B solely for cleanup.
3. Fix only genuine defects or specifically authorized maintenance issues.
4. Preserve all review/evidence history.

## Track B — minimal product loop

1. Write a concise milestone specification.
2. Build Challenge read/create flow.
3. Build Submission flow.
4. Execute REP Evaluation.
5. Render result/evidence summary.
6. Add Comparison.
7. Add Explainability hooks.
8. Add replay/export.
9. Verify locally.
10. Run review.
11. Produce evidence.

## Track C — Phase-0C

1. Prepare one-page external explanation.
2. Prepare interview script.
3. Prepare demo of the minimal product loop.
4. Identify first 10 candidate organizations.
5. Conduct structured interviews.
6. Record feedback as evidence.
7. Seek three design-partner confirmations.
8. Seek one paid discovery/pilot commitment.
9. Reassess Gate A.

## Track D — maintenance

1. Triage current advisories.
2. Prioritize material/reachable items.
3. Schedule upgrades separately.
4. Reverify after material toolchain changes.

---

# 20. Push policy

## Publication status update — 2026-08-10

The original text in this section records the repository state and publication policy as of Revision 3 on 2026-08-07.

Since Revision 3 was issued, the verified lineage completed Stage 1 publication to the remote branch `canonical/verified-lineage`. The exact Stage 1 object and the current authority-transition state are recorded in [GOSP Remote Publication Status](GOSP_REMOTE_PUBLICATION_STATUS_2026-08-10.md).

As of this update:

- the verified lineage is publicly reachable on `canonical/verified-lineage`;
- the Stage 1 published commit was independently checked against the verified local object;
- the repository default branch remains `main`;
- authority transition has not occurred;
- branch-protection transition has not occurred;
- PR #2 has not been merged into the authoritative lineage;
- automatic CI is not being substituted for recorded local verification;
- publication does not create professional, physical-test, certification, or production-readiness claims.

The original Section 20 text below is retained as the historical state/policy record applicable when Revision 3 was issued.

The Phase-0B checkpoint currently exists only locally.

A future push should be treated as an **owner-level publication/collaboration decision**, not a routine coding step.

Before any authorized push:

- confirm the exact local commit(s) intended for publication;
- confirm working tree is clean;
- confirm no credentials/local artifacts are included;
- confirm remote branch state;
- confirm manual-only GitHub Actions policy remains as intended;
- confirm the push will not trigger unintended automation;
- record the checkpoint SHA being published.

A push does not itself increase engineering truth. It increases durability, collaboration availability, and external accessibility.

---

# 21. HouseSim status

HouseSim remains deferred until actual HouseSim source is available and the project intentionally begins migration.

Do not create fake HouseSim scaffolding merely to satisfy earlier planning language.

Clean Water currently serves as the first real-domain proof that a vertical can consume generic contracts while the core remains domain-neutral.

HouseSim remains useful as a future building-domain compatibility and migration test.

---

# 22. Passive-cooling/courtyard demonstrator status

The passive-cooling/courtyard problem remains a strong future educational/public demonstrator.

Canonical question:

> **How much can geometry, shading, thermal mass, natural ventilation, night flushing, and related passive strategies reduce cooling energy and improve comfort under controlled hot-weather conditions?**

It remains an example of imported-source truth separation, scenario comparison, multi-fidelity analysis, Explainable Engineering, sensitivity/uncertainty, STEM depth progression, and evidence obligations.

It is not required before the minimal Challenge -> Submission -> Evaluation -> Evidence -> Comparison loop exists.

---

# 23. What should not happen next

Do not:

- reopen Phase-0B without a real defect;
- claim external reproducibility from local Docker/Windows reproduction;
- claim professional validation;
- claim physical validation;
- claim certification;
- claim Phase-0C completion;
- claim product-market fit;
- jump directly to the full Forge Studio;
- add infrastructure merely because it appears in the long-range plan;
- let dependency upgrades destabilize the checkpoint without evidence;
- allow UI convenience to become the source of truth;
- hide failed evaluations or negative evidence;
- or require the owner to supervise routine engineering work.

---

# 24. Phase-0C / minimal-loop success criteria

The next combined milestone should be considered successful when:

## Technical

- Challenge -> Submission -> Evaluation -> Evidence -> Comparison works end-to-end;
- REP replay remains deterministic;
- material/execution evidence remain separated;
- two candidate/scenario evaluations can be compared;
- user can inspect the reason for the result;
- relevant math/model/evidence metadata can be surfaced;
- local verification passes;
- review finds no blocking defect.

## External

- at least three outside organizations confirm the workflow addresses a real problem;
- at least one organization is willing to pay for a pilot/discovery engagement;
- at least one real bounded problem is available for a pilot;
- external feedback produces concrete revisions to the workflow.

Only after these conditions should the project represent the original business-plan Gate A as substantially achieved.

---

# 25. Current verification/provenance disclosure

## Directly grounded in project source material

This revision preserves the business plan and Revision 2 direction around the six-product architecture, Engineering Program Graph, REP, claims/evidence, ERL/DRL, domain neutrality, reproducibility, scenario comparison, Explainable Engineering, STEM education, modular construction as first major vertical, water/energy as adjacent verticals, staged external validation, and the local-only development policy.

## Directly grounded in the current project conversation

This revision incorporates the reported Phase-0B completion record, including final checkpoint commit, working-tree state, no remote write, two-environment local reproducibility, remediation of seven review findings, source-implementation identity, final test counts, post-commit evidence currentness, and deferred dependency advisories.

## Not independently re-executed in this document

This document did not itself run `pnpm verify`, inspect the local Windows working tree, execute Docker reproduction, calculate the reported hashes, open the local evidence JSON, or independently rerun the final code review.

Therefore local software status is described as **reported and checkpointed execution evidence**, not independent external reproduction by this document.

## External research

No new external web research was performed for Revision 3. The August 6 business-plan research cut-off remains the inherited external research baseline.

---

# 26. Compact canonical summary

**GOSP Forge is an open, AI-assisted, multi-fidelity STEM problem-solving and engineering network whose value is the trustworthy chain from real-world problem to structured requirements, scenarios, models, calculations/simulations, explanations, sensitivity, reproducibility, evidence, review, testing, and reusable knowledge. Imported material supplies problems and evidence candidates, not automatic truth. The same authentic STEM problem should support multiple learning depths from visual exploration through professional validation.**

**As of August 7, 2026, Phase-0B is locally checkpointed at commit `2945361038ee63d26304b4279d703c11ed66d14b`. The reported implementation passes the local Windows verification suite, reproduces material hashes in a second local Docker/Linux environment, has a domain-neutral core with Clean Water behind a vertical adapter, uses deterministic source-implementation identity, and has passed a second final code review after remediation of seven discovered defects. The remote repository remains unchanged and no GitHub Actions were run.**

**The next work is split into three coordinated tracks: (1) Phase-0C external validation, (2) the minimal Challenge -> Submission -> Evaluation -> Evidence -> Comparison product loop with explainability hooks, and (3) separate maintenance/security triage. The owner should approve phases and consequential actions, not routine implementation steps. Phase-0B is a technical proof milestone; it does not establish external reproduction, professional approval, physical validation, product completion, or market validation.**
