# Repository assistant instructions

Read and follow `AGENTS.md` before making changes.

GOSP Forge is a domain-neutral engineering challenge, reproducibility, evidence, and component-reuse platform. HouseSim is the first building vertical, not the universal data model.

Priority order:

1. truthful repository checks;
2. contracts and versioned identifiers;
3. REP and deterministic evaluation;
4. provenance/evidence;
5. safe domain-neutral benchmark;
6. CI replay evidence;
7. HouseSim migration;
8. UI and broader integrations only after the core proof works.

Never make core contracts depend on HouseSim. Never claim a command, test, benchmark, deployment, review, physical test, accreditation, or certification happened unless it actually happened.

Every PR closeout must identify files changed, commands actually run, checks passed/failed, evidence artifacts produced, generated/inferred content, known limitations, and any contract/safety/license implications.
