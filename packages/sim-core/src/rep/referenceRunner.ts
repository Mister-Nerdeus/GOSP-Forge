import {
  EvaluationSchema,
  RepEvaluationResultSchema,
  RepMaterialInputSchema,
  type ExplainabilitySchema,
  type RepEvaluationResult,
  type RepMaterialInput,
} from '@gosp/contracts';
import { canonicalJson } from '../hash/canonicalJson.js';
import { sha256 } from '../hash/sha256.js';
import {
  REFERENCE_RUNNER_SOURCE_PATHS,
  sourceImplementationIdentity,
} from './sourceImplementationIdentity.js';

export const REFERENCE_RUNNER_MANIFEST = {
  id: 'gosp.rep.reference-runner',
  revision: '0.1.0',
  protocol: 'REP',
  protocolRevision: '0.1.0',
  canonicalization: 'gosp-canonical-json-unicode-code-point-v1',
  hashAlgorithm: 'sha256',
  identityBasis: 'gosp-source-implementation-v1',
} as const;

export const referenceRunnerIdentity = () =>
  sourceImplementationIdentity({
    kind: 'runner',
    id: REFERENCE_RUNNER_MANIFEST.id,
    revision: REFERENCE_RUNNER_MANIFEST.revision,
    sourcePaths: [...REFERENCE_RUNNER_SOURCE_PATHS],
  });

export type RepEvaluatorOutput = {
  result: unknown;
  explainability: typeof ExplainabilitySchema._output;
  uncertainty?: Array<{
    parameterPath: string;
    method: 'bounds' | 'distribution' | 'ensemble' | 'qualitative';
    lower?: number;
    upper?: number;
    distribution?: string;
    unit?: string;
    rationale: string;
  }>;
  sensitivity?: Array<{
    parameterPath: string;
    resultPath: string;
    method: 'one-at-a-time' | 'local-derivative' | 'global' | 'qualitative';
    effect?: number;
    rank?: number;
    interpretation: string;
  }>;
};

export function evaluateRep(
  rawInput: unknown,
  evaluator: (input: RepMaterialInput) => RepEvaluatorOutput,
): RepEvaluationResult {
  const input = RepMaterialInputSchema.parse(rawInput);
  const expectedRunner = referenceRunnerIdentity();
  if (canonicalJson(input.runner) !== canonicalJson(expectedRunner)) {
    throw new Error('Recorded runner identity does not match this reference runner.');
  }

  const materialInputHash = sha256(canonicalJson(input));
  const evaluated = evaluator(input);
  const resultPayload = {
    repVersion: input.repVersion,
    materialInputHash,
    challengeRef: {
      kind: input.challenge.kind,
      id: input.challenge.id,
      revision: input.challenge.revision,
    },
    submissionRef: {
      kind: input.submission.kind,
      id: input.submission.id,
      revision: input.submission.revision,
    },
    scenarioRef: {
      kind: input.compiledScenario.kind,
      id: input.compiledScenario.id,
      revision: input.compiledScenario.revision,
    },
    modelRef: { kind: input.model.kind, id: input.model.id, revision: input.model.revision },
    workflowRef: {
      kind: input.workflow.kind,
      id: input.workflow.id,
      revision: input.workflow.revision,
    },
    runner: input.runner,
    contractIdentities: input.contractIdentities,
    datasetIdentities: input.datasetIdentities,
    result: evaluated.result,
    explainability: evaluated.explainability,
    uncertainty: evaluated.uncertainty ?? [],
    sensitivity: evaluated.sensitivity ?? [],
  };
  const materialResultHash = sha256(canonicalJson(resultPayload));

  const evaluation = EvaluationSchema.parse({
    kind: 'Evaluation',
    id: `evaluation.${input.submission.id}`,
    revision: input.runner.revision,
    provenance: {
      sources: [],
      method: 'generated',
      notes: ['Generated deterministically by the REP reference runner.'],
    },
    relationships: [],
    supersedes: [],
    challengeRef: resultPayload.challengeRef,
    submissionRef: resultPayload.submissionRef,
    scenarioRef: resultPayload.scenarioRef,
    modelRef: resultPayload.modelRef,
    workflowRef: resultPayload.workflowRef,
    runner: input.runner,
    contractIdentities: input.contractIdentities,
    datasetIdentities: input.datasetIdentities,
    materialInputHash,
    materialResultHash,
    result: evaluated.result,
    explainability: evaluated.explainability,
    uncertainty: evaluated.uncertainty ?? [],
    sensitivity: evaluated.sensitivity ?? [],
    evidenceReadiness: 'source-backed',
    deploymentReadiness: 'concept-only',
    evidenceRefs: [],
    status: 'completed',
  });

  return RepEvaluationResultSchema.parse({ evaluation, materialInputHash, materialResultHash });
}
