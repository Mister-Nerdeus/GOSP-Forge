export type ProjectSummary = {
  id: string;
  title: string;
  version?: string;
  mode: string;
  design?: { status?: string; notes?: string[] };
  refs?: Array<{ id: string; kind: string; required?: boolean }>;
  refGroups?: {
    modules?: Array<{ id: string }>;
    products?: Array<{ id: string }>;
    graphs?: Array<{ id: string }>;
    education?: Array<{ id: string }>;
  };
};

export function createProjectPanel(project: ProjectSummary) {
  return createPanel('Project', [
    row('Title', project.title),
    row('Mode', project.mode),
    row('Version', project.version ?? 'unknown'),
    row('Design status', project.design?.status ?? 'unknown'),
    row('Required refs', String(project.refs?.filter((ref) => ref.required).length ?? 0)),
  ]);
}

export function createPanel(title: string, children: HTMLElement[], className?: string) {
  const element = document.createElement('section');
  element.className = className ? `panel ${className}` : 'panel';
  const heading = document.createElement('h2');
  heading.textContent = title;
  const body = document.createElement('div');
  body.className = 'panel-body';
  body.append(...children);
  element.append(heading, body);
  return element;
}

export function row(label: string, value: string) {
  const element = document.createElement('div');
  element.className = 'pair';
  element.append(text('span', label, 'label'), text('span', value, 'value'));
  return element;
}

export function list(items: string[]) {
  const element = document.createElement('ul');
  element.className = 'compact-list';
  for (const item of items) {
    const child = document.createElement('li');
    child.textContent = item;
    element.append(child);
  }
  return element;
}

export function text(tagName: 'p' | 'span', value: string, className?: string) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  element.textContent = value;
  return element;
}
