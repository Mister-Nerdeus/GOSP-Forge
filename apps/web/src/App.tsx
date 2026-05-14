import manifest from '../../../examples/projects/automated-water-filter.project-v2.json';

type ProjectManifestSummary = {
  id: string;
  title: string;
  mode: string;
  refs?: Array<{ id: string; kind: string; required?: boolean }>;
  refGroups?: {
    modules?: Array<{ id: string }>;
    products?: Array<{ id: string }>;
    graphs?: Array<{ id: string }>;
    education?: Array<{ id: string }>;
  };
};

const project = manifest as ProjectManifestSummary;

export function renderApp(root: HTMLElement) {
  root.replaceChildren(createShell());
}

function createShell() {
  const app = document.createElement('main');
  app.className = 'app-shell';

  app.append(
    section('Project', [
      pair('Title', project.title),
      pair('Mode', project.mode),
      pair('Project ID', project.id),
    ]),
    section('Manifest Refs', [
      metric('Modules', project.refGroups?.modules?.length ?? 0),
      metric('Products', project.refGroups?.products?.length ?? 0),
      metric('Graphs', project.refGroups?.graphs?.length ?? 0),
      metric('Education', project.refGroups?.education?.length ?? 0),
    ]),
    refList(),
    notice(),
  );

  return app;
}

function section(title: string, children: HTMLElement[]) {
  const element = document.createElement('section');
  element.className = 'panel';
  const heading = document.createElement('h2');
  heading.textContent = title;
  const body = document.createElement('div');
  body.className = 'panel-body';
  body.append(...children);
  element.append(heading, body);
  return element;
}

function pair(label: string, value: string) {
  const row = document.createElement('div');
  row.className = 'pair';
  row.append(labelText(label), valueText(value));
  return row;
}

function metric(label: string, value: number) {
  const row = document.createElement('div');
  row.className = 'metric';
  row.append(valueText(String(value)), labelText(label));
  return row;
}

function refList() {
  const refs = project.refs ?? [];
  const element = section(
    'Required Refs',
    refs.slice(0, 12).map((ref) => pair(ref.kind, ref.id)),
  );
  element.classList.add('wide');
  return element;
}

function notice() {
  const element = document.createElement('section');
  element.className = 'notice wide';
  element.textContent =
    'Educational foundation shell only. No CAD editor, persistence, potable-water certification, professional approval, or production manufacturing approval.';
  return element;
}

function labelText(value: string) {
  const span = document.createElement('span');
  span.className = 'label';
  span.textContent = value;
  return span;
}

function valueText(value: string) {
  const span = document.createElement('span');
  span.className = 'value';
  span.textContent = value;
  return span;
}
