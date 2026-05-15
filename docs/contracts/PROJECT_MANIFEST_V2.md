# Project Manifest V2

Manifest V2 supports incomplete designs and references external truth-bearing files without duplicating them.

## Typed Ref Groups

`refGroups` is the typed reference surface for current manifests:

- `problem`: one problem ref.
- `modules`: module refs.
- `products`: product binding refs.
- `graphs`: resource, power, or control graph refs.
- `estimates`: cost or estimate refs.
- `scorecards`: scorecard refs.
- `education`: education guide refs.
- `safety`: safety profile or safety document refs.

The legacy `problemRef` and `refs` fields remain accepted during the foundation transition so earlier validation and CLI commands continue to pass. New manifests should populate `refGroups` and later validation slices should resolve those groups directly.

Scoring manifests require a problem ref through either `refGroups.problem` or the legacy `problemRef`.

## Current Implementation Limits

This document describes foundation policy and contract intent. The current repository provides foundation packages, example fixtures, and validation gates only. It does not claim production readiness, professional approval, potable-water certification, or production manufacturing approval.

## Canonical Refs

refGroups is canonical for ProjectManifestV2. refs and problemRef are legacy migration fields only. Exact duplicates are warnings; mismatches between legacy refs and refGroups are blockers.
