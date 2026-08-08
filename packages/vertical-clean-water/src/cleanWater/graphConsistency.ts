type RefValue = {
  id: string;
  kind: string;
  value: unknown;
};

export type CleanWaterGraphWarning = {
  code: string;
  message: string;
  severity: 'warning' | 'blocker';
};

type GraphLike = {
  kind: string;
  nodes: Array<{ id: string }>;
};

const RequiredCleanWaterGraphNodes = [
  { id: 'raw-water-tank', label: 'raw water tank' },
  { id: 'pump', label: 'pump' },
  { id: 'filter-housing', label: 'filter housing' },
  { id: 'clean-water-tank', label: 'clean water tank' },
  { id: 'classroom-battery', label: 'battery/power source' },
  { id: 'controller-logic', label: 'controller' },
  { id: 'status-dashboard-module', label: 'dashboard' },
] as const;

function isGraphLike(value: unknown): value is GraphLike {
  return (
    typeof value === 'object' &&
    value !== null &&
    'kind' in value &&
    typeof value.kind === 'string' &&
    value.kind.endsWith('FlowGraph') &&
    'nodes' in value &&
    Array.isArray(value.nodes)
  );
}

export function validateCleanWaterGraphConsistency(input: {
  refs: RefValue[];
  mode?: string;
}) {
  const graphNodeIds = new Set(
    input.refs
      .filter((ref) => ref.kind === 'graph' && isGraphLike(ref.value))
      .flatMap((ref) => (ref.value as GraphLike).nodes.map((node) => node.id)),
  );
  const missingRequiredNodes = RequiredCleanWaterGraphNodes.filter(
    (node) => !graphNodeIds.has(node.id),
  );
  const severity = input.mode === 'scoring' ? ('blocker' as const) : ('warning' as const);
  const warnings: CleanWaterGraphWarning[] = missingRequiredNodes.map((node) => ({
    code: 'missing-required-clean-water-graph-node',
    message: `Clean Water graph consistency is missing required ${node.label} node "${node.id}".`,
    severity,
  }));

  return {
    requiredNodeIds: RequiredCleanWaterGraphNodes.map((node) => node.id),
    presentNodeIds: [...graphNodeIds].sort(),
    missingNodeIds: missingRequiredNodes.map((node) => node.id),
    warnings,
  };
}
