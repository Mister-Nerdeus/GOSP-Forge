export type GospId = string;
export type SemanticRevision = string;

export interface RevisionedRecord {
  id: GospId;
  revision: SemanticRevision;
}

export interface Requirement extends RevisionedRecord {
  text: string;
  source?: string;
  measurable?: boolean;
}

export type ConstraintKind = 'hard' | 'soft';

export interface Constraint extends RevisionedRecord {
  kind: ConstraintKind;
  description: string;
  applicability?: string;
}

export type HazardSeverity = 'low' | 'moderate' | 'high' | 'critical';

export interface Hazard extends RevisionedRecord {
  description: string;
  severity: HazardSeverity;
  controls: string[];
  residualRisk?: string;
}

export interface SystemElement extends RevisionedRecord {
  name: string;
  elementType: 'physical' | 'digital' | 'process' | 'organizational' | 'environmental';
}

export interface InterfaceRecord extends RevisionedRecord {
  fromElementId: GospId;
  toElementId: GospId;
  interfaceType: 'mechanical' | 'electrical' | 'thermal' | 'fluid' | 'data' | 'human' | 'contractual' | 'other';
  description: string;
}

export type ClaimStatus =
  | 'proposed'
  | 'computationally-evaluated'
  | 'independently-reproduced'
  | 'physically-tested'
  | 'professionally-reviewed'
  | 'externally-certified'
  | 'contradicted'
  | 'withdrawn'
  | 'expired';

export interface Claim extends RevisionedRecord {
  subjectId: GospId;
  property: string;
  value: unknown;
  unit?: string;
  status: ClaimStatus;
  applicability?: Record<string, unknown>;
  evidenceIds: GospId[];
  limitations: string[];
}

export type EvidenceType =
  | 'source-record'
  | 'analytical-calculation'
  | 'numerical-simulation'
  | 'independent-reproduction'
  | 'expert-review'
  | 'bench-test'
  | 'accredited-laboratory-test'
  | 'field-demonstration'
  | 'professional-approval'
  | 'product-certification'
  | 'operational-history';

export interface Evidence extends RevisionedRecord {
  evidenceType: EvidenceType;
  supportsClaimIds: GospId[];
  contradictsClaimIds?: GospId[];
  artifactDigests: string[];
  scope: string;
  limitations: string[];
}

export interface Objective {
  metric: string;
  direction: 'minimize' | 'maximize' | 'report';
}

export interface EvaluationDefinition {
  kind: string;
  parameters: Record<string, unknown>;
}

export interface ChallengeDefinition extends RevisionedRecord {
  title: string;
  domain: string;
  hazardTier: 0 | 1 | 2 | 3 | 4;
  requirements: Requirement[];
  constraints: Constraint[];
  objectives: Objective[];
  evaluation: EvaluationDefinition;
}

export interface Submission extends RevisionedRecord {
  challengeId: GospId;
  payload: Record<string, unknown>;
}

export interface EvaluatorIdentity {
  kind: string;
  version: string;
}

export interface EvaluationRecord {
  evaluationId: GospId;
  challengeId: GospId;
  submissionId: GospId;
  evaluator: EvaluatorIdentity;
  inputHashes: {
    challengeSha256: string;
    submissionSha256: string;
  };
  deterministicResult: unknown;
  limitations: string[];
}

export interface Review extends RevisionedRecord {
  subjectId: GospId;
  reviewerRole: string;
  scope: string;
  decision: 'accept' | 'accept-with-limitations' | 'reject' | 'needs-more-evidence';
  conflictsDisclosed: string[];
}

export interface TestArticle extends RevisionedRecord {
  subjectId: GospId;
  manufacturingRecordIds: GospId[];
  artifactDigests: string[];
}

export interface ComponentRelease extends RevisionedRecord {
  name: string;
  intendedUse: string;
  prohibitedUses: string[];
  interfaceIds: GospId[];
  claimIds: GospId[];
  evidenceIds: GospId[];
  knownIssues: string[];
  license: string;
}

export interface OperationalObservation extends RevisionedRecord {
  subjectId: GospId;
  observationType: 'field-data' | 'maintenance' | 'failure' | 'measured-outcome';
  description: string;
  artifactDigests: string[];
}

export interface EngineeringProgram extends RevisionedRecord {
  name: string;
  requirements: Requirement[];
  constraints: Constraint[];
  hazards: Hazard[];
  systemElements: SystemElement[];
  interfaces: InterfaceRecord[];
  claimIds: GospId[];
  evidenceIds: GospId[];
  challengeIds: GospId[];
  componentReleaseIds: GospId[];
}
