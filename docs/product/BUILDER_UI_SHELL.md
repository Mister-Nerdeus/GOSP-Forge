# Phase-1A Web Application Surface

The web package is the local challenge-facing application projection. It loads a derived read model from the Node API and presents registered sandbox and Clean Water workspaces, structured Challenge and Submission authoring, REP Evaluations, Evidence, deterministic Comparison, explainability, replay, portable evidence, and workspace archive controls.

## Boundaries

- No CAD editor is implemented.
- Direct server persistence uses durable owner-controlled local files; tests may use process memory. Neither is production storage.
- Structured authoring covers identity, narrative, and material payload while keeping canonical validation and material JSON visible. It is not a CAD editor.
- No potable-water certification, professional approval, or production manufacturing approval is provided.
- The browser does not implement scoring, canonicalization, or hashing.

## Validation

The package participates in workspace build, typecheck, and Vitest smoke coverage through Vite and TypeScript. The API validates canonical objects and selects a registered REP evaluator by exact Model identity. See [the Phase-1A product-loop document](PHASE_1A_MINIMAL_PRODUCT_LOOP.md).
