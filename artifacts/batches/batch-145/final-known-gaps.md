# Batch #145 Final Known Gaps

Date: 2026-05-15

These gaps are intentionally preserved as non-claims. They do not block the foundation handoff because no README, API, CLI, UI, audit, or release evidence text claims them as implemented.

## Preserved NO-GO Boundaries

| Gap | Current state | Required before claim |
| --- | --- | --- |
| Production deployment readiness | Not implemented. Repository provides foundation packages, examples, local validation, CI, and docs only. | Scoped deployment architecture, hosting config, security review, operational runbooks, CI/CD evidence, and production audit. |
| Production storage/auth/secrets | Not implemented. API remains a foundation/local service surface with no production storage or auth claim. | Production-grade storage, identity, authorization, secret rotation, audit logging, threat model, and tests. |
| Public production API behavior | Not claimed. API schema-only validation is default; repo-ref mode is local/dev or explicit internal operator override only. | Public API contract, auth, rate limits, abuse controls, hosting, storage, support posture, and production audit. |
| Professional engineering approval | Not implemented or claimed. Simulation, estimates, scorecards, and audits remain educational/foundation artifacts. | Licensed professional workflow, domain review, legal signoff, and explicit product requirements. |
| Potable-water certification or validation | Not implemented or claimed. Clean Water examples are classroom screening artifacts only. | Laboratory validation, safety protocol, regulatory review, chain-of-custody evidence, and professional signoff. |
| Production manufacturing approval | Not implemented or claimed. Fabrication/estimate outputs are educational/conceptual only. | Manufacturing QA workflow, supplier/manufacturer verification, tolerances, safety review, and production approval process. |
| Manufacturer verification | Not implemented or claimed. Manufacturer docs remain draft/submission boundaries only. | Verification workflow, signed attestations, revocation, audit trail, and governance. |
| Public marketplace or leaderboard | Not implemented or claimed. Governance docs preserve neutrality and no pay-to-win boundaries. | Marketplace/leaderboard architecture, anti-abuse, privacy, moderation, scoring governance, and public launch audit. |
| Procurement quote or purchasing instruction | Not implemented or claimed. Estimate output is educational/conceptual; `filter-housing` parent line remains zero-cost to avoid double-counting child cost lines. | Sourcing model, vendor terms, quote lifecycle, procurement review, and legal/commercial signoff. |
| Full CAD/editor UI and persistence workflow | Not implemented or claimed. Web app is a read-only inspection shell with smoke coverage. | Product UI scope, persistence model, editor interactions, CAD integration, browser automation, and user workflow tests. |
| Branch protection configured-claim | Not proven by repository contents. Docs recommend branch protection but do not claim GitHub settings are configured. | Manual or API verification of branch protection settings and required checks. |

## Remaining Foundation-Level Warnings

- `estimate:clean-water` intentionally reports one zero-cost parent line: `filter-housing`.
- Validation of example education profiles still emits structured education-mode warnings; these preserve the boundary that education profile text is not safety approval.
- Local validation currentness is held in ignored artifacts and must be regenerated after the final commit before push.

## Next-Phase Guardrail

Any attempt to turn a preserved gap into an implemented claim requires a new scoped issue, implementation evidence, tests, gates, code review, updated claim map, and final audit entry.
