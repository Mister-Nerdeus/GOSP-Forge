import {
  StemSystemProjectionSchema,
  StemMathDefinitionSchema,
  type CanonicalConstraint,
  type Challenge,
  type Interface,
  type Model,
  type Phase1aComparison,
  type Phase1aEvaluationView,
  type Requirement,
  type Scenario,
  type StemSystemProjection,
  type StemMathDefinition,
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

function valueAtPath(root: unknown, path: string): unknown {
  const segments = path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);
  return segments.reduce<unknown>((value, segment) => {
    if (value === null || typeof value !== 'object') return undefined;
    return (value as Record<string, unknown>)[segment];
  }, root);
}

function buildMathProjection(
  definitionInput: StemMathDefinition,
  referenceEvaluation: Phase1aEvaluationView,
) {
  const definition = StemMathDefinitionSchema.parse(definitionInput);
  const explanation = referenceEvaluation.evaluation.explainability;
  const quantities = definition.quantities.map((declaration) => {
    let value: unknown;
    if (declaration.source === 'material-input') {
      value = valueAtPath(referenceEvaluation.materialInput, declaration.sourcePath);
    } else if (declaration.source === 'evaluation-result') {
      value = valueAtPath(referenceEvaluation.evaluation, declaration.sourcePath);
    } else {
      value = explanation.intermediateValues.find(
        (item) => item.id === declaration.sourcePath,
      )?.value;
    }
    return {
      id: declaration.id,
      label: declaration.label,
      symbol: declaration.symbol,
      ...(value === undefined ? {} : { value }),
      unit: declaration.unit,
      role: declaration.role,
      status: declaration.status,
      sourcePath: declaration.sourcePath,
      resultPath: declaration.resultPath,
      availability: value === undefined ? ('unavailable' as const) : ('available' as const),
    };
  });
  const quantityById = new Map(quantities.map((quantity) => [quantity.id, quantity]));
  const equations = definition.equations.map((declaration) => {
    const recorded = explanation.equations.find(
      (equation) => equation.id === declaration.equationId,
    );
    if (!recorded) {
      throw new Error(
        `STEM math definition references missing recorded equation ${declaration.equationId}.`,
      );
    }
    const recordedSymbols = Object.keys(recorded.variables).sort();
    const declaredSymbols = Object.keys(declaration.variableBindings).sort();
    if (JSON.stringify(recordedSymbols) !== JSON.stringify(declaredSymbols)) {
      throw new Error(
        `STEM math bindings for ${declaration.equationId} must exactly match the recorded equation variables.`,
      );
    }
    const variableBindings = Object.entries(declaration.variableBindings).map(
      ([symbol, quantityId]) => ({ symbol, quantityId }),
    );
    return {
      id: recorded.id,
      expression: recorded.expression,
      description: recorded.description,
      variableBindings,
      substitutions: variableBindings.map(({ symbol, quantityId }) => {
        const quantity = quantityById.get(quantityId)!;
        return {
          quantityId,
          symbol,
          ...(quantity.value === undefined ? {} : { value: quantity.value }),
          unit: quantity.unit,
          availability: quantity.availability,
        };
      }),
      intermediateQuantityIds: declaration.intermediateQuantityIds,
      outputQuantityId: declaration.outputQuantityId,
      dimensionalStatus: declaration.dimensionalStatus,
      assumptions: declaration.assumptions,
      limitations: declaration.limitations,
    };
  });
  const dependencies = definition.equations.flatMap((equation) => {
    const inputs = Object.values(equation.variableBindings);
    if (!equation.intermediateQuantityIds.length) {
      return inputs.map((quantityId) => ({
        fromQuantityId: quantityId,
        toQuantityId: equation.outputQuantityId,
        equationId: equation.equationId,
      }));
    }
    return [
      ...inputs.flatMap((quantityId) =>
        equation.intermediateQuantityIds.map((intermediateId) => ({
          fromQuantityId: quantityId,
          toQuantityId: intermediateId,
          equationId: equation.equationId,
        })),
      ),
      ...equation.intermediateQuantityIds.map((intermediateId) => ({
        fromQuantityId: intermediateId,
        toQuantityId: equation.outputQuantityId,
        equationId: equation.equationId,
      })),
    ];
  });
  return {
    quantities,
    equations,
    dependencies,
    disclosure:
      'Values are resolved from the recorded REP material input, explainability intermediates, and canonical Evaluation result. The browser does not recalculate the result. Dimensional status is explicit and is not inferred from displayed units.',
  };
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
  mathDefinition: StemMathDefinition;
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
    mathDefinition,
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
    math: buildMathProjection(mathDefinition, referenceEvaluation),
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
