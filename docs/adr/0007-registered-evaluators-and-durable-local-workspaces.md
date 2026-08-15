# ADR 0007: Registered Evaluators and Durable Local Workspaces

- Status: Accepted for the post-Phase-1A local application increment
- Date: 2026-08-14

## Context

The first Phase-1A application path embedded `sandbox-001` directly in the API and stored authored records only in process memory. That proved the minimal product loop but could not demonstrate a second vertical through the same application boundary or preserve local work across restarts.

## Decision

The application layer owns a registry of evaluator adapters. Each adapter declares its exact Model identity, material-input template, evaluator, objective result path, explanation limitations, and seed Submissions. The registry selects adapters from canonical Model identity; it does not add domain concepts to GOSP core.

Structured authoring may create new revisions of a registered logical Challenge. Defining an unrelated Challenge ID requires a separately registered evaluator/template rather than reusing an evaluator whose material boundary does not claim that support.

The local server uses an atomic, versioned filesystem key/value adapter by default. Caller-controlled keys are hashed into filenames, writes use same-directory temporary files and atomic rename, and workspace archives provide an explicit backup/restore path. Tests may continue using process-local memory.

Portable evidence packages contain a material section and its canonical SHA-256 hash. Execution evidence remains outside that material hash. Package validation reruns the registered evaluator and compares the recorded material-input and material-result hashes.

## Consequences

- `sandbox-001` and the Clean Water educational adapter use the same application service and REP boundary.
- Core packages remain domain-neutral; the API application layer may depend on vertical adapters.
- Local records can survive restarts without claiming database, tenant, authentication, deployment, or production readiness.
- A portable evidence package is independently movable, but local validation is not independent external reproduction.
- Adding an evaluator requires an exact Model identity and explicit limitations; it cannot silently repair canonical inputs.
