# Issue 66 Pre-Audit

## Scope

Build a manifest-driven Clean Water simulation input compiler and wire the simulate command to resolved manifest refs.

## Current Behavior

- `simulateCommand` ignored its manifest file argument.
- Water and power inputs were hardcoded in the CLI command.
- Missing specs could not warn or lower confidence because product refs were not read.
- Simulation envelope defaulted inputs were empty.

## Risk Notes

Compiled inputs remain educational level-1 screening inputs and do not certify potable water, professional engineering, or production use.
