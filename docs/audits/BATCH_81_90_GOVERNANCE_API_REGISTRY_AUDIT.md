# Batch 81-90 Governance API Registry Audit

Date: 2026-05-14

## Decision

GO for foundation governance/API continuation.

NO-GO for public leaderboard launch, production API hosting, production storage, manufacturer verification claims, legal import advice, professional approval, potable-water certification, or paid ranking claims.

## Review Scope

This audit reviewed issues #81-#89:

- API `/validate` uses real project validation and returns `422` for invalid manifests.
- API body, content-type, invalid JSON, server, and rate-limit controls have tests.
- Storage adapter boundaries reject local memory/json-file storage in production mode.
- Signed submission verification requires server re-simulation before trust or leaderboard decisions.
- Registry trust/moderation states preserve restriction reasons and removed-entry audit records.
- License compatibility blocks unlicensed public imports and preserves attribution/share-alike/ODbL obligations.
- External source/import examples distinguish public import from reference-only citation.
- Manufacturer spec drafts keep missing fields, contradictions, human review, and `manufacturerVerified: false`.
- Scoring profiles reject sponsor influence in component ids, labels, formulas, and sources.

## Findings

No blocking defects were found in this review pass.

### API Foundation-Only

The API remains a local foundation surface. `/validate` uses shared validation logic where practical, and API docs explicitly deny production hosting, production identity, production secret storage, and public leaderboard operation.

### Registry And Imports

Registry trust is visible but does not certify safety. Restricted and removed entries require reasons/audit records. External import records require explicit license metadata and do not imply bulk-import permission.

### Manufacturer And Sponsorship

Manufacturer spec imports remain draft-plane records requiring human review. Sponsor status is disclosed outside scoring, but scoring contracts reject sponsor terms in scoring components.

## Known Gaps

- No production persistence backend is implemented.
- No public leaderboard is implemented.
- No legal review workflow is implemented for external imports.
- No manufacturer verification workflow is implemented beyond draft/submission metadata.
- API controls are foundation tests, not a production security certification.

## Gate Plan

Issue #90 closeout requires the full standard gate set:

- `pnpm lint`
- `pnpm -r build`
- `pnpm -r typecheck`
- `pnpm -r test`
- `pnpm validate:examples`
- `pnpm simulate:clean-water`
- `pnpm estimate:clean-water`
- `pnpm audit`
- `node scripts/controls/write-local-validation.mjs`
- `node scripts/controls/verify-local-validation-current.mjs`
