# STEM Foundation Slices F/G — Model Fidelity and How Do We Know?

Date: 2026-08-29 (America/New_York)
Issue: #10
Starting SHA: `63947941a1ab5311c536dcd1bc26f52cbdd823d5`
Implementation SHA: `566687e21dfcfb5ef89ae8da73c3068aea024a8b`
Branch: `cipher/stem-foundation`

## Result

Slices F/G add a domain-neutral, integrity-checked result-to-proof trace. A consequential recorded output now traces through its equation, exact material inputs, model, assumptions and source status, solver and runner identities, execution environment, claim, supporting and contradicting evidence, readiness dispositions, and proof obligations.

Model representation and evidence strength are displayed as separate ladder dimensions. Material input/result hashes and contract/dataset identities are displayed separately from runner, solver, environment, and replay identity. Unavailable, not-declared, and broken trace states remain explicit.

## Files changed

- `apps/web/src/App.test.ts`
- `apps/web/src/App.tsx`
- `config/intended-tests.json`
- `packages/api/src/phase1a/stemSystemProjection.test.ts`
- `packages/api/src/phase1a/stemSystemProjection.ts`
- `packages/contracts/src/education/stemHowWeKnowTrace.test.ts`
- `packages/contracts/src/education/stemHowWeKnowTrace.ts`
- `packages/contracts/src/education/stemSystemProjection.ts`
- `packages/contracts/src/index.ts`

## Executed verification

Runtime: Node v22.16.0; pnpm 9.15.5; 2026-08-29 America/New_York.

Commands executed:

```text
pnpm --filter @gosp/contracts build
pnpm --filter @gosp/api build
pnpm --filter @gosp/web typecheck
pnpm --filter @gosp/contracts test -- stemHowWeKnowTrace.test.ts
pnpm --filter @gosp/api test -- stemSystemProjection.test.ts
pnpm --filter @gosp/web test
pnpm verify
pnpm install --frozen-lockfile
pnpm dev:phase1a
rg -n -i "clean[- ]water|solar|pump|filter" packages/contracts/src/education/stemHowWeKnowTrace.ts
git diff --check
```

Observed results:

- affected builds and typecheck: pass;
- focused trace contracts: 3/3;
- focused API projection and broken-link coverage: 8/8;
- focused web: 1/1;
- intended discovery: 38/38 files;
- full repository: 38 files, 178 tests passed;
- REP replay input and result hashes matched;
- Clean Water validation, simulation, and estimate completed;
- foundation audit: GO, 23 pass, 0 warn, 0 fail;
- frozen install passed with an unchanged lockfile;
- core-boundary scan found no Clean Water, solar, pump, or filter terms in the trace contract;
- `git diff --check` reported no whitespace errors.

## Browser acceptance

API: `http://127.0.0.1:3080`. Browser: `http://localhost:5174/` because port 5173 was occupied.

Observed for Clean Water:

- `result.flow.cleanWaterLiters = 64` was visibly identified as the consequential result.
- The `rule-check` fidelity and `not-calibrated` status appeared separately from computational evidence readiness, concept-only deployment readiness, and not-assessed professional disposition.
- Exact material input/result hashes, REP contract identity, runner, solver, environment, and replay state were visible in separate identity sections.
- The result traced through `clean-water.flow-screen`, four exact material inputs, the model, the material educational assumption, solver, runner, execution, two accepted evidence records, readiness states, and all proof obligations.
- The authoritative source was visibly `not-declared`; no contradiction was recorded; independent reproduction and physical validation remained open and unavailable.
- Higher-fidelity and local-replay non-claims were visible.
- Browser console warnings/errors: none; only normal Vite connection debug messages appeared.

## Broken-link acceptance

- Contract tests reject missing edge endpoints and a resolved edge that terminates at a broken node.
- API coverage injected a proof-obligation reference to an absent Evidence record.
- The projection preserved that reference as an explicit broken Evidence node and a broken `satisfied-by` edge.

## Failures and recovery

- No focused or full verification check failed.
- Stopping the development processes with an interrupt produced the expected nonzero teardown status; this was not an application failure.

## Architecture and truth review

- The trace schema contains no vertical fields.
- The trace is derived server-side from canonical REP material input, Evaluation, Model, execution evidence, Claim, Evidence, contradictions, and proof obligations plus the verified STEM math projection.
- The browser performs no trace resolution, hash calculation, readiness inference, or evidence judgment.
- Trace edges must terminate at explicit nodes. Broken references are represented, not discarded.
- Model fidelity, calibration, evidence readiness, deployment readiness, and professional disposition remain separate.
- Material identity and execution identity remain separate.
- REP identities and material hashes did not change.
- No dependency, service, GitHub Action, external outreach, canonical merge, force push, release, or unrelated-branch change occurred.

## Explicit non-claims and limitations

- Higher model fidelity is not stronger evidence, physical validation, deployment readiness, or professional approval.
- Local replay is not independent external reproduction.
- A complete computational trace does not establish a complete physical evidence chain.
- Clean Water has no authoritative source record, calibration evidence, physical observation, independent reproduction, treatment-efficacy evidence, or potable-water validation.
- Absence of recorded contradiction is not proof that no contradiction exists.

## Next dependency

Issue #11, Learning-depth Projection, can now vary explanatory inclusion over this same exact trace and evaluation while proving that material input and result identities remain unchanged.
