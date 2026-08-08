# Local Phase-0B Verification

## Policy

Run verification locally. Do not trigger GitHub Actions or use remote CI as evidence under the current policy.

## Commands

```powershell
pnpm verify
pnpm evidence:local
```

`pnpm verify` must run runtime-policy validation, lint, builds, typechecks, intended tests, contract/example validation, the synthetic REP benchmark, and the preserved Clean Water checks documented by the root script.

`pnpm evidence:local` runs the same gate and writes a new record under `artifacts/phase-0b/local/`. It must not overwrite `artifacts/controls/local-validation/latest.json` or `latest.sanitized.json`.

The evidence fields `statusBeforeVerification` and `statusAfterVerification` bracket command execution. The latter is intentionally captured before the evidence file writes itself; `statusSnapshotSemantics` records that boundary explicitly.

## Evidence interpretation

- A recorded exit status of zero supports only the commands actually listed in that record.
- A material hash supports deterministic content identity, not physical validation or professional approval.
- Environment evidence may differ across Windows and Linux.
- Cross-environment reproducibility is established only by comparing the same recorded REP inputs and obtaining the same material-result hash.
- Failed commands and hash mismatches remain evidence and must be retained in the report.
