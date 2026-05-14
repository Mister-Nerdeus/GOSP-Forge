# Issue 68 Pre-Audit

## Scope

Add Clean Water baseline comparison and expand baseline anchors.

## Current Behavior

- Five baseline fixture files existed.
- `clean-water.problem.json` embedded only one baseline and metric baseline ref.
- Simulation core did not expose a baseline comparison helper.

## Risk Notes

Baselines must be anchors for classroom comparison, not superiority or potable-water safety claims.
