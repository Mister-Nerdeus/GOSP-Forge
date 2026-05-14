import { createPanel, list, row } from './ProjectPanel';

export function createOutputPanel() {
  return createPanel('Outputs', [
    row('Simulation confidence', 'medium, from manifest refs and product specs'),
    row('Estimate confidence', 'low, due defaulted quantities and lifecycle gaps'),
    row('Defaulted inputs', 'water.sourceLiters, water.minutes, water.filterEfficiency'),
    list([
      'Outputs are derived from the foundation CLI model and bundled example data.',
      'Assumptions and limitations remain visible before any result is interpreted.',
      'No potable-water certification, professional validation, or production manufacturing approval.',
    ]),
  ]);
}
