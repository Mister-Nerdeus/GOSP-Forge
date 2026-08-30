import {
  StemSystemProjectionSchema,
  StemMathDefinitionSchema,
  StemMathProjectionSchema,
  StemScienceDefinitionSchema,
  StemEngineeringDefinitionSchema,
  StemEngineeringProjectionSchema,
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
  type StemMathProjection,
  type StemScienceDefinition,
  type StemEngineeringDefinition,
  StemTechnologyDefinitionSchema,
  StemTechnologyProjectionSchema,
  type StemTechnologyDefinition,
  StemHowWeKnowTraceSchema,
  StemLearningProjectionSchema,
  type StemLearningDepth,
  StemDynamicProjectionSchema,
  StemExperimentDefinitionSchema,
  StemExperimentProjectionSchema,
  type StemExperimentDefinition,
  StemHumanRelevanceDefinitionSchema,
  StemHumanRelevanceProjectionSchema,
  type StemHumanRelevanceDefinition,
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
  return StemMathProjectionSchema.parse({
    quantities,
    equations,
    dependencies,
    disclosure:
      'Values are resolved from the recorded REP material input, explainability intermediates, and canonical Evaluation result. The browser does not recalculate the result. Dimensional status is explicit and is not inferred from displayed units.',
  });
}

function buildScienceProjection(
  definitionInput: StemScienceDefinition,
  model: Model,
  math: StemMathProjection,
) {
  const definition = StemScienceDefinitionSchema.parse(definitionInput);
  const equationIds = new Set(math.equations.map((equation) => equation.id));
  const quantityIds = new Set(math.quantities.map((quantity) => quantity.id));
  for (const item of definition.items) {
    for (const equationId of item.equationIds) {
      if (!equationIds.has(equationId)) {
        throw new Error(
          `STEM science item ${item.id} references unknown equation ${equationId}.`,
        );
      }
    }
    for (const quantityId of item.quantityIds) {
      if (!quantityIds.has(quantityId)) {
        throw new Error(
          `STEM science item ${item.id} references unknown quantity ${quantityId}.`,
        );
      }
    }
  }
  return {
    treatment: definition.treatment,
    modelRef: { id: model.id, revision: model.revision },
    fidelityLevel: model.fidelity.level,
    items: definition.items,
    disclosures: definition.disclosures,
  };
}

function numericMargin(
  constraint: CanonicalConstraint,
  baselineActual: unknown,
  candidateActual: unknown,
) {
  if (
    typeof constraint.value !== 'number' ||
    typeof baselineActual !== 'number' ||
    typeof candidateActual !== 'number'
  ) {
    return {
      status: 'not-applicable' as const,
      unit: constraint.unit,
      explanation: 'This gate is not a numeric threshold, so a numeric margin is not applicable.',
    };
  }
  const threshold = constraint.value;
  const marginFor = (actual: number) => {
    if (constraint.operator === 'gte' || constraint.operator === 'gt') {
      return actual - threshold;
    }
    if (constraint.operator === 'lte' || constraint.operator === 'lt') {
      return threshold - actual;
    }
    return undefined;
  };
  const baseline = marginFor(baselineActual);
  const candidate = marginFor(candidateActual);
  if (baseline === undefined || candidate === undefined) {
    return {
      status: 'not-applicable' as const,
      unit: constraint.unit,
      explanation: 'The declared numeric operator has no directional margin rule.',
    };
  }
  return {
    status: 'available' as const,
    baseline,
    candidate,
    unit: constraint.unit,
    explanation: 'Positive margin is on the passing side of the declared modeled threshold.',
  };
}

function buildEngineeringProjection(input: {
  definitionInput: StemEngineeringDefinition;
  requirements: Array<{ record: Requirement; role: 'hard-gate' | 'objective' }>;
  baseline: Phase1aEvaluationView;
  candidate: Phase1aEvaluationView;
  comparison: Phase1aComparison;
  math: StemMathProjection;
}) {
  const { requirements, baseline, candidate, comparison, math } = input;
  const definition = StemEngineeringDefinitionSchema.parse(input.definitionInput);
  const quantityIds = new Set(math.quantities.map((quantity) => quantity.id));
  definition.designVariables.forEach((variable) => {
    if (!quantityIds.has(variable.quantityId)) {
      throw new Error(
        `STEM engineering variable ${variable.id} references unknown quantity ${variable.quantityId}.`,
      );
    }
  });
  const hardGates = baseline.hardGates.map((gate, index) => {
    const candidateGate = candidate.hardGates[index];
    if (!candidateGate || candidateGate.constraint.id !== gate.constraint.id) {
      throw new Error(`Comparable evaluations must expose matching hard gate ${gate.constraint.id}.`);
    }
    return {
      constraintId: gate.constraint.id,
      statement: gate.constraint.statement,
      baseline: { actual: gate.actual, passed: gate.passed },
      candidate: { actual: candidateGate.actual, passed: candidateGate.passed },
      changed: gate.passed !== candidateGate.passed,
      margin: numericMargin(gate.constraint, gate.actual, candidateGate.actual),
    };
  });
  const designVariables = definition.designVariables.map((variable) => {
    const changed = comparison.changedInputPaths.some(
      (path) => path === variable.inputPath || path.startsWith(`${variable.inputPath}[`) || path.startsWith(`${variable.inputPath}.`),
    );
    const baselineValue = valueAtPath(baseline.materialInput, variable.inputPath);
    const candidateValue = valueAtPath(candidate.materialInput, variable.inputPath);
    return {
      ...variable,
      changed,
      ...(baselineValue === undefined ? {} : { baseline: baselineValue }),
      ...(candidateValue === undefined ? {} : { candidate: candidateValue }),
    };
  });
  const objectives = definition.objectives.map((objective) => {
    if (objective.rule.kind === 'numeric-result') {
      const baselineValue = valueAtPath(baseline.evaluation, objective.rule.resultPath);
      const candidateValue = valueAtPath(candidate.evaluation, objective.rule.resultPath);
      if (typeof baselineValue !== 'number' || typeof candidateValue !== 'number') {
        return {
          id: objective.id,
          statement: objective.statement,
          assessmentKind: objective.rule.kind,
          preference: 'not-assessed' as const,
          explanation: `Numeric objective path ${objective.rule.resultPath} is unavailable.`,
        };
      }
      const delta = candidateValue - baselineValue;
      const candidatePreferred = objective.rule.direction === 'maximize' ? delta > 0 : delta < 0;
      const baselinePreferred = objective.rule.direction === 'maximize' ? delta < 0 : delta > 0;
      const preference = candidatePreferred
        ? ('candidate' as const)
        : baselinePreferred
          ? ('baseline' as const)
          : ('equivalent' as const);
      return {
        id: objective.id,
        statement: objective.statement,
        assessmentKind: objective.rule.kind,
        baseline: baselineValue,
        candidate: candidateValue,
        preference,
        explanation: `${objective.rule.direction} ${objective.rule.resultPath}; candidate delta ${delta}.`,
      };
    }
    const inputPath = objective.rule.inputPath;
    const baselineValue = valueAtPath(baseline.materialInput, inputPath);
    const candidateValue = valueAtPath(candidate.materialInput, inputPath);
    const changed = comparison.changedInputPaths.some(
      (path) => path === inputPath || path.startsWith(`${inputPath}[`) || path.startsWith(`${inputPath}.`),
    );
    return {
      id: objective.id,
      statement: objective.statement,
      assessmentKind: objective.rule.kind,
      ...(baselineValue === undefined ? {} : { baseline: baselineValue }),
      ...(candidateValue === undefined ? {} : { candidate: candidateValue }),
      preference: changed ? ('baseline' as const) : ('equivalent' as const),
      explanation: changed
        ? `The candidate changed preserved path ${inputPath}; this objective prefers the baseline absent new evidence.`
        : `The preserved path ${inputPath} did not change.`,
    };
  });
  const directional = new Set(
    objectives.map((objective) => objective.preference).filter(
      (preference) => preference === 'baseline' || preference === 'candidate',
    ),
  );
  const tradeoff = directional.has('baseline') && directional.has('candidate')
    ? {
        status: 'conflict' as const,
        decision: 'no-universal-winner' as const,
        explanation: 'Declared objectives prefer different revisions. Value judgment or additional evidence is required; no universal winner is asserted.',
      }
    : definition.objectives.length === 1
      ? {
          status: 'single-objective' as const,
          decision: directional.has('candidate') ? ('candidate-preferred' as const) : directional.has('baseline') ? ('baseline-preferred' as const) : ('equivalent' as const),
          explanation: 'Only one declared objective is assessed; this is not a universal multi-objective ranking.',
        }
      : {
          status: 'aligned' as const,
          decision: directional.has('candidate') ? ('candidate-preferred' as const) : directional.has('baseline') ? ('baseline-preferred' as const) : ('equivalent' as const),
          explanation: 'The assessed objectives do not prefer opposing revisions.',
        };
  return StemEngineeringProjectionSchema.parse({
    requirements: requirements.map(({ record, role }) => ({
      id: record.id,
      statement: record.statement,
      obligation: record.obligation,
      role,
      status: record.status,
      verificationMethod: record.verificationMethod,
    })),
    hardGates,
    unresolvedProofObligations: {
      baseline: comparison.unresolvedProofObligations.baseline.map(({ id, description }) => ({ id, description })),
      candidate: comparison.unresolvedProofObligations.candidate.map(({ id, description }) => ({ id, description })),
    },
    designVariables,
    hazards: definition.hazards.map((hazard) => ({
      id: hazard.id,
      description: hazard.description,
      severity: hazard.severity,
      likelihood: hazard.likelihood,
      status: hazard.status,
      mitigationStatus: hazard.mitigationRefs.length ? 'declared' : 'not-declared',
    })),
    objectives,
    tradeoff,
    revisionExplanation: {
      summary: comparison.explanation.summary,
      changedInputs: comparison.changedInputs.map(
        (change) => `${change.path}: ${String(change.baseline)} → ${String(change.candidate)}`,
      ),
      resultChanges: comparison.resultDeltas.map(
        (delta) => `${delta.resultPath}: ${delta.baseline} → ${delta.candidate} (Δ ${delta.delta})`,
      ),
    },
    disclosures: definition.disclosures,
  });
}

function buildTechnologyProjection(input: {
  definitionInput: StemTechnologyDefinition;
  systemElements: SystemElement[];
  requirements: Array<{ record: Requirement; role: 'hard-gate' | 'objective' }>;
  math: StemMathProjection;
}) {
  const definition = StemTechnologyDefinitionSchema.parse(input.definitionInput);
  const knownElements = new Set(input.systemElements.map((element) => element.id));
  const knownRequirements = new Set(input.requirements.map(({ record }) => record.id));
  const knownModelSteps = new Set(input.math.equations.map((equation) => equation.id));
  const knownMeasurements = new Set<string>();

  const linkResolved = (link: StemTechnologyDefinition['nodes'][number]['purposeLinks'][number]) => {
    if (link.declarationStatus === 'not-declared') return false;
    if (link.kind === 'requirement') return knownRequirements.has(link.targetId);
    if (link.kind === 'model-step') return knownModelSteps.has(link.targetId);
    if (link.kind === 'measurement') return knownMeasurements.has(link.targetId);
    return true;
  };

  for (const node of definition.nodes) {
    if (node.systemElementId && !knownElements.has(node.systemElementId)) {
      throw new Error(`Technology ${node.id} references unknown SystemElement ${node.systemElementId}.`);
    }
    for (const link of node.purposeLinks) {
      if (link.declarationStatus === 'declared' && !linkResolved(link)) {
        throw new Error(`Technology ${node.id} has unresolved declared ${link.kind} target ${link.targetId}.`);
      }
    }
  }

  return StemTechnologyProjectionSchema.parse({
    nodes: definition.nodes.map((node) => ({
      ...node,
      systemElementResolution: node.systemElementId ? 'resolved' : 'not-declared',
      purposeLinks: node.purposeLinks.map((link) => ({
        ...link,
        resolutionStatus: linkResolved(link) ? 'resolved' : 'not-declared',
      })),
    })),
    disclosures: definition.disclosures,
  });
}

function buildHowWeKnowTrace(input: {
  model: Model;
  math: StemMathProjection;
  evaluationView: Phase1aEvaluationView;
}) {
  const { model, math, evaluationView } = input;
  const { evaluation, claim, evidence, contradictions, materialInput, executionEvidence } = evaluationView;
  const output = math.quantities.find((quantity) => quantity.role === 'output' && quantity.resultPath);
  if (!output || output.value === undefined || !output.resultPath) {
    throw new Error('How-do-we-know trace requires one recorded consequential output quantity.');
  }

  const nodes: Array<{
    id: string;
    category: 'result' | 'equation' | 'model' | 'material-input' | 'source' | 'assumption' | 'implementation' | 'execution' | 'claim' | 'evidence' | 'contradiction' | 'readiness' | 'proof-obligation';
    label: string;
    status: 'resolved' | 'unavailable' | 'broken' | 'not-declared';
    detail: string;
  }> = [];
  const edges: Array<{ from: string; to: string; relationship: string; status: 'resolved' | 'broken' }> = [];
  const addNode = (node: typeof nodes[number]) => {
    if (!nodes.some((item) => item.id === node.id)) nodes.push(node);
  };
  const addEdge = (from: string, to: string, relationship: string, status: 'resolved' | 'broken' = 'resolved') =>
    edges.push({ from, to, relationship, status });

  addNode({ id: 'trace.result', category: 'result', label: output.label, status: 'resolved', detail: `${output.resultPath} = ${String(output.value)}${output.unit ? ` ${output.unit}` : ''}.` });
  addNode({ id: 'trace.model', category: 'model', label: model.name, status: 'resolved', detail: `${model.modelType}; fidelity ${model.fidelity.level}; calibration ${model.fidelity.calibrationStatus}.` });
  addNode({ id: 'trace.claim', category: 'claim', label: claim.statement, status: 'resolved', detail: `${claim.id}@${claim.revision}.` });
  addEdge('trace.claim', 'trace.result', 'asserts');

  for (const equation of math.equations.filter((item) => item.outputQuantityId === output.id)) {
    const equationId = `trace.equation.${equation.id}`;
    addNode({ id: equationId, category: 'equation', label: equation.expression, status: 'resolved', detail: `${equation.id}; dimensional status ${equation.dimensionalStatus}.` });
    addEdge('trace.result', equationId, 'calculated-by');
    addEdge(equationId, 'trace.model', 'represented-by');
    for (const binding of equation.variableBindings) {
      const quantity = math.quantities.find((item) => item.id === binding.quantityId);
      const inputId = `trace.input.${binding.quantityId}`;
      addNode({
        id: inputId,
        category: 'material-input',
        label: quantity?.label ?? binding.quantityId,
        status: quantity?.availability === 'available' ? 'resolved' : 'unavailable',
        detail: quantity ? `${quantity.sourcePath}; ${quantity.availability}.` : 'Referenced quantity is unavailable.',
      });
      addEdge(equationId, inputId, 'uses', quantity ? 'resolved' : 'broken');
    }
  }

  const assumptions = [
    ...materialInput.materialAssumptions,
    ...materialInput.compiledScenario.assumptions,
    ...materialInput.model.assumptions,
  ].filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index);
  const sourceRefs = new Set<string>();
  for (const assumption of assumptions) {
    const assumptionId = `trace.assumption.${assumption.id}`;
    addNode({ id: assumptionId, category: 'assumption', label: assumption.statement, status: 'resolved', detail: assumption.material ? 'Material assumption.' : 'Non-material assumption.' });
    addEdge('trace.model', assumptionId, 'assumes');
    for (const sourceRef of assumption.sourceRefs) {
      sourceRefs.add(sourceRef);
      const sourceId = `trace.source.${sourceRef}`;
      addNode({ id: sourceId, category: 'source', label: sourceRef, status: 'unavailable', detail: 'Source identity is referenced, but no source record is available in this local trace.' });
      addEdge(assumptionId, sourceId, 'cites', 'broken');
    }
  }
  if (!sourceRefs.size) {
    addNode({ id: 'trace.source.not-declared', category: 'source', label: 'Authoritative source', status: 'not-declared', detail: 'No authoritative source record is declared for this traced result.' });
    addEdge('trace.model', 'trace.source.not-declared', 'source-status');
  }

  addNode({ id: 'trace.implementation.runner', category: 'implementation', label: evaluation.runner.id, status: 'resolved', detail: `${evaluation.runner.revision} · ${evaluation.runner.contentHash}.` });
  addNode({ id: 'trace.implementation.solver', category: 'implementation', label: model.solver.id, status: 'resolved', detail: `${model.solver.revision} · ${model.solver.contentHash}.` });
  addNode({ id: 'trace.execution', category: 'execution', label: executionEvidence.executionId, status: evaluationView.replay.ok ? 'resolved' : 'broken', detail: `${executionEvidence.environment.os} · ${executionEvidence.environment.runtime} · exit ${executionEvidence.exitStatus}.` });
  addEdge('trace.model', 'trace.implementation.solver', 'implemented-by');
  addEdge('trace.implementation.solver', 'trace.implementation.runner', 'executed-by');
  addEdge('trace.implementation.runner', 'trace.execution', 'recorded-in', evaluationView.replay.ok ? 'resolved' : 'broken');

  const knownEvidence = new Set(evidence.map((item) => `${item.id}@${item.revision}`));
  for (const item of evidence) {
    const evidenceId = `trace.evidence.${item.id}@${item.revision}`;
    addNode({ id: evidenceId, category: 'evidence', label: item.title, status: item.status === 'accepted' ? 'resolved' : 'unavailable', detail: `${item.evidenceType}; ${item.readiness}; ${item.status}.` });
    addEdge(evidenceId, 'trace.claim', 'supports', item.supports.some((ref) => ref.id === claim.id && ref.revision === claim.revision) ? 'resolved' : 'broken');
  }
  for (const item of contradictions) {
    const contradictionId = `trace.contradiction.${item.id}@${item.revision}`;
    addNode({ id: contradictionId, category: 'contradiction', label: item.title, status: 'resolved', detail: `${item.evidenceType}; ${item.status}.` });
    addEdge(contradictionId, 'trace.claim', 'contradicts');
  }
  if (!contradictions.length) {
    addNode({ id: 'trace.contradiction.not-declared', category: 'contradiction', label: 'Contradicting evidence', status: 'not-declared', detail: 'No contradicting evidence is recorded for this claim.' });
    addEdge('trace.claim', 'trace.contradiction.not-declared', 'contradiction-status');
  }

  for (const obligation of claim.proofObligations) {
    const obligationId = `trace.obligation.${obligation.id}`;
    addNode({ id: obligationId, category: 'proof-obligation', label: obligation.description, status: obligation.status === 'open' ? 'unavailable' : 'resolved', detail: `${obligation.status}; requires ${obligation.requiredEvidenceTypes.join(', ')}.` });
    addEdge('trace.claim', obligationId, 'requires-proof');
    for (const ref of obligation.evidenceRefs) {
      const evidenceKey = `${ref.id}@${ref.revision}`;
      const evidenceId = `trace.evidence.${evidenceKey}`;
      if (!knownEvidence.has(evidenceKey)) {
        addNode({ id: evidenceId, category: 'evidence', label: evidenceKey, status: 'broken', detail: 'Referenced evidence record is absent from the evaluation view.' });
      }
      addEdge(obligationId, evidenceId, 'satisfied-by', knownEvidence.has(evidenceKey) ? 'resolved' : 'broken');
    }
  }

  addNode({ id: 'trace.readiness.evidence', category: 'readiness', label: `Evidence readiness: ${claim.evidenceReadiness}`, status: 'resolved', detail: 'Evidence readiness is assessed independently from model fidelity.' });
  addNode({ id: 'trace.readiness.deployment', category: 'readiness', label: `Deployment readiness: ${claim.deploymentReadiness}`, status: 'resolved', detail: 'Deployment readiness is a separate disposition.' });
  addNode({ id: 'trace.readiness.professional', category: 'readiness', label: `Professional disposition: ${claim.professionalDisposition.status}`, status: 'resolved', detail: 'Professional disposition is not inferred from a computation.' });
  addEdge('trace.claim', 'trace.readiness.evidence', 'has-evidence-readiness');
  addEdge('trace.claim', 'trace.readiness.deployment', 'has-deployment-readiness');
  addEdge('trace.claim', 'trace.readiness.professional', 'has-professional-disposition');

  return StemHowWeKnowTraceSchema.parse({
    consequentialResult: { resultPath: output.resultPath.replace(/^evaluation\./, ''), value: output.value, quantityId: output.id, claimId: claim.id },
    modelEvidenceLadder: {
      modelRepresentation: { modelId: model.id, fidelityLevel: model.fidelity.level, calibrationStatus: model.fidelity.calibrationStatus },
      evidenceStrength: { evidenceReadiness: claim.evidenceReadiness, acceptedEvidenceCount: evidence.filter((item) => item.status === 'accepted').length, contradictionCount: contradictions.length },
      deploymentReadiness: claim.deploymentReadiness,
      professionalDisposition: claim.professionalDisposition.status,
      independenceDisclosure: 'Local replay verifies recorded hashes in this environment; it is not independent external reproduction.',
    },
    materialIdentity: {
      inputHash: evaluation.materialInputHash,
      resultHash: evaluation.materialResultHash,
      contractIdentities: evaluation.contractIdentities.map(({ id, revision, contentHash }) => ({ id, revision, contentHash })),
      datasetIdentities: evaluation.datasetIdentities.map(({ id, revision, contentHash }) => ({ id, revision, contentHash })),
    },
    executionIdentity: {
      runner: { id: evaluation.runner.id, revision: evaluation.runner.revision, contentHash: evaluation.runner.contentHash },
      solver: { id: model.solver.id, revision: model.solver.revision, contentHash: model.solver.contentHash },
      environment: { os: executionEvidence.environment.os, runtime: executionEvidence.environment.runtime },
      replayStatus: evaluationView.replay.reproductionStatus,
    },
    nodes,
    edges,
    disclosures: [
      'Higher model fidelity is not stronger evidence, physical validation, deployment readiness, or professional approval.',
      'Local replay is not independent reproduction.',
      'Unavailable, not-declared, and broken trace states are preserved; they are not treated as resolved evidence.',
    ],
  });
}

const learningSections = ['system-map', 'human-relevance', 'math', 'science', 'engineering', 'technology', 'dynamic', 'experiment', 'how-we-know'] as const;

function buildLearningProjection(depth: StemLearningDepth, evaluationView: Phase1aEvaluationView) {
  const definitions: Array<{
    depth: StemLearningDepth;
    label: string;
    detailLevel: 'introductory' | 'guided' | 'technical' | 'verification' | 'full';
    includedSections: Array<typeof learningSections[number]>;
  }> = [
    { depth: 'explore', label: 'Explore', detailLevel: 'introductory', includedSections: ['system-map', 'human-relevance'] },
    { depth: 'measure', label: 'Measure', detailLevel: 'guided', includedSections: ['system-map', 'human-relevance', 'math'] },
    { depth: 'model', label: 'Model', detailLevel: 'technical', includedSections: ['system-map', 'human-relevance', 'math', 'science'] },
    { depth: 'solve', label: 'Solve', detailLevel: 'technical', includedSections: ['system-map', 'human-relevance', 'math', 'science', 'engineering', 'technology', 'dynamic'] },
    { depth: 'verify', label: 'Verify', detailLevel: 'verification', includedSections: [...learningSections] },
    { depth: 'research-professional', label: 'Research / Professional', detailLevel: 'full', includedSections: [...learningSections] },
  ];
  const manifests = definitions.map((definition) => ({
    ...definition,
    redactedSections: learningSections.filter((section) => !definition.includedSections.includes(section)),
    disclosure: `The ${definition.label} view changes explanatory inclusion only; it does not alter the canonical evaluation or its identities.`,
  }));
  const selectedManifest = manifests.find((manifest) => manifest.depth === depth)!;
  return StemLearningProjectionSchema.parse({
    selectedDepth: depth,
    canonicalIdentity: {
      evaluationId: evaluationView.evaluation.id,
      evaluationRevision: evaluationView.evaluation.revision,
      materialInputHash: evaluationView.evaluation.materialInputHash,
      materialResultHash: evaluationView.evaluation.materialResultHash,
    },
    selectedManifest,
    availableManifests: manifests,
    identityInvariant: true,
    disclosures: [
      'Learning depth changes presentation, not canonical inputs, material results, hashes, evidence, or readiness.',
      'A depth label is not grade alignment, curriculum accreditation, accessibility certification, or evidence of learner mastery.',
    ],
  });
}

function firstTimeSeries(value: unknown): unknown[] | undefined {
  if (Array.isArray(value)) {
    if (value.length && value.every((item) => item && typeof item === 'object' && ('time' in item || 'timestamp' in item))) return value;
    for (const item of value) {
      const found = firstTimeSeries(item);
      if (found) return found;
    }
  } else if (value && typeof value === 'object') {
    for (const item of Object.values(value)) {
      const found = firstTimeSeries(item);
      if (found) return found;
    }
  }
  return undefined;
}

function buildExperimentProjection(input: {
  definitionInput: StemExperimentDefinition;
  math: StemMathProjection;
  evaluationView: Phase1aEvaluationView;
}) {
  const definition = StemExperimentDefinitionSchema.parse(input.definitionInput);
  const quantity = input.math.quantities.find((item) => item.id === definition.predictionQuantityId);
  const predictionValue = typeof quantity?.value === 'number' ? quantity.value : undefined;
  const observation = definition.observations[0];
  const unitsMatch = observation && quantity?.unit === observation.unit
    && definition.testPlan.acceptanceCriterion.unit === observation.unit;
  const canCompare = predictionValue !== undefined && observation !== undefined && unitsMatch;
  const signed = canCompare ? observation.value - predictionValue : undefined;
  const absolute = signed === undefined ? undefined : Math.abs(signed);
  const criterionOutcome = absolute === undefined
    ? ('not-assessed' as const)
    : absolute <= definition.testPlan.acceptanceCriterion.threshold
      ? ('pass' as const)
      : ('fail' as const);
  const contradictionIds = input.evaluationView.contradictions.map((item) => `${item.id}@${item.revision}`);
  const preservesFailure = input.evaluationView.evaluation.status === 'failed'
    || contradictionIds.length > 0
    || criterionOutcome === 'fail';
  const readiness = input.evaluationView.claim.evidenceReadiness;

  return StemExperimentProjectionSchema.parse({
    definitionId: definition.id,
    title: definition.title,
    testPlan: definition.testPlan,
    prediction: {
      status: predictionValue === undefined ? 'unavailable' : 'available',
      quantityId: definition.predictionQuantityId,
      ...(predictionValue === undefined ? {} : { value: predictionValue }),
      ...(quantity?.unit ? { unit: quantity.unit } : {}),
      source: 'canonical-evaluation',
    },
    observation: observation
      ? { status: 'available', ...observation }
      : { status: 'not-declared' },
    discrepancy: canCompare
      ? {
          status: 'available',
          signed,
          absolute,
          ...(predictionValue === 0 ? {} : { relativePercent: (signed! / Math.abs(predictionValue)) * 100 }),
          unit: observation!.unit,
          criterionOutcome,
          failureState: criterionOutcome === 'fail' ? 'negative-result' : 'none',
        }
      : { status: 'not-assessed', criterionOutcome: 'not-assessed', failureState: 'not-assessed' },
    canonicalTruthBoundary: {
      evaluationStatus: input.evaluationView.evaluation.status,
      contradictionIds,
      preservedFailureState: preservesFailure ? 'preserved' : 'none-declared',
      evidenceReadinessBefore: readiness,
      evidenceReadinessAfter: readiness,
      readinessUpdate: 'not-applied',
    },
    disclosures: [
      ...definition.nonClaims,
      'Failed criteria, failed evaluations, and contradictions remain visible; this projection does not discard or repair them.',
      'Evidence and readiness change only through canonical Claim, Evidence, Review, and proof-obligation rules.',
    ],
  });
}

function buildHumanRelevanceProjection(input: {
  definitionInput: StemHumanRelevanceDefinition;
  math: StemMathProjection;
  evaluationView: Phase1aEvaluationView;
  comparison: Phase1aComparison;
}) {
  const definition = StemHumanRelevanceDefinitionSchema.parse(input.definitionInput);
  const evidenceRefs = input.evaluationView.evidence
    .filter((item) => item.status === 'accepted')
    .map((item) => `${item.id}@${item.revision}`);
  const uncertaintyText = input.evaluationView.evaluation.uncertainty
    .map((item) => 'rationale' in item ? item.rationale : JSON.stringify(item))
    .join(' ');
  const categories = definition.declarations.map((declaration) => {
    const measures = declaration.quantityIds.flatMap((quantityId) => {
      const quantity = input.math.quantities.find((item) => item.id === quantityId);
      return quantity?.availability === 'available' && quantity.value !== undefined
        ? [{ quantityId, value: quantity.value, ...(quantity.unit ? { unit: quantity.unit } : {}) }]
        : [];
    });
    if (declaration.status === 'unknown' || !measures.length || !evidenceRefs.length) {
      return {
        category: declaration.category,
        status: 'unknown' as const,
        outcomes: [],
        unknownReason: declaration.unknownReason ?? 'Required canonical quantities or accepted evidence are unavailable.',
      };
    }
    const measureText = measures.map((item) => `${item.quantityId} = ${String(item.value)}${item.unit ? ` ${item.unit}` : ''}`).join(', ');
    return {
      category: declaration.category,
      status: 'supported' as const,
      outcomes: declaration.interpretations.map((interpretation) => ({
        interpretation,
        statement: interpretation === 'benefit'
          ? `Within the recorded model boundary, ${measureText}; this modeled quantity is available for comparison.`
          : interpretation === 'tradeoff'
            ? `${input.comparison.explanation.summary} The result depends on the recorded changed inputs and is not a universal preference.`
            : `${uncertaintyText || 'No quantified uncertainty interval is recorded.'} The supported quantity remains model-dependent.`,
        measures,
        evidenceRefs,
        limitations: [
          'The linked evidence supports the recorded computation and local replay, not physical performance or broader social impact.',
          'A technical quantity does not decide stakeholder priorities.',
        ],
      })),
    };
  });
  return StemHumanRelevanceProjectionSchema.parse({
    categories,
    stakeholderValues: definition.stakeholderValues,
    technicalValueSeparation: true,
    disclosures: definition.nonClaims,
  });
}

const humanRelevanceCategories = ['cost','safety','energy','water','reliability','accessibility','maintenance','labor-skills','materials-waste','environment','infrastructure-community'] as const;

function undeclaredHumanRelevanceDefinition(): StemHumanRelevanceDefinition {
  return StemHumanRelevanceDefinitionSchema.parse({
    declarations: humanRelevanceCategories.map((category) => ({ category, status: 'unknown', quantityIds: [], interpretations: [], unknownReason: 'No human-relevance quantity and evidence declaration is registered.' })),
    stakeholderValues: [],
    nonClaims: ['This projection is not policy advice.','This projection is not a lifecycle assessment.','This projection is not environmental certification.','This projection is not an economic forecast.','This projection is not proof of social benefit.'],
  });
}

function buildDynamicProjection(input: {
  interfaces: Interface[];
  math: StemMathProjection;
  engineering: ReturnType<typeof buildEngineeringProjection>;
  evaluationView: Phase1aEvaluationView;
  comparison: Phase1aComparison;
}) {
  const { interfaces, math, engineering, evaluationView, comparison } = input;
  const resourceInterfaces = interfaces.filter((item) => item.interfaceType === 'resource');
  const electricalInterfaces = interfaces.filter((item) => item.interfaceType === 'power' || item.interfaceType === 'control');
  const energyQuantities = math.quantities.filter((item) => item.unit && /^(J|kJ|MJ|Wh|kWh)$/i.test(item.unit));
  const timeSeries = firstTimeSeries(evaluationView.evaluation.result);
  const uncertainty = evaluationView.evaluation.uncertainty;
  const sensitivity = evaluationView.evaluation.sensitivity;
  const available = (kind: 'flow' | 'vector-force' | 'energy' | 'electrical-control' | 'time-series' | 'uncertainty' | 'sensitivity', provenance: 'canonical-interface' | 'evaluation-result' | 'model-metadata' | 'recorded-series' | 'model-generated-series', description: string, data: unknown) => ({ kind, status: 'available' as const, provenance, description, data });
  const unavailable = (kind: 'flow' | 'vector-force' | 'energy' | 'electrical-control' | 'time-series' | 'uncertainty' | 'sensitivity', description: string) => ({ kind, status: 'unavailable' as const, provenance: 'not-declared' as const, description });

  return StemDynamicProjectionSchema.parse({
    allowedParameters: engineering.designVariables.flatMap((variable) => {
      const valueType = typeof variable.baseline;
      if (variable.changePolicy !== 'allowed-for-comparison' || variable.baseline === undefined || !['number', 'string', 'boolean'].includes(valueType)) return [];
      const quantity = math.quantities.find((item) => item.id === variable.quantityId);
      return [{ id: variable.id, label: quantity?.label ?? variable.id, inputPath: variable.inputPath, currentValue: variable.baseline, valueType, rationale: variable.rationale }];
    }),
    visualPrimitives: [
      resourceInterfaces.length
        ? available('flow', 'canonical-interface', 'Declared resource-flow interfaces; arrow direction comes from canonical Interface records.', resourceInterfaces.map(({ id, from, to, direction, unit }) => ({ id, from: from.id, to: to.id, direction, unit: unit ?? null })))
        : unavailable('flow', 'No canonical resource-flow Interface records are declared.'),
      unavailable('vector-force', 'No declared force or vector result is available.'),
      energyQuantities.length
        ? available('energy', 'evaluation-result', 'Declared energy quantities from the recorded projection.', energyQuantities.map(({ id, value, unit }) => ({ id, value: value ?? null, unit })))
        : unavailable('energy', 'No declared energy quantity is available.'),
      electricalInterfaces.length
        ? available('electrical-control', 'canonical-interface', 'Declared power or control interfaces.', electricalInterfaces.map(({ id, interfaceType, from, to, direction, unit }) => ({ id, interfaceType, from: from.id, to: to.id, direction, unit: unit ?? null })))
        : unavailable('electrical-control', 'No canonical power or control Interface records are declared.'),
      timeSeries
        ? available('time-series', 'model-generated-series', 'Time series recorded in the canonical Evaluation result.', timeSeries)
        : unavailable('time-series', 'No recorded or model-generated time series is available.'),
      uncertainty.length
        ? available('uncertainty', 'model-metadata', 'Uncertainty metadata recorded on the Evaluation.', uncertainty)
        : unavailable('uncertainty', 'No Evaluation uncertainty entries are declared.'),
      sensitivity.length
        ? available('sensitivity', 'evaluation-result', 'Sensitivity entries recorded on the Evaluation.', sensitivity)
        : unavailable('sensitivity', 'No Evaluation sensitivity entries are declared.'),
    ],
    causalHighlights: {
      status: comparison.changedInputs.length || comparison.resultDeltas.length ? 'available' : 'not-declared',
      changedInputs: comparison.changedInputs.map(({ path, baseline, candidate }) => ({
        path,
        baseline,
        candidate,
        baselineAvailability: baseline === undefined ? 'unavailable' : 'available',
        candidateAvailability: candidate === undefined ? 'unavailable' : 'available',
      })),
      changedResults: comparison.resultDeltas.map(({ resultPath, baseline, candidate, delta }) => ({ resultPath, baseline, candidate, delta })),
    },
    timePlayback: timeSeries
      ? { status: 'available', provenance: 'model-generated-series', frameCount: timeSeries.length, explanation: 'Playback frames come only from the recorded Evaluation result.' }
      : { status: 'unavailable', provenance: 'not-declared', frameCount: 0, explanation: 'Playback is disabled because no recorded or model-generated time series exists.' },
    disclosures: [
      'Animation is not measurement. Smooth motion is not solver fidelity. A browser transition is not an engineering calculation.',
      'Parameter changes create canonical Submissions and are evaluated by the registered server-side evaluator.',
      'Unavailable visualization primitives remain unavailable; the browser does not invent vectors, energy, uncertainty, sensitivity, or time frames.',
    ],
  });
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
  scienceDefinition: StemScienceDefinition;
  engineeringDefinition: StemEngineeringDefinition;
  technologyDefinition: StemTechnologyDefinition;
  experimentDefinition?: StemExperimentDefinition;
  humanRelevanceDefinition?: StemHumanRelevanceDefinition;
  candidateEvaluation: Phase1aEvaluationView;
  learningDepth?: StemLearningDepth;
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
    scienceDefinition,
    engineeringDefinition,
    technologyDefinition,
    experimentDefinition,
    humanRelevanceDefinition,
    candidateEvaluation,
    learningDepth = 'explore',
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
  const math = buildMathProjection(mathDefinition, referenceEvaluation);
  const engineeringDecision = buildEngineeringProjection({
    definitionInput: engineeringDefinition,
    requirements,
    baseline: referenceEvaluation,
    candidate: candidateEvaluation,
    comparison,
    math,
  });
  const technology = buildTechnologyProjection({
    definitionInput: technologyDefinition,
    systemElements,
    requirements,
    math,
  });
  const experiment = buildExperimentProjection({
    definitionInput: experimentDefinition ?? {
      id: 'experiment.not-declared',
      title: 'Experiment not declared',
      predictionQuantityId: math.quantities.find((item) => item.role === 'output')?.id ?? math.quantities[0]!.id,
      testPlan: {
        status: 'planned',
        controls: ['No experiment controls are declared.'],
        instruments: [{ id: 'instrument.not-declared', name: 'Instrument not declared', status: 'not-declared', measurementKind: 'not declared' }],
        procedure: ['Declare a test plan before recording observations.'],
        repetitions: { planned: 1, completed: 0 },
        uncertainty: { status: 'not-declared', basis: 'No observation uncertainty is declared.' },
        acceptanceCriterion: { kind: 'absolute-discrepancy-at-most', threshold: 0, unit: 'not-declared', falsificationStatement: 'No falsification criterion is declared.' },
      },
      observations: [],
      nonClaims: ['A test plan is not a completed test.', 'An undeclared observation is not a measurement.', 'One observation is not validation.'],
    },
    math,
    evaluationView: referenceEvaluation,
  });
  const humanRelevance = buildHumanRelevanceProjection({
    definitionInput: humanRelevanceDefinition ?? undeclaredHumanRelevanceDefinition(),
    math,
    evaluationView: referenceEvaluation,
    comparison,
  });

  return StemSystemProjectionSchema.parse({
    projectionVersion: '0.1.0',
    learningDepth,
    learningProjection: buildLearningProjection(learningDepth, referenceEvaluation),
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
      measurementStatus: experiment.observation.classification === 'measured' ? 'declared' : 'not-declared',
      measuredOutputs: experiment.observation.classification === 'measured' && experiment.observation.value !== undefined
        ? [{ path: `experiment.observation.${experiment.observation.id}`, value: experiment.observation.value, status: 'measured' }]
        : [],
    },
    math,
    science: buildScienceProjection(scienceDefinition, model, math),
    engineeringDecision,
    technology,
    howWeKnow: buildHowWeKnowTrace({ model, math, evaluationView: referenceEvaluation }),
    dynamic: buildDynamicProjection({
      interfaces,
      math,
      engineering: engineeringDecision,
      evaluationView: referenceEvaluation,
      comparison,
    }),
    experiment,
    humanRelevance,
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
