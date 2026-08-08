import { z } from 'zod';
import type { RepMaterialInput } from '@gosp/contracts';
import { evaluateRep, type RepEvaluatorOutput } from './referenceRunner.js';

const SandboxPayloadSchema = z
  .object({
    values: z.array(z.number().finite()).min(1),
    weights: z.array(z.number().finite()).min(1),
    offset: z.number().finite(),
  })
  .superRefine((value, context) => {
    if (value.values.length !== value.weights.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'sandbox-001 requires one weight for each value.',
      });
    }
  });

function evaluateSandbox001(input: RepMaterialInput): RepEvaluatorOutput {
  if (input.challenge.id !== 'sandbox-001') {
    throw new Error('The sandbox-001 evaluator only accepts challenge sandbox-001.');
  }
  const payload = SandboxPayloadSchema.parse(input.submission.materialPayload);
  const scaleValue = input.compiledScenario.parameters.scale;
  if (typeof scaleValue !== 'number' || !Number.isFinite(scaleValue)) {
    throw new Error('sandbox-001 compiled scenario requires finite numeric parameter "scale".');
  }

  const terms = payload.values.map((value, index) => value * payload.weights[index]!);
  const weightedSum = terms.reduce((total, value) => total + value, 0);
  const value = payload.offset + scaleValue * weightedSum;

  return {
    result: { value, terms, weightedSum },
    explainability: {
      explanation: 'The material result is the offset plus the scenario scale times a weighted sum.',
      equations: [
        {
          id: 'sandbox-001.weighted-sum',
          expression: 'result = offset + scale * sum(values[i] * weights[i])',
          description: 'Deterministic weighted-sum benchmark.',
          variables: {
            offset: 'Submission offset.',
            scale: 'Compiled scenario scale.',
            values: 'Submitted numeric values.',
            weights: 'Submitted numeric weights.',
          },
        },
      ],
      intermediateValues: [
        { id: 'weighted-sum', value: weightedSum },
        { id: 'scale', value: scaleValue },
        { id: 'offset', value: payload.offset },
      ],
      modelInspection: {
        assumptions: input.materialAssumptions,
        boundaryConditions: input.model.boundaryConditions,
        numericalSettings: { arithmetic: 'ECMAScript Number binary64' },
        convergence: 'Closed-form calculation; convergence is not applicable.',
        calibration: 'Synthetic benchmark; calibration is not applicable.',
      },
      evidenceRefs: [],
    },
    uncertainty: input.model.uncertainty,
    sensitivity: [
      {
        parameterPath: 'compiledScenario.parameters.scale',
        resultPath: 'result.value',
        method: 'local-derivative',
        effect: weightedSum,
        rank: 1,
        interpretation: 'The derivative of the result with respect to scale equals the weighted sum.',
      },
    ],
  };
}

export function runSandbox001(rawInput: unknown) {
  return evaluateRep(rawInput, evaluateSandbox001);
}
