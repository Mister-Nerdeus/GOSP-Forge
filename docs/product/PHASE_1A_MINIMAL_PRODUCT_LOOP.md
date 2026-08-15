# Phase-1A Minimal Challenge-Facing Product Loop

## Scope

The existing plain-DOM Vite app and local Node API implement the application-facing slice:

```text
Challenge -> Submission -> REP Evaluation -> Evidence -> Comparison
```

The browser is a projection. It does not calculate scores, canonicalize material input, or create material hashes. The local API validates canonical records with `@gosp/contracts` and invokes the existing `@gosp/sim-core` REP runner.

## Local operation

From the repository root:

```powershell
pnpm dev:phase1a
```

The API listens on `127.0.0.1:3080`; Vite uses its normal local port and proxies `/api` to that API. Direct local-server execution stores records under the ignored owner-controlled `.gosp/workspaces/default` directory using versioned envelopes and atomic file replacement. `GOSP_WORKSPACE_DIR` may select another local directory. Tests use the process-memory adapter. This is durable local storage, not production persistence.

## Implemented boundary

- Select and inspect either registered evaluator workspace: `sandbox-001` or the Clean Water educational screening adapter.
- Validate/create canonical Challenge JSON.
- Validate/import canonical Submission JSON with exact Challenge and Scenario reference checks.
- Evaluate two valid candidate Submissions through the existing REP runner.
- Select any two process-local Submissions for evaluation and controlled comparison.
- Refresh the displayed workspace after a local import so the new result, evidence, and comparison are visible without restarting the app.
- Display material identities separately from execution evidence.
- Display result metrics, hard-gate outcomes, Claim/Evidence readiness, contradictions, limitations, and unresolved proof obligations.
- Compare changed/fixed material input paths, numeric result deltas, hard-gate changes, readiness, and proof obligations.
- Display structured explanation, the real sandbox equation, variables, intermediate values, Model fidelity, numerical settings, and source-implementation identities.
- Export a REP v0.1 replay record and show replay hash-match status.
- Export and validate a portable material-hashed evidence package.
- Export and restore a validated canonical workspace archive.
- Author a new revision and narrative for a registered Challenge, plus Submission identity/material payload, through structured browser controls backed by canonical API validation.

## Limitations and non-claims

- The evaluator catalog contains only the synthetic sandbox and Clean Water educational screening adapter.
- Filesystem storage is single-owner local durability, not a transactional database or multi-user service.
- The UI is not a source of engineering truth.
- Local replay is not independent external reproduction.
- The synthetic benchmark is not physical validation.
- No professional approval, certification, regulatory approval, production authentication, tenancy, production database durability, or deployment readiness is claimed.
