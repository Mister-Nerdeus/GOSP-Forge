import {
  BaselineSolutionSchema,
  CostEstimateSchema,
  ModulePackageSchema,
  ModuleScorecardSchema,
  ProblemDefinitionSchema,
  ProductBindingSchema,
  SimulationRunEnvelopeSchema,
  SystemScorecardSchema,
} from '@gosp/contracts';
import { z } from 'zod';
import { listExampleJson, readJsonFile, resolveRepoPath } from './exampleRegistry.js';

type ProjectRef = {
  id: string;
  kind: string;
  path?: string;
  required?: boolean;
};

type RefDiagnostic = {
  code: string;
  message: string;
  refId?: string;
  refKind?: string;
  path?: string;
};

const GraphLikeSchema = z.object({
  id: z.string().min(1),
  kind: z.string().includes('flow'),
  nodes: z.array(z.unknown()).min(1),
  edges: z.array(z.unknown()).default([]),
});

const RefKindSchemas: Record<string, z.ZodTypeAny[]> = {
  problem: [ProblemDefinitionSchema],
  module: [ModulePackageSchema],
  product: [ProductBindingSchema],
  graph: [GraphLikeSchema],
  estimate: [CostEstimateSchema],
  simulation: [SimulationRunEnvelopeSchema],
  scorecard: [ModuleScorecardSchema, SystemScorecardSchema],
  baseline: [BaselineSolutionSchema],
};

export function resolveExampleRefs() {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const file of listExampleJson()) {
    const value = readJsonFile(file) as { id?: string };
    if (!value.id) continue;
    if (seen.has(value.id)) duplicates.add(value.id);
    seen.add(value.id);
  }
  return { ids: [...seen].sort(), duplicates: [...duplicates].sort() };
}

function collectProjectRefs(project: { problemRef?: ProjectRef; refs?: ProjectRef[] }): ProjectRef[] {
  return [project.problemRef, ...(project.refs ?? [])].filter((ref): ref is ProjectRef => Boolean(ref));
}

function validateRefKind(ref: ProjectRef, value: unknown): RefDiagnostic | undefined {
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

  const actualKind = typeof value === 'object' && value && 'kind' in value ? String(value.kind) : 'unknown';
  return {
    code: 'wrong-ref-kind',
    message: `Ref "${ref.id}" declares kind "${ref.kind}" but referenced file has schema kind "${actualKind}".`,
    refId: ref.id,
    refKind: ref.kind,
    path: ref.path,
  };
}

export function resolveProjectRefs(project: { problemRef?: ProjectRef; refs?: ProjectRef[] }) {
  const errors: RefDiagnostic[] = [];
  const warnings: RefDiagnostic[] = [];
  const resolved: Array<{ id: string; kind: string; path: string }> = [];

  for (const ref of collectProjectRefs(project)) {
    if (!ref.path) {
      const diagnostic = {
        code: ref.required === false ? 'optional-ref-missing-path' : 'required-ref-missing-path',
        message: `Ref "${ref.id}" does not declare a path.`,
        refId: ref.id,
        refKind: ref.kind,
      };
      (ref.required === false ? warnings : errors).push(diagnostic);
      continue;
    }

    try {
      const value = readJsonFile(ref.path);
      const refId = typeof value === 'object' && value && 'id' in value ? String(value.id) : undefined;
      if (refId && refId !== ref.id) {
        errors.push({
          code: 'ref-id-mismatch',
          message: `Ref "${ref.id}" points to file with id "${refId}".`,
          refId: ref.id,
          refKind: ref.kind,
          path: ref.path,
        });
      }

      const kindError = validateRefKind(ref, value);
      if (kindError) errors.push(kindError);
      else resolved.push({ id: ref.id, kind: ref.kind, path: resolveRepoPath(ref.path) });
    } catch (error) {
      const diagnostic = {
        code: ref.required === false ? 'optional-ref-missing' : 'required-ref-missing',
        message: `Ref "${ref.id}" could not be loaded: ${error instanceof Error ? error.message : String(error)}`,
        refId: ref.id,
        refKind: ref.kind,
        path: ref.path,
      };
      (ref.required === false ? warnings : errors).push(diagnostic);
    }
  }

  return { resolved, errors, warnings };
}
