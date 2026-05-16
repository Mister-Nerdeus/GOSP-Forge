# Validation Result Contract

Validation output uses a shared contract with `ok`, `schema`, `validationMode`, `errors`, and `warnings`.

`validationMode` is `"schema-only"` when only `ProjectManifestV2` is parsed. `validationMode` is `"repo-refs"` when repository refs are resolved and referenced schemas are checked.

Errors are blocker `ValidationDiagnostic` objects. Warnings are also structured `ValidationDiagnostic` objects with `severity: "warning"`; raw string warnings are not valid in `ValidationResult`.

The API schema-only limitation is reported as:

```json
{
  "code": "api-schema-only-no-repo-refs",
  "message": "API validation does not resolve repository refs in this foundation build.",
  "severity": "warning",
  "source": "mode"
}
```

The contract is shared by CLI validation and API validation so result shapes do not drift silently.
