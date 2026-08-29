import { z } from 'zod';
import { CanonicalJsonValueSchema } from '../canonical/identity.js';
import { StemMathProjectionSchema } from './stemMathProjection.js';
import { StemScienceProjectionSchema } from './stemScienceProjection.js';
import { StemEngineeringProjectionSchema } from './stemEngineeringProjection.js';
import { StemTechnologyProjectionSchema } from './stemTechnologyProjection.js';

export const StemLearningDepthSchema = z.enum([
  'explore',
  'measure',
  'model',
  'solve',
  'verify',
  'research-professional',
]);

export const StemSystemProjectionSchema = z.object({
  projectionVersion: z.literal('0.1.0'),
  learningDepth: StemLearningDepthSchema,
  problem: z.object({
    title: z.string().min(1),
    statement: z.string().min(1),
  }),
  boundary: z.object({
    challenge: z.object({ id: z.string().min(1), revision: z.string().min(1) }),
    scenario: z.object({ id: z.string().min(1), revision: z.string().min(1) }),
    model: z.object({ id: z.string().min(1), revision: z.string().min(1) }),
    workflow: z.object({ id: z.string().min(1), revision: z.string().min(1) }),
  }),
  systemElements: z.array(z.object({
    id: z.string().min(1),
    revision: z.string().min(1),
  })).default([]),
  systemMap: z.object({
    declarationStatus: z.enum(['declared', 'partially-declared', 'not-declared']),
    elements: z.array(z.object({
      id: z.string().min(1),
      revision: z.string().min(1),
      name: z.string().min(1),
      elementType: z.enum([
        'physical',
        'digital',
        'logical',
        'process',
        'service',
        'human',
        'hybrid',
        'unknown',
      ]),
      status: z.string().min(1),
      resolutionStatus: z.enum(['resolved', 'unresolved']),
    })).default([]),
    interfaces: z.array(z.object({
      id: z.string().min(1),
      revision: z.string().min(1),
      name: z.string().min(1),
      interfaceType: z.enum([
        'resource',
        'power',
        'data',
        'control',
        'process',
        'physical',
        'human',
      ]),
      fromElementId: z.string().min(1),
      toElementId: z.string().min(1),
      direction: z.enum(['unidirectional', 'bidirectional']),
      unit: z.string().min(1).optional(),
      status: z.string().min(1),
      resolutionStatus: z.enum(['resolved', 'unresolved']),
    })).default([]),
    disclosures: z.array(z.string().min(1)).min(1),
  }),
  variableRoles: z.object({
    inputs: z.array(z.object({
      path: z.string().min(1),
      value: CanonicalJsonValueSchema,
      status: z.literal('submitted'),
    })).default([]),
    controlled: z.array(z.object({
      path: z.string().min(1),
      value: CanonicalJsonValueSchema,
      status: z.literal('controlled'),
    })).default([]),
    changeablePaths: z.array(z.string().min(1)).default([]),
    outputs: z.array(z.object({
      path: z.string().min(1),
      value: CanonicalJsonValueSchema,
      status: z.literal('calculated'),
    })).default([]),
    measurementStatus: z.enum(['declared', 'not-declared']),
    measuredOutputs: z.array(z.object({
      path: z.string().min(1),
      value: CanonicalJsonValueSchema,
      status: z.literal('measured'),
    })).default([]),
  }),
  math: StemMathProjectionSchema,
  science: StemScienceProjectionSchema,
  engineeringDecision: StemEngineeringProjectionSchema,
  technology: StemTechnologyProjectionSchema,
  controlledConditions: z.object({
    environment: z.record(CanonicalJsonValueSchema).default({}),
    operatingConditions: z.record(CanonicalJsonValueSchema).default({}),
    parameters: z.record(CanonicalJsonValueSchema).default({}),
  }),
  assumptions: z.array(z.object({
    id: z.string().min(1),
    statement: z.string().min(1),
    value: CanonicalJsonValueSchema.optional(),
    unit: z.string().min(1).optional(),
    material: z.boolean(),
  })).default([]),
  engineering: z.object({
    requirements: z.array(z.object({
      id: z.string().min(1),
      statement: z.string().min(1),
      role: z.enum(['hard-gate', 'objective']),
    })).default([]),
    constraints: z.array(z.object({
      id: z.string().min(1),
      statement: z.string().min(1),
      parameter: z.string().min(1).optional(),
      operator: z.string().min(1).optional(),
      value: CanonicalJsonValueSchema.optional(),
      unit: z.string().min(1).optional(),
    })).default([]),
  }),
  model: z.object({
    name: z.string().min(1),
    modelType: z.string().min(1),
    fidelityLevel: z.string().min(1),
    calibrationStatus: z.string().min(1),
    solver: z.object({ id: z.string().min(1), revision: z.string().min(1) }),
    limitations: z.array(z.string().min(1)).min(1),
  }),
  workflow: z.array(z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    action: z.string().min(1),
  })).min(1),
  evidenceStatus: z.object({
    claim: z.string().min(1),
    evidenceReadiness: z.string().min(1),
    deploymentReadiness: z.string().min(1),
    professionalDisposition: z.string().min(1),
    evidence: z.array(z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      evidenceType: z.string().min(1),
      readiness: z.string().min(1),
      status: z.string().min(1),
    })).default([]),
    unresolvedProofObligations: z.array(z.object({
      id: z.string().min(1),
      description: z.string().min(1),
    })).default([]),
  }),
  disclosure: z.string().min(1),
});

export type StemLearningDepth = z.infer<typeof StemLearningDepthSchema>;
export type StemSystemProjection = z.infer<typeof StemSystemProjectionSchema>;
