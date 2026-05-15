# API Validation Route

The foundation API /validate route defaults to schema-only validation. In schema-only mode it parses ProjectManifestV2 and counts declared refs, but it does not load repository files, resolve refs, or validate referenced schemas.

Schema-only responses include validationMode: "schema-only" and the warning "API validation does not resolve repository refs in this foundation build." A valid schema with missing or unresolved refs is therefore only schema-valid, not repository-valid.

Local/dev repo-ref mode is available with POST /validate?mode=repo. It is blocked in production unless explicitly enabled. Repo-ref mode accepts only repository-relative known example and clean-water education paths, rejects absolute paths and traversal attempts, and reports validationMode: "repo-refs".

Production non-claim: API validation is not CLI-equivalent unless repo-ref mode is explicitly enabled and succeeds.
