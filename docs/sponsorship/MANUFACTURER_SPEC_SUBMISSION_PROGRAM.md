# Manufacturer Spec Submission Program

Manufacturer verification improves confidence but not score. Draft imports cannot self-certify as verified.

## Draft Workflow

1. AI-assisted or manual extraction creates a `SpecImportDraft`.
2. The draft lists extracted fields, missing fields, assumptions, and contradictions.
3. `humanReviewRequired` remains true for foundation drafts.
4. `manufacturerVerified` remains false until a future production verification process exists.
5. Contradictory drafts may remain in `needs-review`, but cannot be marked `manufacturer-submitted`.

## Program Boundaries

- Manufacturer submission may improve confidence after review, but it cannot change scoring directly.
- AI extraction cannot mark any field or product as manufacturer verified.
- Missing fields and contradictions must stay visible in the machine-readable draft.
- Human review is explicit and required before importing a draft into product bindings.

## Non-Claims

The foundation workflow does not claim manufacturer verification, product approval, potable-water certification, professional engineering review, or production manufacturing approval.
