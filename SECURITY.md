# Security Policy

GOSP Forge is an early research/development repository and is not yet approved for sensitive, export-controlled, regulated, or production safety-critical engineering data.

## Do not commit

- credentials, tokens, private keys, license-server secrets;
- sponsor-confidential engineering data;
- export-controlled technical data;
- personal data not explicitly authorized for the repository;
- proprietary CAD/models/datasets without documented rights.

## Untrusted evaluation rule

Phase 0 evaluations are local reference workloads only. Future untrusted submissions must run with least privilege, network disabled by default, explicit resource limits, and isolated storage before the platform accepts third-party executable content.

## Reporting

For now, report suspected security issues privately to the repository owner rather than opening a public issue containing exploit details or sensitive data.

No statement in this file represents a completed security audit, penetration test, compliance certification, or production-readiness approval.
