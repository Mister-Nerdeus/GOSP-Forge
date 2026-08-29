# STEM Foundation Slice C — Show the Science

Date: 2026-08-29 (America/New_York)
Issue: #7
Starting SHA: `20000e6032cc8a1c11df18a23f35466c09709d62`
Implementation SHA: `93979ea9415bb20a80c799e544995216889253e6`
Branch: `cipher/stem-foundation`

## Result

Slice C adds a domain-neutral science projection that distinguishes:

- natural principle;
- model equation;
- engineering approximation;
- empirical relationship;
- assumption;
- observation.

Every item exposes applicability, limitations, source status, evidence status, equation links, quantity links, and the exact model/fidelity context. Cross-links to undeclared math nodes are rejected.

Clean Water declares all six distinctions. Its volume-balance principle has no attached authoritative source, its empirical efficiency relationship is unavailable, and its physical observation is explicitly `not-declared`. Sandbox remains a `synthetic-benchmark` with no asserted natural principle, empirical relationship, or physical observation.

## Files changed

- `apps/web/src/App.test.ts`
- `apps/web/src/App.tsx`
- `config/intended-tests.json`
- `packages/api/src/phase1a/evaluatorRegistry.ts`
- `packages/api/src/phase1a/service.ts`
- `packages/api/src/phase1a/stemSystemProjection.test.ts`
- `packages/api/src/phase1a/stemSystemProjection.ts`
- `packages/contracts/src/education/stemScienceProjection.test.ts`
- `packages/contracts/src/education/stemScienceProjection.ts`
- `packages/contracts/src/education/stemSystemProjection.ts`
- `packages/contracts/src/index.ts`
- `packages/sim-core/src/education/stemScienceDefinition.ts`
- `packages/sim-core/src/index.ts`
- `packages/sim-core/src/rep/rep.test.ts`
- `packages/vertical-clean-water/src/education/stemScienceDefinition.ts`
- `packages/vertical-clean-water/src/index.ts`
- `packages/vertical-clean-water/src/vertical-clean-water.test.ts`

## Executed verification

Runtime: Node v22.16.0; pnpm 9.15.5; 2026-08-29 America/New_York.

Commands executed:

```text
git diff --check
pnpm --filter @gosp/contracts build
pnpm --filter @gosp/sim-core build
pnpm --filter @gosp/vertical-clean-water build
pnpm --filter @gosp/api build
pnpm --filter @gosp/web typecheck
pnpm --filter @gosp/contracts test -- stemScienceProjection.test.ts
pnpm --filter @gosp/sim-core test -- rep.test.ts
pnpm --filter @gosp/vertical-clean-water test
pnpm --filter @gosp/api test -- stemSystemProjection.test.ts
pnpm --filter @gosp/web test
pnpm verify
pnpm dev:phase1a
pnpm install --frozen-lockfile
rg -n -i "clean[- ]water|solar|pump|filter" packages/contracts/src/education/stemScienceProjection.ts
```

Observed results:

- affected builds/typechecks: pass;
- focused science contracts: 3/3;
- focused sim-core: 10/10;
- focused Clean Water: 18/18;
- focused API projection: 6/6;
- focused web: 1/1;
- intended discovery: 35/35 files;
- full repository: 35 files, 163 tests passed;
- REP replay input/result hashes matched;
- Clean Water validation/simulation/estimate completed;
- foundation audit: GO, 23 pass, 0 warn, 0 fail;
- frozen install passed with an unchanged lockfile;
- core-boundary scan found no vertical terms in the science contract.

## Browser acceptance

API: `http://127.0.0.1:3080`. Browser: `http://localhost:5174/` because port 5173 was occupied.

Observed:

- Sandbox rendered `synthetic-benchmark`, a model equation, an arithmetic assumption, and the explicit absence of asserted physical science or observation.
- Clean Water visibly separated all six classifications.
- Principle source status was `unavailable`; empirical evidence was `unavailable`; observation applicability/source/evidence were `not-declared`.
- Model fidelity `rule-check`, applicability statements, equation/quantity links, and limitations were visible.
- The explicit non-claim that declaring a principle does not prove model adequacy or physical validation was visible.
- Browser console warnings/errors: none.

## Failures and recovery

- No focused or full verification check failed.
- Stopping the development processes with an interrupt produced the expected nonzero teardown status; this was not an application failure.

## Architecture and truth review

- Classification and projection contracts are domain-neutral.
- Sandbox declarations remain in sim-core; Clean Water content remains vertical-owned.
- Science nodes link to the verified math projection and cannot invent unknown equation or quantity identities.
- Source and evidence status remain separate; a model declaration is not source evidence or observation.
- No physical observation is inferred from calculated values.
- Fidelity remains separate from evidence and deployment readiness.
- REP identities did not change.
- No GitHub Actions, external outreach, canonical merge, force push, release, or unrelated-branch change occurred.

## Explicit non-claims and limitations

- Declaring a principle does not prove that the model represents it adequately.
- Clean Water has no authoritative science source, empirical calibration, physical observation, treatment-efficacy evidence, or potable-water validation in this slice.
- Sandbox has no physical science claim.
- Model-only and assumption-only items are not observation-backed evidence.

## Next dependency

Issue #8, Show Engineering, can now combine the resolved system map and math graph with requirements, hard gates, objectives, design variables, margins, hazards, and revision tradeoffs while preserving failed gates and unresolved obligations.
