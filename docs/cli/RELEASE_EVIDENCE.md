# Release Evidence Command

Run `pnpm --filter @gosp/cli start release-evidence foundation` to gather existing foundation evidence into machine-readable JSON.

The command reports:

- git SHA and branch
- runtime proof for Node and pnpm
- validation summary, validation mode, and ref counts
- simulation summary, confidence summary, and graph consistency summary
- estimate quality report and mode gate
- foundation audit decision, counts, and claim scan result

It gathers evidence only; it does not approve a release or create professional, manufacturing, procurement, release-approval, or potable-water claims.
