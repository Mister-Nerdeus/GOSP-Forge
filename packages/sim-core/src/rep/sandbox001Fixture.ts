import { RepMaterialInputSchema, type RepMaterialInput, type RepReplayRecord } from '@gosp/contracts';
import { canonicalJson } from '../hash/canonicalJson.js';
import { sha256 } from '../hash/sha256.js';
import { referenceRunnerIdentity } from './referenceRunner.js';
import { runSandbox001 } from './sandbox001.js';
import {
  loadSourceImplementationManifest,
  sourceImplementationIdentity,
} from './sourceImplementationIdentity.js';

const provenance = { sources: [], method: 'authored' as const };
const ref = (kind: string, id: string) => ({ kind, id, revision: '1.0.0' });

const artifactIdentity = (
  kind: 'solver' | 'contract' | 'schema' | 'dataset' | 'component-data',
  id: string,
  descriptor: unknown,
) => ({
  kind,
  id,
  revision: '1.0.0',
  contentHash: sha256(canonicalJson(descriptor)),
});

export const SANDBOX_001_CONTRACT_IDENTITY = artifactIdentity(
  'contract',
  'gosp.rep.sandbox-001',
  {
    id: 'gosp.rep.sandbox-001',
    revision: '1.0.0',
    input: 'finite values, finite weights, finite offset, finite scenario scale',
    output: 'offset + scale * sum(values[i] * weights[i])',
  },
);

export const SANDBOX_001_SOLVER_SOURCE_PATHS = [
  'tsconfig.base.json',
  'packages/sim-core/tsconfig.json',
  'packages/sim-core/src/rep/sourceImplementationIdentity.ts',
  'packages/sim-core/src/rep/sandbox001.ts',
] as const;

const sandbox001SolverSourceSpec = {
  kind: 'solver',
  id: 'solver.sandbox-001',
  revision: '1.0.0',
  sourcePaths: [...SANDBOX_001_SOLVER_SOURCE_PATHS],
} as const;

export const SANDBOX_001_SOLVER_IDENTITY = sourceImplementationIdentity(
  sandbox001SolverSourceSpec,
);
export const sandbox001SolverSourceManifest = () =>
  loadSourceImplementationManifest(sandbox001SolverSourceSpec);

export function createSandbox001MaterialInput(): RepMaterialInput {
  return RepMaterialInputSchema.parse({
    repVersion: '0.1.0',
    challenge: {
      kind: 'Challenge',
      id: 'sandbox-001',
      revision: '1.0.0',
      provenance,
      title: 'Sandbox 001 deterministic weighted sum',
      problemStatement: 'Evaluate a finite weighted sum under a controlled scalar scenario.',
      evaluationModelRef: ref('Model', 'model.sandbox-001'),
      workflowRef: ref('Workflow', 'workflow.sandbox-001'),
      permittedScenarioRefs: [ref('Scenario', 'scenario.sandbox-001.reference')],
      status: 'open',
    },
    submission: {
      kind: 'Submission',
      id: 'submission.sandbox-001.reference',
      revision: '1.0.0',
      provenance,
      challengeRef: ref('Challenge', 'sandbox-001'),
      scenarioRef: ref('Scenario', 'scenario.sandbox-001.reference'),
      materialPayload: { values: [1, 2, 3], weights: [2, 3, 5], offset: 7 },
      status: 'submitted',
    },
    compiledScenario: {
      kind: 'Scenario',
      id: 'scenario.sandbox-001.reference',
      revision: '1.0.0',
      provenance,
      name: 'Sandbox 001 reference scenario',
      parameters: { scale: 2 },
      modelRef: ref('Model', 'model.sandbox-001'),
      status: 'controlled',
    },
    model: {
      kind: 'Model',
      id: 'model.sandbox-001',
      revision: '1.0.0',
      provenance,
      name: 'Sandbox 001 analytical model',
      modelType: 'analytical',
      fidelity: {
        level: 'analytical',
        calibrationStatus: 'not-applicable',
        limitations: ['Synthetic deterministic benchmark only.'],
      },
      solver: SANDBOX_001_SOLVER_IDENTITY,
      contractIdentities: [SANDBOX_001_CONTRACT_IDENTITY],
      assumptions: [
        {
          id: 'assumption.binary64',
          statement: 'Inputs are finite and evaluated with ECMAScript Number binary64 arithmetic.',
          material: true,
        },
      ],
      status: 'active',
    },
    workflow: {
      kind: 'Workflow',
      id: 'workflow.sandbox-001',
      revision: '1.0.0',
      provenance,
      name: 'Sandbox 001 reference evaluation',
      steps: [
        { id: 'validate', name: 'Validate material input', action: 'inspect' },
        { id: 'evaluate', name: 'Evaluate weighted sum', action: 'execute' },
        { id: 'record', name: 'Record material result', action: 'record' },
      ],
      status: 'active',
    },
    runner: referenceRunnerIdentity(),
    contractIdentities: [SANDBOX_001_CONTRACT_IDENTITY],
    datasetIdentities: [],
    componentData: [],
    materialAssumptions: [
      {
        id: 'assumption.binary64',
        statement: 'Inputs are finite and evaluated with ECMAScript Number binary64 arithmetic.',
        material: true,
      },
    ],
    materialParameters: { benchmark: 'weighted-sum-v1' },
  });
}

export function createSandbox001ReplayRecord(): RepReplayRecord {
  const materialInput = createSandbox001MaterialInput();
  const evaluated = runSandbox001(materialInput);
  return {
    kind: 'RepReplayRecord',
    repVersion: '0.1.0',
    materialInput,
    expectedMaterialInputHash: evaluated.materialInputHash,
    expectedMaterialResultHash: evaluated.materialResultHash,
  };
}
