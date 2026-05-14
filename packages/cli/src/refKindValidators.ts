import {
  BaselineSolutionSchema,
  ControlFlowGraphSchema,
  CostEstimateSchema,
  ModulePackageSchema,
  ModuleScorecardSchema,
  PowerFlowGraphSchema,
  ProblemDefinitionSchema,
  ProductBindingSchema,
  ResourceFlowGraphSchema,
  SimulationRunEnvelopeSchema,
  SystemScorecardSchema,
} from '@gosp/contracts';
import type { z } from 'zod';

export type RefDiagnostic = {
  code: string;
  message: string;
  refId?: string;
  refKind?: string;
  path?: string;
};

export type ProjectRef = {
  id: string;
  kind: string;
  path?: string;
  required?: boolean;
};

const RefKindSchemas: Record<string, z.ZodTypeAny[]> = {
  problem: [ProblemDefinitionSchema],
  module: [ModulePackageSchema],
  product: [ProductBindingSchema],
  graph: [ResourceFlowGraphSchema, PowerFlowGraphSchema, ControlFlowGraphSchema],
  estimate: [CostEstimateSchema],
  simulation: [SimulationRunEnvelopeSchema],
  scorecard: [ModuleScorecardSchema, SystemScorecardSchema],
  baseline: [BaselineSolutionSchema],
};

export function validateRefKind(ref: ProjectRef, value: unknown): RefDiagnostic | undefined {
  const schemas = RefKindSchemas[ref.kind];
  if (!schemas) {
    return {
      code: 'unknown-ref-kind',
      message: `Ref kind "${ref.kind}" is not supported by validation.`,
      refId: ref.id,
      refKind: ref.kind,
      path: ref.path,
    };
  }

  if (schemas.some((schema) => schema.safeParse(value).success)) return undefined;

  const actualKind =
    typeof value === 'object' && value && 'kind' in value ? String(value.kind) : 'unknown';
  return {
    code: 'wrong-ref-kind',
    message: `Ref "${ref.id}" declares kind "${ref.kind}" but referenced file has schema kind "${actualKind}".`,
    refId: ref.id,
    refKind: ref.kind,
    path: ref.path,
  };
}
