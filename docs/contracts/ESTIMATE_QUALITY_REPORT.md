# Estimate Quality Report

Estimate output includes a quality report with `zeroCostLineCount`, `defaultCostLineCount`, `defaultedQuantityCount`, `zeroCostLineIds`, `defaultCostLineIds`, `defaultedQuantityIds`, and `confidenceImpact`.

The report makes placeholder cost and quantity behavior visible. Education mode may warn. Scoring mode blocks placeholder costs or quantities. Professional estimate mode remains blocked in the foundation build.

## Clean Water Fixture Note

The Clean Water estimate may report `filter-housing` in `zeroCostLineIds`. That parent fabrication line is intentionally zero in the classroom price pack because PLA material, machine time, and labor are priced as separate educational assumption lines. This is not a market price, quote, procurement instruction, or professional estimate.

The Clean Water `filter-housing` module declares `quantity: 1` so the remaining zero-cost parent line is no longer also a defaulted-quantity item.
