# Pay To Win Prohibition

Sponsorship labels are disclosed and cannot alter score formulas or ranking.

## Rules

- Sponsored items must remain disclosed in product or module metadata.
- Scoring profiles must set `sponsorNeutral: true`.
- Scoring component ids, labels, formulas, and sources must not include sponsor status as an input.
- Sponsor status cannot change component weights, eligibility, ranking, or confidence.
- Manufacturer submission or sponsorship may improve provenance only after review; it cannot improve score.

## Validation

The contracts package rejects scoring profiles that mention sponsor, sponsored, sponsorship, or pay-to-win terms in scoring components. This is a foundation truth gate, not a marketplace or leaderboard claim.

## Non-Claims

The repository does not operate a public leaderboard and does not sell score placement. These checks preserve neutrality for foundation examples and future registry workflows.
