# ADR 0002: Canonical Identity, Versioning, and Lineage

- Status: Accepted for Phase-0B
- Date: 2026-08-07

## Context

Existing objects use IDs and free-form version strings inconsistently. The Engineering Program Graph needs stable references without forcing speculative persistence infrastructure.

## Decision

Every canonical object carries:

- a typed object kind;
- a stable logical ID;
- a non-empty revision;
- provenance source references;
- optional creation metadata;
- optional supersession lineage;
- typed relationships to other canonical objects;
- status where the object lifecycle requires one.

Logical identity and revision identify an authored object. Material hashes identify immutable serialized content. Identity alone does not establish professional approval or truth.

## Consequences

Legacy contracts remain valid through additive schemas and adapters. Content-addressed material identities can be added to evaluation records without converting all repository files to a content-addressed store.
