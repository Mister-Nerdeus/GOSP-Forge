# Evidence Rules

## Evidence is append-oriented

New evidence may support, contradict, narrow, supersede, or invalidate an earlier claim. Do not silently overwrite material prior evidence.

## Logical records and artifacts are different

Keep these identities distinct:

- logical subject ID, e.g. `component:connector-x`;
- revision ID/version, e.g. `component:connector-x:v3`;
- artifact digest, e.g. `sha256:...`;
- evaluation ID;
- claim ID;
- evidence ID.

A new file hash does not automatically mean a new logical component, and a new logical revision must not inherit old evidence without an explicit relationship.

## Minimum reproducible evaluation evidence

For Phase 0, capture:

- challenge ID and revision;
- submission ID and revision;
- canonical challenge hash;
- canonical submission hash;
- evaluator name/version;
- deterministic result;
- deterministic result hash;
- runtime/platform metadata in a separate execution manifest;
- pass/fail of same-input replay within the execution.

## Status vocabulary

Do not imply more evidence than exists. Useful states include:

- proposed;
- computationally-evaluated;
- independently-reproduced;
- physically-tested;
- professionally-reviewed;
- externally-certified.

The latter states require actual evidence from the applicable qualified party or process.

## Negative evidence

Failures are evidence. Preserve validation failures, rejected candidates, contradictory observations, and known limitations when they are material to future reliance.
