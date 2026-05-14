# Issue 80 Pre-Audit

Date: 2026-05-14

## Scope

Issue #80 is the corrective review pass for issues #71-#79.

## Review Set

Changed files reviewed from `0f823fe` through `39c6dc6` cover:

- Manifest-driven BOM and estimate compilation.
- Classroom price pack and cost estimate envelope.
- Fabrication estimate integration.
- Product lifecycle replacement estimates.
- Clean Water scoring profile and scorecard generation.
- Safety validation and education guide validation.
- Clean Water project manifest, product fixtures, and guide refs.

## Planned Work

- Run the full standard gate set.
- Inspect estimation, fabrication, scoring, safety, and education changes as one integration slice.
- Fix blockers if found.
- Write `docs/audits/BATCH_71_80_ESTIMATION_SCORING_AUDIT.md`.
- Write issue closeout evidence.

## Initial Risk Notes

- Validation now emits education-mode warnings by design.
- Markdown education refs require commands to use resolver document values instead of rereading all refs as JSON.
- Estimate confidence should remain low where quantities, costs, or lifecycle intervals are defaulted.
