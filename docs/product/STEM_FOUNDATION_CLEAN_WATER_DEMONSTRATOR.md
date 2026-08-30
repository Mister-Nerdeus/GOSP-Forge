# Clean Water STEM Foundation Demonstrator

Status: Local educational demonstrator on `cipher/stem-foundation`

## Purpose and boundary

This is the first end-to-end teaching path for the domain-neutral STEM projection. It uses the Clean Water educational screening adapter and the same canonical Challenge, Scenario, Model, Submission, Evaluation, Claim, and Evidence chain at every learning depth.

It does not establish potable-water safety, treatment efficacy, field performance, public-health suitability, physical validation, certification, regulatory acceptance, deployment readiness, or professional approval. The synthetic teaching observation is not a measurement.

## Setup

Prerequisites: a supported Node version from `.nvmrc` / `package.json` and pnpm 9.x.

From the repository root:

```powershell
pnpm install --frozen-lockfile
pnpm verify
pnpm dev:phase1a
```

Open the Vite local URL printed by the command. The API must report a loopback URL at `127.0.0.1:3080`. If port 5173 is occupied, Vite selects another local port. Select **Clean Water educational screening evaluation** in the Challenge selector.

Local server records are stored under the ignored `.gosp/workspaces/default` directory unless `GOSP_WORKSPACE_DIR` selects another owner-controlled local directory. This is local durability, not production persistence. Export a workspace archive before intentionally replacing that directory.

## Manual acceptance script

Record the exact evaluation identity, material input hash, and material result hash at Explore. Confirm they remain unchanged while switching depths.

### 1. Explore — see and understand

- Confirm the problem is an educational screening evaluation of a resolved Clean Water fixture.
- Inspect the three declared system elements and their resource/power interfaces.
- Confirm the Human Relevance panel supports only water and marks unsupported categories unknown.
- Confirm stakeholder values are authored preferences, separate from technical results.

### 2. Measure — quantities and units

- Select Measure.
- Confirm the calculated output is 64 L for the baseline.
- Inspect submitted, controlled, calculated, and measured-output status.
- Confirm the synthetic teaching observation is not listed as a measured output.

### 3. Model — math and science

- Select Model.
- Inspect `clean-water.flow-screen`, its variable bindings, substitutions, units, assumptions, and limitations.
- Confirm the science view distinguishes principles, model equations, approximations, empirical relationships, assumptions, and observations.
- Confirm missing sources/observations remain unavailable or not declared.

### 4. Solve — engineering change and evaluation

- Select Solve.
- Inspect requirements, hard gates, objectives, design variables, hazards, and tradeoffs before changing a value.
- In Dynamic STEM, change filter efficiency from 0.8 to 0.75 and select **Evaluate parameter change**.
- Confirm the API creates a canonical Submission and server-side Evaluation.
- Confirm the comparison reports 64 L to 60 L, delta -4 L, and the exact changed material-input path.
- Confirm unavailable visualization primitives and time playback remain unavailable.

### 5. Verify — evidence, uncertainty, and experiment

- Select Verify.
- Inspect the model/evidence ladder and result-to-proof trace.
- Confirm model fidelity, evidence readiness, deployment readiness, and professional disposition are separate.
- Confirm accepted calculation/local-replay Evidence, unresolved independent-reproduction and physical-validation obligations, and contradiction status.
- Inspect the experiment plan: prediction 64 L; explicitly synthetic observation 58 ±2 L; discrepancy -6 L; criterion fail; negative result preserved.
- Confirm evidence readiness remains unchanged and `readinessUpdate` is `not-applied`.

### 6. Research / Professional — advanced drill-down

- Select Research / Professional.
- Confirm the same evaluation identity and hashes remain visible.
- Inspect exact Model, solver/runner source identities, numerical settings, assumptions, equation links, evidence identities, replay status, limitations, and open proof obligations.
- Confirm this depth does not claim validation, certification, professional review, or learner mastery.

## Issue #4 acceptance answers

The UI must let a non-expert answer these from the Clean Water project without source code:

| Question | Where the answer appears |
| --- | --- |
| What is the system trying to do? | Challenge problem and System Map boundary. |
| What parts are in it and how do they interact? | System Map elements and resource/power Interfaces. |
| What quantities matter? | Show the Math quantity list and input/control/output roles. |
| What math produced the result? | `clean-water.flow-screen`, bindings, substitutions, intermediates, and output. |
| What scientific principles are involved? | Show the Science classifications, applicability, sources, evidence status, and limitations. |
| What engineering choices can I change? | Engineering design variables and Dynamic STEM allowed parameter controls. |
| What technology is used and why? | Technology Map nodes and purpose links. |
| What assumptions are active? | Challenge/model assumptions, equation assumptions, and model inspection. |
| What is simulated versus measured? | Calculated outputs, measured-output status, and experiment observation classification. |
| How certain is the conclusion? | Evaluation uncertainty, sensitivity, model fidelity/calibration, and experiment discrepancy. |
| What evidence supports it? | How Do We Know trace, accepted Evidence, identities, and replay status. |
| What remains unknown or unverified? | Unavailable states, unknown relevance categories, limitations, contradictions, and open proof obligations. |
| Why might it matter to people? | Evidence-linked Human Relevance outcomes and separately labeled stakeholder values. |

## Recovery and verification ledger

- Execution plan: `docs/program/STEM_FOUNDATION_EXECUTION_PLAN_2026-08-28.md`
- Per-slice verification checklist: `docs/program/STEM_FOUNDATION_VERIFICATION_CHECKLIST.md`
- Issue #15 checkpoint: `docs/program/STEM_FOUNDATION_SLICE_L_2026-08-29.md`
- Local verification artifacts: `artifacts/phase-1a/local/`

Only executed checks may be marked verified. Issue #16 and any merge to `canonical/verified-lineage` require explicit owner authorization.
