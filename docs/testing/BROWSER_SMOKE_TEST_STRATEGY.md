# Browser Smoke Test Strategy

Date: 2026-08-14
Status: Current Phase-1A local-browser strategy

## Current boundary

Phase-1A includes a local API-backed Challenge and Submission workflow, deterministic evaluation, comparison, evidence inspection, and replay export. The browser remains a projection: canonical validation, scoring, comparison, and hashing are owned by the local API and canonical packages.

The application is local-only, uses process-memory storage, and has no production authentication, tenancy, durable persistence, deployment, or professional-approval claim.

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
3. `Validate / create Challenge` succeeds for the seeded canonical record;
4. `Validate / import / run Submission` succeeds and executes through the canonical REP runner;
5. material identities, result values, and unresolved proof obligations are visible;
6. no browser console error is observed during the smoke;
7. the API listener remains loopback-only.

The live smoke is execution evidence for the tested environment. It is not cross-browser certification or production end-to-end coverage.

## 2026-08-14 maintenance smoke

After the Vite 7 patch refresh, the application loaded at the dynamically selected local Vite URL while the API listened on `127.0.0.1:3080`. The complete Phase-1A surface rendered, Challenge creation succeeded, Submission import/evaluation succeeded, and zero browser console errors were observed. The local processes were stopped after the test.

## Deferred automated-browser harness

A repository-owned automated browser harness remains deferred while the application is a single local demonstrator and the current unit/API/live-smoke combination covers its narrow behavior. Add a durable automated browser suite before claiming any of the following:

- durable or multi-user editing;
- authenticated or role-specific behavior;
- production deployment readiness;
- cross-browser compatibility;
- multi-page routing with material workflow state;
- persisted submission/evaluation lifecycle behavior;
- or a substantially broader evaluator catalog.

## Non-claims

This strategy does not claim broad browser automation, cross-browser support, production deployment, durable persistence, professional review, or physical validation.
