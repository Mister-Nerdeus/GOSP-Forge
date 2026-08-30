# STEM Foundation Verification Checklist

Use this checklist for every implementation slice under Issue #4. A checked item must name executed evidence in the issue or handoff; do not infer a pass from implementation.

Completed checkpoint records:

- Slice A1: `docs/program/STEM_FOUNDATION_SLICE_A_2026-08-28.md`
- Slice A2 / Issue #5: `docs/program/STEM_FOUNDATION_SLICE_A2_2026-08-29.md`
- Slice B / Issue #6: `docs/program/STEM_FOUNDATION_SLICE_B_2026-08-29.md`
- Slice C / Issue #7: `docs/program/STEM_FOUNDATION_SLICE_C_2026-08-29.md`
- Slice D / Issue #8: `docs/program/STEM_FOUNDATION_SLICE_D_2026-08-29.md`
- Slice E / Issue #9: `docs/program/STEM_FOUNDATION_SLICE_E_2026-08-29.md`
- Slices F/G / Issue #10: `docs/program/STEM_FOUNDATION_SLICES_F_G_2026-08-29.md`
- Slice H / Issue #11: `docs/program/STEM_FOUNDATION_SLICE_H_2026-08-29.md`
- Slice I / Issue #12: `docs/program/STEM_FOUNDATION_SLICE_I_2026-08-29.md`
- Slice J / Issue #13: `docs/program/STEM_FOUNDATION_SLICE_J_2026-08-29.md`
- Slice K / Issue #14: `docs/program/STEM_FOUNDATION_SLICE_K_2026-08-29.md`
- Slice L / Issue #15: `docs/program/STEM_FOUNDATION_SLICE_L_2026-08-29.md`

## Scope and authority

- [ ] Work is on `cipher/stem-foundation` or an explicitly authorized descendant.
- [ ] Exact starting SHA and resulting working-tree state are recorded.
- [ ] Dependency work packages and acceptance criteria are identified.
- [ ] No canonical merge, default-branch change, or authority transition occurred.
- [ ] No GitHub Actions or other remote execution was triggered.
- [ ] No external outreach, sponsorship, school, manufacturer, or partner action occurred.

## Architecture

- [ ] Core contracts and utilities contain no vertical-specific concepts.
- [ ] Dependency direction remains `vertical/application -> core`.
- [ ] The view projects canonical records; it does not become a second source of truth.
- [ ] Browser code performs no independent physics, scoring, evidence, or readiness calculation.
- [ ] Model fidelity, evidence readiness, deployment readiness, and professional disposition remain distinct.
- [ ] Missing data is `unknown`, `not-declared`, `not-checked`, or `not-applicable`; it is not silently invented.

## Contract and behavior tests

- [ ] Schema accepts the intended canonical projection.
- [ ] Schema rejects malformed, incomplete, or contradictory required data.
- [ ] Sandbox coverage passes where applicable.
- [ ] Clean Water coverage passes where applicable.
- [ ] A missing-data/failure-state case is covered.
- [ ] New test files are registered in `config/intended-tests.json`.
- [ ] Material hash/replay changes are either absent or intentionally explained and reconciled.

## Local execution

Record versions:

```text
Node:
pnpm:
Starting SHA:
Command date/timezone:
```

- [ ] `pnpm install --frozen-lockfile` completed when dependencies were not already present.
- [ ] focused tests executed after workspace packages were built or through the repository gate.
- [ ] `pnpm verify` exited zero.
- [ ] intended and discovered test counts match.
- [ ] total passing test count is recorded.
- [ ] REP replay input and result hashes match.
- [ ] Clean Water validation/simulation/estimate complete.
- [ ] foundation audit result is recorded.
- [ ] UI changes received a local browser smoke with route and observations recorded.
- [ ] any failed attempt is disclosed separately from the final gate.

## Truth and learner acceptance

- [ ] The learner can tell what is canonical, calculated, assumed, simulated, observed, and unknown.
- [ ] Claims link to supporting/contradicting evidence and open proof obligations.
- [ ] Failed evaluations and negative evidence remain visible.
- [ ] Non-claims appear near potentially misleading outputs.
- [ ] No computational result is described as physical validation.
- [ ] No local replay is described as independent reproduction.
- [ ] No component listing is described as endorsement or verified compatibility.
- [ ] No human-relevance projection is described as policy advice or proven social benefit.

## Handoff

- [ ] Files changed are listed.
- [ ] Exact commands and outcomes are listed.
- [ ] Unverified items are listed.
- [ ] Known limitations and follow-up proof obligations are listed.
- [ ] Issue checklist is updated with observed evidence.
- [ ] Commit/push/PR/merge status is stated explicitly.
