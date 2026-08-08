export function createSimulationConfidenceSummary(input: {
  knownInputs?: string[];
  defaultedInputs?: string[];
  unknownInputs?: string[];
  warningCount?: number;
  graphWarningCount?: number;
}) {
  const known = input.knownInputs?.length ?? 0;
  const defaulted = input.defaultedInputs?.length ?? 0;
  const unknown = input.unknownInputs?.length ?? 0;
  const warningCount = input.warningCount ?? 0;
  const graphWarningCount = input.graphWarningCount ?? 0;
  const reasons = [
    ...(defaulted > 0 || unknown > 0
      ? ['defaulted or unknown educational screening inputs']
      : []),
    ...(graphWarningCount > 0 ? ['graph consistency warnings'] : []),
    ...(warningCount > 0 && graphWarningCount === 0 && defaulted === 0 && unknown === 0
      ? ['simulation warnings']
      : []),
  ];
  return {
    knownInputs: known,
    defaultedInputs: defaulted,
    unknownInputs: unknown,
    graphWarningCount,
    warningCount,
    level:
      defaulted > 0 || unknown > 0 || warningCount > 0 || graphWarningCount > 0
        ? ('low' as const)
        : ('medium' as const),
    rationale: reasons.length
      ? `Simulation confidence is lowered by ${reasons.join(' and ')}.`
      : 'Simulation inputs are explicit for the foundation screening model.',
  };
}
