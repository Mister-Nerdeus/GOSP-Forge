# Storage and Secret Policy

The API storage boundary is intentionally narrow in the foundation slice.

## Policy

- `StorageAdapter` is an interface boundary only.
- `LocalMemoryStorage` is local-only and is not production storage.
- Versioned atomic filesystem storage is local-only and is not production storage.
- Local workspace archives are owner-controlled backup artifacts and may contain complete material payloads; they must not be committed or shared without review.
- Production storage must be managed, encrypted, monitored, backed up, and reviewed before use.
- Plaintext long-lived secrets are forbidden in production.
- Future secret storage must use managed secret storage or an equivalent reviewed secret-management boundary.

## Current Implementation Limits

This repository provides durable local workspace envelopes, archives, foundation packages, examples, tests, and validation gates. It does not provide transactional or multi-tenant production storage, production secret management, production identity, professional approval, potable-water certification, or production manufacturing approval. See the [local workspace threat model](LOCAL_WORKSPACE_THREAT_MODEL.md).
