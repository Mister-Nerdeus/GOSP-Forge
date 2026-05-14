# External Source Imports

External source records are provenance records for material discovered outside the repository. Import records describe a bounded, reviewed relationship between a source and a GOSP module.

## Supported Example Records

- `examples/imports/open-know-how.example.json`: public import example with attribution and share-alike obligations.
- `examples/imports/appropedia-reference.example.json`: reference-only source record; it does not allow public import.
- `examples/imports/unlicensed.invalid.json`: invalid fixture proving unlicensed public imports are blocked.

## Rules

- License and attribution must be explicit.
- Share-alike obligations must be preserved in downstream public records.
- Reference-only records remain reference-only unless a separate review changes `publicImportAllowed`.
- Unlicensed content must not become a public module import.
- Example records do not imply bulk-import permission from any external source.

## Non-Claims

The foundation importer records provenance and policy checks only. It is not legal advice, not a professional review, and not permission to scrape, bulk import, or republish external content.
