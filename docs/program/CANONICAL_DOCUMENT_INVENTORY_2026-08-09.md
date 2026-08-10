# Canonical Document Inventory and Precedence Closure

Date: 2026-08-09 (America/New_York)

Status: accepted for the RR-212 reconciliation/control checkpoint. Owner Gate #1 selected ADR 0006 Option A.

## Inventory

| Document or set | Observed location/state | Classification | Disposition |
|---|---|---|---|
| August 6, 2026 GOSP Forge business plan | Referenced by Revisions 2 and 3; no exact repository file or GOSP attachment was identified in the available workspace/archive | external attachment only; canonical-supporting by reference | Preserve outside the repository until the exact source and identity are supplied. Then track a provenance copy or stable reference; do not reconstruct it from later summaries. |
| GOSP Forge Source of Truth, initial revision | Superseded by R2; no current repository file observed | superseded-historical | Preserve if an authenticated source is later located; do not recreate or claim an identity. |
| `docs/source-of-truth/GOSP_Forge_Project_Source_of_Truth_2026-08-07_R2.md` | Tracked | superseded-historical; canonical-supporting for historical decisions | Keep tracked for provenance. Do not delete or rewrite its historical status claims. |
| `docs/source-of-truth/GOSP_Forge_Project_Source_of_Truth_2026-08-07_R3.md` | Present for RR-212 tracking, SHA-256 `9bdcd6b7b56e899d8b8f1b3f067d164d87018e03717a4aed181beef7ea0dea0b` | canonical-current | Track in RR-212 with this exact content. |
| `docs/source-of-truth/REPOSITORY_STATUS_RECONCILIATION_2026-08-07.md` | Tracked | canonical-supporting for status methodology; partially superseded by newly observed evidence | Keep tracked. Add later reconciliation records rather than rewriting its historical observations. |
| `docs/source-of-truth/PHASE_0B_IMPLEMENTATION_STATUS_2026-08-07.md` | Tracked | superseded-historical; execution-evidence summary | Keep tracked for checkpoint provenance. |
| `docs/source-of-truth/PHASE_0B_FINAL_CODE_REVIEW_2026-08-07.md` | Tracked | superseded-historical review | Keep tracked for review history. |
| `docs/source-of-truth/PHASE_0B_FINAL_CODE_REVIEW_2026-08-07_R2.md` | Tracked | canonical-supporting review conclusion; execution-evidence summary | Keep tracked for Phase-0B checkpoint provenance. |
| `docs/source-of-truth/PHASE_0B_DEFECT_REMEDIATION_STATUS_2026-08-07.md` | Tracked | canonical-supporting remediation record; execution-evidence summary | Keep tracked. |
| `docs/verification/LOCAL_PHASE_0B_VERIFICATION.md` | Tracked | canonical-supporting verification procedure | Keep tracked and distinguish procedure from timestamped execution evidence. |
| Phase-1A external work order, titled `GOSP Forge — Next Codex Requirements` | External attachment, SHA-256 `5fe363e9a58c22fa1920c4820094755e0561af84f3c555b0b1f619f3f16cbd34`; not tracked at checkpoint | work-order-only; external attachment only | Track its identity and operative provenance in `docs/program/WORK_ORDER_PROVENANCE_2026-08-09.md`. Do not insert it into or rewrite the historical checkpoint. |
| `docs/product/PHASE_1A_MINIMAL_PRODUCT_LOOP.md` | Tracked in Phase-1A checkpoint | canonical-supporting implementation contract | Keep tracked. It describes the product loop, not project-wide precedence. |
| `docs/source-of-truth/PHASE_1A_IMPLEMENTATION_REPORT_2026-08-09.md` | Tracked in Phase-1A checkpoint | superseded-historical status report; execution-evidence summary | Keep unchanged for provenance. Apply its status correction only through `PHASE_1A_CHECKPOINT_RECONCILIATION_2026-08-09.md`. |
| `docs/program/PHASE_1A_CHECKPOINT_RECONCILIATION_2026-08-09.md` | New, untracked | canonical-supporting; candidate-for-repository-tracking | Track in the later reconciliation/control checkpoint. |
| Original reconciliation issue batch, Revision 2 | External attachment, SHA-256 `88c5bc64f99915bdaefcfeecafc80b8de93fb6cb4c8bbb8e8ce708f483fed80f` | work-order-only; external attachment only | Track its identity and operative provenance with the revised baseline in `WORK_ORDER_PROVENANCE_2026-08-09.md`. |
| Revised reconciliation baseline authorization | External attachment, SHA-256 `472d5286750f2e4ad5d194cad564976a230df3d2819579697493afcb88dee576` | work-order-only; external attachment only | Track its identity and effect in `WORK_ORDER_PROVENANCE_2026-08-09.md` so RR-200/RR-201R remain reconstructable. |
| `artifacts/reconciliation/PREFLIGHT_STATE.*`, `BATCH_STATE.*`, and review packages | Untracked local artifacts | execution-evidence | Retain locally. Select a stable, hash-manifested subset for the later control checkpoint; do not treat generated logs as normative policy. |
| `docs/adr/0001` through `0005` | Tracked, current ADRs | canonical-supporting | Keep tracked. Each controls its stated architecture/verification scope unless superseded by a later accepted ADR. |
| `docs/adr/0006-authoritative-repository-lineage.md` | Owner Gate #1 accepted Option A | canonical-supporting ADR | Track as accepted in RR-212. |
| `docs/rep/REP_V0.1.md` | Tracked | canonical-supporting technical protocol | Keep tracked; it governs REP semantics within its scope. |
| `AGENTS.md` | Tracked | canonical-current repository operating instructions | Keep tracked. Its local execution constraints apply to repository work and do not replace product strategy. |
| `README.md` | Tracked; updated for R3 and the selected local lineage in RR-212 | canonical-supporting navigation | Keep aligned with R3 and exact reconciliation records; do not treat README navigation as higher authority. |

No observed GOSP document was classified `do-not-track`. Voluminous transient server logs and disposable checkout contents are not governance documents and should remain untracked; selected evidence may be retained by hash.

## Required recommendations

### Should Revision 3 become repository-tracked?

Yes. It declares itself the current project source of truth and defines the current precedence and execution policy. Publishing implementation without it would omit the governing direction. Add it in a new reconciliation/control commit; do not alter historical checkpoints.

### Should Phase-1A requirements become tracked?

Yes. Track the exact externally supplied work order, or a faithful repository copy carrying its SHA-256 and provenance, as a historical requirements record. It is not retroactively part of `9f67e174…`.

### Should the reconciliation issue batch become tracked?

Yes. Track the exact Revision 2 work order plus the revised-baseline addendum, or faithful repository copies with hashes. Together they explain why RR-200 stopped, why RR-201–204 were superseded, why RR-201R audited exact commits, and where owner gates apply.

### Which older source-of-truth revisions remain?

Keep Revision 2 and any authenticated initial revision for provenance. Mark them superseded rather than deleting them. The exact repository content and evidence bound to those historical states must remain reconstructable.

## Proposed repository-level precedence after publication

This order restates Revision 3 and separates policy scopes; it does not take effect merely because this inventory exists:

1. Later explicit written owner direction controls the particular decision it addresses.
2. Tracked Revision 3 controls project purpose, current technical status, execution policy, milestone interpretation, and immediate next-phase direction.
3. The authenticated August 6 business plan controls detailed strategy, market, governance, legal, financial, licensing, and long-range planning where Revision 3 does not narrow it.
4. Accepted ADRs, the REP specification, and product contracts control their stated technical scopes, subject to items 1–3. A later accepted ADR supersedes an earlier ADR only where it says so.
5. Repository operating instructions control how work is performed in this repository, subject to owner direction and without silently changing product strategy.
6. Reconciliation and checkpoint status records control repository-state claims only to the extent supported by observed state and newly executed evidence. New exact-SHA evidence supersedes conflicting execution-status claims, not historical fact.
7. Revision 2, earlier source-of-truth revisions, implementation reports, work orders, and historical reviews remain provenance. They do not override later canonical direction outside any explicit unresolved gate they preserve.
8. Generated evidence and logs support claims but are not normative policy.

Any change to this ordering requires an explicit owner-approved source-of-truth revision or scoped ADR; it must not arise implicitly from a README, report, branch name, or generated artifact.

## Open provenance gaps

- The exact August 6 business-plan artifact and hash were not observed. Its role is known only through R2/R3 references.
- The initial source-of-truth revision was not observed as a repository file.
- External work-order identities are tracked in `docs/program/WORK_ORDER_PROVENANCE_2026-08-09.md`; full attachment text remains external and hash-addressed.
