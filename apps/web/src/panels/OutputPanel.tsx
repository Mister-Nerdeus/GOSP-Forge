import { createPanel, list, row } from './ProjectPanel';

export function createOutputPanel() {
  return createPanel('Outputs', [
    row('Simulation confidence', 'reported from explicit scenario settings and product specs'),
    row('Estimate confidence', 'bounded by visible zero/default cost quality report'),
    row('Defaulted inputs', 'reported by the CLI envelope when present'),
    list([
      'Outputs are derived from the foundation CLI model and bundled example data.',
      'Assumptions and limitations remain visible before any result is interpreted.',
      'Foundation inspection only: no CAD editing, potable-water certification, professional validation, or production manufacturing approval.',
    ]),
  ]);
}
