# Issue 67 Pre-Audit

## Scope

Connect `ProductSpecMeaning` target fields to Clean Water simulation input through an explicit mapper.

## Current Behavior

- `applyProductSpecEffects` copied every declared `targetField` into the target object.
- Unknown target fields did not warn.
- Clean Water input compiler manually searched product specs for specific target fields.

## Risk Notes

Sponsor status must not affect simulation results. Unknown target fields should warn rather than silently changing model input.
