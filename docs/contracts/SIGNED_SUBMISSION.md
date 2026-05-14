# Signed Submission

Official submissions require input hash, model version, scoring profile, signature metadata, and server re-simulation before trust.

## Contract Boundary

- Signature metadata records algorithm, key id, and signature bytes.
- Signature metadata is not proof of simulation correctness.
- Server re-simulation is required before leaderboard, trust, or acceptance decisions.
- A signed submission can still be rejected or revoked after review.

## API Verifier Boundary

`verifySubmissionSignatureMetadata` parses the signed submission contract and reports whether server re-simulation is still required. It does not make a cryptographic correctness claim and does not mark submissions trusted.

## Production Requirements

- Production signing keys must use managed secret storage.
- Plaintext long-lived secrets are forbidden.
- Server-side re-simulation must reproduce the submitted input hash, model version, and scoring profile before any trusted status.

## Current Implementation Limits

This repository provides foundation schemas, verifier boundary tests, and local validation gates only. It does not operate a public leaderboard, production signing service, production secret store, or professional validation process.
