# STEM Foundation Slice K — Evidence-Linked Human Relevance

Date: 2026-08-29 (America/New_York)
Issue: #14
Starting SHA: `ea7b01336a83f032faa27fcb32b37831831d0abe`
Implementation SHA: `be04b99091ccf9cd1bd38e2347c1887c8cc34007`
Branch: `cipher/stem-foundation`

## Result

Slice K adds a domain-neutral human-relevance projection with eleven fixed categories: cost, safety, energy, water, reliability, accessibility, maintenance, labor/skills, materials/waste, environment, and infrastructure/community. A supported outcome must contain a canonical quantity and at least one canonical evidence reference. Unknown categories cannot contain outcomes and must explain why support is unavailable.

Clean Water supports only the water category. It presents a modeled benefit, comparison tradeoff, and recorded uncertainty around the canonical 64 L output, linked to the accepted calculation and local-replay Evidence records. The other ten categories remain unknown. Learner and reviewer priorities are labeled `authored-preference` in a separate stakeholder-values section.

## Files changed

- `apps/web/src/App.test.ts`
- `apps/web/src/App.tsx`
- `config/intended-tests.json`
- `packages/api/src/phase1a/evaluatorRegistry.ts`
- `packages/api/src/phase1a/service.ts`
- `packages/api/src/phase1a/stemSystemProjection.test.ts`
- `packages/api/src/phase1a/stemSystemProjection.ts`
- `packages/contracts/src/education/stemHumanRelevanceProjection.test.ts`
- `packages/contracts/src/education/stemHumanRelevanceProjection.ts`
- `packages/contracts/src/education/stemLearningProjection.ts`
- `packages/contracts/src/education/stemSystemProjection.ts`
- `packages/contracts/src/index.ts`
- `packages/sim-core/src/education/stemHumanRelevanceDefinition.ts`
- `packages/sim-core/src/index.ts`
- `packages/vertical-clean-water/src/education/stemHumanRelevanceDefinition.ts`
- `packages/vertical-clean-water/src/index.ts`

## Executed verification

Runtime: Node v22.16.0; pnpm 9.15.5; 2026-08-29 America/New_York.

Commands executed:

```text
pnpm --filter @gosp/contracts build
pnpm --filter @gosp/sim-core build
pnpm --filter @gosp/vertical-clean-water build
pnpm --filter @gosp/api build
pnpm --filter @gosp/web build
pnpm exec vitest run packages/contracts/src/education/stemHumanRelevanceProjection.test.ts packages/api/src/phase1a/stemSystemProjection.test.ts apps/web/src/App.test.ts
pnpm verify
pnpm install --frozen-lockfile
pnpm dev:phase1a
rg -n -i "clean[- ]water|pump|filter|solar|photovoltaic|building" packages/contracts/src/education/stemHumanRelevanceProjection.ts packages/sim-core/src/education/stemHumanRelevanceDefinition.ts packages/api/src/phase1a/stemSystemProjection.ts
git diff --check
```

Observed results:

- affected builds: pass after the correction below;
- focused contract, API evidence-link/unsupported-category, and web coverage: 3 files, 17 tests passed;
- intended discovery: 42/42 files;
- full repository: 42 files, 195 tests passed;
- REP replay input and result hashes matched;
- Clean Water validation, simulation, and estimate completed;
- foundation audit: GO, 23 pass, 0 warn, 0 fail;
- professional-claim scan: zero findings across 232 files;
- frozen install passed and the lockfile remained unchanged;
- core-boundary scan found no Clean Water, pump, filter, solar, photovoltaic, or building terms in the relevance contract or Sandbox definition;
- `git diff --check` reported no whitespace errors.

## Browser acceptance

API: `http://127.0.0.1:3080`. Browser: `http://localhost:5174/` because port 5173 was occupied.

Observed in the Clean Water Explore view:

- water: supported;
- benefit: canonical modeled output 64 L available for comparison;
- tradeoff: candidate delta +8 with changed-input and non-universal-preference disclosure;
- uncertainty: filter efficiency is a model input not physically validated;
- each supported outcome linked the 64 L quantity to accepted calculation and local-replay Evidence identities;
- cost, safety, energy, reliability, accessibility, maintenance, labor/skills, materials/waste, environment, and infrastructure/community: unknown with explicit reasons;
- learner and reviewer values: `authored-preference` and visibly separate from technical results;
- policy, lifecycle, environmental-certification, economic-forecast, and social-benefit non-claims: visible;
- browser console warnings/errors: none.

## Failures and recovery

- The first web build failed on one missing closing parenthesis in the category rendering expression; the syntax was corrected and the web build and all focused tests were rerun successfully.
- The first browser read occurred before the asynchronous Challenge selection finished and therefore captured the Sandbox unknown-category view. The smoke then waited for the visible Clean Water hero statement and captured the correct Clean Water relevance panel.
- Stopping the development processes with an interrupt produced the expected nonzero teardown status; this was not an application failure.

## Architecture, limitations, and non-claims

- The vocabulary and schema are domain-neutral; verticals own category declarations.
- The API resolves supported quantities and accepted Evidence records. The browser performs no impact, evidence, readiness, or advocacy calculation.
- Supported means evidence-linked to the recorded computation, not physically validated or socially beneficial.
- Stakeholder values are authored preferences, not conclusions produced by engineering data.
- This projection is not policy advice, lifecycle assessment, environmental certification, economic forecast, or proof of social benefit.
- No dependency, service, GitHub Action, external outreach, canonical merge, force push, release, or unrelated-branch change occurred.

## Next dependency

Issue #15 can now integrate the completed STEM slices into one documented Clean Water path, execute the full manual acceptance script, and perform the final local architecture/truth review. Issue #16 remains owner-controlled and out of scope.
