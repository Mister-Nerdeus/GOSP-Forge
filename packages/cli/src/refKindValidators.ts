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
  validateModuleSafety,
} from '@gosp/contracts';
import type { z } from 'zod';

export type RefDiagnostic = {
  code: string;
  message: string;
  severity?: 'warning' | 'blocker';
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

export function validateRefKind(ref: ProjectRef, value: unknown) {
  const schemas = RefKindSchemas[ref.kind];
  if (!schemas) {
    return {
      errors: [
        {
          code: 'unknown-ref-kind',
          message: `Ref kind "${ref.kind}" is not supported by validation.`,
          refId: ref.id,
          refKind: ref.kind,
          path: ref.path,
        },
      ],
      warnings: [],
    };
  }

  if (schemas.some((schema) => schema.safeParse(value).success)) {
    const safetyIssues =
      ref.kind === 'module'
        ? validateModuleSafety(value).map((issue) => ({
            code: issue.code,
            message: issue.message,
            severity: issue.severity,
            refId: ref.id,
            refKind: ref.kind,
            path: issue.path ?? ref.path,
          }))
        : [];
    return {
      errors: safetyIssues.filter((issue) => issue.severity === 'blocker'),
      warnings: safetyIssues.filter((issue) => issue.severity === 'warning'),
    };
  }

  const actualKind =
    typeof value === 'object' && value && 'kind' in value ? String(value.kind) : 'unknown';
  return {
    errors: [
      {
        code: 'wrong-ref-kind',
        message: `Ref "${ref.id}" declares kind "${ref.kind}" but referenced file has schema kind "${actualKind}".`,
        refId: ref.id,
        refKind: ref.kind,
        path: ref.path,
      },
    ],
    warnings: [],
  };
}
