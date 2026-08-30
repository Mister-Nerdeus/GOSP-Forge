# Advanced Challenge Execution Plan

- Owner authorization: “Continue” followed by confirmation of the narrowed repository-local milestone
- Issue: #17
- Branch: `cipher/stem-foundation`
- Starting SHA: `853b813deedd829be17f812fad3ac7ee8ae05819`
- Implementation starting SHA: `40bff6228a6992cef2f9feedb65950ccc19fe90c`
- Verified implementation SHA: `36d381f7f6d56e6d53aeceddd9b82d3488735614`
- Status: complete; awaiting owner review

## Outcome

Project model-bound tradeoffs across multiple process-local canonical candidates without creating a competition, team registry, universal ranking, or browser-owned calculation.

The first validation uses the existing synthetic retractable-solar adapter because it already declares three separate numeric objectives and two candidates with a real modeled tradeoff. The projection itself remains domain-neutral and must work for any registered evaluator whose engineering definition declares numeric objectives.

## Architecture boundary

```text
canonical Submission + Evaluation records
        + evaluator-owned numeric objective declarations
        + canonical hard-gate results
                         |
                         v
domain-neutral advanced-challenge projection builder
                         |
                         v
generic API workspace field -> browser renderer
```

- The builder owns eligibility and Pareto/non-dominance analysis.
- The browser renders the returned projection and performs no comparison math.
- Existing canonical records, REP evaluation, hashes, evidence, and readiness rules remain unchanged.
- The change may add a public application projection schema/type, but it must be additive and must not change an existing required field's meaning.
- Vertical names may appear only in vertical declarations, fixtures, and application registration—not in generic projection fields.

## N1 — Additive projection contract

Define a domain-neutral schema containing:

- exact Challenge, Scenario, and Model boundary identities;
- numeric objective declarations with direction and optional unit;
- explicitly excluded nonnumeric objectives;
- candidates with exact Submission/Evaluation identities;
- hard-gate eligibility and failed gate IDs;
- per-objective numeric outcomes and availability;
- dominance relations and non-dominated/Pareto membership;
- disclosures and explicit non-claims.

Tests must reject duplicate objective IDs, duplicate candidate identities, dominance references to unknown candidates, Pareto flags inconsistent with dominance, eligible candidates with missing objective values, and candidates marked eligible despite failed gates.

## N2 — Server-side projection

Build the projection from the selected registered Challenge's process-local Submissions and their canonical Evaluations.

Rules:

1. Only numeric-result objectives enter Pareto analysis.
2. Preserve-input or otherwise nonnumeric objectives are listed as excluded, not silently converted to numbers.
3. A candidate with any failed canonical hard gate is ineligible for Pareto membership.
4. Candidate A dominates B only when both are eligible, A is no worse on every available declared numeric objective, and A is strictly better on at least one.
5. Equivalent candidates do not dominate one another.
6. Missing objective values are explicit and make the candidate ineligible for Pareto analysis; the Evaluation remains visible.
7. Comparisons cannot cross exact Challenge, Scenario, Model, solver, runner, contract, or dataset boundaries.
8. No composite score, weighting, universal winner, rank, award, or readiness change is produced.

Focused tests must cover tradeoff, dominance, equivalence, failed-gate precedence, missing data, and cross-boundary rejection.

## N3 — Generic browser view

Add an Advanced Challenge section at Solve, Verify, and Research/Professional depths.

The view must show:

- controlled boundary;
- candidate count;
- declared objectives and directions;
- excluded objectives;
- eligibility before outcomes;
- each candidate's canonical identities and objective values;
- dominance relations;
- the non-dominated set;
- non-claims near the result.

Browser acceptance must confirm that solar's two seeded candidates are both non-dominated for different objective reasons, that hashes/readiness remain canonical and unchanged by presentation, and that browser logs contain no warnings or errors.

## Verification gates

- [x] N1 positive and negative schema tests pass.
- [x] N2 algorithm tests pass for tradeoff, dominance, equivalence, failed gate, missing value, and cross-boundary cases.
- [x] Sandbox, Clean Water, and solar application tests pass.
- [x] New tests are present in intended-test discovery.
- [x] Frozen-lockfile install passes.
- [x] Full build and typecheck pass.
- [x] `pnpm verify` exits zero with exact totals recorded.
- [x] REP replay hashes match and Clean Water commands remain successful.
- [x] Core boundary scan finds no vertical leakage.
- [x] Local browser acceptance passes and records observed results.
- [x] Local evidence is generated only from a clean exact implementation SHA.
- [x] Final audit and claim scan pass.

See `ADVANCED_CHALLENGE_SLICE_N_2026-08-29.md` for the exact checkpoint record.

## Non-claims

- Pareto membership is conditional on the recorded model, objectives, directions, inputs, and gates.
- Non-dominated does not mean physically superior, safe, validated, deployable, professional, certified, or universally preferred.
- Process-local candidates are not schools, teams, people, entrants, products, or external participants.
- No ranking, prize, award, sponsor, manufacturer, physical round, outreach, launch, release, or canonical merge is part of this plan.

## Next owner boundary

After Issue #17, stop before adding real participant identity, competition rules, awards, combined-design synthesis, external data, physical build requirements, publication, or canonical merge unless the owner explicitly scopes that next package.
