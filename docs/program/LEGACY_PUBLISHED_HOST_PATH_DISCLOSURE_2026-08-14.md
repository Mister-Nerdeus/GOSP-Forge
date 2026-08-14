# Legacy Published Host-Path Disclosure

Date: 2026-08-14 (America/New_York)
Status: Observed in existing published ancestry; no new occurrence introduced by the candidate

## Observation

The local remote-tracking ref `origin/canonical/verified-lineage` and candidate base `6ef362b...` each contain six historical execution records with one Windows Corepack command path that includes the local user-profile name:

- four records under `artifacts/phase-0b/local/`;
- two records under `artifacts/phase-1a/local/`.

The six records were already ancestors of the published Stage-1 line before this candidate was prepared. They are not reconciliation review packages, credentials, private attachment paths, or newly generated candidate evidence. A common credential-pattern scan found no credential match.

## Candidate boundary

The staged candidate changes no file under `artifacts/` and adds zero host-profile, private attachment, or credential-pattern occurrence. It excludes the unpublished reconciliation packages and their raw batch-state file. Accordingly, “privacy-safe candidate” means that the candidate introduces no new private-path exposure and does not publish the separate local-only reconciliation history; it does not mean the inherited Git history is free of host paths.

## Preservation decision

This candidate does not rewrite history or edit historical validation artifacts. A tip-only redaction would leave the original path in Git history while changing the evidence record, and a remote history rewrite would conflict with the selected lineage and checkpoint-preservation policy unless separately designed and owner-authorized. Neither action is performed here.

The owner should treat the six already-published paths as a known disclosure during the publication decision. They expose a local Windows profile and tool-cache location, but the observed strings are not authentication material. Any request for destructive history remediation requires a separate risk decision, backup/rollback plan, affected-ref inventory, and explicit authorization.
