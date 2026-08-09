import { describe, expect, it } from 'vitest';
import type { Phase1aClient } from './phase1a/client';

class TestElement {
  className = '';
  textContent = '';
  value = '';
  type = '';
  href = '';
  download = '';
  children: TestElement[] = [];

  constructor(readonly tagName: string) {}
  append(...children: TestElement[]) { this.children.push(...children); }
  replaceChildren(...children: TestElement[]) { this.children = children; }
  addEventListener() {}
  click() {}
  get innerText(): string {
    return [this.textContent, ...this.children.map((child) => child.innerText)].filter(Boolean).join(' ');
  }
}

const ref = (kind: string, id: string, revision = '1.0.0') => ({ kind, id, revision });
const provenance = { sources: [], method: 'authored', notes: [] };
const hashA = 'a'.repeat(64);
const hashB = 'b'.repeat(64);
const evaluationView = (id: string, value: number, hash: string, passed: boolean) => ({
  evaluation: {
    kind: 'Evaluation', id: `evaluation.${id}`, revision: '0.1.0', provenance, relationships: [], supersedes: [],
    challengeRef: ref('Challenge', 'sandbox-001'), submissionRef: ref('Submission', id),
    scenarioRef: ref('Scenario', 'scenario.sandbox-001.reference'), modelRef: ref('Model', 'model.sandbox-001'),
    workflowRef: ref('Workflow', 'workflow.sandbox-001'), runner: { kind: 'runner', id: 'gosp.rep.reference-runner', revision: '0.1.0', contentHash: hashA },
    contractIdentities: [], datasetIdentities: [], materialInputHash: hash, materialResultHash: hash,
    result: { value, weightedSum: value === 53 ? 23 : 8, terms: value === 53 ? [2, 6, 15] : [0, 3, 5] },
    explainability: {
      explanation: 'Structured explanation.', equations: [{ id: 'sandbox-001.weighted-sum', expression: 'result = offset + scale * sum(values[i] * weights[i])', description: 'Deterministic weighted sum.', variables: { offset: 'Submission offset.', scale: 'Scenario scale.' } }],
      intermediateValues: [{ id: 'weighted-sum', value: value === 53 ? 23 : 8 }],
      modelInspection: { assumptions: [], boundaryConditions: [], numericalSettings: { arithmetic: 'binary64' }, calibration: 'not applicable' }, evidenceRefs: [],
    }, uncertainty: [], sensitivity: [], evidenceReadiness: 'source-backed', deploymentReadiness: 'concept-only', evidenceRefs: [], status: 'completed',
  },
  materialInput: {},
  executionEvidence: { environment: { os: 'win32', runtime: 'v22.16.0' } },
  claim: {
    id: `claim.${id}`, revision: '1.0.0', statement: `Synthetic result ${value}.`, evidenceReadiness: 'computationally-reproduced', deploymentReadiness: 'concept-only',
    professionalDisposition: { status: 'not-assessed' }, proofObligations: [
      { id: 'proof.independent-reproduction', description: 'Independent reproduction remains open.', requiredEvidenceTypes: ['reproduction'], status: 'open', evidenceRefs: [] },
    ],
  },
  evidence: [{ id: `evidence.${id}`, revision: '1.0.0', title: 'Verified local REP replay', evidenceType: 'reproduction', status: 'accepted', readiness: 'computationally-reproduced', summary: 'Hashes matched.' }],
  hardGates: [{ passed, constraint: { id: 'constraint.minimum' } }],
  replay: { ok: true, inputHashMatches: true, resultHashMatches: true, reproductionStatus: 'verified-local-replay' },
  contradictions: [],
  limitations: ['No professional approval, product certification, regulatory approval, or deployment readiness is claimed.'],
});

const workspace = {
  milestone: 'Phase-1A — Minimal Challenge-Facing Product Loop',
  persistence: { kind: 'process-local-memory', durable: false, disclosure: 'Records reset when the local process restarts.' },
  challenge: {
    record: { kind: 'Challenge', id: 'sandbox-001', revision: '1.0.0', title: 'Sandbox 001 deterministic weighted sum', problemStatement: 'Evaluate a finite weighted sum.', status: 'open' },
    availableChallenges: [{ id: 'sandbox-001', revision: '1.0.0', title: 'Sandbox 001 deterministic weighted sum' }],
    requirements: [
      { role: 'hard-gate', record: { id: 'requirement.valid', revision: '1.0.0', statement: 'Inputs shall be valid.', obligation: 'shall' } },
      { role: 'objective', record: { id: 'requirement.maximize', revision: '1.0.0', statement: 'Maximize result.value.', obligation: 'should' } },
    ],
    constraints: [{ id: 'constraint.minimum', statement: 'Result at least 50.', parameter: 'result.value', operator: 'gte', value: 50 }],
    assumptions: [{ statement: 'Finite binary64 arithmetic.', material: true }],
    model: { id: 'model.sandbox-001', revision: '1.0.0', name: 'Sandbox analytical model', fidelity: { level: 'analytical', limitations: ['Synthetic only.'] }, solver: { id: 'solver.sandbox-001', revision: '1.0.0', contentHash: hashA }, datasetIdentities: [] },
    scenario: { id: 'scenario.sandbox-001.reference', revision: '1.0.0' },
    workflow: { id: 'workflow.sandbox-001', revision: '1.0.0' },
  },
  submissions: [
    { id: 'submission.reference', revision: '1.0.0', challengeRef: ref('Challenge', 'sandbox-001'), scenarioRef: ref('Scenario', 'scenario.sandbox-001.reference'), materialPayload: { values: [1, 2, 3] } },
    { id: 'submission.candidate', revision: '1.0.0', challengeRef: ref('Challenge', 'sandbox-001'), scenarioRef: ref('Scenario', 'scenario.sandbox-001.reference'), materialPayload: { values: [0, 1, 1] } },
  ],
  evaluations: [evaluationView('submission.reference', 53, hashA, true), evaluationView('submission.candidate', 23, hashB, true)],
  comparison: {
    explanation: { summary: 'The baseline performed better on result.value; the candidate delta is -30.', primaryReasons: ['submission.materialPayload.values[0] changed.'] },
    changedInputPaths: ['submission.id', 'submission.materialPayload.values[0]'], fixedInputPaths: ['compiledScenario.parameters.scale'],
    changedInputs: [{ path: 'submission.materialPayload.values[0]', baseline: 1, candidate: 0 }],
    resultDeltas: [{ resultPath: 'result.value', baseline: 53, candidate: 23, delta: -30 }],
    hardGateChanges: [{ changed: false }],
  },
} as never;

describe('renderApp', () => {
  it('renders the complete canonical Phase-1A projection and explicit non-claims', async () => {
    Object.defineProperty(globalThis, 'document', {
      value: { createElement: (tagName: string) => new TestElement(tagName) },
      configurable: true,
    });
    const client = {
      loadWorkspace: async () => workspace,
      createChallenge: async () => ({}),
      createSubmission: async () => ({}),
      evaluateSubmission: async () => ({} as never),
      exportReplay: async () => ({}),
    } as Phase1aClient;
    const { renderApp } = await import('./App');
    const root = new TestElement('div') as unknown as HTMLElement;
    await renderApp(root, client);

    const text = (root as unknown as TestElement).innerText;
    expect(text).toContain('Challenge → Submission → REP Evaluation → Evidence → Comparison');
    expect(text).toContain('Sandbox 001 deterministic weighted sum');
    expect(text).toContain('HARD GATE');
    expect(text).toContain('OBJECTIVE');
    expect(text).toContain('result = offset + scale');
    expect(text).toContain('source implementation');
    expect(text).toContain('Independent reproduction remains open');
    expect(text).toContain('No professional approval');
    expect(text).toContain('Export REP replay package');
    expect(text).toContain('Validate / import / run Submission');
    expect(text).toContain('process restarts');
  });
});
