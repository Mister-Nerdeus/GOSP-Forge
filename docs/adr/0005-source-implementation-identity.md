# ADR 0005: Source-Implementation Identity for Local REP

- Status: Accepted for Phase-0B by explicit owner decision
- Date: 2026-08-07

## Context

The first REP implementation hashed descriptive runner and solver constants. That proved only that an evaluation declared a particular name and revision; it did not bind the identity to the implementation that produced the result.

Three approaches were considered: hashing a deterministic source closure, hashing compiled JavaScript artifacts, or recording both. The project owner selected the deterministic source-closure approach for Phase-0B.

## Decision

REP runner and solver `contentHash` values use `gosp-source-implementation-v1`. The hash covers a canonical manifest containing:

- the logical implementation ID and revision;
- an explicit, reviewed closure of repository-relative implementation and contract source paths;
- SHA-256 hashes of each source after UTF-8 BOM removal and CRLF/CR normalization to LF;
- relevant TypeScript configuration files;
- the resolved TypeScript toolchain version;
- exact resolved runtime dependency versions relevant to the implementation.

Manifest file records are sorted by repository-relative path and the complete manifest is hashed using REP canonical JSON. Duplicate, absolute, drive-qualified, or parent-traversing paths are rejected.

Timestamps, usernames, host paths, process IDs, operating systems, Node versions, locales, timezones, and build-output paths are excluded. Those remain execution evidence and must not change material identity.

## Consequences

- A reviewed implementation or relevant contract-source change changes the runner or solver identity and therefore changes REP material hashes.
- Equivalent LF and CRLF working trees produce the same identity.
- The identity can be audited by recording the source manifest alongside execution evidence.
- Source must be present for this local Phase-0B implementation to calculate identity.
- A future packaged or signed runner may add a separate compiled/package artifact identity without redefining this source-implementation identity.
