import { StemMathDefinitionSchema } from '@gosp/contracts';

export function createSandboxStemMathDefinition() {
  return StemMathDefinitionSchema.parse({
    quantities: [
      { id: 'sandbox.values', label: 'Submitted values', symbol: 'values', role: 'input', status: 'submitted', source: 'material-input', sourcePath: 'submission.materialPayload.values' },
      { id: 'sandbox.weights', label: 'Submitted weights', symbol: 'weights', role: 'input', status: 'submitted', source: 'material-input', sourcePath: 'submission.materialPayload.weights' },
      { id: 'sandbox.offset', label: 'Offset', symbol: 'offset', role: 'input', status: 'submitted', source: 'material-input', sourcePath: 'submission.materialPayload.offset' },
      { id: 'sandbox.scale', label: 'Scenario scale', symbol: 'scale', role: 'controlled', status: 'controlled', source: 'material-input', sourcePath: 'compiledScenario.parameters.scale' },
      { id: 'sandbox.weighted-sum', label: 'Weighted sum', symbol: 'weightedSum', role: 'intermediate', status: 'calculated', source: 'intermediate-value', sourcePath: 'weighted-sum' },
      { id: 'sandbox.result', label: 'Recorded result', symbol: 'result', role: 'output', status: 'calculated', source: 'evaluation-result', sourcePath: 'result.value', resultPath: 'evaluation.result.value' },
    ],
    equations: [{
      equationId: 'sandbox-001.weighted-sum',
      variableBindings: {
        values: 'sandbox.values',
        weights: 'sandbox.weights',
        offset: 'sandbox.offset',
        scale: 'sandbox.scale',
      },
      intermediateQuantityIds: ['sandbox.weighted-sum'],
      outputQuantityId: 'sandbox.result',
      dimensionalStatus: 'not-applicable',
      assumptions: ['All quantities in this synthetic benchmark are unitless.'],
      limitations: ['This arithmetic path is a deterministic protocol benchmark, not a physical model.'],
    }],
  });
}
