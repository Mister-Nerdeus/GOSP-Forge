# Reconciliation Evidence Custody

Date: 2026-08-14 (America/New_York)

This record concerns the separate unpublished reconciliation evidence. It does not supersede the [legacy published host-path disclosure](LEGACY_PUBLISHED_HOST_PATH_DISCLOSURE_2026-08-14.md) for six older Phase-0B/Phase-1A execution records already present in published ancestry.
Status: Local preservation established; public payload and external archive not established

## Purpose

This record separates repository-publication content from raw reconciliation provenance. It prevents local review packages from being treated as either disposable build output or automatically public evidence.

## Observed local preservation

- A separate local-only checkpoint, `7ab8c0cb95ae7a71eaa548ff91f03d55e45586bb`, preserves 131 reconciliation evidence files without rewriting the immutable Phase-0B, Phase-1A, or remediation checkpoints.
- The two Phase-1A review manifests were independently recalculated before that checkpoint: 50/50 R1 entries and 54/54 R2 entries matched.
- The documentation-remediation hash manifest was independently recalculated: 12/12 entries matched.
- Credential-signature and credential-assignment scans found zero matches.
- Eight historical evidence files contain ten occurrences of the same host-specific Corepack executable path under a Windows user profile.
- One additional raw file, `artifacts/reconciliation/BATCH_STATE.json`, remains outside Git history because it contains private Codex attachment paths. Its recorded SHA-256 is `7b2f33f28ce920c324e84dc25eaedb6023652174e6794d15e895119a7d97f917`.

These are local observations. No access-controlled external archive was verified.

## Publication disposition

The privacy-safe publication candidate based on `6ef362b2324f562420d8f4b6d1a4c3af7305cf83` excludes all 131 reconciliation payload files and the raw batch-state file. It includes only human-readable status, custody, maintenance, and verification records needed to explain the current boundary.

Deleting the payload files in a descendant of `7ab8c0c...` would not remove them from published Git history. Therefore:

1. do not publish `7ab8c0c...` or its maintenance descendant without an explicit owner decision accepting the host-path disclosure;
2. do not publish the raw batch-state file in its current form;
3. if public artifact-level provenance is later required, create separately named sanitized derivatives and new integrity manifests rather than rewriting historical local evidence;
4. preserve the local checkpoint and raw file until an access-controlled archive or an explicit continued-local-custody decision is recorded.

## Truth boundary

This custody record proves neither remote preservation nor public publication of the review packages. The public candidate can advance repository authority without exposing the reviewed local payloads; the local evidence remains separately recoverable.
