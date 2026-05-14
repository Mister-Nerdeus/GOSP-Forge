# Batch 71-80 Estimation Scoring Audit

Date: 2026-05-14

## Scope

This audit reviews issues #71-#79 as an integrated foundation slice: manifest-driven BOM and cost estimation, fabrication integration, lifecycle estimates, cost estimate envelopes, Clean Water scoring and scorecards, safety validation, and education guide refs.

## Gate Result

GO for the batch. The full standard gate set passed:

- `pnpm lint`
- `pnpm -r build`
- `pnpm -r typecheck`
- `pnpm -r test`
- `pnpm validate:examples`
- `pnpm simulate:clean-water`
- `pnpm estimate:clean-water`
- `pnpm audit`

Local validation was also written and verified during each issue closeout.

## Area Review

### Estimation And BOM

Decision: GO

- BOM lines derive from resolved project refs, not fixed CLI output.
- Product, fabricated part, material, machine-time, and labor line types are distinguishable.
- Missing quantities produce warnings and low confidence.
- Cost totals derive from the BOM plus the classroom price pack.
- Cost output is wrapped in an educational concept envelope with assumptions, sources, warnings, and limitations.

Known gap: Product quantities are still mostly defaulted to one each, so estimate confidence correctly remains low.

### Fabrication

Decision: GO

- Fabrication profiles feed BOM and cost lines.
- Material, machine time, and labor are separated.
- Fabrication warnings and confidence are visible through estimate output.

Known gap: Fabrication rates are classroom assumptions, not market pricing.

### Lifecycle

Decision: GO

- Product lifecycle intervals are read from product data where present.
- Missing intervals produce warnings and lower confidence.
- Horizon is explicit.

Known gap: Battery and sensor lifecycle intervals remain missing in the foundation examples.

### Scoring

Decision: GO

- Clean Water scoring profile is versioned and sponsor-neutral.
- Scorer ignores sponsored status.
- Module and system scorecards include component scores, confidence, and rationale.
- Defaulted inputs lower scorecard confidence.

Known gap: The scoring profile is a runtime Clean Water profile rather than a manifest-resolved scorecard ref. This is acceptable for this batch and should be revisited when scorecard artifacts become persisted refs.

### Safety

Decision: GO

- Module safety validation blocks unsafe potable-water, professional approval, or production-readiness claims.
- Physical, water, and electrical modules require safety profiles.
- Water modules require no-potable and no-professional boundary language.
- Education profiles now produce warnings rather than approval signals.

Known gap: Safety scanning is intentionally conservative pattern matching, not a formal policy engine.

### Education

Decision: GO

- Teacher and student guides are committed.
- The Clean Water manifest references both guides with `education` refs.
- Markdown guide refs validate through the CLI resolver.
- Guide validation checks free public-school use, student safety language, and payment-prompt boundaries.

Known gap: Guide content is foundation-level only and not a complete curriculum.

## Corrective Findings

- Fixed in issue #79: `simulate` reread all resolved refs as JSON, which failed once education refs pointed to Markdown guides. It now uses resolver document values.
- No unresolved P0/P1 findings remain for issues #71-#79.

## Batch Decision

GO. Proceed to issue #81 after committing issue #80 evidence.
