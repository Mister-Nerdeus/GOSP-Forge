# Final Gate Output

Last pre-commit gate run: 2026-05-15 (America/New_York).

| Gate | Result |
| --- | --- |
| pnpm lint | PASS |
| pnpm -r build | PASS |
| pnpm -r typecheck | PASS |
| pnpm -r test | PASS |
| pnpm validate:examples | PASS, repo-refs mode, 20 declared/20 resolved refs |
| pnpm simulate:clean-water | PASS, defaultedInputs = 0, confidenceSummary knownInputs = 6 |
| pnpm estimate:clean-water | PASS, qualityReport zeroCostLineCount = 1, defaultCostLineCount = 0, defaultedQuantityCount = 1 |
| pnpm audit | PASS, no known vulnerabilities found |
| pnpm run audit | PASS, GO, claim scanner findings = 0 |
| node scripts/controls/write-local-validation.mjs | PASS |
| node scripts/controls/sanitize-local-validation.mjs | PASS |
| node scripts/controls/verify-local-validation-current.mjs | PASS before commit; rerun after commit before push |

Notes: remaining estimate zero-cost/defaulted quantity is visible for filter-housing fabrication and is bounded by education-mode warnings. Production API validation remains schema-only by default.
