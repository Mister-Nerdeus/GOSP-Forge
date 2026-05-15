# Validation Result Contract

Validation output uses a shared contract with ok, schema, validationMode, errors, and warnings.

validationMode is "schema-only" when only ProjectManifestV2 is parsed. validationMode is "repo-refs" when repository refs are resolved and referenced schemas are checked.

Errors are blockers. Warnings are visible limitations or non-blocking ref diagnostics. The contract is shared by CLI validation and API validation so result shapes do not drift silently.
