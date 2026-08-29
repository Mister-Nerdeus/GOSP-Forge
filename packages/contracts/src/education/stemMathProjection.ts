import { z } from 'zod';
import { CanonicalJsonValueSchema } from '../canonical/identity.js';

export const StemQuantityRoleSchema = z.enum([
  'input',
  'controlled',
  'intermediate',
  'output',
]);

export const StemQuantityStatusSchema = z.enum([
  'submitted',
  'controlled',
  'calculated',
]);

export const StemDimensionalStatusSchema = z.enum([
  'checked',
  'not-checked',
  'not-applicable',
]);

export const StemMathDefinitionSchema = z.object({
  quantities: z.array(z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    symbol: z.string().min(1),
    unit: z.string().min(1).optional(),
    role: StemQuantityRoleSchema,
    status: StemQuantityStatusSchema,
    source: z.enum(['material-input', 'intermediate-value', 'evaluation-result']),
    sourcePath: z.string().min(1),
    resultPath: z.string().min(1).optional(),
  })).min(1),
  equations: z.array(z.object({
    equationId: z.string().min(1),
    variableBindings: z.record(z.string().min(1)),
    intermediateQuantityIds: z.array(z.string().min(1)).default([]),
    outputQuantityId: z.string().min(1),
    dimensionalStatus: StemDimensionalStatusSchema,
    assumptions: z.array(z.string().min(1)).default([]),
    limitations: z.array(z.string().min(1)).min(1),
  })).min(1),
}).superRefine((definition, context) => {
  const quantityIds = new Set<string>();
  definition.quantities.forEach((quantity, index) => {
    if (quantityIds.has(quantity.id)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['quantities', index, 'id'],
        message: `Duplicate STEM quantity id ${quantity.id}.`,
      });
    }
    quantityIds.add(quantity.id);
  });
  definition.equations.forEach((equation, index) => {
    if (!Object.keys(equation.variableBindings).length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['equations', index, 'variableBindings'],
        message: `Equation ${equation.equationId} must bind at least one variable.`,
      });
    }
    const references = [
      ...Object.values(equation.variableBindings),
      ...equation.intermediateQuantityIds,
      equation.outputQuantityId,
    ];
    references.forEach((quantityId) => {
      if (!quantityIds.has(quantityId)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['equations', index],
          message: `Equation ${equation.equationId} references undeclared quantity ${quantityId}.`,
        });
      }
    });
    const output = definition.quantities.find(
      (quantity) => quantity.id === equation.outputQuantityId,
    );
    if (output && output.role !== 'output') {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['equations', index, 'outputQuantityId'],
        message: `Equation output ${equation.outputQuantityId} must have role output.`,
      });
    }
    equation.intermediateQuantityIds.forEach((quantityId) => {
      const intermediate = definition.quantities.find(
        (quantity) => quantity.id === quantityId,
      );
      if (intermediate && intermediate.role !== 'intermediate') {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['equations', index, 'intermediateQuantityIds'],
          message: `Equation intermediate ${quantityId} must have role intermediate.`,
        });
      }
    });
  });
});

export const StemMathProjectionSchema = z.object({
  quantities: z.array(z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    symbol: z.string().min(1),
    value: CanonicalJsonValueSchema.optional(),
    unit: z.string().min(1).optional(),
    role: StemQuantityRoleSchema,
    status: StemQuantityStatusSchema,
    sourcePath: z.string().min(1),
    resultPath: z.string().min(1).optional(),
    availability: z.enum(['available', 'unavailable']),
  })).min(1),
  equations: z.array(z.object({
    id: z.string().min(1),
    expression: z.string().min(1),
    description: z.string().min(1),
    variableBindings: z.array(z.object({
      symbol: z.string().min(1),
      quantityId: z.string().min(1),
    })).min(1),
    substitutions: z.array(z.object({
      quantityId: z.string().min(1),
      symbol: z.string().min(1),
      value: CanonicalJsonValueSchema.optional(),
      unit: z.string().min(1).optional(),
      availability: z.enum(['available', 'unavailable']),
    })).min(1),
    intermediateQuantityIds: z.array(z.string().min(1)).default([]),
    outputQuantityId: z.string().min(1),
    dimensionalStatus: StemDimensionalStatusSchema,
    assumptions: z.array(z.string().min(1)).default([]),
    limitations: z.array(z.string().min(1)).min(1),
  })).min(1),
  dependencies: z.array(z.object({
    fromQuantityId: z.string().min(1),
    toQuantityId: z.string().min(1),
    equationId: z.string().min(1),
  })).min(1),
  disclosure: z.string().min(1),
});

export type StemMathDefinition = z.infer<typeof StemMathDefinitionSchema>;
export type StemMathProjection = z.infer<typeof StemMathProjectionSchema>;
