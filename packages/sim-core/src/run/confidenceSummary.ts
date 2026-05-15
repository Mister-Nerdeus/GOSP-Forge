export function createSimulationConfidenceSummary(input: {
  knownInputs?: string[];
  defaultedInputs?: string[];
  unknownInputs?: string[];
  warningCount?: number;
}) {
  const known = input.knownInputs?.length ?? 0;
  const defaulted = input.defaultedInputs?.length ?? 0;
  const unknown = input.unknownInputs?.length ?? 0;
  const warningCount = input.warningCount ?? 0;
  return {
    knownInputs: known,
    defaultedInputs: defaulted,
    unknownInputs: unknown,
    warningCount,
    level: defaulted > 0 || unknown > 0 || warningCount > 0 ? ('low' as const) : ('medium' as const),
    rationale:
      defaulted > 0 || unknown > 0
        ? 'Simulation includes defaulted or unknown educational screening inputs.'
        : 'Simulation inputs are explicit for the foundation screening model.',
  };
}
