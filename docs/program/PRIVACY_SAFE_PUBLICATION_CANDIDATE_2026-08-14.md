# Privacy-Safe Publication Candidate Handoff

Date: 2026-08-14 (America/New_York)
Status: Locally verified candidate; commit and remote actions remain owner-gated

Current-state overlay: the candidate was committed as `9db3839b8b4a0e5d222ef5e4c8edd1ef19086091`, verified from an exact detached checkout, and published by an owner-authorized non-force fast-forward of `canonical/verified-lineage`. The separately authorized Phase-0C first wave was also sent. See the [2026-08-14 canonical publication and Phase-0C status](../source-of-truth/GOSP_CANONICAL_PUBLICATION_AND_PHASE_0C_STATUS_2026-08-14.md). The candidate-state and remaining-gate text below is preserved as execution provenance.

Privacy scope: the candidate introduces no new host-profile or private attachment path and excludes the unpublished reconciliation history. Six host-path occurrences remain in historical execution records already present in the published Stage-1 ancestry; see the [legacy published host-path disclosure](LEGACY_PUBLISHED_HOST_PATH_DISCLOSURE_2026-08-14.md). This is not a claim that the inherited repository history is path-free.

## Lineage

The candidate is prepared from exact local base `6ef362b2324f562420d8f4b6d1a4c3af7305cf83`, whose parent is the published Stage-1 commit `51df178bfc886f0102343b602b2653557f1c3b19`.

No immutable checkpoint is amended, rebased, squashed, or rewritten. No unrelated history is merged. The separate local preservation commits `7ab8c0c...` and `349683a...` remain intact but are not ancestors of this candidate.

## Included content

- current claim and publication-state corrections;
- dated overlays on historical publication-plan and final-gate records;
- the privacy-safe reconciliation custody record;
- development-tool advisory remediation within existing major lines;
- the current API-backed browser-smoke strategy;
- Phase-0C demo, participant-selection, consent/evidence, and pilot-specification materials retained as historical/internal records;
- a fifteen-organization research register and bounded outreach-message drafts that were unsent at candidate preparation time and are now marked do-not-send under the later owner closure;
- the updated dependency manifests and lockfile.

## Excluded content

- all 131 raw reconciliation review-package files preserved on the local-only checkpoint;
- raw `artifacts/reconciliation/BATCH_STATE.json`;
- credentials, private Codex attachment paths, or generated local execution logs;
- remote repository mutations, workflow execution, deployment, or external-contact evidence.

## Verification boundary

The candidate must pass a frozen offline install, `pnpm verify`, complete and production-only dependency audits, Phase-0B material readers, the Phase-1A product-loop reader, documentation-link validation, privacy/credential scans, Git diff checks, and a live local browser smoke before it is eligible for an owner-authorized commit.

After a commit is explicitly authorized and created, repeat the same checks from an exact detached checkout of that commit. Only that exact committed SHA may be used in a later publication authorization request.

## Verification executed on the uncommitted candidate

- Frozen offline install: exit 0 on Node v22.16.0 and pnpm 9.15.5.
- `pnpm verify`: exit 0; 31 intended / 31 discovered test files and 139 passing tests.
- Foundation audit: `GO`, 23 pass / 0 warn / 0 fail; claim scan checked 213 files with zero findings.
- Complete and production-only `pnpm audit --json`: exit 0; zero reported advisories.
- Phase-0B material reader: exit 0; protected hashes and source-implementation identities matched.
- Phase-1A product-loop reader: exit 0; both evaluations replayed and compared successfully.
- Documentation validation: 352 Markdown files inspected, 115 relative links checked, zero missing.
- Changed-content privacy scan: zero host-profile-path, private attachment-path, or common credential-pattern findings; `artifacts/reconciliation/` is absent.
- Full staged-tree scan: six inherited host-path occurrences in six historical execution records, all also present in the published Stage-1 remote-tracking ref; zero common credential-pattern findings.
- Lineage check: `7ab8c0c...` and `349683a...` are not ancestors of the candidate.
- `git diff --check`: exit 0.
- Live local browser smoke: the full Phase-1A surface rendered; Challenge creation and Submission import/evaluation succeeded; zero console errors observed.

These results apply to the current uncommitted Windows worktree. They are not exact-commit evidence and do not establish Linux/Docker, cross-environment, production, physical-validation, or independent-reproduction claims.

## Remaining gates

1. Explicit authorization to create the local candidate commit.
2. Exact detached re-verification of the created commit.
3. Separate authorization for a one-ref, non-force fast-forward of `canonical/verified-lineage`.
4. Separate authorization for branch protection, default-branch transition, and PR #2 disposition.
5. No Phase-0C participant contact: later owner direction closes outreach, replies, follow-ups, scheduling, and other external communication.

No item in this handoff grants any of those permissions by itself.
