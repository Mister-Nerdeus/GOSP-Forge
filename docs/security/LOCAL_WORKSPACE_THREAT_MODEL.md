# Local Workspace Threat Model

Date: 2026-08-14
Status: Implemented local controls; not a production security assessment

## Protected assets

- canonical Challenges, Submissions, Evaluations, Claims, and Evidence;
- material and source-implementation hashes;
- locally authored material payloads and exported archives;
- the separation between material records and execution evidence.

## Current trust boundary

The Phase-1A server binds to `127.0.0.1`, accepts JSON rather than executable code, applies request-size and rate limits, sends no-store and browser-hardening headers, and persists only to an owner-controlled local directory. Storage keys are hashed into filenames and cannot select arbitrary paths. Writes use a versioned envelope and atomic replacement.

## Credible local threats and controls

| Threat | Current control | Residual limitation |
| --- | --- | --- |
| Path traversal through record identity | SHA-256 filename derivation | Local account access can still read workspace files |
| Partial file replacement | same-directory temporary write and atomic rename | No transactional multi-record database |
| Oversized or malformed input | JSON content-type, parse, and size limits | Not designed for hostile internet exposure |
| Silent material tampering | canonical schemas, REP hashes, evidence-package hash and replay | No signing key or external timestamp authority |
| Browser/API data caching | `Cache-Control: no-store` and hardening headers | Browser and OS behavior are not certified |
| Secret or sensitive-data ingestion | repository policy and local-only storage disclosure | No DLP, tenant isolation, or regulated-data approval |

## Explicit non-claims

There is no production authentication, authorization, tenant isolation, encryption-at-rest guarantee, key management, audit service, penetration test, compliance certification, public deployment approval, or untrusted-code sandbox.

