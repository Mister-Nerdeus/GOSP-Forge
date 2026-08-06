# Evidence Directory

Generated local and CI execution evidence follows this convention:

```text
evidence/ci/<commit-or-local-id>/
  manifest.json
  result.json
```

Generated CI evidence is ignored by Git and uploaded as a workflow artifact. It is execution evidence, not source code.

`result.json` is the deterministic material evaluation result. `manifest.json` records the environment, execution time, replay status, and hash of that result.
