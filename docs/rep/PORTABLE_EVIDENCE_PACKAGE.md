# Portable Evidence Package

Status: Implemented local format, version `0.1.0`

`GospEvidencePackage` carries a replayable material section containing the REP replay record, Evaluation, Claim, Evidence records, and limitations. `materialPackageHash` is SHA-256 over canonical JSON for that material section.

Execution evidence is included separately and does not affect `materialPackageHash`. Changing timestamps, runtime, operating system, working directory, or other execution-only details therefore cannot change material package identity.

Validation performs three checks:

1. recompute the material-package hash;
2. select the registered evaluator from the exact Model identity and replay the material input;
3. compare replayed material-input and material-result hashes with the package and Evaluation.

A passing validation establishes package integrity and local deterministic replay for the registered implementation. It does not establish independent reproduction, physical correctness, professional approval, certification, regulatory acceptance, or production readiness.

