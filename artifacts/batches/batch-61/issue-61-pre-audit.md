# Issue 61 Pre-Audit

## Scope

Add typed project manifest ref groups and update the Clean Water manifest/docs.

## Current Behavior

- `ProjectManifestV2` accepted `problemRef` and a generic `refs` array.
- Clean Water manifest used the generic refs array only.
- Documentation did not define typed groups for modules, products, graphs, estimates, scorecards, education, or safety.

## Risk Notes

The change must preserve current CLI gates while introducing the typed structure for later validation and simulation issues.
