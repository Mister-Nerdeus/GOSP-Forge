# Issue 52 Pre-Audit

## Scope

Add explicit fixtures and tests for project ref resolution.

## Current Behavior

- Issue #51 added project-ref validation.
- Existing CLI tests only exercised the happy path through the Clean Water manifest.
- No dedicated negative fixtures existed for missing required refs or wrong-kind refs.
- No dedicated fixture asserted that missing optional refs warn without failing.

## Risk Notes

Fixtures must use unique IDs so duplicate-ID validation does not hide the intended test result.
