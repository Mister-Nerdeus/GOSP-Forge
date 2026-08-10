# Work-Order Provenance Record

Date: 2026-08-09 (America/New_York)

This repository record identifies the external instructions that governed Phase-1A and repository reconciliation without pretending they were present in historical checkpoints. The attachment-local source paths are intentionally omitted from publication content; exact SHA-256 identities are retained.

| Work order | SHA-256 | Historical repository state | Operative role / disposition |
|---|---|---|---|
| `GOSP Forge — Next Codex Requirements` | `5fe363e9a58c22fa1920c4820094755e0561af84f3c555b0b1f619f3f16cbd34` | External; not tracked at Phase-1A checkpoint | Directed the minimal Challenge → Submission → Evaluation → Evidence → Comparison loop, explainability layers, local verification, scope boundaries, and non-claims. Recorded as historical requirements provenance. |
| `GOSP Forge — Codex Repository Reconciliation Issue Batch, Revision 2` | `88c5bc64f99915bdaefcfeecafc80b8de93fb6cb4c8bbb8e8ce708f483fed80f` | External; initial RR-200 evidence only | Defined RR-200–214, two owner gates, local-only reconciliation, lineage proof, publication planning, and standard truthful closeout. Its assumed uncommitted Phase-1A state was superseded by observation. |
| `Revised reconciliation baseline authorized` | `472d5286750f2e4ad5d194cad564976a230df3d2819579697493afcb88dee576` | External; supplied after RR-200 stopped | Adopted immutable `2945361… → 9f67e17…`, replaced RR-201–204 with RR-201R, authorized a descendant implementation fix if required, and preserved R3 until RR-205 disposition. |

## Resulting provenance chain

1. RR-200 correctly observed that Phase-1A already existed as `9f67e174…`.
2. The revised baseline made that exact commit the immutable audit target.
3. RR-201R found implementation defects and preserved them in the historical record.
4. `d49e9d111…` fixed the defects as a new descendant and became the verified local technical head.
5. Owner Gate #1 selected ADR 0006 Option A.
6. RR-212 creates a separate governance/control descendant; no work order is retroactively inserted into an earlier checkpoint.

## Authority boundary

These work orders are execution/provenance records. Revision 3, accepted ADRs, REP v0.1, and current repository instructions remain the normative documents within their stated scopes. Where a work order records an explicit owner gate, the recorded owner decision controls that gate.

The full original attachment text remains identified by its hash but is not reproduced here. This avoids embedding private machine attachment paths or treating a copied chat artifact as a new canonical source-of-truth revision.
