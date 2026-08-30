import { StemExperimentDefinitionSchema } from '@gosp/contracts';

export function createSolarDeploymentStemExperimentDefinition() {
  return StemExperimentDefinitionSchema.parse({
    id: 'experiment.solar.synthetic-power-check',
    title: 'Compare modeled power with an authored teaching observation',
    predictionQuantityId: 'solar.instantaneous-power',
    testPlan: {
      status: 'planned',
      controls: [
        'Hold the panel, irradiance, temperature, angle, soiling, and deployed fraction at the recorded values.',
        'Use an independently declared power instrument and the same stabilized interval for each repetition.',
      ],
      instruments: [
        { id: 'instrument.solar.power', name: 'Calibrated electrical power instrument', status: 'not-declared', measurementKind: 'electrical power' },
        { id: 'instrument.solar.environment', name: 'Irradiance and temperature references', status: 'not-declared', measurementKind: 'test environment' },
      ],
      procedure: [
        'Record the canonical prediction before observing the teaching value.',
        'Record power and controlled conditions with independent instruments.',
        'Repeat the declared procedure and preserve both passing and failing discrepancies.',
      ],
      repetitions: { planned: 3, completed: 0 },
      uncertainty: { status: 'declared', value: 5, unit: 'W', basis: 'Authored allowance for the synthetic teaching observation; not calibration evidence.' },
      acceptanceCriterion: { kind: 'absolute-discrepancy-at-most', threshold: 5, unit: 'W', falsificationStatement: 'An absolute discrepancy greater than 5 W fails this teaching criterion and remains visible.' },
    },
    observations: [{ id: 'observation.solar.synthetic-001', classification: 'synthetic', value: 130, unit: 'W', uncertainty: 5, repetitions: 1, source: 'Authored teaching fixture; no physical panel or instrument was used.' }],
    nonClaims: [
      'The planned test is not a completed physical test.',
      'The synthetic observation is not a measurement.',
      'The comparison does not validate a panel, structure, control system, weather response, deployment, or safety case.',
      'No manufacturer, laboratory, field, certification, or professional approval is represented.',
    ],
  });
}
