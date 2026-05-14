# Issue 64 Pre-Audit

## Scope

Expand the Clean Water project manifest to reference the full Automated Water Filter System module list.

## Current Behavior

- The manifest referenced only `raw-water-tank`, `pump`, and graph refs.
- Most named module fixtures already existed.
- `examples/modules/power/classroom-battery.module.json` was missing.

## Risk Notes

Physical modules must include safety profiles, and public examples must retain attribution/license metadata and no potable-water/professional-use claims.
