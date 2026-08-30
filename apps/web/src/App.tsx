import type {
  Phase1aEvaluationView,
  Phase1aWorkspace,
  Phase1aWorkspaceSelection,
  StemLearningDepth,
  Submission,
} from '@gosp/contracts';
import { createPhase1aClient, type Phase1aClient } from './phase1a/client';

export async function renderApp(
  root: HTMLElement,
  client: Phase1aClient = createPhase1aClient(),
  selection?: Phase1aWorkspaceSelection,
) {
  root.replaceChildren(element('main', 'app-shell', 'Loading the local Phase-1A workspace…'));
  try {
    const workspace = await client.loadWorkspace(selection);
    root.replaceChildren(createShell(workspace, client, root));
  } catch (error) {
    root.replaceChildren(
      element(
        'main',
        'app-shell',
        `Unable to load the local Phase-1A API: ${error instanceof Error ? error.message : String(error)}`,
      ),
    );
  }
}

function createShell(workspace: Phase1aWorkspace, client: Phase1aClient, root: HTMLElement) {
  const app = document.createElement('main');
  app.className = 'app-shell';

  const included = new Set(workspace.stemSystem.learningProjection.selectedManifest.includedSections);
  app.append(
    hero(workspace),
    challengePanel(workspace, client, root),
    learningDepthPanel(workspace, client, root),
    ...(included.has('system-map') ? [systemMapPanel(workspace)] : []),
    ...(included.has('human-relevance') ? [humanRelevancePanel(workspace)] : []),
    ...(included.has('math') ? [mathPanel(workspace)] : []),
    ...(included.has('science') ? [sciencePanel(workspace)] : []),
    ...(included.has('engineering') ? [engineeringPanel(workspace)] : []),
    ...(workspace.advancedChallenge && ['solve', 'verify', 'research-professional'].includes(workspace.stemSystem.learningDepth)
      ? [advancedChallengePanel(workspace)] : []),
    ...(included.has('technology') ? [technologyPanel(workspace)] : []),
    ...(included.has('dynamic') ? [dynamicStemPanel(workspace, client, root)] : []),
    ...(included.has('experiment') ? [experimentPanel(workspace)] : []),
    ...(included.has('how-we-know') ? [howWeKnowPanel(workspace)] : []),
    submissionPanel(workspace),
    comparisonSelectionPanel(workspace, client, root),
    resultPanel(workspace),
    comparisonPanel(workspace),
    explainabilityPanel(workspace),
    evidencePanel(workspace),
    replayPanel(workspace, client),
    importPanel(workspace, client, root),
  );
  return app;
}

function advancedChallengePanel(workspace: Phase1aWorkspace) {
  const projection = workspace.advancedChallenge!;
  const objectiveById = new Map(projection.objectives.map((objective) => [objective.id, objective]));
  return panel('Advanced Challenge Tradeoffs', [
    element('p', 'claim', 'MODELED, PROCESS-LOCAL PARETO VIEW — eligibility is checked before objective comparison.'),
    subheading('Exact comparison boundary'),
    keyValues([
      ['Challenge', `${projection.boundary.challenge.id}@${projection.boundary.challenge.revision}`],
      ['Scenario', `${projection.boundary.scenario.id}@${projection.boundary.scenario.revision}`],
      ['Model', `${projection.boundary.model.id}@${projection.boundary.model.revision}`],
      ['Candidate count', String(projection.candidates.length)],
      ['Excluded stored candidates', String(projection.excludedCandidates.length)],
      ['Non-dominated count', String(projection.nonDominatedSet.length)],
    ]),
    subheading('Separate numeric objectives'),
    cardList(projection.objectives.map((objective) => ({
      title: objective.statement,
      meta: `${objective.direction} · ${objective.id}`,
      body: `${objective.resultPath} · ${objective.source}`,
    }))),
    ...(projection.excludedObjectives.length ? [
      subheading('Excluded objectives'),
      cardList(projection.excludedObjectives.map((objective) => ({
        title: objective.id,
        meta: objective.reason,
        body: objective.explanation,
      }))),
    ] : []),
    ...(projection.excludedCandidates.length ? [
      subheading('Excluded stored candidates'),
      cardList(projection.excludedCandidates.map((candidate) => ({
        title: `${candidate.submission.id}@${candidate.submission.revision}`,
        meta: candidate.reason,
        body: candidate.explanation,
      }))),
    ] : []),
    subheading('Candidate eligibility and outcomes'),
    ...projection.candidates.map((candidate) => layer(
      `${candidate.submission.id}@${candidate.submission.revision} · ${candidate.paretoStatus}`,
      [
        keyValues([
          ['Eligibility', candidate.eligibility],
          ['Evaluation', `${candidate.evaluation.id}@${candidate.evaluation.revision}`],
          ['Failed gates', candidate.failedGateIds.join(', ') || 'none'],
          ['Dominated by', candidate.dominatedBy.map((item) => `${item.submissionId}@${item.submissionRevision}`).join(', ') || 'none'],
        ]),
        cardList(candidate.objectiveOutcomes.map((outcome) => ({
          title: objectiveById.get(outcome.objectiveId)?.statement ?? outcome.objectiveId,
          meta: `${outcome.status} · ${outcome.objectiveId}`,
          body: outcome.status === 'available' ? String(outcome.value) : 'No finite recorded value is available.',
        }))),
      ],
    )),
    subheading('Non-dominated set'),
    bullets(projection.nonDominatedSet.length
      ? projection.nonDominatedSet.map((candidate) => `${candidate.submissionId}@${candidate.submissionRevision}`)
      : ['No eligible non-dominated candidate is available.']),
    bullets(projection.disclosures),
  ], 'wide');
}

function learningDepthPanel(workspace: Phase1aWorkspace, client: Phase1aClient, root: HTMLElement) {
  const learning = workspace.stemSystem.learningProjection;
  const selector = document.createElement('select');
  selector.className = 'select-control';
  selector.ariaLabel = 'Learning depth';
  for (const manifest of learning.availableManifests) {
    const option = document.createElement('option');
    option.value = manifest.depth;
    option.textContent = `${manifest.label} · ${manifest.detailLevel}`;
    option.selected = manifest.depth === learning.selectedDepth;
    selector.append(option);
  }
  const status = element('p', 'form-status', learning.selectedManifest.disclosure);
  selector.addEventListener('change', () => {
    status.textContent = 'Loading learning-depth projection…';
    void client.loadWorkspace(workspace.selection, selector.value as StemLearningDepth)
      .then((next) => root.replaceChildren(createShell(next, client, root)))
      .catch((error) => {
        status.className = 'form-status error';
        status.textContent = error instanceof Error ? error.message : String(error);
      });
  });
  return panel('Learning Depth', [
    selector,
    status,
    keyValues([
      ['Evaluation', `${learning.canonicalIdentity.evaluationId}@${learning.canonicalIdentity.evaluationRevision}`],
      ['Material input hash', learning.canonicalIdentity.materialInputHash],
      ['Material result hash', learning.canonicalIdentity.materialResultHash],
      ['Included STEM sections', learning.selectedManifest.includedSections.join(', ') || 'none'],
      ['Redacted STEM sections', learning.selectedManifest.redactedSections.join(', ') || 'none'],
    ]),
    bullets(learning.disclosures),
  ], 'wide');
}

function engineeringPanel(workspace: Phase1aWorkspace) {
  const engineering = workspace.stemSystem.engineeringDecision;
  return panel('Show Engineering', [
    element(
      'p',
      'claim',
      engineering.hardGates.every((gate) => gate.baseline.passed && gate.candidate.passed)
        ? 'Modeled hard gates pass for both recorded revisions.'
        : 'MODELED HARD GATE FAILURE — review before objective outcomes.',
    ),
    subheading('Requirements, hard gates, and objectives'),
    cardList(engineering.requirements.map((requirement) => ({
      title: requirement.statement,
      meta: `${requirement.role.toUpperCase()} · ${requirement.obligation} · ${requirement.status} · ${requirement.id}`,
      body: requirement.verificationMethod ? `Verification method: ${requirement.verificationMethod}` : undefined,
    }))),
    subheading('Gate state and margins'),
    cardList(engineering.hardGates.map((gate) => ({
      title: `${gate.constraintId} · ${gate.baseline.passed && gate.candidate.passed ? 'PASS' : 'FAIL'}`,
      meta: `baseline ${String(gate.baseline.actual)} / ${gate.baseline.passed ? 'pass' : 'fail'} · candidate ${String(gate.candidate.actual)} / ${gate.candidate.passed ? 'pass' : 'fail'} · margin ${gate.margin.status}`,
      body: `${gate.statement} ${gate.margin.explanation}`,
    }))),
    subheading('Unresolved proof obligations — before optimization outcomes'),
    cardList([
      ...engineering.unresolvedProofObligations.baseline.map((item) => ({
        title: `BASELINE · ${item.description}`,
        meta: item.id,
      })),
      ...engineering.unresolvedProofObligations.candidate.map((item) => ({
        title: `CANDIDATE · ${item.description}`,
        meta: item.id,
      })),
    ]),
    subheading('Design variables'),
    cardList(engineering.designVariables.map((variable) => ({
      title: `${variable.id} · ${variable.changed ? 'changed' : 'fixed'}`,
      meta: `${variable.changePolicy} · ${variable.quantityId}`,
      body: `${variable.inputPath}: ${displayRecordedValue(variable.baseline)} → ${displayRecordedValue(variable.candidate)}. ${variable.rationale}`,
    }))),
    subheading('Hazards'),
    cardList(engineering.hazards.map((hazard) => ({
      title: hazard.description,
      meta: `${hazard.severity} severity · ${hazard.likelihood} likelihood · ${hazard.status} · mitigation ${hazard.mitigationStatus}`,
      body: hazard.id,
    }))),
    subheading('Separate objective outcomes'),
    cardList(engineering.objectives.map((objective) => ({
      title: objective.statement,
      meta: `${objective.preference.toUpperCase()} · ${objective.assessmentKind}`,
      body: `${displayRecordedValue(objective.baseline)} → ${displayRecordedValue(objective.candidate)}. ${objective.explanation}`,
    }))),
    element(
      'p',
      'comparison-summary',
      `${engineering.tradeoff.status.toUpperCase()} · ${engineering.tradeoff.decision}: ${engineering.tradeoff.explanation}`,
    ),
    subheading('Why the revision differs'),
    element('p', '', engineering.revisionExplanation.summary),
    bullets([
      ...engineering.revisionExplanation.changedInputs,
      ...engineering.revisionExplanation.resultChanges,
    ]),
    bullets(engineering.disclosures),
  ], 'wide');
}

function technologyPanel(workspace: Phase1aWorkspace) {
  const technology = workspace.stemSystem.technology;
  return panel('Show the Technology', [
    element('p', 'claim', 'Technology roles are linked to declared engineering or model purposes; missing declarations remain visible.'),
    ...technology.nodes.map((node) => layer(`${node.category} · ${node.name}`, [
      element('p', '', node.purpose),
      keyValues([
        ['Declaration', node.declarationStatus],
        ['System element', node.systemElementId ? `${node.systemElementId} · ${node.systemElementResolution}` : 'not-declared'],
        ['Product provenance', node.productProvenanceStatus],
        ['Availability', node.availabilityStatus],
        ['Compatibility', node.compatibilityStatus],
        ['Safety', node.safetyStatus],
      ]),
      subheading('Purpose links'),
      cardList(node.purposeLinks.map((link) => ({
        title: `${link.kind.replaceAll('-', ' ')} · ${link.targetId}`,
        meta: `${link.declarationStatus} · ${link.resolutionStatus}`,
        body: link.explanation,
      }))),
      subheading('Represented properties and evidence'),
      node.propertyEvidence.length
        ? cardList(node.propertyEvidence.map((property) => ({
            title: `${property.property}: ${property.representedValue}`,
            meta: `${property.status} · sources ${property.sourceRefs.length ? property.sourceRefs.join(', ') : 'none declared'}`,
          })))
        : element('p', 'muted', 'No represented product property or supporting source is declared.'),
    ])),
    bullets(technology.disclosures),
  ], 'wide');
}

function howWeKnowPanel(workspace: Phase1aWorkspace) {
  const trace = workspace.stemSystem.howWeKnow;
  const ladder = trace.modelEvidenceLadder;
  return panel('Model Fidelity & How Do We Know?', [
    element('p', 'claim', `${trace.consequentialResult.resultPath} = ${displayRecordedValue(trace.consequentialResult.value)}`),
    subheading('Model representation — not evidence strength'),
    keyValues([
      ['Model', ladder.modelRepresentation.modelId],
      ['Fidelity', ladder.modelRepresentation.fidelityLevel],
      ['Calibration', ladder.modelRepresentation.calibrationStatus],
    ]),
    subheading('Evidence, deployment, and professional dispositions'),
    keyValues([
      ['Evidence readiness', ladder.evidenceStrength.evidenceReadiness],
      ['Accepted evidence', String(ladder.evidenceStrength.acceptedEvidenceCount)],
      ['Contradictions', String(ladder.evidenceStrength.contradictionCount)],
      ['Deployment readiness', ladder.deploymentReadiness],
      ['Professional disposition', ladder.professionalDisposition],
    ]),
    element('p', 'muted', ladder.independenceDisclosure),
    subheading('Material identity'),
    keyValues([
      ['Input hash', trace.materialIdentity.inputHash],
      ['Result hash', trace.materialIdentity.resultHash],
      ['Contracts', trace.materialIdentity.contractIdentities.length ? trace.materialIdentity.contractIdentities.map((item) => `${item.id}@${item.revision}`).join(', ') : 'none'],
      ['Datasets', trace.materialIdentity.datasetIdentities.length ? trace.materialIdentity.datasetIdentities.map((item) => `${item.id}@${item.revision}`).join(', ') : 'none'],
    ]),
    subheading('Execution identity — separate from material identity'),
    keyValues([
      ['Runner', `${trace.executionIdentity.runner.id}@${trace.executionIdentity.runner.revision}`],
      ['Solver', `${trace.executionIdentity.solver.id}@${trace.executionIdentity.solver.revision}`],
      ['Environment', `${trace.executionIdentity.environment.os} · ${trace.executionIdentity.environment.runtime}`],
      ['Replay', trace.executionIdentity.replayStatus],
    ]),
    subheading('Result-to-proof trace'),
    cardList(trace.nodes.map((node) => ({
      title: `${node.category.replaceAll('-', ' ')} · ${node.label}`,
      meta: `${node.status} · ${node.id}`,
      body: node.detail,
    }))),
    subheading('Trace links'),
    cardList(trace.edges.map((edge) => ({
      title: `${edge.from} → ${edge.to}`,
      meta: `${edge.relationship} · ${edge.status}`,
    }))),
    bullets(trace.disclosures),
  ], 'wide');
}

function experimentPanel(workspace: Phase1aWorkspace) {
  const experiment = workspace.stemSystem.experiment;
  const observation = experiment.observation;
  const discrepancy = experiment.discrepancy;
  return panel('Simulation to Experiment', [
    element('p', 'claim', `${experiment.title} · ${discrepancy.failureState.replaceAll('-', ' ').toUpperCase()}`),
    subheading('Test plan'),
    keyValues([
      ['Plan status', experiment.testPlan.status],
      ['Repetitions', `${experiment.testPlan.repetitions.completed} completed / ${experiment.testPlan.repetitions.planned} planned`],
      ['Uncertainty', experiment.testPlan.uncertainty.status === 'declared' ? `±${experiment.testPlan.uncertainty.value} ${experiment.testPlan.uncertainty.unit}` : 'not declared'],
      ['Acceptance', `absolute discrepancy ≤ ${experiment.testPlan.acceptanceCriterion.threshold} ${experiment.testPlan.acceptanceCriterion.unit}`],
    ]),
    subheading('Controls'),
    bullets(experiment.testPlan.controls),
    subheading('Instruments'),
    cardList(experiment.testPlan.instruments.map((instrument) => ({ title: instrument.name, meta: `${instrument.status} · ${instrument.measurementKind} · ${instrument.id}` }))),
    subheading('Procedure'),
    bullets(experiment.testPlan.procedure),
    subheading('Prediction versus observation'),
    keyValues([
      ['Prediction', experiment.prediction.status === 'available' ? `${experiment.prediction.value} ${experiment.prediction.unit ?? ''}` : 'unavailable'],
      ['Observation', observation.status === 'available' ? `${observation.value} ${observation.unit ?? ''} · ${observation.classification}` : 'not declared'],
      ['Observation uncertainty', observation.uncertainty === undefined ? 'not declared' : `±${observation.uncertainty} ${observation.unit ?? ''}`],
      ['Signed discrepancy', discrepancy.signed === undefined ? 'not assessed' : `${discrepancy.signed} ${discrepancy.unit ?? ''}`],
      ['Criterion outcome', discrepancy.criterionOutcome],
      ['Failure state', discrepancy.failureState],
    ]),
    element('p', 'comparison-summary', experiment.testPlan.acceptanceCriterion.falsificationStatement),
    subheading('Canonical truth boundary'),
    keyValues([
      ['Evaluation status', experiment.canonicalTruthBoundary.evaluationStatus],
      ['Preserved failure', experiment.canonicalTruthBoundary.preservedFailureState],
      ['Contradictions', experiment.canonicalTruthBoundary.contradictionIds.length ? experiment.canonicalTruthBoundary.contradictionIds.join(', ') : 'none declared'],
      ['Evidence readiness', `${experiment.canonicalTruthBoundary.evidenceReadinessBefore} → ${experiment.canonicalTruthBoundary.evidenceReadinessAfter}`],
      ['Readiness update', experiment.canonicalTruthBoundary.readinessUpdate],
    ]),
    bullets(experiment.disclosures),
  ], 'wide');
}

function humanRelevancePanel(workspace: Phase1aWorkspace) {
  const relevance = workspace.stemSystem.humanRelevance;
  return panel('Human Relevance', [
    element('p', 'claim', 'Technical quantities and evidence are shown separately from authored stakeholder priorities.'),
    ...relevance.categories.map((category) => layer(`${category.category.replaceAll('-', ' / ')} · ${category.status}`, category.status === 'unknown'
      ? [element('p', 'muted', category.unknownReason ?? 'Unknown.')]
      : category.outcomes.map((outcome) => elementContainer('article', 'result-card', [
          element('strong', '', outcome.interpretation.toUpperCase()),
          element('p', '', outcome.statement),
          keyValues([
            ['Measures', outcome.measures.map((item) => `${item.quantityId} = ${displayRecordedValue(item.value)}${item.unit ? ` ${item.unit}` : ''}`).join(', ')],
            ['Evidence', outcome.evidenceRefs.join(', ')],
          ]),
          bullets(outcome.limitations),
        ])))),
    subheading('Stakeholder values — authored preferences, not technical results'),
    cardList(relevance.stakeholderValues.map((item) => ({ title: item.stakeholder, meta: item.status, body: item.value }))),
    bullets(relevance.disclosures),
  ], 'wide');
}

function dynamicStemPanel(workspace: Phase1aWorkspace, client: Phase1aClient, root: HTMLElement) {
  const dynamic = workspace.stemSystem.dynamic;
  const controls = dynamic.allowedParameters.map((parameter) => {
    const input = document.createElement('input');
    input.type = parameter.valueType === 'number' ? 'number' : 'text';
    input.value = String(parameter.currentValue);
    const status = element('p', 'form-status', parameter.rationale);
    const button = actionButton('Evaluate parameter change', async () => {
      await runFormAction(status, async () => {
        const value = parameter.valueType === 'number'
          ? Number(input.value)
          : parameter.valueType === 'boolean'
            ? input.value === 'true'
            : input.value;
        const next = await client.changeParameter({
          baseline: workspace.selection.baseline,
          parameterId: parameter.id,
          value,
          learningDepth: workspace.stemSystem.learningDepth,
        });
        root.replaceChildren(createShell(next, client, root));
      }, 'Canonical Submission created and evaluated through the registered server-side evaluator.');
    });
    return layer(`Allowed parameter · ${parameter.label}`, [
      keyValues([['Parameter ID', parameter.id], ['Material path', parameter.inputPath], ['Current value', String(parameter.currentValue)]]),
      labeledControl('New value', input),
      button,
      status,
    ]);
  });
  return panel('Dynamic STEM', [
    element('p', 'claim', 'Parameter changes create canonical Submissions and server-side evaluations.'),
    ...(controls.length ? controls : [element('p', 'muted', 'No parameter is allowed for canonical comparison.')]),
    subheading('Visualization primitives'),
    cardList(dynamic.visualPrimitives.map((primitive) => ({
      title: `${primitive.kind.replaceAll('-', ' ')} · ${primitive.status}`,
      meta: primitive.provenance,
      body: `${primitive.description}${primitive.data === undefined ? '' : ` Data: ${JSON.stringify(primitive.data)}`}`,
    }))),
    subheading('Canonical before / after highlights'),
    cardList([
      ...dynamic.causalHighlights.changedInputs.map((change) => ({
        title: change.path,
        meta: 'material input',
        body: `${displayRecordedValue(change.baseline)} → ${displayRecordedValue(change.candidate)}`,
      })),
      ...dynamic.causalHighlights.changedResults.map((change) => ({
        title: change.resultPath,
        meta: 'recorded result',
        body: `${change.baseline} → ${change.candidate} (Δ ${change.delta})`,
      })),
    ]),
    subheading('Time playback'),
    keyValues([
      ['Status', dynamic.timePlayback.status],
      ['Provenance', dynamic.timePlayback.provenance],
      ['Frames', String(dynamic.timePlayback.frameCount)],
    ]),
    element('p', 'muted', dynamic.timePlayback.explanation),
    bullets(dynamic.disclosures),
  ], 'wide');
}

function sciencePanel(workspace: Phase1aWorkspace) {
  const science = workspace.stemSystem.science;
  return panel('Show the Science', [
    keyValues([
      ['Treatment', science.treatment],
      ['Model', `${science.modelRef.id}@${science.modelRef.revision}`],
      ['Model fidelity', science.fidelityLevel],
    ]),
    ...science.items.map((item) => layer(
      `${item.classification.replaceAll('-', ' ')} · ${item.title}`,
      [
        element('p', '', item.statement),
        keyValues([
          ['Applicability', `${item.applicability.status} · ${item.applicability.description}`],
          ['Source status', item.sourceStatus],
          ['Evidence status', item.evidenceStatus],
          ['Equation links', item.equationIds.length ? item.equationIds.join(', ') : 'none declared'],
          ['Quantity links', item.quantityIds.length ? item.quantityIds.join(', ') : 'none declared'],
        ]),
        subheading('Limitations'),
        bullets(item.limitations),
      ],
    )),
    bullets(science.disclosures),
    element(
      'p',
      'muted',
      'Declaring a scientific principle does not prove that the model represents it adequately or that the result is physically validated.',
    ),
  ], 'wide');
}

function displayRecordedValue(value: unknown) {
  if (value === undefined) return 'unavailable';
  if (value !== null && typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function mathPanel(workspace: Phase1aWorkspace) {
  const math = workspace.stemSystem.math;
  return panel('Show the Math', [
    element(
      'p',
      'claim',
      'Recorded quantities → declared relationship → recorded intermediate → canonical result',
    ),
    subheading('Quantities and units'),
    cardList(math.quantities.map((quantity) => ({
      title: `${quantity.symbol} = ${displayRecordedValue(quantity.value)} ${quantity.unit ?? '(unitless)'}`,
      meta: `${quantity.role.toUpperCase()} · ${quantity.status} · ${quantity.availability}`,
      body: `${quantity.label} · ${quantity.sourcePath}${quantity.resultPath ? ` · ${quantity.resultPath}` : ''}`,
    }))),
    ...math.equations.map((equation) => layer(`Relationship · ${equation.id}`, [
      keyValues([
        ['Expression', equation.expression],
        ['Description', equation.description],
        ['Dimensional consistency', equation.dimensionalStatus],
        ['Output quantity', equation.outputQuantityId],
      ]),
      subheading('Recorded substitutions'),
      bullets(equation.substitutions.map((substitution) =>
        `${substitution.symbol} = ${displayRecordedValue(substitution.value)} ${substitution.unit ?? '(unitless)'} · ${substitution.availability}`,
      )),
      subheading('Assumptions'),
      bullets(equation.assumptions.length ? equation.assumptions : ['none declared']),
      subheading('Limitations'),
      bullets(equation.limitations),
    ])),
    details(
      'Input-to-result dependency links',
      bullets(math.dependencies.map((dependency) =>
        `${dependency.fromQuantityId} → ${dependency.toQuantityId} · ${dependency.equationId}`,
      )),
    ),
    element('p', 'muted', math.disclosure),
    element(
      'p',
      'muted',
      'Displaying an equation does not establish scientific completeness, calibration, dimensional correctness unless checked, or physical validity.',
    ),
  ], 'wide');
}

function systemMapPanel(workspace: Phase1aWorkspace) {
  const projection = workspace.stemSystem;
  const map = projection.systemMap;
  const nodes = document.createElement('div');
  nodes.className = 'system-node-grid';
  if (map.elements.length) {
    for (const item of map.elements) {
      nodes.append(
        elementContainer('article', `system-node ${item.resolutionStatus}`, [
          element('strong', '', item.name),
          element('span', 'meta', `${item.elementType} · ${item.id}@${item.revision}`),
          element('span', 'meta', `${item.status} · ${item.resolutionStatus}`),
        ]),
      );
    }
  } else {
    nodes.append(element('p', 'muted', 'No SystemElement records are declared for this Scenario.'));
  }
  const connections = map.interfaces.length
    ? cardList(
        map.interfaces.map((item) => ({
          title: `${item.fromElementId} → ${item.toElementId}`,
          meta: `${item.interfaceType.toUpperCase()} · ${item.direction} · ${item.unit ?? 'unit not declared'}`,
          body: item.name,
        })),
      )
    : element('p', 'muted', 'No canonical interfaces are declared; no connections are inferred.');
  const variableSummary = keyValues([
    ['Submitted inputs', String(projection.variableRoles.inputs.length)],
    ['Controlled values', String(projection.variableRoles.controlled.length)],
    ['Changeable paths', String(projection.variableRoles.changeablePaths.length)],
    ['Calculated outputs', String(projection.variableRoles.outputs.length)],
    ['Measured outputs', projection.variableRoles.measurementStatus],
  ]);
  return panel('System Map', [
    element('p', 'claim', `${map.declarationStatus} canonical system declaration`),
    keyValues([
      ['Challenge', `${projection.boundary.challenge.id}@${projection.boundary.challenge.revision}`],
      ['Scenario', `${projection.boundary.scenario.id}@${projection.boundary.scenario.revision}`],
      ['Model', `${projection.boundary.model.id}@${projection.boundary.model.revision}`],
    ]),
    nodes,
    subheading('Declared interactions / flows'),
    connections,
    subheading('Input, control, change, and output roles'),
    variableSummary,
    details(
      'Inspect declared paths',
      bullets([
        ...projection.variableRoles.inputs.map((item) => `INPUT · ${item.path}`),
        ...projection.variableRoles.controlled.map((item) => `CONTROLLED · ${item.path}`),
        ...projection.variableRoles.changeablePaths.map((path) => `CHANGEABLE · ${path}`),
        ...projection.variableRoles.outputs.map((item) => `CALCULATED OUTPUT · ${item.path}`),
      ]),
    ),
    bullets(map.disclosures),
    element('p', 'muted', projection.disclosure),
  ], 'wide');
}

function hero(workspace: Phase1aWorkspace) {
  const wrapper = document.createElement('header');
  wrapper.className = 'hero wide';
  wrapper.append(
    element('span', 'eyebrow', 'GOSP Forge · local application slice'),
    element('h1', '', workspace.milestone),
    element(
      'p',
      'lede',
      `${workspace.evaluator.title}: canonical Challenge → Submission → REP Evaluation → Evidence → Comparison, with no parallel scoring or hashing in the browser.`,
    ),
    element('p', 'persistence-notice', workspace.persistence.disclosure),
  );
  return wrapper;
}

function challengePanel(
  workspace: Phase1aWorkspace,
  client: Phase1aClient,
  root: HTMLElement,
) {
  const { record, requirements, constraints, assumptions, model, scenario } = workspace.challenge;
  const selector = document.createElement('select');
  selector.className = 'select-control';
  selector.ariaLabel = 'Challenge';
  for (const challenge of workspace.challenge.availableChallenges) {
    const option = document.createElement('option');
    option.value = `${challenge.id}@${challenge.revision}`;
    option.textContent = `${challenge.title} · ${challenge.id}@${challenge.revision}`;
    selector.append(option);
    if (challenge.id === record.id && challenge.revision === record.revision) {
      option.selected = true;
    }
  }
  const switchStatus = element('p', 'form-status', workspace.evaluator.description);
  selector.addEventListener('change', () => {
    const [id, revision] = selector.value.split('@');
    if (!id || !revision) return;
    switchStatus.textContent = 'Loading evaluator workspace…';
    void client
      .loadChallenge(id, revision, workspace.stemSystem.learningDepth)
      .then((next) => root.replaceChildren(createShell(next, client, root)))
      .catch((error) => {
        switchStatus.className = 'form-status error';
        switchStatus.textContent = error instanceof Error ? error.message : String(error);
      });
  });
  return panel('Challenge', [
    selector,
    switchStatus,
    keyValues([
      ['Identity', `${record.id}@${record.revision}`],
      ['Status', record.status],
      ['Problem', record.problemStatement],
      ['Model expectation', `${model.name} · ${model.fidelity.level}`],
      ['Solver', `${model.solver.id}@${model.solver.revision}`],
      ['Scenario', `${scenario.id}@${scenario.revision}`],
    ]),
    subheading('Requirements & objectives'),
    cardList(
      requirements.map(({ record: requirement, role }) => ({
        title: requirement.statement,
        meta: `${role === 'hard-gate' ? 'HARD GATE' : 'OBJECTIVE'} · ${requirement.obligation} · ${requirement.id}@${requirement.revision}`,
      })),
    ),
    subheading('Constraints'),
    cardList(
      constraints.map((constraint) => ({
        title: constraint.statement,
        meta: `${constraint.parameter} ${constraint.operator} ${String(constraint.value)} · ${constraint.unit ?? 'unitless'}`,
      })),
    ),
    subheading('Material assumptions'),
    bullets(assumptions.map((assumption) => `${assumption.statement}${assumption.unit ? ` (${assumption.unit})` : ''}`)),
  ], 'wide');
}

function submissionPanel(workspace: Phase1aWorkspace) {
  return panel('Submissions', [
    element(
      'p',
      'muted',
      'Process-local canonical candidates target the same exact Challenge and controlled Scenario. Validation failures are returned without repairing material input.',
    ),
    cardList(
      workspace.submissions.map((submission) => ({
        title: `${submission.id}@${submission.revision}`,
        meta: `Challenge ${submission.challengeRef.id}@${submission.challengeRef.revision} · Scenario ${submission.scenarioRef.id}@${submission.scenarioRef.revision}`,
        body: JSON.stringify(submission.materialPayload),
      })),
    ),
  ], 'wide');
}

function comparisonSelectionPanel(
  workspace: Phase1aWorkspace,
  client: Phase1aClient,
  root: HTMLElement,
) {
  const baseline = submissionSelect(workspace.submissions, workspace.selection.baseline);
  const candidate = submissionSelect(workspace.submissions, workspace.selection.candidate);
  const status = element(
    'p',
    'form-status',
    'Choose two process-local submissions evaluated under the same controlled boundary.',
  );
  const button = actionButton('Run selected comparison', async () => {
    await runFormAction(status, async () => {
      const selection = {
        baseline: selectedSubmission(workspace.submissions, baseline),
        candidate: selectedSubmission(workspace.submissions, candidate),
      };
      if (
        selection.baseline.id === selection.candidate.id &&
        selection.baseline.revision === selection.candidate.revision
      ) {
        throw new Error('Select two different submissions.');
      }
      await refreshWorkspace(root, client, selection, workspace.stemSystem.learningDepth);
    }, 'Comparison updated.');
  });
  return panel('Choose comparison pair', [
    element(
      'p',
      'muted',
      'The API reruns both selected submissions through REP and rejects comparisons that cross fixed Challenge, Scenario, Model, solver, runner, contract, or dataset boundaries.',
    ),
    elementContainer('div', 'selection-grid', [
      labeledControl('Baseline', baseline),
      labeledControl('Candidate', candidate),
    ]),
    button,
    status,
  ], 'wide');
}

function resultPanel(workspace: Phase1aWorkspace) {
  const grid = document.createElement('div');
  grid.className = 'result-grid';
  for (const view of workspace.evaluations) grid.append(evaluationCard(view));
  return panel('REP results', [grid], 'wide');
}

function evaluationCard(view: Phase1aEvaluationView) {
  const resultMetrics = numericLeaves(view.evaluation.result).slice(0, 4);
  const card = document.createElement('article');
  card.className = 'result-card';
  card.append(
    element('span', `status ${view.hardGates.every((gate) => gate.passed) ? 'pass' : 'fail'}`, view.hardGates.every((gate) => gate.passed) ? 'HARD GATES PASS' : 'HARD GATE FAIL'),
    element('h3', '', view.evaluation.submissionRef.id),
    ...resultMetrics.map(([path, value]) => metric(path, String(value))),
    codeRow('Material input', view.evaluation.materialInputHash),
    codeRow('Material result', view.evaluation.materialResultHash),
    codeRow('Evaluation', `${view.evaluation.id}@${view.evaluation.revision}`),
  );
  return card;
}

function numericLeaves(value: unknown, path = 'result', output: Array<[string, number]> = []) {
  if (typeof value === 'number') {
    output.push([path, value]);
    return output;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => numericLeaves(item, `${path}[${index}]`, output));
    return output;
  }
  if (value && typeof value === 'object') {
    Object.entries(value as Record<string, unknown>).forEach(([key, item]) =>
      numericLeaves(item, `${path}.${key}`, output),
    );
  }
  return output;
}

function comparisonPanel(workspace: Phase1aWorkspace) {
  const comparison = workspace.comparison;
  return panel('Controlled comparison', [
    keyValues([
      ['Baseline', `${workspace.selection.baseline.id}@${workspace.selection.baseline.revision}`],
      ['Candidate', `${workspace.selection.candidate.id}@${workspace.selection.candidate.revision}`],
    ]),
    element('p', 'comparison-summary', comparison.explanation.summary),
    statStrip([
      ['Changed paths', String(comparison.changedInputPaths.length)],
      ['Fixed paths', String(comparison.fixedInputPaths.length)],
      ['Gate changed', comparison.hardGateChanges.some((gate) => gate.changed) ? 'yes' : 'no'],
    ]),
    subheading('Changed material inputs'),
    cardList(
      comparison.changedInputs.map((change) => ({
        title: change.path,
        meta: `${String(change.baseline)} → ${String(change.candidate)}`,
      })),
    ),
    subheading('Result deltas'),
    cardList(
      comparison.resultDeltas.map((delta) => ({
        title: `${delta.resultPath}: ${delta.baseline} → ${delta.candidate}`,
        meta: `Δ ${delta.delta}`,
      })),
    ),
    details('Fixed material paths', bullets(comparison.fixedInputPaths)),
  ], 'wide');
}

function explainabilityPanel(workspace: Phase1aWorkspace) {
  const view = workspace.evaluations[0]!;
  const explanation = view.evaluation.explainability;
  const model = workspace.challenge.model;
  return panel('Explainable Engineering', [
    layer('1 · Explain', [
      element('p', '', workspace.comparison.explanation.summary),
      bullets(workspace.comparison.explanation.primaryReasons),
    ]),
    layer('3 · Inspect the Model', [
      keyValues([
        ['Model', `${model.id}@${model.revision}`],
        ['Fidelity', model.fidelity.level],
        ['Solver/source implementation', `${model.solver.id}@${model.solver.revision} · ${model.solver.contentHash}`],
        ['Runner/source implementation', `${view.evaluation.runner.id}@${view.evaluation.runner.revision} · ${view.evaluation.runner.contentHash}`],
        ['Datasets', model.datasetIdentities.length ? model.datasetIdentities.map((item) => `${item.id}@${item.revision}`).join(', ') : 'none'],
        ['Numerical settings', JSON.stringify(explanation.modelInspection.numericalSettings)],
        ['Boundary conditions', explanation.modelInspection.boundaryConditions.length ? JSON.stringify(explanation.modelInspection.boundaryConditions) : 'none declared'],
        ['Calibration', explanation.modelInspection.calibration ?? 'not exposed'],
      ]),
      bullets(model.fidelity.limitations),
    ]),
    layer('4 · Inspect the Evidence', [
      keyValues([
        ['Claim', `${view.claim.id}@${view.claim.revision}`],
        ['Evidence readiness', view.claim.evidenceReadiness],
        ['Deployment readiness', view.claim.deploymentReadiness],
        ['Professional disposition', view.claim.professionalDisposition.status],
        ['Replay', view.replay.reproductionStatus],
      ]),
    ]),
  ], 'wide');
}

function evidencePanel(workspace: Phase1aWorkspace) {
  const view = workspace.evaluations[0]!;
  const open = view.claim.proofObligations.filter((obligation) => obligation.status === 'open');
  return panel('Evidence, readiness & non-claims', [
    element('p', 'claim', view.claim.statement),
    cardList(
      view.evidence.map((evidence) => ({
        title: `${evidence.title} · ${evidence.evidenceType}`,
        meta: `${evidence.id}@${evidence.revision} · ${evidence.status} · ${evidence.readiness}`,
        body: evidence.summary,
      })),
    ),
    subheading('Unresolved proof obligations'),
    cardList(open.map((obligation) => ({ title: obligation.description, meta: obligation.requiredEvidenceTypes.join(', ') }))),
    subheading('Contradictions'),
    element('p', 'muted', view.contradictions.length ? `${view.contradictions.length} recorded` : 'None recorded for this synthetic run.'),
    subheading('Limitations / non-claims'),
    bullets(view.limitations),
  ], 'wide');
}

function replayPanel(workspace: Phase1aWorkspace, client: Phase1aClient) {
  const body = document.createElement('div');
  body.className = 'replay-grid';
  for (const view of workspace.evaluations) {
    const item = document.createElement('article');
    item.className = 'replay-card';
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Export REP replay package';
    button.addEventListener('click', async () => {
      const record = await client.exportReplay(view.evaluation.submissionRef.id, view.evaluation.submissionRef.revision);
      downloadJson(`${view.evaluation.submissionRef.id}.replay.json`, record);
    });
    const evidenceButton = document.createElement('button');
    evidenceButton.type = 'button';
    evidenceButton.textContent = 'Export portable evidence package';
    evidenceButton.addEventListener('click', async () => {
      const record = await client.exportEvidencePackage(
        view.evaluation.submissionRef.id,
        view.evaluation.submissionRef.revision,
      );
      downloadJson(`${view.evaluation.submissionRef.id}.evidence-package.json`, record);
    });
    item.append(
      element('h3', '', view.evaluation.submissionRef.id),
      keyValues([
        ['Replay status', view.replay.ok ? 'MATCH' : 'MISMATCH'],
        ['Input hash', view.replay.inputHashMatches ? 'matched' : 'mismatched'],
        ['Result hash', view.replay.resultHashMatches ? 'matched' : 'mismatched'],
        ['Execution OS', view.executionEvidence.environment.os],
        ['Execution runtime', view.executionEvidence.environment.runtime],
      ]),
      button,
      evidenceButton,
    );
    body.append(item);
  }
  return panel('Replay & export', [body], 'wide');
}

function importPanel(workspace: Phase1aWorkspace, client: Phase1aClient, root: HTMLElement) {
  let authoredChallenge = structuredClone(workspace.challenge.record);
  const authoredSubmissionRefs: Array<{ id: string; revision: string }> = [];
  const challengeStatus = element('p', 'form-status', 'Ready to author a canonical Challenge revision.');
  const challengeId = textInput(workspace.challenge.record.id);
  challengeId.readOnly = true;
  const challengeRevision = textInput('1.0.1');
  const challengeTitle = textInput(`${workspace.challenge.record.title} — local copy`);
  const challengeProblem = editor(workspace.challenge.record.problemStatement);
  challengeProblem.classList.add('compact-editor');
  const challengeButton = actionButton('Create structured Challenge', async () => {
    await runFormAction(challengeStatus, async () => {
      authoredChallenge = {
        ...structuredClone(workspace.challenge.record),
        id: challengeId.value,
        revision: challengeRevision.value,
        title: challengeTitle.value,
        problemStatement: challengeProblem.value,
        status: 'draft',
      };
      await client.createChallenge(authoredChallenge);
    }, 'Challenge accepted. Create two submissions to open its comparison workspace.');
  });

  const submissionStatus = element('p', 'form-status', 'Ready to author and evaluate a canonical Submission.');
  const submissionId = textInput(`submission.${workspace.challenge.record.id}.authored-1`);
  const submissionRevision = textInput('1.0.0');
  const payloadEditor = editor(JSON.stringify(workspace.submissions[0]!.materialPayload, null, 2));
  const submissionButton = actionButton('Create and evaluate Submission', async () => {
    await runFormAction(submissionStatus, async () => {
      const template = structuredClone(workspace.submissions[0]!) as Submission;
      const value: Submission = {
        ...template,
        id: submissionId.value,
        revision: submissionRevision.value,
        challengeRef: {
          kind: 'Challenge',
          id: authoredChallenge.id,
          revision: authoredChallenge.revision,
        },
        materialPayload: JSON.parse(payloadEditor.value) as Submission['materialPayload'],
        status: 'submitted',
      };
      await client.createSubmission(value);
      await client.evaluateSubmission(value.id, value.revision);
      authoredSubmissionRefs.push({ id: value.id, revision: value.revision });
      if (
        authoredChallenge.id === workspace.challenge.record.id &&
        authoredChallenge.revision === workspace.challenge.record.revision
      ) {
        await refreshWorkspace(root, client, {
          baseline: workspace.selection.baseline,
          candidate: { id: value.id, revision: value.revision },
        }, workspace.stemSystem.learningDepth);
      } else if (authoredSubmissionRefs.length >= 2) {
        const next = await client.loadChallenge(authoredChallenge.id, authoredChallenge.revision, workspace.stemSystem.learningDepth);
        root.replaceChildren(createShell(next, client, root));
      } else {
        submissionId.value = submissionId.value.replace(/\d+$/, '2');
      }
    }, 'Submission accepted and executed through its registered REP evaluator.');
  });

  const archiveStatus = element('p', 'form-status', 'Workspace archive and evidence validation are local-only operations.');
  const exportArchive = actionButton('Export workspace archive', async () => {
    await runFormAction(archiveStatus, async () => {
      downloadJson('gosp-phase1a-workspace.archive.json', await client.exportArchive());
    }, 'Workspace archive exported.');
  });
  const importArchiveInput = jsonFileInput(async (value) => {
    await runFormAction(archiveStatus, () => client.importArchive(value), 'Workspace archive validated and restored.');
  });
  const evidenceInput = jsonFileInput(async (value) => {
    await runFormAction(archiveStatus, async () => {
      const result = (await client.validateEvidencePackage(value)) as { ok?: boolean };
      if (!result.ok) throw new Error('Evidence package hashes or replay did not match.');
    }, 'Evidence package material hash and REP replay matched.');
  });

  return panel('Author canonical records & manage local evidence', [
    element('p', 'muted', 'Structured identity and narrative controls remain projections over canonical API validation. Material payload JSON stays visible because no evaluator-specific form may silently change engineering input.'),
    formGrid([
      labeledControl('Challenge ID', challengeId),
      labeledControl('Revision', challengeRevision),
      labeledControl('Title', challengeTitle),
    ]),
    labeledControl('Problem statement', challengeProblem),
    challengeButton,
    challengeStatus,
    formGrid([
      labeledControl('Submission ID', submissionId),
      labeledControl('Revision', submissionRevision),
    ]),
    labeledControl('Material payload', payloadEditor),
    submissionButton,
    submissionStatus,
    subheading('Backup, recovery & portable verification'),
    elementContainer('div', 'button-row', [exportArchive]),
    labeledControl('Restore workspace archive', importArchiveInput),
    labeledControl('Validate evidence package', evidenceInput),
    archiveStatus,
  ], 'wide');
}

async function refreshWorkspace(
  root: HTMLElement,
  client: Phase1aClient,
  selection: Phase1aWorkspaceSelection,
  learningDepth?: StemLearningDepth,
) {
  const workspace = await client.loadWorkspace(selection, learningDepth);
  root.replaceChildren(createShell(workspace, client, root));
}

function submissionSelect(
  submissions: Submission[],
  selected: Phase1aWorkspaceSelection['baseline'],
) {
  const select = document.createElement('select');
  select.className = 'select-control';
  let selectedIndex = 0;
  submissions.forEach((submission, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = `${submission.id}@${submission.revision}`;
    select.append(option);
    if (submission.id === selected.id && submission.revision === selected.revision) {
      selectedIndex = index;
    }
  });
  select.value = String(selectedIndex);
  return select;
}

function selectedSubmission(submissions: Submission[], select: HTMLSelectElement) {
  const submission = submissions[Number(select.value)];
  if (!submission) throw new Error('Select a valid process-local submission.');
  return { id: submission.id, revision: submission.revision };
}

function labeledControl(label: string, control: HTMLElement) {
  const wrapper = document.createElement('label');
  wrapper.className = 'selection-control';
  wrapper.append(element('span', 'metric-label', label), control);
  return wrapper;
}

async function runFormAction(status: HTMLElement, action: () => Promise<unknown>, success: string) {
  status.className = 'form-status';
  status.textContent = 'Validating…';
  try {
    await action();
    status.className = 'form-status success';
    status.textContent = success;
  } catch (error) {
    status.className = 'form-status error';
    status.textContent = error instanceof Error ? error.message : String(error);
  }
}

function actionButton(label: string, action: () => Promise<void>) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', () => void action());
  return button;
}

function editor(value: string) {
  const textarea = document.createElement('textarea');
  textarea.className = 'json-editor';
  textarea.value = value;
  return textarea;
}

function textInput(value: string) {
  const input = document.createElement('input');
  input.className = 'text-control';
  input.type = 'text';
  input.value = value;
  return input;
}

function jsonFileInput(onValue: (value: unknown) => Promise<void>) {
  const input = document.createElement('input');
  input.className = 'file-control';
  input.type = 'file';
  input.accept = 'application/json,.json';
  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (!file) return;
    void file.text().then((text) => onValue(JSON.parse(text)));
  });
  return input;
}

function formGrid(children: HTMLElement[]) {
  return elementContainer('div', 'form-grid', children);
}

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(href);
}

function panel(title: string, children: HTMLElement[], extraClass = '') {
  const section = document.createElement('section');
  section.className = `panel ${extraClass}`.trim();
  section.append(element('h2', '', title), elementContainer('div', 'panel-body', children));
  return section;
}

function layer(title: string, children: HTMLElement[]) {
  const wrapper = document.createElement('section');
  wrapper.className = 'explain-layer';
  wrapper.append(element('h3', '', title), ...children);
  return wrapper;
}

function details(summary: string, child: HTMLElement) {
  const wrapper = document.createElement('details');
  const heading = document.createElement('summary');
  heading.textContent = summary;
  wrapper.append(heading, child);
  return wrapper;
}

function subheading(value: string) {
  return element('h3', 'subheading', value);
}

function keyValues(items: Array<[string, string]>) {
  const wrapper = document.createElement('dl');
  wrapper.className = 'key-values';
  for (const [label, value] of items) {
    wrapper.append(element('dt', '', label), element('dd', '', value));
  }
  return wrapper;
}

function statStrip(items: Array<[string, string]>) {
  const wrapper = document.createElement('div');
  wrapper.className = 'stat-strip';
  for (const [label, value] of items) {
    const item = document.createElement('div');
    item.append(element('strong', '', value), element('span', '', label));
    wrapper.append(item);
  }
  return wrapper;
}

function metric(label: string, value: string) {
  const wrapper = document.createElement('div');
  wrapper.className = 'metric';
  wrapper.append(element('span', 'metric-label', label), element('strong', '', value));
  return wrapper;
}

function codeRow(label: string, value: string) {
  const wrapper = document.createElement('div');
  wrapper.className = 'code-row';
  wrapper.append(element('span', 'metric-label', label), element('code', '', value));
  return wrapper;
}

function cardList(items: Array<{ title: string; meta?: string; body?: string }>) {
  const wrapper = document.createElement('div');
  wrapper.className = 'card-list';
  for (const item of items) {
    const card = document.createElement('article');
    card.className = 'mini-card';
    card.append(element('strong', '', item.title));
    if (item.meta) card.append(element('span', 'meta', item.meta));
    if (item.body) card.append(element('code', 'payload', item.body));
    wrapper.append(card);
  }
  return wrapper;
}

function bullets(items: string[]) {
  const list = document.createElement('ul');
  list.className = 'compact-list';
  for (const item of items) list.append(element('li', '', item));
  return list;
}

function elementContainer(tagName: string, className: string, children: HTMLElement[]) {
  const node = document.createElement(tagName);
  node.className = className;
  node.append(...children);
  return node;
}

function element(tagName: string, className: string, textContent: string) {
  const node = document.createElement(tagName);
  node.className = className;
  node.textContent = textContent;
  return node;
}
