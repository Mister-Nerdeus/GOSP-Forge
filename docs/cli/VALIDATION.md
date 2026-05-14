# CLI Validation

`gosp validate <project-manifest>` emits machine-readable JSON. The command validates the project manifest schema, checks duplicate example IDs, and resolves refs declared by the manifest.

Required refs must declare a path, load successfully, and match the declared ref kind. Optional refs that are missing are reported as warnings and do not fail validation. Duplicate IDs always fail validation.

Validation is a foundation truth gate only. It does not certify potable water, professional engineering readiness, manufacturing readiness, or safety approval.
