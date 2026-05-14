# Issue 55 Pre-Audit

## Scope

Make runtime verification read repo-declared policy rather than hardcoding supported Node majors.

## Current Behavior

- `scripts/controls/verify-runtime-version.mjs` hardcoded supported Node majors `[22, 24]`.
- `.nvmrc` declared Node 24.
- `.tool-versions` declared Node 24.11.0 and pnpm 9.15.5.
- `package.json` declared `engines.node` but not a structured preferred/temporary runtime policy.
- CI already used Node 24.

## Risk Notes

Node 24 remains the only preferred runtime. Node 22 is temporary local support and must remain explicitly documented.
