type Warning = { code: string; message: string; severity: 'info' | 'warning' | 'blocker' };

export function createCleanWaterImpactReport(output: {
  flow?: { cleanWaterLiters?: number };
  power?: { compatible?: boolean };
}) {
  const warnings: Warning[] = [
    {
      code: 'downstream-effects-educational-only',
      message:
        'Downstream effects are level-1 educational estimates and are not professional validation.',
      severity: 'info',
    },
  ];

  return {
    kind: 'CleanWaterImpactReport',
    direct: [
      {
        id: 'direct-pump-flow',
        metric: 'cleanWaterLiters',
        value: output.flow?.cleanWaterLiters,
        unit: 'L',
        interpretation: 'Modeled direct flow output for classroom comparison only.',
      },
    ],
    downstream: [
      {
        id: 'downstream-power-runtime',
        affectedArea: 'power-runtime',
        interpretation: output.power?.compatible
          ? 'Power compatibility supports the modeled pump run in this level-1 screen.'
          : 'Power incompatibility would reduce or block modeled pump runtime.',
      },
      {
        id: 'downstream-cost-confidence',
        affectedArea: 'cost-confidence',
        interpretation:
          'Changes to pump flow, runtime, and replacement assumptions may affect downstream cost confidence.',
      },
    ],
    warnings,
    limitations: [
      'Educational impact report only.',
      'No potable-water certification or professional engineering claim.',
    ],
  };
}
