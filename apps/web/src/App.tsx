import type {
  Phase1aEvaluationView,
  Phase1aWorkspace,
  Phase1aWorkspaceSelection,
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

  app.append(
    hero(workspace),
    challengePanel(workspace),
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

function hero(workspace: Phase1aWorkspace) {
  const wrapper = document.createElement('header');
  wrapper.className = 'hero wide';
  wrapper.append(
    element('span', 'eyebrow', 'GOSP Forge · local application slice'),
    element('h1', '', workspace.milestone),
    element(
      'p',
      'lede',
      'Canonical Challenge → Submission → REP Evaluation → Evidence → Comparison, with no parallel scoring or hashing in the browser.',
    ),
    element('p', 'persistence-notice', workspace.persistence.disclosure),
  );
  return wrapper;
}

function challengePanel(workspace: Phase1aWorkspace) {
  const { record, requirements, constraints, assumptions, model, scenario } = workspace.challenge;
  const selector = document.createElement('select');
  selector.className = 'select-control';
  for (const challenge of workspace.challenge.availableChallenges) {
    const option = document.createElement('option');
    option.value = `${challenge.id}@${challenge.revision}`;
    option.textContent = `${challenge.title} · ${challenge.id}@${challenge.revision}`;
    selector.append(option);
  }
  return panel('Challenge', [
    selector,
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
      await refreshWorkspace(root, client, selection);
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
  const result = view.evaluation.result as { value: number; weightedSum: number; terms: number[] };
  const card = document.createElement('article');
  card.className = 'result-card';
  card.append(
    element('span', `status ${view.hardGates.every((gate) => gate.passed) ? 'pass' : 'fail'}`, view.hardGates.every((gate) => gate.passed) ? 'HARD GATES PASS' : 'HARD GATE FAIL'),
    element('h3', '', view.evaluation.submissionRef.id),
    metric('Result', String(result.value)),
    metric('Weighted sum', String(result.weightedSum)),
    metric('Terms', result.terms.join(', ')),
    codeRow('Material input', view.evaluation.materialInputHash),
    codeRow('Material result', view.evaluation.materialResultHash),
    codeRow('Evaluation', `${view.evaluation.id}@${view.evaluation.revision}`),
  );
  return card;
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
    layer('2 · Show the Math', [
      ...explanation.equations.map((equation) =>
        keyValues([
          ['Relationship', equation.id],
          ['Expression', equation.expression],
          ['Description', equation.description],
          ['Variables', Object.entries(equation.variables).map(([key, value]) => `${key}: ${value}`).join(' · ')],
        ]),
      ),
      cardList(
        explanation.intermediateValues.map((value) => ({
          title: value.id,
          meta: `${String(value.value)} ${value.unit ?? '(unitless)'}`,
        })),
      ),
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
    );
    body.append(item);
  }
  return panel('Replay & export', [body], 'wide');
}

function importPanel(workspace: Phase1aWorkspace, client: Phase1aClient, root: HTMLElement) {
  const challengeStatus = element('p', 'form-status', 'Ready to validate canonical Challenge JSON.');
  const challengeEditor = editor(JSON.stringify(workspace.challenge.record, null, 2));
  const challengeButton = actionButton('Validate / create Challenge', async () => {
    await runFormAction(challengeStatus, () => client.createChallenge(JSON.parse(challengeEditor.value)), 'Challenge accepted into process-local memory.');
  });

  const submissionStatus = element('p', 'form-status', 'Ready to validate canonical Submission JSON.');
  const template = structuredClone(workspace.submissions[1]!) as Submission;
  template.id = 'submission.sandbox-001.local-import';
  const submissionEditor = editor(JSON.stringify(template, null, 2));
  const submissionButton = actionButton('Validate / import / run Submission', async () => {
    await runFormAction(submissionStatus, async () => {
      const value = JSON.parse(submissionEditor.value) as Submission;
      await client.createSubmission(value);
      await client.evaluateSubmission(value.id, value.revision);
      await refreshWorkspace(root, client, {
        baseline: workspace.selection.baseline,
        candidate: { id: value.id, revision: value.revision },
      });
    }, 'Submission accepted and executed through the canonical REP runner.');
  });

  return panel('Create / import canonical records', [
    element('p', 'muted', 'These controls send JSON to canonical Zod validation in the local API. Invalid identities and material inputs are rejected and displayed; no production persistence is implied.'),
    formBlock('Challenge JSON', challengeEditor, challengeButton, challengeStatus),
    formBlock('Submission JSON', submissionEditor, submissionButton, submissionStatus),
  ], 'wide');
}

async function refreshWorkspace(
  root: HTMLElement,
  client: Phase1aClient,
  selection: Phase1aWorkspaceSelection,
) {
  const workspace = await client.loadWorkspace(selection);
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

function formBlock(title: string, textarea: HTMLTextAreaElement, button: HTMLButtonElement, status: HTMLElement) {
  const wrapper = document.createElement('div');
  wrapper.className = 'form-block';
  wrapper.append(subheading(title), textarea, button, status);
  return wrapper;
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
