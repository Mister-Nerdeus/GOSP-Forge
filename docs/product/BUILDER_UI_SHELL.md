# Phase-1A Web Application Surface

The web package is the minimal Phase-1A challenge-facing application projection. It loads a derived local read model from the Node API and presents the canonical `sandbox-001` Challenge, two Submissions, REP Evaluations, Evidence, deterministic Comparison, explainability, and replay/export controls.

## Boundaries

- No CAD editor is implemented.
- Persistence is process-local memory only and resets with the API process.
- Canonical Challenge and Submission JSON can be validated/imported locally; no general project editor is implemented.
- No potable-water certification, professional approval, or production manufacturing approval is provided.
- The browser does not implement scoring, canonicalization, or hashing.

## Validation

The package participates in workspace build, typecheck, and Vitest smoke coverage through Vite and TypeScript. The API validates canonical objects and calls the existing REP runner. See [the Phase-1A product-loop document](PHASE_1A_MINIMAL_PRODUCT_LOOP.md).
