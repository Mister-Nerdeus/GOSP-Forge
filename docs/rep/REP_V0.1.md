# Reproducible Evaluation Protocol (REP) v0.1

- Protocol version: `0.1.0`
- Implementation status: Phase-0B reference implementation
- Scope: deterministic local evaluation and replay

## Purpose

REP records enough material identity to rerun an evaluation and compare its engineering result across execution environments. It does not certify physical correctness, safety, deployment readiness, professional approval, or regulatory compliance.

## Material input

`RepMaterialInput` includes every declared input capable of changing an engineering result:

- exact Challenge revision;
- exact Submission revision and material payload;
- compiled Scenario, including environment, schedules, operating conditions, parameters, assumptions, components, datasets, model choice, and constraints;
- Model and solver identity, fidelity, assumptions, boundary conditions, and uncertainty metadata;
- Workflow revision;
- runner identity and revision;
- contract/schema identities;
- dataset identities;
- component/product-data identities;
- material assumptions and parameters.

Versioned artifact identities contain a kind, stable ID, revision, and SHA-256 content hash.

### Runner and solver implementation identity

Phase-0B runner and solver content hashes use `gosp-source-implementation-v1` as established by ADR 0005. The canonical source manifest binds identity to an explicit repository-relative source closure, relevant contract sources, TypeScript configuration, the resolved TypeScript version, and exact relevant runtime dependency versions.

Text sources are normalized from UTF-8 with an optional BOM and CRLF/CR line endings to UTF-8 without a BOM and LF endings before hashing. File records are sorted by repository-relative path. Absolute paths, parent traversal, timestamps, host/runtime metadata, and build-output locations are prohibited from the source manifest.

The source manifest is recorded with local execution evidence so another reviewer can audit how the runner and solver hashes were derived. The Node/OS environment remains separate execution evidence because cross-environment reproduction intentionally compares different supported runtimes and operating systems.

## Normative canonicalization

Material hashes use `gosp-canonical-json-unicode-code-point-v1`:

1. accepted values are JSON null, booleans, finite numbers, strings, dense arrays, and plain objects;
2. negative zero is serialized as zero;
3. non-finite numbers, undefined values, functions, symbols, bigint values, cyclic graphs, sparse arrays, class instances, and other non-JSON values are rejected;
4. object keys are ordered lexicographically by Unicode code point, independent of host locale;
5. strings and finite numbers use ECMAScript JSON serialization;
6. SHA-256 is calculated over the UTF-8 canonical JSON text.

## Material result

The material-result hash covers:

- REP version and material-input hash;
- exact Challenge, Submission, Scenario, Model, and Workflow refs;
- runner, contract, and dataset identities;
- result values;
- explanation, equations, intermediate values, and model-inspection metadata;
- uncertainty and sensitivity metadata.

Because the material-input hash is included, a declared material-input change changes the material-result identity even when a coincidental numeric output remains equal.

## Execution evidence

`RepExecutionEvidence` is stored separately. It may contain timestamps, command line, OS, architecture, runtime, package manager, hostname, username, locale, timezone, process ID, working directory, artifact paths, warnings, and exit status.

Execution-only values must never enter either material hash.

## Replay

A `RepReplayRecord` contains the full material input and optional expected material-input and material-result hashes. Replay reevaluates the record and reports both comparisons. A mismatch is a failed reproducibility result and remains visible.

## sandbox-001

The reference benchmark computes:

```text
result = offset + scale * sum(values[i] * weights[i])
```

The checked-in replay record uses values `[1, 2, 3]`, weights `[2, 3, 5]`, offset `7`, and scale `2`, producing result `53`. It is synthetic and carries no physical or professional-use claim.
