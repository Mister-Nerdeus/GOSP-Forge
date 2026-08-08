import { describe, expect, it } from 'vitest';
import {
  CanonicalObjectSchema,
  ControlledComparisonSchema,
  ProfessionalDispositionSchema,
  ProofObligationSchema,
} from '../index.js';

const hash = 'a'.repeat(64);
const provenance = { sources: [], method: 'authored' as const };
const base = (kind: string, id: string) => ({ kind, id, revision: '1.0.0', provenance });
const ref = (kind: string, id: string) => ({ kind, id, revision: '1.0.0' });
const artifact = (kind: 'runner' | 'solver' | 'schema' | 'contract' | 'dataset' | 'component-data', id: string) => ({
  kind,
  id,
  revision: '1.0.0',
  contentHash: hash,
});

const model = {
  ...base('Model', 'model.sandbox'),
  name: 'Sandbox model',
  modelType: 'analytical',
  fidelity: {
    level: 'analytical',
    calibrationStatus: 'not-applicable',
    limitations: ['Synthetic benchmark only.'],
  },
  solver: artifact('solver', 'solver.sandbox'),
  contractIdentities: [artifact('contract', 'contract.rep')],
  status: 'active',
};

const scenario = {
  ...base('Scenario', 'scenario.sandbox'),
  name: 'Sandbox scenario',
  parameters: { input: 2 },
  modelRef: ref('Model', 'model.sandbox'),
  status: 'controlled',
};

const workflow = {
  ...base('Workflow', 'workflow.sandbox'),
  name: 'Sandbox evaluation',
  steps: [{ id: 'evaluate', name: 'Evaluate', action: 'execute' }],
  status: 'active',
};

const challenge = {
  ...base('Challenge', 'challenge.sandbox-001'),
  title: 'Sandbox 001',
  problemStatement: 'Apply the published deterministic transformation.',
  evaluationModelRef: ref('Model', 'model.sandbox'),
  workflowRef: ref('Workflow', 'workflow.sandbox'),
  status: 'open',
};

const submission = {
  ...base('Submission', 'submission.sandbox-001.reference'),
  challengeRef: ref('Challenge', 'challenge.sandbox-001'),
  scenarioRef: ref('Scenario', 'scenario.sandbox'),
  materialPayload: { values: [1, 2, 3] },
  status: 'submitted',
};

const evaluation = {
  ...base('Evaluation', 'evaluation.sandbox-001.reference'),
  challengeRef: ref('Challenge', 'challenge.sandbox-001'),
  submissionRef: ref('Submission', 'submission.sandbox-001.reference'),
  scenarioRef: ref('Scenario', 'scenario.sandbox'),
  modelRef: ref('Model', 'model.sandbox'),
  workflowRef: ref('Workflow', 'workflow.sandbox'),
  runner: artifact('runner', 'runner.reference'),
  contractIdentities: [artifact('contract', 'contract.rep')],
  materialInputHash: hash,
  materialResultHash: hash,
  result: { value: 14 },
  explainability: {
    explanation: 'The result is a weighted sum.',
    modelInspection: {},
  },
  evidenceReadiness: 'computationally-reproduced',
  deploymentReadiness: 'concept-only',
  status: 'completed',
};

describe('canonical object union and truth model', () => {
  it('validates all 18 canonical object kinds through one union', () => {
    const objects = [
      {
        ...base('EngineeringProgram', 'program.sandbox'),
        title: 'Sandbox',
        summary: 'Protocol proof.',
        status: 'active',
      },
      {
        ...base('Requirement', 'requirement.repeatable'),
        statement: 'Results shall repeat.',
        obligation: 'shall',
        status: 'accepted',
      },
      {
        ...base('Constraint', 'constraint.finite'),
        statement: 'Inputs shall be finite.',
        constraintType: 'logical',
        status: 'active',
      },
      {
        ...base('Hazard', 'hazard.synthetic-only'),
        description: 'Synthetic output may be mistaken for real-world approval.',
        severity: 'serious',
        likelihood: 'possible',
        status: 'mitigating',
      },
      {
        ...base('SystemElement', 'element.transform'),
        name: 'Transform',
        elementType: 'logical',
        status: 'active',
      },
      {
        ...base('Interface', 'interface.input'),
        name: 'Input',
        interfaceType: 'data',
        from: ref('SystemElement', 'element.input'),
        to: ref('SystemElement', 'element.transform'),
        direction: 'unidirectional',
        status: 'active',
      },
      scenario,
      {
        ...base('Claim', 'claim.repeatable'),
        claimType: 'performance',
        statement: 'The reference result is deterministic.',
        subjectRefs: [ref('Challenge', 'challenge.sandbox-001')],
        proofObligations: [
          {
            id: 'obligation.replay',
            description: 'Replay in distinct environments.',
            requiredEvidenceTypes: ['reproduction'],
            status: 'open',
          },
        ],
        evidenceReadiness: 'source-backed',
        deploymentReadiness: 'concept-only',
        professionalDisposition: { status: 'not-required' },
        status: 'asserted',
      },
      {
        ...base('Evidence', 'evidence.reference-run'),
        evidenceType: 'simulation',
        title: 'Reference run',
        summary: 'Recorded synthetic evaluation.',
        readiness: 'source-backed',
        status: 'candidate',
      },
      model,
      workflow,
      challenge,
      submission,
      evaluation,
      {
        ...base('Review', 'review.reference'),
        target: ref('Evaluation', 'evaluation.sandbox-001.reference'),
        reviewerType: 'self',
        outcome: 'pending',
      },
      {
        ...base('TestArticle', 'test-article.synthetic'),
        name: 'Synthetic fixture',
        systemElementRefs: [ref('SystemElement', 'element.transform')],
        configurationHash: hash,
        configuration: { fixture: true },
        status: 'planned',
      },
      {
        ...base('ComponentRelease', 'release.transform'),
        componentRef: ref('SystemElement', 'element.transform'),
        releaseVersion: '1.0.0',
        releaseStatus: 'candidate',
      },
      {
        ...base('OperationalObservation', 'observation.synthetic'),
        subject: ref('SystemElement', 'element.transform'),
        observedAt: '2026-08-07T12:00:00-04:00',
        measurements: [{ id: 'result', value: 14 }],
      },
    ];

    expect(objects).toHaveLength(18);
    expect(objects.map((object) => CanonicalObjectSchema.parse(object).kind)).toHaveLength(18);
  });

  it('keeps proof and professional approval claims evidence-bound', () => {
    expect(
      ProofObligationSchema.safeParse({
        id: 'obligation',
        description: 'Reproduce the result.',
        requiredEvidenceTypes: ['reproduction'],
        status: 'satisfied',
      }).success,
    ).toBe(false);

    expect(
      ProfessionalDispositionSchema.safeParse({ status: 'approved', authority: 'Example authority' })
        .success,
    ).toBe(false);
  });

  it('represents controlled comparisons explicitly', () => {
    expect(
      ControlledComparisonSchema.parse({
        baselineEvaluationRef: ref('Evaluation', 'evaluation.baseline'),
        candidateEvaluationRef: ref('Evaluation', 'evaluation.candidate'),
        fixedInputPaths: ['scenario.environment'],
        changedInputPaths: ['scenario.parameters.input'],
        resultDeltas: [
          {
            resultPath: 'result.value',
            baseline: 10,
            candidate: 14,
            delta: 4,
            interpretation: 'Changing the input increased the weighted sum.',
          },
        ],
      }),
    ).toBeTruthy();
  });
});
