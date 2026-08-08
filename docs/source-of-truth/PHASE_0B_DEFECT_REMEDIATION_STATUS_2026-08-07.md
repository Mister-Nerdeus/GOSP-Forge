# Phase-0B Defect Remediation Status — 2026-08-07

## Outcome

The authorized local defect-remediation pass corrected all seven findings in
`PHASE_0B_FINAL_CODE_REVIEW_2026-08-07.md`. The original review and all earlier evidence
records remain preserved. No file was staged or committed, and no remote or GitHub Actions
operation was performed.

## Finding dispositions

- B-01: canonical JSON now rejects sparse array holes by visiting every index; regression
  coverage proves sparse output cannot be emitted.
- B-02: Clean Water product-target fields and safety/education semantics now live in
  `@gosp/vertical-clean-water`; the core boundary test covers runtime sources in both
  `@gosp/sim-core` and `@gosp/contracts`.
- H-01: REP schemas now enforce context-specific identity kinds and cross-object canonical
  reference consistency.
- H-02: runner and solver identities now use the deterministic source-closure rule recorded in
  ADR 0005. The manifest hashes normalized repository-relative source content, relevant
  TypeScript configuration, TypeScript `5.9.3`, and Zod `3.25.76`; it excludes local paths,
  timestamps, process data, and generated build metadata.
- M-01: professional-claim scanning now applies scoped separation disclaimers and retains
  affirmative approval/certification findings when words such as `separate` or `distinct`
  occur elsewhere on the line.
- M-02: cross-environment comparison now requires distinct environment IDs and a difference in
  operating system, architecture, or runtime. A changed working directory alone is rejected.
- L-01: local evidence fields now say `statusBeforeVerification` and
  `statusAfterVerification`, with an explicit statement that the latter is captured after
  verification/material extraction and immediately before the evidence file itself is written.

## Verification and evidence

- Targeted tests: `@gosp/sim-core`, 2 files and 9 tests passed. The final suite also contains
  37 contract tests, 15 Clean Water vertical tests, and 21 CLI tests covering the other
  remediations.
- Complete `pnpm verify`: exit 0 on Windows Node `v22.16.0`; lint, build, typecheck, validation,
  replay, simulation, estimate, and audit passed; 29 intended test files exactly matched 29
  discovered files; 125 tests passed; foundation audit was `GO` with 23 pass, 0 warn, 0 fail
  across 174 scanned files.
- New local evidence: `artifacts/phase-0b/local/execution-2026-08-08T01-31-23-237Z.json`,
  result `PASS`.
- New Windows evidence:
  `artifacts/phase-0b/reproducibility/windows-node22-remediated.json`, replay exit 0 on
  `win32 10.0.26200`, Node `v22.16.0`.
- New Docker/Linux evidence:
  `artifacts/phase-0b/reproducibility/linux-node24-remediated.json`, replay exit 0 on
  `linux 6.6.87.2-microsoft-standard-WSL2`, Node `v24.19.0`.
- New comparison:
  `artifacts/phase-0b/reproducibility/comparison-remediated.json`, reproducible `true`; all nine
  checks passed.

## Material hash changes

| Boundary | Before remediation | After remediation |
| --- | --- | --- |
| Sandbox REP material input | `bebe2c8fe4dcbc0fdb327d44c5fffeee7864161f49c278a2c32ab5ca25d3af2e` | `72886e655374bcc81162f72fb3a942bb6e596164aea85025453feac0ada8b383` |
| Sandbox REP material result | `3cfd0c28a321535667e55ee92a74788d68c1083cd76748348f54fb758fe05b95` | `991b9464d74424297f88fe363a200d895147349a87b0377d5851945e0aa34c21` |
| Clean Water REP material input | `fd78e3708ea08905e775cca44066fee568ab2345b298acaa097ce2d86fe88756` | `809bf1cad1f3b3d18e1c605fbd4550feb8346545c7fa10720a22a00f45f90d0c` |
| Clean Water REP material result | `d947135a2daaf6137ffc1a87ca85c364dd18e48244133b007d0ab1090242b24c` | `0912de0a81bf5cc327663cfb31df0f97dd2f76102190521a912507cdae2ee5e6` |

These changes are expected. Runner and solver implementation identities are part of REP material
input, so replacing declaration hashes with deterministic source-closure hashes changes each
material-input hash. Material results bind their material-input hash and therefore change as
well. The computed sandbox result remains `53`, the Clean Water modeled output remains `8`
liters, and the legacy Clean Water input/output hashes remain
`2355da693fad75a3337887d0c9129df41e432de3824a70997f2673e9369441a6` and
`d500dfecaf0afa7a7ca6c9c6ff1dca97343f1f1f096a1798b3ba887d7d474bde` respectively.

The resulting implementation identities are:

- reference runner: `9b069e97fc2246b2be0ee21990b9200fb9536f3c9ce755143030319f18f1590d`;
- sandbox solver: `0997b38d17fc9d33951d0b63d085894cc645ff2428922279f1b658a260466946`.

## Change control

Branch `develop`, HEAD `8a416bed36c025a478d999c0a99939cdeadca837`, and `origin/develop` remain aligned.
The working tree remains intentionally uncommitted and unstaged pending checkpoint authorization.
