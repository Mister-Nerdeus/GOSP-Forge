import { describe, expect, it } from 'vitest';
import type { Phase1aClient } from './phase1a/client';

class TestElement {
  className = '';
  textContent = '';
  value = '';
  type = '';
  href = '';
  download = '';
  ariaLabel = '';
  children: TestElement[] = [];
  classList = { add: (...values: string[]) => { this.className = [this.className, ...values].filter(Boolean).join(' '); } };

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
  selection: {
    baseline: { id: 'submission.reference', revision: '1.0.0' },
    candidate: { id: 'submission.candidate', revision: '1.0.0' },
  },
  persistence: { kind: 'process-local-memory', durable: false, schemaVersion: '1', disclosure: 'Records reset when the local process restarts.' },
  evaluator: {
    id: 'evaluator.sandbox-001', title: 'Sandbox deterministic weighted sum', description: 'Synthetic reference evaluator.',
    challengeRef: ref('Challenge', 'sandbox-001'), modelRef: ref('Model', 'model.sandbox-001'),
    defaultSelection: { baseline: { id: 'submission.reference', revision: '1.0.0' }, candidate: { id: 'submission.candidate', revision: '1.0.0' } },
  },
  availableEvaluators: [],
  stemSystem: {
    projectionVersion: '0.1.0', learningDepth: 'research-professional',
    learningProjection: {
      selectedDepth: 'research-professional',
      canonicalIdentity: { evaluationId: 'evaluation.submission.reference', evaluationRevision: '0.1.0', materialInputHash: hashA, materialResultHash: hashB },
      selectedManifest: { depth: 'research-professional', label: 'Research / Professional', detailLevel: 'full', includedSections: ['system-map', 'human-relevance', 'math', 'science', 'engineering', 'technology', 'dynamic', 'experiment', 'how-we-know'], redactedSections: [], disclosure: 'Presentation only.' },
      availableManifests: [
        { depth: 'explore', label: 'Explore', detailLevel: 'introductory', includedSections: ['system-map'], redactedSections: ['math', 'science', 'engineering', 'technology', 'dynamic', 'experiment', 'how-we-know'], disclosure: 'Presentation only.' },
        { depth: 'measure', label: 'Measure', detailLevel: 'guided', includedSections: ['system-map', 'math'], redactedSections: ['science', 'engineering', 'technology', 'dynamic', 'experiment', 'how-we-know'], disclosure: 'Presentation only.' },
        { depth: 'model', label: 'Model', detailLevel: 'technical', includedSections: ['system-map', 'math', 'science'], redactedSections: ['engineering', 'technology', 'dynamic', 'experiment', 'how-we-know'], disclosure: 'Presentation only.' },
        { depth: 'solve', label: 'Solve', detailLevel: 'technical', includedSections: ['system-map', 'math', 'science', 'engineering', 'technology', 'dynamic'], redactedSections: ['experiment', 'how-we-know'], disclosure: 'Presentation only.' },
        { depth: 'verify', label: 'Verify', detailLevel: 'verification', includedSections: ['system-map', 'math', 'science', 'engineering', 'technology', 'dynamic', 'experiment', 'how-we-know'], redactedSections: [], disclosure: 'Presentation only.' },
        { depth: 'research-professional', label: 'Research / Professional', detailLevel: 'full', includedSections: ['system-map', 'math', 'science', 'engineering', 'technology', 'dynamic', 'experiment', 'how-we-know'], redactedSections: [], disclosure: 'Presentation only.' },
      ],
      identityInvariant: true,
      disclosures: ['Learning depth changes presentation, not canonical inputs, material results, hashes, evidence, or readiness.', 'A depth label is not grade alignment, curriculum accreditation, accessibility certification, or evidence of learner mastery.'],
    },
    problem: { title: 'Sandbox 001 deterministic weighted sum', statement: 'Evaluate a finite weighted sum.' },
    boundary: {
      challenge: { id: 'sandbox-001', revision: '1.0.0' },
      scenario: { id: 'scenario.sandbox-001.reference', revision: '1.0.0' },
      model: { id: 'model.sandbox-001', revision: '1.0.0' },
      workflow: { id: 'workflow.sandbox-001', revision: '1.0.0' },
    },
    systemElements: [],
    systemMap: {
      declarationStatus: 'not-declared', elements: [], interfaces: [],
      disclosures: [
        'The selected Scenario declares no SystemElement records; the projection does not infer parts or connections.',
        'No canonical Interface records are declared for this Scenario; no connections are inferred.',
      ],
    },
    variableRoles: {
      inputs: [{ path: 'submission.materialPayload.values[0]', value: 1, status: 'submitted' }],
      controlled: [{ path: 'compiledScenario.parameters.scale', value: 2, status: 'controlled' }],
      changeablePaths: ['submission.materialPayload.values[0]'],
      outputs: [{ path: 'evaluation.result.value', value: 53, status: 'calculated' }],
      measurementStatus: 'not-declared', measuredOutputs: [],
    },
    math: {
      quantities: [
        { id: 'sandbox.offset', label: 'Offset', symbol: 'offset', value: 7, role: 'input', status: 'submitted', sourcePath: 'submission.materialPayload.offset', availability: 'available' },
        { id: 'sandbox.result', label: 'Recorded result', symbol: 'result', value: 53, role: 'output', status: 'calculated', sourcePath: 'result.value', resultPath: 'evaluation.result.value', availability: 'available' },
      ],
      equations: [{
        id: 'sandbox-001.weighted-sum', expression: 'result = offset + scale * sum(values[i] * weights[i])', description: 'Deterministic weighted sum.',
        variableBindings: [{ symbol: 'offset', quantityId: 'sandbox.offset' }],
        substitutions: [{ quantityId: 'sandbox.offset', symbol: 'offset', value: 7, availability: 'available' }],
        intermediateQuantityIds: [], outputQuantityId: 'sandbox.result', dimensionalStatus: 'not-applicable',
        assumptions: ['Unitless benchmark.'], limitations: ['Not a physical model.'],
      }],
      dependencies: [{ fromQuantityId: 'sandbox.offset', toQuantityId: 'sandbox.result', equationId: 'sandbox-001.weighted-sum' }],
      disclosure: 'The browser does not recalculate the result.',
    },
    science: {
      treatment: 'synthetic-benchmark',
      modelRef: { id: 'model.sandbox-001', revision: '1.0.0' },
      fidelityLevel: 'analytical',
      items: [{
        id: 'sandbox.science.weighted-sum-model', title: 'Synthetic weighted-sum model relationship', classification: 'model-equation',
        statement: 'The benchmark is a deterministic equation.',
        applicability: { status: 'applicable', description: 'Sandbox only.' },
        limitations: ['Not a physical model.'], sourceStatus: 'model-declared', evidenceStatus: 'model-only',
        sourceRefs: [], evidenceRefs: [], equationIds: ['sandbox-001.weighted-sum'], quantityIds: ['sandbox.result'],
      }],
      disclosures: ['No natural governing principle or physical observation is asserted.'],
    },
    engineeringDecision: {
      requirements: [
        { id: 'requirement.valid', statement: 'Inputs shall be valid.', obligation: 'shall', role: 'hard-gate', status: 'accepted', verificationMethod: 'analysis' },
        { id: 'objective.sandbox.result', statement: 'Increase the recorded result.', obligation: 'should', role: 'objective', status: 'accepted', verificationMethod: 'analysis' },
      ],
      hardGates: [{
        constraintId: 'constraint.minimum', statement: 'Evaluation must complete.',
        baseline: { actual: 'completed', passed: true }, candidate: { actual: 'completed', passed: true }, changed: false,
        margin: { status: 'not-applicable', explanation: 'Logical gate has no numeric margin.' },
      }],
      unresolvedProofObligations: {
        baseline: [{ id: 'proof.physical-validation', description: 'Physical validation remains open.' }],
        candidate: [{ id: 'proof.physical-validation', description: 'Physical validation remains open.' }],
      },
      designVariables: [{
        id: 'sandbox.design.values', quantityId: 'sandbox.values', inputPath: 'submission.materialPayload.values',
        changePolicy: 'allowed-for-comparison', changed: true, baseline: [1, 2, 3], candidate: [0, 1, 1], rationale: 'Values may change.',
      }],
      hazards: [{ id: 'hazard.sandbox.physical-misinterpretation', description: 'Synthetic result may be misrepresented.', severity: 'minor', likelihood: 'possible', status: 'mitigating', mitigationStatus: 'not-declared' }],
      objectives: [{
        id: 'objective.sandbox.result', statement: 'Increase the recorded result.', assessmentKind: 'numeric-result',
        baseline: 53, candidate: 23, preference: 'baseline', explanation: 'Maximize result.value.',
      }],
      tradeoff: { status: 'single-objective', decision: 'baseline-preferred', explanation: 'Not a universal ranking.' },
      revisionExplanation: { summary: 'Baseline performed better.', changedInputs: ['values changed'], resultChanges: ['53 → 23'] },
      disclosures: ['Passing modeled gates is not safety approval.'],
    },
    technology: {
      nodes: [{
        id: 'technology.sandbox.solver', name: 'Sandbox reference solver', category: 'solver',
        purpose: 'Execute the recorded deterministic model.', declarationStatus: 'declared',
        systemElementResolution: 'not-declared',
        purposeLinks: [{ kind: 'model-step', targetId: 'sandbox-001.weighted-sum', explanation: 'Implements the declared relationship.', declarationStatus: 'declared', resolutionStatus: 'resolved' }],
        propertyEvidence: [{ property: 'implementation identity', representedValue: 'solver.sandbox-001@1.0.0', status: 'authored', sourceRefs: [] }],
        productProvenanceStatus: 'not-applicable', productSourceRefs: [], availabilityStatus: 'not-checked', compatibilityStatus: 'not-checked', safetyStatus: 'not-assessed',
      }],
      disclosures: ['Listing a technology does not establish availability, compatibility, safety, endorsement, or verification.'],
    },
    howWeKnow: {
      consequentialResult: { resultPath: 'result.value', value: 53, quantityId: 'sandbox.result', claimId: 'claim.submission.reference' },
      modelEvidenceLadder: {
        modelRepresentation: { modelId: 'model.sandbox-001', fidelityLevel: 'analytical', calibrationStatus: 'not-applicable' },
        evidenceStrength: { evidenceReadiness: 'computationally-reproduced', acceptedEvidenceCount: 1, contradictionCount: 0 },
        deploymentReadiness: 'concept-only', professionalDisposition: 'not-assessed',
        independenceDisclosure: 'Local replay verifies recorded hashes in this environment; it is not independent external reproduction.',
      },
      materialIdentity: { inputHash: hashA, resultHash: hashB, contractIdentities: [], datasetIdentities: [] },
      executionIdentity: {
        runner: { id: 'gosp.rep.reference-runner', revision: '0.1.0', contentHash: hashA },
        solver: { id: 'solver.sandbox-001', revision: '1.0.0', contentHash: hashA },
        environment: { os: 'win32', runtime: 'v22.16.0' }, replayStatus: 'verified-local-replay',
      },
      nodes: [
        { id: 'trace.result', category: 'result', label: 'Recorded result', status: 'resolved', detail: 'result.value = 53.' },
        { id: 'trace.source.not-declared', category: 'source', label: 'Authoritative source', status: 'not-declared', detail: 'No authoritative source record is declared.' },
        { id: 'trace.obligation.proof.physical-validation', category: 'proof-obligation', label: 'Physical validation remains open.', status: 'unavailable', detail: 'open; requires physical-test.' },
      ],
      edges: [{ from: 'trace.result', to: 'trace.source.not-declared', relationship: 'source-status', status: 'resolved' }],
      disclosures: ['Higher model fidelity is not stronger evidence, physical validation, deployment readiness, or professional approval.', 'Local replay is not independent reproduction.'],
    },
    dynamic: {
      allowedParameters: [{ id: 'sandbox.design.offset', label: 'Offset', inputPath: 'submission.materialPayload.offset', currentValue: 7, valueType: 'number', rationale: 'Allowed for comparison.' }],
      visualPrimitives: [
        { kind: 'flow', status: 'unavailable', provenance: 'not-declared', description: 'No flow.' },
        { kind: 'vector-force', status: 'unavailable', provenance: 'not-declared', description: 'No vectors.' },
        { kind: 'energy', status: 'unavailable', provenance: 'not-declared', description: 'No energy.' },
        { kind: 'electrical-control', status: 'unavailable', provenance: 'not-declared', description: 'No electrical path.' },
        { kind: 'time-series', status: 'unavailable', provenance: 'not-declared', description: 'No series.' },
        { kind: 'uncertainty', status: 'unavailable', provenance: 'not-declared', description: 'No uncertainty.' },
        { kind: 'sensitivity', status: 'available', provenance: 'evaluation-result', description: 'Recorded sensitivity.', data: [{ effect: 23 }] },
      ],
      causalHighlights: { status: 'available', changedInputs: [{ path: 'submission.materialPayload.values[0]', baseline: 1, candidate: 0, baselineAvailability: 'available', candidateAvailability: 'available' }], changedResults: [{ resultPath: 'result.value', baseline: 53, candidate: 23, delta: -30 }] },
      timePlayback: { status: 'unavailable', provenance: 'not-declared', frameCount: 0, explanation: 'Playback disabled.' },
      disclosures: ['Animation is not measurement. Smooth motion is not solver fidelity. A browser transition is not an engineering calculation.'],
    },
    experiment: {
      definitionId: 'experiment.sandbox.fixture', title: 'Teaching experiment fixture',
      testPlan: {
        status: 'planned', controls: ['Hold inputs fixed.'],
        instruments: [{ id: 'instrument.fixture', name: 'Fixture instrument', status: 'not-declared', measurementKind: 'synthetic output' }],
        procedure: ['Record the prediction.', 'Preserve the outcome.'], repetitions: { planned: 1, completed: 0 },
        uncertainty: { status: 'declared', value: 1, unit: 'unitless', basis: 'Teaching allowance.' },
        acceptanceCriterion: { kind: 'absolute-discrepancy-at-most', threshold: 2, unit: 'unitless', falsificationStatement: 'A discrepancy greater than 2 fails.' },
      },
      prediction: { status: 'available', quantityId: 'sandbox.result', value: 53, unit: 'unitless', source: 'canonical-evaluation' },
      observation: { status: 'available', id: 'observation.fixture', classification: 'synthetic', value: 50, unit: 'unitless', uncertainty: 1, repetitions: 1, source: 'Teaching fixture.' },
      discrepancy: { status: 'available', signed: -3, absolute: 3, relativePercent: -5.66, unit: 'unitless', criterionOutcome: 'fail', failureState: 'negative-result' },
      canonicalTruthBoundary: { evaluationStatus: 'completed', contradictionIds: [], preservedFailureState: 'preserved', evidenceReadinessBefore: 'computationally-reproduced', evidenceReadinessAfter: 'computationally-reproduced', readinessUpdate: 'not-applied' },
      disclosures: ['A test plan is not a completed test.', 'Synthetic observations are not measurements.', 'One observation is not validation.'],
    },
    humanRelevance: {
      categories: ['cost','safety','energy','water','reliability','accessibility','maintenance','labor-skills','materials-waste','environment','infrastructure-community'].map((category) => category === 'water' ? {
        category, status: 'supported', outcomes: [{ interpretation: 'benefit', statement: 'A recorded modeled quantity is available for comparison.', measures: [{ quantityId: 'sandbox.result', value: 53 }], evidenceRefs: ['evidence.fixture@1.0.0'], limitations: ['Modeled quantity only.', 'Stakeholder priorities remain separate.'] }],
      } : { category, status: 'unknown', outcomes: [], unknownReason: 'No canonical quantity and evidence are declared.' }),
      stakeholderValues: [{ stakeholder: 'learner', value: 'Understand uncertainty.', status: 'authored-preference' }],
      technicalValueSeparation: true,
      disclosures: ['This projection is not policy advice.','This projection is not a lifecycle assessment.','This projection is not environmental certification.','This projection is not an economic forecast.','This projection is not proof of social benefit.'],
    },
    controlledConditions: { environment: {}, operatingConditions: {}, parameters: { scale: 2 } },
    assumptions: [], engineering: { requirements: [], constraints: [] },
    model: { name: 'Sandbox analytical model', modelType: 'analytical', fidelityLevel: 'analytical', calibrationStatus: 'not-applicable', solver: { id: 'solver.sandbox-001', revision: '1.0.0' }, limitations: ['Synthetic only.'] },
    workflow: [{ id: 'evaluate', name: 'Evaluate weighted sum', action: 'execute' }],
    evidenceStatus: { claim: 'Synthetic result 53.', evidenceReadiness: 'computationally-reproduced', deploymentReadiness: 'concept-only', professionalDisposition: 'not-assessed', evidence: [], unresolvedProofObligations: [] },
    disclosure: 'This STEM system view is a projection of canonical GOSP records.',
  },
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
      loadChallenge: async () => workspace,
      createChallenge: async () => ({}),
      createSubmission: async () => ({}),
      evaluateSubmission: async () => ({} as never),
      exportReplay: async () => ({}),
      exportEvidencePackage: async () => ({}),
      validateEvidencePackage: async () => ({ ok: true }),
      exportArchive: async () => ({}),
      importArchive: async () => ({}),
      changeParameter: async () => workspace,
    } as Phase1aClient;
    const { renderApp } = await import('./App');
    const root = new TestElement('div') as unknown as HTMLElement;
    await renderApp(root, client);

    const text = (root as unknown as TestElement).innerText;
    expect(text).toContain('Challenge → Submission → REP Evaluation → Evidence → Comparison');
    expect(text).toContain('Learning Depth');
    expect(text).toContain('Learning depth changes presentation, not canonical inputs');
    expect(text).toContain('A depth label is not grade alignment');
    expect(text).toContain('Sandbox 001 deterministic weighted sum');
    expect(text).toContain('HARD GATE');
    expect(text).toContain('OBJECTIVE');
    expect(text).toContain('result = offset + scale');
    expect(text).toContain('source implementation');
    expect(text).toContain('Independent reproduction remains open');
    expect(text).toContain('No professional approval');
    expect(text).toContain('Export REP replay package');
    expect(text).toContain('Create and evaluate Submission');
    expect(text).toContain('Export portable evidence package');
    expect(text).toContain('Export workspace archive');
    expect(text).toContain('Process-local canonical candidates');
    expect(text).toContain('Choose comparison pair');
    expect(text).toContain('Run selected comparison');
    expect(text).toContain('submission.reference@1.0.0');
    expect(text).toContain('submission.candidate@1.0.0');
    expect(text).toContain('process restarts');
    expect(text).toContain('System Map');
    expect(text).toContain('not-declared canonical system declaration');
    expect(text).toContain('no connections are inferred');
    expect(text).toContain('Measured outputs not-declared');
    expect(text).toContain('Recorded quantities → declared relationship');
    expect(text).toContain('offset = 7 (unitless)');
    expect(text).toContain('Dimensional consistency not-applicable');
    expect(text).toContain('browser does not recalculate');
    expect(text).toContain('Show the Science');
    expect(text).toContain('synthetic-benchmark');
    expect(text).toContain('model equation · Synthetic weighted-sum model relationship');
    expect(text).toContain('No natural governing principle or physical observation');
    expect(text).toContain('does not prove that the model represents it adequately');
    expect(text).toContain('Show Engineering');
    expect(text).toContain('margin not-applicable');
    expect(text).toContain('Unresolved proof obligations — before optimization outcomes');
    expect(text).toContain('Synthetic result may be misrepresented');
    expect(text).toContain('SINGLE-OBJECTIVE · baseline-preferred');
    expect(text).toContain('Passing modeled gates is not safety approval');
    expect(text.indexOf('Unresolved proof obligations')).toBeLessThan(text.indexOf('Separate objective outcomes'));
    expect(text).toContain('Show the Technology');
    expect(text).toContain('Sandbox reference solver');
    expect(text).toContain('Product provenance not-applicable');
    expect(text).toContain('Availability not-checked');
    expect(text).toContain('Listing a technology does not establish availability');
    expect(text).toContain('Model Fidelity & How Do We Know?');
    expect(text).toContain('Model representation — not evidence strength');
    expect(text).toContain('Execution identity — separate from material identity');
    expect(text).toContain('Authoritative source not-declared');
    expect(text).toContain('Physical validation remains open');
    expect(text).toContain('Higher model fidelity is not stronger evidence');
    expect(text).toContain('Dynamic STEM');
    expect(text).toContain('Allowed parameter · Offset');
    expect(text).toContain('sensitivity · available');
    expect(text).toContain('time series · unavailable');
    expect(text).toContain('Simulation to Experiment');
    expect(text).toContain('NEGATIVE RESULT');
    expect(text).toContain('synthetic');
    expect(text).toContain('Evidence readiness computationally-reproduced → computationally-reproduced');
    expect(text).toContain('Synthetic observations are not measurements');
    expect(text).toContain('Human Relevance');
    expect(text).toContain('water · supported');
    expect(text).toContain('cost · unknown');
    expect(text).toContain('Stakeholder values — authored preferences, not technical results');
    expect(text).toContain('not policy advice');
    expect(text).toContain('Animation is not measurement');
  });
});
