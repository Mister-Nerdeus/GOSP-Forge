# License-Aware Import Policy

External imports require license records, attribution generation, share-alike propagation, data-boundary obligations, and rejection of unlicensed public imports.

## Compatibility Outcomes

- `allow`: the license profile permits public import and the required obligations are visible.
- `review`: the license is recognized, but the profile blocks public import until a human review updates the record.
- `block`: the content must not be imported as a public module.

## Required Profile Fields

Each import record must state:

- license identifier
- whether attribution is required
- whether share-alike obligations apply
- whether a data boundary applies
- whether public import is allowed

`Unlicensed` content is blocked for public module import. It may be retained only as reference-only evidence when the project policy allows that separate use.

## Share-Alike and ODbL Boundaries

`CC-BY-SA-4.0`, `CERN-OHL-S-2.0`, and `ODbL-1.0` profiles must keep `shareAlike` true. `ODbL-1.0` profiles must also set a data boundary so database-derived content is not mixed into module records without explicit provenance.

## Non-Claims

The compatibility checker is a foundation policy gate, not legal advice. A passing result means the repository can preserve the stated obligations in examples and registry metadata; it does not grant rights beyond the recorded license.
