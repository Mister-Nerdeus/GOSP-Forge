import {
  StemSystemProjectionSchema,
  type CanonicalConstraint,
  type Challenge,
  type Model,
  type Phase1aEvaluationView,
  type Requirement,
  type Scenario,
  type StemSystemProjection,
  type Workflow,
} from '@gosp/contracts';

export function buildStemSystemProjection(input: {
  challenge: Challenge;
  scenario: Scenario;
  model: Model;
  workflow: Workflow;
  requirements: Array<{ record: Requirement; role: 'hard-gate' | 'objective' }>;
  constraints: CanonicalConstraint[];
  referenceEvaluation: Phase1aEvaluationView;
}): StemSystemProjection {
  const { challenge, scenario, model, workflow, requirements, constraints, referenceEvaluation } = input;
  const openProofObligations = referenceEvaluation.claim.proofObligations.filter(
    (item) => item.status === 'open',
  );

  return StemSystemProjectionSchema.parse({
    projectionVersion: '0.1.0',
    learningDepth: 'explore',
    problem: {
      title: challenge.title,
      statement: challenge.problemStatement,
    },
    boundary: {
      challenge: { id: challenge.id, revision: challenge.revision },
      scenario: { id: scenario.id, revision: scenario.revision },
      model: { id: model.id, revision: model.revision },
      workflow: { id: workflow.id, revision: workflow.revision },
    },
    systemElements: scenario.systemElementRefs.map((ref) => ({
      id: ref.id,
      revision: ref.revision,
    })),
    controlledConditions: {
      environment: scenario.environment,
      operatingConditions: scenario.operatingConditions,
      parameters: scenario.parameters,
    },
    assumptions: [
      ...scenario.assumptions,
      ...model.assumptions,
    ].filter(
      (assumption, index, all) =>
        all.findIndex((item) => item.id === assumption.id) === index,
    ),
    engineering: {
      requirements: requirements.map(({ record, role }) => ({
        id: record.id,
        statement: record.statement,
        role,
      })),
      constraints: constraints.map((constraint) => ({
        id: constraint.id,
        statement: constraint.statement,
        parameter: constraint.parameter,
        operator: constraint.operator,
        value: constraint.value,
        unit: constraint.unit,
      })),
    },
    model: {
      name: model.name,
      modelType: model.modelType,
      fidelityLevel: model.fidelity.level,
      calibrationStatus: model.fidelity.calibrationStatus,
      solver: {
        id: model.solver.id,
        revision: model.solver.revision,
      },
      limitations: model.fidelity.limitations,
    },
    workflow: workflow.steps.map((step) => ({
      id: step.id,
      name: step.name,
      action: step.action,
    })),
    evidenceStatus: {
      claim: referenceEvaluation.claim.statement,
      evidenceReadiness: referenceEvaluation.claim.evidenceReadiness,
      deploymentReadiness: referenceEvaluation.claim.deploymentReadiness,
      professionalDisposition: referenceEvaluation.claim.professionalDisposition.status,
      evidence: referenceEvaluation.evidence.map((record) => ({
        id: record.id,
        title: record.title,
        evidenceType: record.evidenceType,
        readiness: record.readiness,
        status: record.status,
      })),
      unresolvedProofObligations: openProofObligations.map((item) => ({
        id: item.id,
        description: item.description,
      })),
    },
    disclosure:
      'This STEM system view is a projection of canonical GOSP records. It introduces no browser-only physics, scoring, evidence, or readiness claims.',
  });
}
