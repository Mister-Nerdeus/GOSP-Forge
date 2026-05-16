# Remaining Estimate Placeholders

Date: 2026-05-15

Source command: `pnpm estimate:clean-water` after `pnpm -r build`.

## Quality Report

```json
{
  "zeroCostLineCount": 1,
  "defaultCostLineCount": 0,
  "defaultedQuantityCount": 1,
  "zeroCostLineIds": ["filter-housing"],
  "defaultCostLineIds": [],
  "defaultedQuantityIds": ["filter-housing"],
  "confidenceImpact": "lowers-confidence"
}
```

## Remaining Line

- `filter-housing`
  - Zero-cost line: yes.
  - Defaulted quantity: yes.
  - Defaulted unit cost from missing price entry: no.
  - Current rationale: fabricated housing container line is present as a parent fabrication line while material, machine-time, and labor lines carry explicit educational classroom assumptions.

## Boundary

This is visible in education mode and continues to lower estimate confidence. It is not a quote, procurement instruction, professional estimate, or permit-ready output.
