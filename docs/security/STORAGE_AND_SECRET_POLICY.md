# Storage and Secret Policy

The API storage boundary is intentionally narrow in the foundation slice.

## Policy

- `StorageAdapter` is an interface boundary only.
- `LocalMemoryStorage` is local-only and is not production storage.
- JSON-file storage is local-only and is not production storage.
- Production storage must be managed, encrypted, monitored, backed up, and reviewed before use.
- Plaintext long-lived secrets are forbidden in production.
- Future secret storage must use managed secret storage or an equivalent reviewed secret-management boundary.

## Current Implementation Limits

This repository provides local foundation packages, examples, tests, and validation gates. It does not provide production storage, production secret management, production identity, professional approval, potable-water certification, or production manufacturing approval.
