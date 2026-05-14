# AI Proposal

AI proposals are draft-plane records for suggested changes. They can help organize source refs, confidence, missing data, limitations, and review status, but they cannot approve truth, safety, scoring, manufacturer verification, or real-world use.

## Contract Boundaries

- `draftStatus` is always `draft`.
- `truthStatus` is always `unreviewed-draft`.
- `sourceRefs` are required.
- `confidence`, `missingData`, `review`, and `limitations` are required or default-visible.
- Human or domain review status is metadata, not automatic acceptance.

## Review States

- `pending-human-review`
- `needs-domain-review`
- `human-rejected`
- `human-accepted-draft`

`human-accepted-draft` means a draft can be carried forward for normal validation. It does not certify the proposed content.

## Non-Claims

AI proposals do not certify potable water, provide professional engineering review, approve safety, approve scoring, verify manufacturers, or approve production manufacturing.
