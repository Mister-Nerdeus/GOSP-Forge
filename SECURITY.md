# Security Policy

GOSP Forge is an early research/development repository and is not approved for sensitive, export-controlled, regulated, or production safety-critical engineering data.

## Do not commit

- credentials, tokens, private keys, or license-server secrets;
- sponsor-confidential engineering data;
- export-controlled technical data;
- personal data not explicitly authorized for the repository;
- proprietary CAD, models, or datasets without documented rights.

## Evaluation boundary

Current evaluations are local reference workloads over repository-controlled inputs. The project does not accept or execute arbitrary third-party code. Any future untrusted execution requires least privilege, network disabled by default, explicit resource limits, and isolated storage before admission.

## Reporting

Report suspected security issues privately to the repository owner rather than opening a public issue containing exploit details or sensitive data.

This policy is not evidence of a completed security audit, penetration test, compliance certification, professional approval, or production readiness.
