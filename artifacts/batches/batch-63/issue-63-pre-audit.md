# Issue 63 Pre-Audit

## Scope

Validate graph refs from project manifests using graph schemas and update Clean Water graph examples.

## Current Behavior

- CLI graph ref validation used a loose graph-like schema.
- Clean Water graph examples used old string-array node and tuple edge shapes.
- Project ref collection did not inspect typed `refGroups`.

## Risk Notes

Graph validation must fail wrong graph-shaped refs without implying executable control behavior, potable-water safety, or professional approval.
