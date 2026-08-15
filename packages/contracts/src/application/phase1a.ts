import type { CanonicalConstraint, Requirement } from '../canonical/programGraph.js';
import type { Claim, Evidence, ProofObligationSchema } from '../canonical/truthModel.js';
import type {
  Challenge,
  Evaluation,
  Model,
  Scenario,
  Submission,
  Workflow,
} from '../canonical/executionModel.js';
import type {
  RepExecutionEvidence,
  RepMaterialInput,
  RepReplayRecord,
} from '../rep/rep.js';

export type Phase1aProofObligation = typeof ProofObligationSchema._output;

export type Phase1aSubmissionIdentity = Pick<Submission, 'id' | 'revision'>;

export type Phase1aWorkspaceSelection = {
  baseline: Phase1aSubmissionIdentity;
  candidate: Phase1aSubmissionIdentity;
};

export type Phase1aHardGate = {
  constraint: CanonicalConstraint;
  resultPath: string;
  actual: unknown;
  passed: boolean;
};

export type Phase1aEvaluationView = {
  evaluation: Evaluation;
  materialInput: RepMaterialInput;
  executionEvidence: RepExecutionEvidence;
  claim: Claim;
  evidence: Evidence[];
  hardGates: Phase1aHardGate[];
  replayRecord: RepReplayRecord;
  replay: {
    ok: boolean;
    inputHashMatches: boolean;
    resultHashMatches: boolean;
    reproductionStatus: 'verified-local-replay' | 'failed';
  };
  contradictions: Evidence[];
  limitations: string[];
};

export type Phase1aComparison = {
  baselineEvaluationRef: { kind: 'Evaluation'; id: string; revision: string };
  candidateEvaluationRef: { kind: 'Evaluation'; id: string; revision: string };
  comparable: true;
  fixedInputPaths: string[];
  changedInputPaths: string[];
  changedInputs: Array<{ path: string; baseline: unknown; candidate: unknown }>;
  resultDeltas: Array<{
    resultPath: string;
    baseline: number;
    candidate: number;
    delta: number;
    interpretation: string;
  }>;
  hardGateChanges: Array<{
    constraintId: string;
    baselinePassed: boolean;
    candidatePassed: boolean;
    changed: boolean;
  }>;
  readinessDifferences: {
    evidenceReadiness: { baseline: string; candidate: string; changed: boolean };
    deploymentReadiness: { baseline: string; candidate: string; changed: boolean };
  };
  unresolvedProofObligations: {
    baseline: Phase1aProofObligation[];
    candidate: Phase1aProofObligation[];
  };
  explanation: {
    summary: string;
    primaryReasons: string[];
    limitations: string[];
  };
};

export type Phase1aWorkspace = {
  milestone: 'Phase-1A — Minimal Challenge-Facing Product Loop';
  selection: Phase1aWorkspaceSelection;
  persistence: {
    kind: 'process-local-memory';
    durable: false;
    disclosure: string;
  };
  challenge: {
    record: Challenge;
    availableChallenges: Challenge[];
    requirements: Array<{ record: Requirement; role: 'hard-gate' | 'objective' }>;
    constraints: CanonicalConstraint[];
    assumptions: RepMaterialInput['materialAssumptions'];
    model: Model;
    scenario: Scenario;
    workflow: Workflow;
  };
  submissions: Submission[];
  evaluations: Phase1aEvaluationView[];
  comparison: Phase1aComparison;
};
