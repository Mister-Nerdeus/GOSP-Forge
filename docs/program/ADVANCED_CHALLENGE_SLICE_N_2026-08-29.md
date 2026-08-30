# Advanced Challenge Slice N Checkpoint

- Issue: #17
- Branch: `cipher/stem-foundation`
- Owner-authorized milestone start: `853b813deedd829be17f812fad3ac7ee8ae05819`
- Implementation starting SHA after the committed plan: `40bff6228a6992cef2f9feedb65950ccc19fe90c`
- Initial closeout implementation SHA: `7b0b3e9455b5ad7f99617e9c0de4a4685293c293`
- Post-close acceptance-remediation SHA: `36d381f7f6d56e6d53aeceddd9b82d3488735614`
- Result: PASS; ready for owner review

## Delivered

- Added a domain-neutral application projection contract for one exact Challenge/Scenario/Model boundary.
- Reused evaluator-owned numeric engineering objectives; no objective is inferred by the core.
- Applied hard-gate eligibility before Pareto comparison.
- Calculated non-dominance only across eligible process-local canonical candidates.
- Preserved equivalent candidates as mutually non-dominating.
- Made missing numeric outcomes and evaluator-rejected stored candidates explicit.
- Added a generic Solve/Verify/Research browser view that renders server-owned outcomes and performs no comparison math.
- Displays candidate, excluded-candidate, and non-dominated counts explicitly.
- Rejects solver, runner, contract, or dataset identity drift before objective comparison.
- Preserved the existing pairwise comparison, canonical objects, REP identity and hashing, evidence readiness, deployment readiness, and professional disposition rules.

## Files changed

- `packages/contracts/src/application/advancedChallenge.ts`
- `packages/contracts/src/application/advancedChallenge.test.ts`
- `packages/contracts/src/application/phase1a.ts`
- `packages/contracts/src/index.ts`
- `packages/api/src/phase1a/advancedChallengeProjection.ts`
- `packages/api/src/phase1a/advancedChallengeProjection.test.ts`
- `packages/api/src/phase1a/service.ts`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.ts`
- `config/intended-tests.json`
- `README.md`
- `docs/testing/BROWSER_SMOKE_TEST_STRATEGY.md`
- `docs/program/ADVANCED_CHALLENGE_EXECUTION_PLAN_2026-08-29.md`
- this checkpoint record

## Exact commands executed

```powershell
pnpm exec vitest run packages/contracts/src/application/advancedChallenge.test.ts
pnpm --filter @gosp/contracts build
pnpm --filter @gosp/contracts typecheck
pnpm verify

pnpm exec vitest run packages/api/src/phase1a/advancedChallengeProjection.test.ts packages/api/src/phase1a/service.test.ts
pnpm --filter @gosp/api build
pnpm --filter @gosp/api typecheck
pnpm verify

pnpm --filter @gosp/web test
pnpm --filter @gosp/web build
pnpm --filter @gosp/web typecheck
pnpm verify

pnpm exec vitest run packages/contracts/src/application/advancedChallenge.test.ts packages/api/src/phase1a/advancedChallengeProjection.test.ts apps/web/src/App.test.ts
pnpm --filter @gosp/contracts build
pnpm --filter @gosp/api build
pnpm --filter @gosp/web typecheck

pnpm dev:phase1a
pnpm install --offline --frozen-lockfile
pnpm verify
pnpm evidence:phase1a

# Post-close acceptance remediation
pnpm --filter @gosp/contracts build
pnpm --filter @gosp/api build
pnpm exec vitest run packages/contracts/src/application/advancedChallenge.test.ts packages/api/src/phase1a/advancedChallengeProjection.test.ts apps/web/src/App.test.ts
pnpm --filter @gosp/contracts typecheck
pnpm --filter @gosp/api typecheck
pnpm --filter @gosp/web typecheck
pnpm install --offline --frozen-lockfile
pnpm verify
pnpm dev:phase1a
pnpm evidence:phase1a
```

## Verification results

- Frozen lockfile install: PASS; lockfile already current.
- Runtime policy, lint, all workspace builds, and all workspace typechecks: PASS.
- Intended/discovered test files: 45/45.
- Tests after acceptance remediation: 214 passed, 0 failed.
- REP replay: input and result hashes matched.
- Clean Water example validation, simulation, and estimate: PASS.
- Foundation audit: GO, 23 pass, 0 warn, 0 fail.
- Claim scan: 237 files, zero findings.
- Evidence writer: PASS from the clean exact implementation SHA.
- Current evidence artifact: `artifacts/phase-1a/local/execution-2026-08-30T03-21-52-264Z.json`.
- The earlier `execution-2026-08-30T02-39-19-611Z.json` remains valid only for the superseded initial implementation SHA.

## Browser observations

The fresh isolated workspace used `GOSP_WORKSPACE_DIR=%TEMP%\gosp-advanced-smoke-20260829-2234`. The API listened on `127.0.0.1:3080`; Vite served `http://localhost:5174/` because 5173 was occupied.

At Solve depth for `challenge.solar-deployment.synthetic@0.1.0`:

- the exact Challenge, Scenario, and Model boundary rendered;
- the three declared numeric objectives rendered separately;
- hard-gate eligibility appeared before outcomes;
- both seeded candidates rendered as non-dominated;
- the no-composite-score/no-ranking and no-universal-winner disclosures rendered;
- no browser console warning or error was observed.

The durable default workspace also contained an earlier locally authored solar candidate. The projection correctly included it and recomputed the process-local non-dominated set. That observation is not used as the two-seed acceptance result; the isolated run above is.

The post-close remediation smoke used `%TEMP%\gosp-advanced-remediation-smoke-20260829-2318`. It additionally confirmed candidate count 2, excluded stored candidates 0, non-dominated count 2, both seeded candidates non-dominated, the exact boundary, and zero console warnings or errors.

## Failures encountered and resolved

1. The first solar test searched serialized disclosure text for words that the non-claim itself intentionally contains, and TypeScript narrowed the mutable Pareto status too tightly. The assertion was changed to check absent result properties, and the candidate list received its contract type.
2. A live smoke exposed that evaluating every stored Submission could make the workspace unavailable when a canonically stored payload fails evaluator validation. The server now preserves the record, excludes it from Pareto comparison, and returns an explicit `evaluation-unavailable` disclosure. A regression test covers this behavior.
3. During live reload, the browser briefly consumed the new UI bundle against the still-running old API process and showed an undefined-field error. Restarting both documented development services loaded one contract version; the fresh rerun had no page or console error.
4. The browser wait helper did not support `networkidle`; the smoke used `domcontentloaded` plus a bounded render wait.
5. A post-close audit found that the browser omitted the required candidate count, negative schema tests did not cover every listed invariant, and cross-boundary rejection did not yet check solver, runner, contract, and dataset identities. Issue #17 was reopened; the missing view fields, invariants, and four identity-drift cases were added and fully reverified before the issue was closed again.

## Remaining limitations and explicit non-claims

- Pareto status applies only to the recorded objectives, directions, gates, canonical boundary, model, and current process-local candidates.
- The system produces no composite score, universal winner, ranking, award, or readiness change.
- A non-dominated modeled candidate is not proven physically superior, safe, validated, deployable, certified, or professionally approved.
- Solar remains a synthetic validation vertical, not the foundation and not a physical design claim.
- No school, team, entrant, sponsor, manufacturer, outreach, physical build, competition launch, release, or canonical merge occurred.

## Next dependency and owner gate

Issue #17 is complete. No subsequent competition, participant, synthesis, external-data, physical-build, publication, release, or canonical-merge milestone is authorized by this checkpoint. Pause for explicit owner direction before selecting the next package.
