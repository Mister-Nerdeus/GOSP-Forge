# API Validation Route

The foundation API /validate route defaults to schema-only validation. In schema-only mode it parses ProjectManifestV2 and counts declared refs, but it does not load repository files, resolve refs, or validate referenced schemas.

Schema-only responses include validationMode: "schema-only" and a structured `api-schema-only-no-repo-refs` warning with the message "API validation does not resolve repository refs in this foundation build." A valid schema with missing or unresolved refs is therefore only schema-valid, not repository-valid.

Local/dev repo-ref mode is available with POST /validate?mode=repo. Repo-ref mode accepts only repository-relative known example and clean-water education paths, rejects absolute paths and traversal attempts, and reports validationMode: "repo-refs".

Production policy: repo-ref validation is blocked in production by default. `GOSP_API_ENABLE_REPO_VALIDATION=1` is an explicit internal operator override for controlled environments only; it is not public production API behavior.

Production non-claim: API validation is not CLI-equivalent public production validation. Repository-ref validation is claimed only when local/dev mode or the internal operator override is explicitly enabled and succeeds.
