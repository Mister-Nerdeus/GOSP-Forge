# API Non-Claims

The foundation API is a local development and validation surface only.

## Non-Claims

- It is not a production hosting service.
- It is not a public leaderboard service.
- It does not provide production storage.
- It does not provide production identity, authorization, or managed secret storage.
- It does not certify potable water, provide professional engineering approval, or approve production manufacturing.

## Current API Boundary

The API exposes health, version, and foundation validation routes. Request-size, content-type, invalid JSON, and rate-limit controls are tested, but those controls are not a production security certification.

## Validation Non-Claims

The /validate route defaults to schema-only ProjectManifestV2 parsing. It does not claim CLI-equivalent public production repository validation. Repo-ref mode is available for local/dev validation and can be enabled in production only through an explicit internal operator override for controlled environments.
