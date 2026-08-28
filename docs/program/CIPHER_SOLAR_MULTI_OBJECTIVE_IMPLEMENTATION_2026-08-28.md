# Cipher Solar / Multi-Objective Working Implementation

Date: 2026-08-28
Branch: `cipher/solar-multiobjective`
Status: **Implemented on an isolated working branch; local verification not yet executed**

## Purpose

This working increment implements two connected changes without altering the protected canonical branch:

1. generalize Phase-1A from a single implicit objective and completion-only gate to declared multi-objective comparisons plus evaluator-owned hard gates; and
2. add a synthetic educational retractable flexible-solar deployment vertical that exercises the generalized challenge model.

This record is a working implementation note. It is not a new source of truth and does not increase evidence readiness until the exact branch is locally installed, verified, reviewed, and dispositioned under repository policy.

## Implemented changes

### Multi-objective comparison

Evaluator definitions now declare ordered objectives with:

- stable objective ID;
- label;
- numeric result path;
- direction (`maximize` or `minimize`);
- optional unit.

Controlled comparison now reports per-objective outcomes and one of:

- `baseline-dominates`;
- `candidate-dominates`;
- `tradeoff`;
- `equivalent`;
- `both-fail-gates`.

Hard-gate failure takes precedence over objective improvement. A candidate cannot dominate merely by improving an objective while failing a declared hard gate.

### Evaluator-owned hard gates

Evaluator definitions now declare hard gates with:

- stable gate ID;
- statement;
- evaluation/result path;
- comparison operator;
- expected value;
- optional unit.

The Phase-1A service evaluates these gates against the recorded Evaluation rather than supporting only `evaluation.status == completed`.

Existing Sandbox and Clean Water evaluators retain their prior primary behavior through explicit objective and completion-gate declarations.

### Synthetic retractable solar deployment vertical

New package:

```text
packages/vertical-solar-deployment/
```

The vertical uses synthetic educational values only. It does not import or assert manufacturer performance data.

The analytical screening model currently evaluates:

- simplified instantaneous solar power;
- modeled post-cleaning power and recovered power;
- roll-core bend-radius margin;
- deployment and stow times;
- simplified storm-stow available time, required response time, and timing margin;
- explainability equations and intermediate values;
- explicit uncertainty and sensitivity records.

The first registered solar challenge declares six objectives:

1. maximize modeled instantaneous power;
2. maximize storm-stow timing margin;
3. maximize bend-radius margin;
4. minimize deployment time;
5. minimize stow time;
6. maximize modeled cleaning power recovery.

Its current hard gates require:

- canonical evaluation completion;
- nonnegative bend-radius margin;
- nonnegative storm-stow timing margin;
- positive simplified temperature factor.

The two seeded synthetic submissions intentionally create a tradeoff rather than a universal winner.

## Explicit non-claims

This increment does **not** establish:

- manufacturer panel performance;
- actual flexible-panel bend durability;
- structural wind-load safety;
- roll-cycle fatigue life;
- wiring/flex-circuit durability;
- actuator force or torque adequacy;
- hail or precipitation resistance;
- dynamic roll mechanics;
- cleaning effectiveness;
- weather prediction accuracy;
- electrical code compliance;
- professional engineering approval;
- product certification;
- physical validation;
- field deployment readiness.

The solar model is an educational reduced analytical screening model intended to turn those unknowns into explicit future proof obligations.

## Added/updated test intent

Tests were authored for:

- multi-objective tradeoff detection;
- candidate dominance;
- hard-gate precedence over objective improvement;
- objective equivalence;
- deterministic solar REP results;
- positive/negative bend and storm margins;
- invalid stow-trigger input rejection;
- solar evaluator use through the Phase-1A service;
- solar evaluator exposure through the loopback API.

These tests are **authored, not yet reported as executed**.

## Verification status

No GitHub Actions workflow was triggered. The workflow remains manual-only.

No local commands were executed by this chat environment. Therefore this branch must not yet be described as passing build, typecheck, tests, `pnpm verify`, browser smoke, or REP replay.

The root lockfile has not yet been regenerated for the new workspace package and API workspace dependency. Local verification should begin by refreshing the lockfile with the repository's pinned pnpm version, then inspecting the resulting diff before any canonical disposition.

Recommended local sequence:

```powershell
git switch cipher/solar-multiobjective
pnpm install
pnpm verify
pnpm evidence:local
pnpm --filter @gosp/vertical-solar-deployment test
```

Then inspect:

```powershell
git status --short
git diff -- pnpm-lock.yaml
```

A browser smoke should select `evaluator.solar-deployment.synthetic-screening`, confirm all reference/candidate hard gates, confirm `tradeoff` comparison status, inspect objective outcomes, equations, evidence limitations, archive/export behavior, and console errors/warnings.

## Canonical disposition gate

Do not merge this branch into `canonical/verified-lineage` until:

1. lockfile state is intentionally refreshed and reviewed;
2. the exact branch passes the documented local verification suite;
3. new solar and multi-objective tests pass;
4. no existing Sandbox or Clean Water behavior regresses;
5. a focused code review reports no HIGH/MEDIUM blockers;
6. the canonical authority/status documentation is updated only after the implementation identity is fixed and verified.
