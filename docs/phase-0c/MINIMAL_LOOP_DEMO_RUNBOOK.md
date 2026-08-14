# Phase-0C Minimal-Loop Demo Runbook

Status: Local demonstration procedure; no external demonstration is recorded

## Purpose

Demonstrate the implemented Challenge → Submission → Evaluation → Evidence → Comparison loop in 10–12 minutes while preserving its technical and professional boundaries.

## Before the session

- Run the repository's complete local verification gate.
- Start `pnpm dev:phase1a` and confirm the API is bound to `127.0.0.1`.
- Use only the synthetic `sandbox-001` benchmark.
- Confirm that no participant data, confidential data, or production credentials are present.
- Ask permission before taking attributable notes.
- State that records are process-local and reset when the API stops.

## Demo sequence

### 1. Frame the problem — 1 minute

Explain that GOSP Forge tests whether requirements, inputs, model identity, results, and supporting evidence can remain connected and replayable. Do not present the demo as a finished product or validated engineering solver.

### 2. Inspect the Challenge — 2 minutes

Show the Challenge identity, problem statement, hard requirement, objective, Scenario, Model, solver, assumptions, and evidence obligations. Ask which of these elements is normally lost or disconnected in the participant's workflow.

### 3. Inspect two Submissions — 1 minute

Show that both candidates reference the same exact Challenge and Scenario while their material values differ. Emphasize that the browser does not calculate or hash engineering results.

### 4. Inspect Evaluation and evidence — 2 minutes

Show result metrics, material input/result hashes, runner and solver source identities, evidence readiness, deployment readiness, limitations, and unresolved proof obligations.

### 5. Compare candidates — 2 minutes

Show changed input paths, fixed paths, result deltas, hard-gate status, and the plain-language explanation. Ask whether this would reduce review or reconstruction work and what important comparison is missing.

### 6. Show math and model inspection — 1 minute

Show the equation identifier, variables, intermediate values, arithmetic setting, fidelity, assumptions, and limitations. Ask what model detail the participant would require before trusting a result.

### 7. Replay/export — 1 minute

Show the replay status and export control. Explain that matching local replay is not independent external reproduction.

### 8. Show a controlled validation boundary — 1 minute

Use the create/import controls to demonstrate canonical validation. If demonstrating a rejected input, do not repair it silently; show the returned diagnostics.

## Questions immediately after the demo

1. Which part reflects a real problem in your current workflow?
2. Which part is unnecessary or misleading?
3. What evidence would be required before someone else could review the result?
4. What information must remain private?
5. What bounded problem could test the workflow without creating unacceptable risk?
6. Who would decide whether such a pilot created value?
7. What would make the organization pay for a discovery or pilot?

## Evidence to capture

- participant role and organization type;
- consent and attribution choice;
- current workflow and failure points;
- confirmed value, rejection, or uncertainty in the participant's words;
- missing information or capabilities;
- candidate bounded problem;
- design-partner interest, if explicit;
- willingness to pay, only if explicit and attributable;
- requested follow-up and its authorization status.

Interest, politeness, attendance, or a request for information does not satisfy Gate A.
