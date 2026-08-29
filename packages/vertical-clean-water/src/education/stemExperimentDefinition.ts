import { StemExperimentDefinitionSchema } from '@gosp/contracts';

export function createCleanWaterStemExperimentDefinition() {
  return StemExperimentDefinitionSchema.parse({
    id: 'experiment.clean-water.synthetic-flow-check',
    title: 'Compare predicted clean-water output with a teaching observation',
    predictionQuantityId: 'clean-water.clean-water-liters',
    testPlan: {
      status: 'planned',
      controls: [
        'Hold source volume, run time, pump flow, filter setting, and power inputs at the recorded scenario values.',
        'Use the same collection interval and volume-reading method for every repetition.',
      ],
      instruments: [
        { id: 'instrument.collection-volume', name: 'Calibrated collection vessel', status: 'not-declared', measurementKind: 'collected liquid volume' },
        { id: 'instrument.elapsed-time', name: 'Elapsed-time instrument', status: 'not-declared', measurementKind: 'run duration' },
      ],
      procedure: [
        'Record the canonical model prediction before observing the teaching value.',
        'Run the fixed procedure for the declared duration and record collected volume and uncertainty.',
        'Repeat as planned, compare observation with prediction, and retain passing and failing outcomes.',
      ],
      repetitions: { planned: 3, completed: 0 },
      uncertainty: { status: 'declared', value: 2, unit: 'L', basis: 'Authored allowance for the synthetic teaching observation; not instrument calibration evidence.' },
      acceptanceCriterion: {
        kind: 'absolute-discrepancy-at-most',
        threshold: 3,
        unit: 'L',
        falsificationStatement: 'An absolute discrepancy greater than 3 L fails this teaching criterion and must remain visible.',
      },
    },
    observations: [{
      id: 'observation.clean-water.synthetic-001',
      classification: 'synthetic',
      value: 58,
      unit: 'L',
      uncertainty: 2,
      repetitions: 1,
      source: 'Authored teaching fixture; no physical test or instrument reading occurred.',
    }],
    nonClaims: [
      'A test plan is not a completed test.',
      'This synthetic observation is not a measurement.',
      'One observation is not validation.',
      'The comparison does not establish potable-water safety, calibration, certification, or professional approval.',
    ],
  });
}
