import { StemExperimentDefinitionSchema } from '@gosp/contracts';

export function createSandboxStemExperimentDefinition() {
  return StemExperimentDefinitionSchema.parse({
    id: 'experiment.sandbox-001.reproduction-plan',
    title: 'Plan an observation of the synthetic weighted-sum output',
    predictionQuantityId: 'sandbox.result',
    testPlan: {
      status: 'planned',
      controls: ['Hold the canonical material input and source implementation identities fixed.'],
      instruments: [{ id: 'instrument.sandbox-output', name: 'Recorded evaluator output', status: 'declared', measurementKind: 'synthetic numeric output' }],
      procedure: ['Run the canonical evaluator and preserve the result identity.', 'Do not label a repeated calculation as a physical measurement.'],
      repetitions: { planned: 1, completed: 0 },
      uncertainty: { status: 'not-declared', basis: 'No empirical uncertainty model applies to this deterministic synthetic benchmark.' },
      acceptanceCriterion: { kind: 'absolute-discrepancy-at-most', threshold: 0, unit: 'unitless', falsificationStatement: 'Any discrepancy would fail deterministic replay, but would not represent physical falsification.' },
    },
    observations: [],
    nonClaims: ['A test plan is not a completed test.', 'A repeated calculation is not a measurement.', 'One observation is not validation.'],
  });
}
