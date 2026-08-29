import {
  StemSystemProjectionSchema,
  type CanonicalConstraint,
  type Challenge,
  type Interface,
  type Model,
  type Phase1aComparison,
  type Phase1aEvaluationView,
  type Requirement,
  type Scenario,
  type StemSystemProjection,
  type SystemElement,
  type Workflow,
} from '@gosp/contracts';

function exactRef(
  left: { id: string; revision: string },
  right: { id: string; revision: string },
) {
  return left.id === right.id && left.revision === right.revision;
}

function leaves(
  value: unknown,
  path: string,
  output: Array<{ path: string; value: unknown }> = [],
) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => leaves(item, `${path}[${index}]`, output));
  } else if (value !== null && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => leaves(item, `${path}.${key}`, output));
  } else if (value !== undefined) {
    output.push({ path, value });
  }
  return output;
}

export function buildStemSystemProjection(input: {
  challenge: Challenge;
  scenario: Scenario;
  model: Model;
  workflow: Workflow;
  requirements: Array<{ record: Requirement; role: 'hard-gate' | 'objective' }>;
  constraints: CanonicalConstraint[];
  systemElements: SystemElement[];
  interfaces: Interface[];
  referenceEvaluation: Phase1aEvaluationView;
  comparison: Phase1aComparison;
}): StemSystemProjection {
  const {
    challenge,
    scenario,
    model,
    workflow,
    requirements,
    constraints,
    systemElements,
    interfaces,
    referenceEvaluation,
    comparison,
  } = input;
  const openProofObligations = referenceEvaluation.claim.proofObligations.filter(
    (item) => item.status === 'open',
  );
  const resolvedElements = scenario.systemElementRefs.map((ref) => {
    const record = systemElements.find((item) => exactRef(item, ref));
    return record
      ? {
          id: ref.id,
          revision: ref.revision,
          name: record.name,
          elementType: record.elementType,
          status: record.status,
          resolutionStatus: 'resolved' as const,
        }
      : {
          id: ref.id,
          revision: ref.revision,
          name: 'Undeclared system element',
          elementType: 'unknown' as const,
          status: 'not-declared',
          resolutionStatus: 'unresolved' as const,
        };
  });
  const referenced = (ref: { id: string; revision: string }) =>
    scenario.systemElementRefs.some((item) => exactRef(item, ref));
  const projectedInterfaces = interfaces
    .filter((record) => referenced(record.from) || referenced(record.to))
    .map((record) => ({
      id: record.id,
      revision: record.revision,
      name: record.name,
      interfaceType: record.interfaceType,
      fromElementId: record.from.id,
      toElementId: record.to.id,
      direction: record.direction,
      unit: record.unit,
      status: record.status,
      resolutionStatus:
        referenced(record.from) && referenced(record.to)
          ? ('resolved' as const)
          : ('unresolved' as const),
    }));
  const unresolvedCount = resolvedElements.filter(
    (item) => item.resolutionStatus === 'unresolved',
  ).length;
  const declarationStatus = !scenario.systemElementRefs.length
    ? ('not-declared' as const)
    : unresolvedCount
      ? ('partially-declared' as const)
      : ('declared' as const);
  const mapDisclosures = [
    declarationStatus === 'not-declared'
      ? 'The selected Scenario declares no SystemElement records; the projection does not infer parts or connections.'
      : declarationStatus === 'partially-declared'
        ? `${unresolvedCount} referenced SystemElement record(s) could not be resolved; their details remain undeclared.`
        : 'All Scenario SystemElement references resolve to declared canonical records.',
    projectedInterfaces.length
      ? 'Connections shown are declared canonical Interface records.'
      : 'No canonical Interface records are declared for this Scenario; no connections are inferred.',
  ];
  const materialInput = referenceEvaluation.materialInput;
  const submittedInputs = leaves(
    materialInput.submission.materialPayload,
    'submission.materialPayload',
  ).map((item) => ({ ...item, status: 'submitted' as const }));
  const controlled = [
    ...leaves(scenario.environment, 'compiledScenario.environment'),
    ...leaves(scenario.operatingConditions, 'compiledScenario.operatingConditions'),
    ...leaves(scenario.parameters, 'compiledScenario.parameters'),
  ].map((item) => ({ ...item, status: 'controlled' as const }));
  const outputs = leaves(
    referenceEvaluation.evaluation.result,
    'evaluation.result',
  ).map((item) => ({ ...item, status: 'calculated' as const }));

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
    systemMap: {
      declarationStatus,
      elements: resolvedElements,
      interfaces: projectedInterfaces,
      disclosures: mapDisclosures,
    },
    variableRoles: {
      inputs: submittedInputs,
      controlled,
      changeablePaths: comparison.changedInputPaths.filter((path) =>
        path.startsWith('submission.materialPayload'),
      ),
      outputs,
      measurementStatus: 'not-declared',
      measuredOutputs: [],
    },
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
