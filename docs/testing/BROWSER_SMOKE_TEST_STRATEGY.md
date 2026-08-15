# Browser Smoke Test Strategy

Date: 2026-08-14
Status: Current Phase-1A local-browser strategy

## Current boundary

Phase-1A includes a local API-backed Challenge and Submission workflow, deterministic evaluation, comparison, evidence inspection, and replay export. The browser remains a projection: canonical validation, scoring, comparison, and hashing are owned by the local API and canonical packages.

The application is local-only. Direct server execution uses owner-controlled durable filesystem storage; tests may use process memory. It has no production authentication, tenancy, transactional database, deployment, or professional-approval claim.

## Required automated evidence

- `pnpm --filter @gosp/web test` verifies the rendered canonical projection and explicit non-claims.
- `pnpm --filter @gosp/web build` verifies the Vite production bundle.
- `pnpm --filter @gosp/web typecheck` verifies the web TypeScript boundary.
- API tests verify canonical Challenge/Submission validation, evaluation, comparison, export, loopback binding, and error behavior.
- `node scripts/phase-1a/read-product-loop-results.mjs` verifies the complete local product-loop result independently of the browser.

These commands run through the complete local verification and supporting readers. Missing or undiscovered tests must fail the exact test-discovery gate.

## Required live local smoke

Run a controlled local-browser smoke after changes to the web application, API-facing client, Vite/build tooling, local proxy, or Phase-1A response contracts:

```powershell
pnpm dev:phase1a
```

The actual Vite port may differ when its preferred port is already in use. Record the observed URL and verify:

1. the application and API respond locally;
2. Challenge, Submission, REP results, controlled comparison, all four explainability layers, evidence, replay, persistence disclosure, and non-claims render;
3. the evaluator selector switches between `sandbox-001` and Clean Water without crossing comparison boundaries;
4. structured Challenge and Submission authoring reaches canonical API validation and registered REP evaluation;
5. any two local Submissions for the same exact Challenge can be selected and rerun;
6. restart preserves authored records when filesystem storage is active;
7. REP replay, portable evidence package, workspace archive, and evidence validation controls are visible;
8. material identities, result values, limitations, and unresolved proof obligations are visible;
9. no browser console error is observed during the smoke;
10. the API listener remains loopback-only.

The live smoke is execution evidence for the tested environment. It is not cross-browser certification or production end-to-end coverage.

## 2026-08-14 maintenance smoke

After the Vite 7 patch refresh, the application loaded at the dynamically selected local Vite URL while the API listened on `127.0.0.1:3080`. The complete Phase-1A surface rendered, Challenge creation succeeded, Submission import/evaluation succeeded, and zero browser console errors were observed. The local processes were stopped after the test.

## 2026-08-14 selectable-comparison smoke

After the selectable process-local comparison increment, the application loaded at `http://localhost:5176/` while the API listened on `127.0.0.1:3080`. Reversing the seeded baseline/candidate selection reran the pair and changed the displayed `result.value` delta from `-30` to `30`. Importing `submission.sandbox-001.local-import@1.0.0` added a third process-local Submission and refreshed the active comparison without restarting the app. The selected evaluation cards, material identities, comparison boundary, replay status, evidence, proof obligations, persistence disclosure, and non-claims remained visible. No browser console warning or error was observed. The local processes were stopped after the test.

## Deferred automated-browser harness

A repository-owned automated browser harness remains deferred while the application is a single local demonstrator and the current unit/API/live-smoke combination covers its narrow behavior. Add a durable automated browser suite before claiming any of the following:

- multi-user editing;
- authenticated or role-specific behavior;
- production deployment readiness;
- cross-browser compatibility;
- multi-page routing with material workflow state;
- authenticated or concurrent persisted lifecycle behavior;
- or a substantially broader evaluator catalog.

## Non-claims

This strategy does not claim broad browser automation, cross-browser support, production deployment, production database readiness, professional review, or physical validation.
