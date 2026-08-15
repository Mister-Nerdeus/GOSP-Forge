# GOSP Forge Docs

This index points to the current foundation documentation. The repository remains a foundation slice: docs should describe implemented contracts, examples, gates, audits, and boundaries without implying production readiness.

## Start Here

- [Revision 3 source of truth](source-of-truth/GOSP_Forge_Project_Source_of_Truth_2026-08-07_R3.md)
- [Stage 1 remote publication status](source-of-truth/GOSP_REMOTE_PUBLICATION_STATUS_2026-08-10.md)
- [Current canonical publication and Phase-0C status](source-of-truth/GOSP_CANONICAL_PUBLICATION_AND_PHASE_0C_STATUS_2026-08-14.md)
- [Current canonical authority status](source-of-truth/GOSP_CANONICAL_AUTHORITY_STATUS_2026-08-15.md)
- [Revision 2 source of truth (historical)](source-of-truth/GOSP_Forge_Project_Source_of_Truth_2026-08-07_R2.md)
- [Repository status reconciliation](source-of-truth/REPOSITORY_STATUS_RECONCILIATION_2026-08-07.md)
- [Phase-0B implementation status](source-of-truth/PHASE_0B_IMPLEMENTATION_STATUS_2026-08-07.md)
- [REP v0.1](rep/REP_V0.1.md)
- [Local Phase-0B verification](verification/LOCAL_PHASE_0B_VERIFICATION.md)
- [Product thesis](product/GOSP_STEM_SYSTEMS_FORGE_THESIS.md)
- [North star](product/GOSP_FORGE_NORTH_STAR.md)
- [What GOSP Forge is not](product/WHAT_GOSP_FORGE_IS_NOT.md)
- [Product invariants](governance/PRODUCT_INVARIANTS.md)
- [Claim implementation map](program/CLAIM_IMPLEMENTATION_MAP.md)
- [Phase-1A checkpoint reconciliation](program/PHASE_1A_CHECKPOINT_RECONCILIATION_2026-08-09.md)
- [Canonical document inventory](program/CANONICAL_DOCUMENT_INVENTORY_2026-08-09.md)
- [Reconciliation evidence custody](program/RECONCILIATION_EVIDENCE_CUSTODY_2026-08-14.md)
- [Legacy published host-path disclosure](program/LEGACY_PUBLISHED_HOST_PATH_DISCLOSURE_2026-08-14.md)
- [Privacy-safe publication candidate handoff](program/PRIVACY_SAFE_PUBLICATION_CANDIDATE_2026-08-14.md)
- [Development-tool advisory remediation](program/DEVELOPMENT_TOOL_ADVISORY_REMEDIATION_2026-08-14.md)
- [Next ten project issues — execution record](program/NEXT_TEN_ISSUES_EXECUTION_2026-08-15.md)
- [Repository lineage audit](program/GOSP_REPOSITORY_LINEAGE_AUDIT_2026-08-09.md)
- [Authoritative-lineage ADR](adr/0006-authoritative-repository-lineage.md)
- [Registered evaluators and durable local workspaces ADR](adr/0007-registered-evaluators-and-durable-local-workspaces.md)
- [Portable evidence package](rep/PORTABLE_EVIDENCE_PACKAGE.md)
- [Local workspace threat model](security/LOCAL_WORKSPACE_THREAT_MODEL.md)

## Contracts

- Canonical Engineering Program Graph objects: `packages/contracts/src/canonical/`
- REP records and execution evidence: `packages/contracts/src/rep/`
- [Project manifest v2](contracts/PROJECT_MANIFEST_V2.md)
- [Validation result](contracts/VALIDATION_RESULT.md)
- [Reference resolution](contracts/REFERENCE_RESOLUTION.md)
- [Graph contracts](contracts/GRAPH_CONTRACTS.md)
- [Product binding](contracts/PRODUCT_BINDING.md)
- [Scoring profile](contracts/SCORING_PROFILE.md)
- [Simulation run envelope](contracts/SIMULATION_RUN_ENVELOPE.md)
- [Pricing contracts](contracts/PRICING_CONTRACTS.md)
- [Estimate quality report](contracts/ESTIMATE_QUALITY_REPORT.md)
- [AI proposal](contracts/AI_PROPOSAL.md)

## Clean Water Foundation

- [Vertical scenario compatibility settings](verticals/clean-water/SCENARIO_SETTINGS.md)
- [Automated Water Filter demo](demos/AUTOMATED_WATER_FILTER_SYSTEM.md)
- [Clean Water problem pack](demos/CLEAN_WATER_PROBLEM_PACK.md)
- [Clean Water product bindings](demos/CLEAN_WATER_PRODUCT_BINDINGS.md)
- [Clean Water flow model](simulation/CLEAN_WATER_FLOW_MODEL.md)
- [Clean Water power model](simulation/CLEAN_WATER_POWER_MODEL.md)
- [Simulation confidence summary](simulation/SIMULATION_CONFIDENCE_SUMMARY.md)
- [Direct and downstream impacts](simulation/DIRECT_DOWNSTREAM_IMPACTS.md)
- [Teacher guide](education/clean-water/TEACHER_GUIDE.md)
- [Student guide](education/clean-water/STUDENT_GUIDE.md)

## UI And API

- [Phase-1A product loop](product/PHASE_1A_MINIMAL_PRODUCT_LOOP.md)
- [Phase-1A web application surface](product/BUILDER_UI_SHELL.md)
- [Foundation UI inspection](product/FOUNDATION_UI_INSPECTION.md)
- [Browser smoke strategy](testing/BROWSER_SMOKE_TEST_STRATEGY.md)
- [API non-claims](api/API_NON_CLAIMS.md)
- [API health and version](api/HEALTH_AND_VERSION.md)

## Phase-0C historical materials — external outreach closed

These records are retained for provenance and internal analysis. Owner direction issued on 2026-08-14 prohibits further project outreach, replies, follow-ups, scheduling, or other external contact.

- [External one-page explanation](phase-0c/GOSP_FORGE_EXTERNAL_ONE_PAGE.md)
- [Structured interview script](phase-0c/EXTERNAL_INTERVIEW_SCRIPT.md)
- [External feedback evidence template](phase-0c/EXTERNAL_FEEDBACK_EVIDENCE_TEMPLATE.json)
- [Gate A tracker](phase-0c/GATE_A_TRACKER.md)
- [Participant selection and outreach plan](phase-0c/PARTICIPANT_SELECTION_AND_OUTREACH_PLAN.md)
- [Candidate organization research register](phase-0c/CANDIDATE_ORGANIZATION_RESEARCH_REGISTER.md)
- [Outreach message drafts](phase-0c/OUTREACH_MESSAGE_DRAFTS.md)
- [Minimal-loop demo runbook](phase-0c/MINIMAL_LOOP_DEMO_RUNBOOK.md)
- [Interview evidence and privacy protocol](phase-0c/INTERVIEW_EVIDENCE_AND_PRIVACY_PROTOCOL.md)
- [Bounded pilot specification template](phase-0c/BOUNDED_PILOT_SPECIFICATION_TEMPLATE.md)
- [Owner-controlled validation gate](phase-0c/OWNER_CONTROLLED_VALIDATION_GATE.md)

## Gates And Audit

- [Validation CLI](cli/VALIDATION.md)
- [Release evidence command](cli/RELEASE_EVIDENCE.md)
- [CI gate policy](gates/CI_GATE_POLICY.md)
- [Local validation truth gate](gates/TRUTH_GATE_LOCAL_VALIDATION.md)
- [No professional claim gate](gates/NO_PROFESSIONAL_CLAIM_GATE.md)
- [Foundation release checklist](program/FOUNDATION_RELEASE_CHECKLIST.md)
- [Develop to main promotion](program/DEVELOP_TO_MAIN_FOUNDATION_PROMOTION.md)
- [Branch protection recommendations](program/BRANCH_PROTECTION_RECOMMENDATIONS.md)
- [Branch protection and repository control policy](program/BRANCH_PROTECTION_AND_REPOSITORY_CONTROL_POLICY_2026-08-09.md)
- [PR #2 supersession map](program/PR_2_SUPERSESSION_MAP_2026-08-09.md)
- [Remote branch disposition plan](program/REMOTE_BRANCH_PRESERVATION_AND_DISPOSITION_2026-08-09.md)
- [Remote automation audit](program/REMOTE_AUTOMATION_AUDIT_2026-08-09.md)
- [Work-order provenance](program/WORK_ORDER_PROVENANCE_2026-08-09.md)
- [Rollback record template](program/ROLLBACK_RECORD_TEMPLATE.md)
- [Foundation audit](audits/GOSP_FORGE_FOUNDATION_AUDIT.md)

## Governance

- [Licensing strategy](licensing/strategy.md)
- [Safety and use policy](governance/SAFETY_AND_USE_POLICY.md)
- [Sponsor independence charter](governance/SPONSOR_INDEPENDENCE_CHARTER.md)
- [Pay-to-win prohibition](governance/PAY_TO_WIN_PROHIBITION.md)
- [License-aware import policy](governance/LICENSE_AWARE_IMPORT_POLICY.md)
- [Storage and secret policy](security/STORAGE_AND_SECRET_POLICY.md)

## Hardening Evidence

Batch 131-145 documentation records final foundation hardening for API validation policy, structured diagnostics, sanitized and CI evidence, estimate placeholder reporting, graph consistency, release evidence, branch protection recommendations, claim-map alignment, and final audit handoff.
