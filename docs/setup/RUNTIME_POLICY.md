# Runtime Policy

Node 24 is the single preferred runtime for GOSP Forge. CI uses Node 24, `.nvmrc` declares Node 24, and `.tool-versions` declares Node 24.11.0.

## Temporary Local Support

Node 22 is temporarily supported for local validation because current developer workstations may still report Node v22.x. This support is declared in `package.json` under `gosp.runtimePolicy.temporarySupportedNodeMajors`.

Any runtime outside the preferred Node major or the explicitly listed temporary majors fails `node scripts/controls/verify-runtime-version.mjs`.

## Policy Sources

- `package.json`: machine-readable preferred and temporary runtime policy plus package engine ranges.
- `.nvmrc`: preferred Node major for Node version managers.
- `.tool-versions`: preferred Node and pnpm versions for asdf-style tooling.
- `.github/workflows/ci.yml`: CI runtime, currently Node 24.

## Current Implementation Limits

This document describes foundation policy and contract intent. The current repository provides foundation packages, example fixtures, validation gates, and runtime verification only. It does not claim production readiness, professional approval, potable-water certification, or production manufacturing approval.
