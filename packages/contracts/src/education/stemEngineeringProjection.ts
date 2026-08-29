import { z } from 'zod';
import { CanonicalJsonValueSchema } from '../canonical/identity.js';
import { HazardSchema } from '../canonical/programGraph.js';

export const StemEngineeringDefinitionSchema = z.object({
  designVariables: z.array(z.object({
    id: z.string().min(1),
    quantityId: z.string().min(1),
    inputPath: z.string().min(1),
    changePolicy: z.enum(['allowed-for-comparison', 'controlled', 'not-allowed']),
    rationale: z.string().min(1),
  })).default([]),
  objectives: z.array(z.object({
    id: z.string().min(1),
    statement: z.string().min(1),
    rule: z.discriminatedUnion('kind', [
      z.object({
        kind: z.literal('numeric-result'),
        resultPath: z.string().min(1),
        direction: z.enum(['maximize', 'minimize']),
      }),
      z.object({
        kind: z.literal('preserve-input'),
        inputPath: z.string().min(1),
      }),
    ]),
  })).min(1),
  hazards: z.array(HazardSchema).default([]),
  disclosures: z.array(z.string().min(1)).min(1),
}).superRefine((definition, context) => {
  const ids = new Set<string>();
  definition.objectives.forEach((objective, index) => {
    if (ids.has(objective.id)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['objectives', index, 'id'],
        message: `Duplicate engineering objective id ${objective.id}.`,
      });
    }
    ids.add(objective.id);
  });
});

export const StemEngineeringProjectionSchema = z.object({
  requirements: z.array(z.object({
    id: z.string().min(1),
    statement: z.string().min(1),
    obligation: z.enum(['shall', 'should', 'may']),
    role: z.enum(['hard-gate', 'objective']),
    status: z.string().min(1),
    verificationMethod: z.string().min(1).optional(),
  })).min(1),
  hardGates: z.array(z.object({
    constraintId: z.string().min(1),
    statement: z.string().min(1),
    baseline: z.object({ actual: CanonicalJsonValueSchema, passed: z.boolean() }),
    candidate: z.object({ actual: CanonicalJsonValueSchema, passed: z.boolean() }),
    changed: z.boolean(),
    margin: z.object({
      status: z.enum(['available', 'not-applicable', 'not-declared']),
      baseline: z.number().finite().optional(),
      candidate: z.number().finite().optional(),
      unit: z.string().min(1).optional(),
      explanation: z.string().min(1),
    }),
  })).min(1),
  unresolvedProofObligations: z.object({
    baseline: z.array(z.object({ id: z.string().min(1), description: z.string().min(1) })),
    candidate: z.array(z.object({ id: z.string().min(1), description: z.string().min(1) })),
  }),
  designVariables: z.array(z.object({
    id: z.string().min(1),
    quantityId: z.string().min(1),
    inputPath: z.string().min(1),
    changePolicy: z.enum(['allowed-for-comparison', 'controlled', 'not-allowed']),
    changed: z.boolean(),
    baseline: CanonicalJsonValueSchema.optional(),
    candidate: CanonicalJsonValueSchema.optional(),
    rationale: z.string().min(1),
  })),
  hazards: z.array(z.object({
    id: z.string().min(1),
    description: z.string().min(1),
    severity: z.string().min(1),
    likelihood: z.string().min(1),
    status: z.string().min(1),
    mitigationStatus: z.enum(['declared', 'not-declared']),
  })),
  objectives: z.array(z.object({
    id: z.string().min(1),
    statement: z.string().min(1),
    assessmentKind: z.enum(['numeric-result', 'preserve-input']),
    baseline: CanonicalJsonValueSchema.optional(),
    candidate: CanonicalJsonValueSchema.optional(),
    preference: z.enum(['baseline', 'candidate', 'equivalent', 'not-assessed']),
    explanation: z.string().min(1),
  })).min(1),
  tradeoff: z.object({
    status: z.enum(['conflict', 'aligned', 'single-objective', 'not-assessed']),
    decision: z.enum(['no-universal-winner', 'baseline-preferred', 'candidate-preferred', 'equivalent', 'not-assessed']),
    explanation: z.string().min(1),
  }),
  revisionExplanation: z.object({
    summary: z.string().min(1),
    changedInputs: z.array(z.string().min(1)),
    resultChanges: z.array(z.string().min(1)),
  }),
  disclosures: z.array(z.string().min(1)).min(1),
}).superRefine((projection, context) => {
  if (
    projection.tradeoff.status === 'conflict' &&
    projection.tradeoff.decision !== 'no-universal-winner'
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['tradeoff', 'decision'],
      message: 'Conflicting objectives must not declare a universal winner.',
    });
  }
});

export type StemEngineeringDefinition = z.infer<typeof StemEngineeringDefinitionSchema>;
export type StemEngineeringProjection = z.infer<typeof StemEngineeringProjectionSchema>;
