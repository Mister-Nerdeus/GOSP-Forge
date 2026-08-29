import { StemMathDefinitionSchema } from '@gosp/contracts';

export function createCleanWaterStemMathDefinition() {
  return StemMathDefinitionSchema.parse({
    quantities: [
      { id: 'clean-water.source-liters', label: 'Available source water', symbol: 'sourceLiters', unit: 'L', role: 'input', status: 'submitted', source: 'material-input', sourcePath: 'submission.materialPayload.compiledInput.water.sourceLiters' },
      { id: 'clean-water.pump-flow', label: 'Pump flow rate', symbol: 'pumpFlowLpm', unit: 'L/min', role: 'input', status: 'submitted', source: 'material-input', sourcePath: 'submission.materialPayload.compiledInput.water.pumpFlowLpm' },
      { id: 'clean-water.duration', label: 'Run duration', symbol: 'minutes', unit: 'min', role: 'input', status: 'submitted', source: 'material-input', sourcePath: 'submission.materialPayload.compiledInput.water.minutes' },
      { id: 'clean-water.filter-efficiency', label: 'Filter efficiency assumption', symbol: 'filterEfficiency', role: 'input', status: 'submitted', source: 'material-input', sourcePath: 'submission.materialPayload.compiledInput.water.filterEfficiency' },
      { id: 'clean-water.pump-capacity', label: 'Pump capacity over duration', symbol: 'pumpCapacityLiters', unit: 'L', role: 'intermediate', status: 'calculated', source: 'intermediate-value', sourcePath: 'pump-capacity-liters' },
      { id: 'clean-water.clean-water-liters', label: 'Calculated clean-water volume', symbol: 'cleanWaterLiters', unit: 'L', role: 'output', status: 'calculated', source: 'evaluation-result', sourcePath: 'result.flow.cleanWaterLiters', resultPath: 'evaluation.result.flow.cleanWaterLiters' },
    ],
    equations: [{
      equationId: 'clean-water.flow-screen',
      variableBindings: {
        sourceLiters: 'clean-water.source-liters',
        pumpFlowLpm: 'clean-water.pump-flow',
        minutes: 'clean-water.duration',
        filterEfficiency: 'clean-water.filter-efficiency',
      },
      intermediateQuantityIds: ['clean-water.pump-capacity'],
      outputQuantityId: 'clean-water.clean-water-liters',
      dimensionalStatus: 'not-checked',
      assumptions: ['Filter efficiency is a dimensionless educational model input.'],
      limitations: ['Dimensional consistency is visible from declared units but has not been checked by a dimensional-analysis verifier.'],
    }],
  });
}
