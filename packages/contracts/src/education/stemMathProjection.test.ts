import { describe, expect, it } from 'vitest';
import { StemMathDefinitionSchema, StemMathProjectionSchema } from './stemMathProjection.js';

const definition = {
  quantities: [
    { id: 'input.x', label: 'Input x', symbol: 'x', role: 'input', status: 'submitted', source: 'material-input', sourcePath: 'submission.materialPayload.x' },
    { id: 'output.y', label: 'Output y', symbol: 'y', role: 'output', status: 'calculated', source: 'evaluation-result', sourcePath: 'result.y', resultPath: 'evaluation.result.y' },
  ],
  equations: [{
    equationId: 'equation.xy',
    variableBindings: { x: 'input.x' },
    intermediateQuantityIds: [],
    outputQuantityId: 'output.y',
    dimensionalStatus: 'not-checked',
    assumptions: [],
    limitations: ['No dimensional verifier executed.'],
  }],
};

describe('STEM math contracts', () => {
  it('accepts an explicit quantity and equation definition', () => {
    expect(StemMathDefinitionSchema.parse(definition).equations[0]?.dimensionalStatus).toBe(
      'not-checked',
    );
  });

  it('rejects undeclared quantity references and contradictory roles', () => {
    expect(() => StemMathDefinitionSchema.parse({
      ...definition,
      equations: [{
        ...definition.equations[0],
        variableBindings: { x: 'missing.x' },
        outputQuantityId: 'input.x',
      }],
    })).toThrow(/undeclared quantity|role output/i);
  });

  it('preserves unavailable values and explicit dimensional status', () => {
    const projection = StemMathProjectionSchema.parse({
      quantities: [
        { id: 'input.x', label: 'Input x', symbol: 'x', role: 'input', status: 'submitted', sourcePath: 'submission.materialPayload.x', availability: 'unavailable' },
        { id: 'output.y', label: 'Output y', symbol: 'y', value: 2, role: 'output', status: 'calculated', sourcePath: 'result.y', resultPath: 'evaluation.result.y', availability: 'available' },
      ],
      equations: [{
        id: 'equation.xy', expression: 'y = 2x', description: 'Example.',
        variableBindings: [{ symbol: 'x', quantityId: 'input.x' }],
        substitutions: [{ quantityId: 'input.x', symbol: 'x', availability: 'unavailable' }],
        intermediateQuantityIds: [], outputQuantityId: 'output.y', dimensionalStatus: 'not-checked',
        assumptions: [], limitations: ['Not checked.'],
      }],
      dependencies: [{ fromQuantityId: 'input.x', toQuantityId: 'output.y', equationId: 'equation.xy' }],
      disclosure: 'Recorded values only.',
    });
    expect(projection.quantities[0]).not.toHaveProperty('value');
    expect(projection.equations[0]?.dimensionalStatus).toBe('not-checked');
  });
});
