import { listExampleJson, readJsonFile, resolveRepoPath } from './exampleRegistry.js';
import { type ProjectRef, type RefDiagnostic, validateRefKind } from './refKindValidators.js';

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

function collectProjectRefs(project: {
  problemRef?: ProjectRef;
  refs?: ProjectRef[];
  refGroups?: {
    problem?: ProjectRef;
    modules?: ProjectRef[];
    products?: ProjectRef[];
    graphs?: ProjectRef[];
    estimates?: ProjectRef[];
    scorecards?: ProjectRef[];
    education?: ProjectRef[];
    safety?: ProjectRef[];
  };
}): ProjectRef[] {
  const refs = [
    project.problemRef,
    ...(project.refs ?? []),
    project.refGroups?.problem,
    ...(project.refGroups?.modules ?? []),
    ...(project.refGroups?.products ?? []),
    ...(project.refGroups?.graphs ?? []),
    ...(project.refGroups?.estimates ?? []),
    ...(project.refGroups?.scorecards ?? []),
    ...(project.refGroups?.education ?? []),
    ...(project.refGroups?.safety ?? []),
  ].filter((ref): ref is ProjectRef => Boolean(ref));
  const seen = new Set<string>();
  return refs.filter((ref) => {
    const key = [ref.id, ref.kind, ref.path ?? ''].join('\0');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function resolveProjectRefs(project: Parameters<typeof collectProjectRefs>[0]) {
  const errors: RefDiagnostic[] = [];
  const warnings: RefDiagnostic[] = [];
  const resolved: Array<{ id: string; kind: string; path: string }> = [];
  const documents: Array<{ id: string; kind: string; path: string; value: unknown }> = [];

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
      const refId =
        typeof value === 'object' && value && 'id' in value ? String(value.id) : undefined;
      if (refId && refId !== ref.id) {
        errors.push({
          code: 'ref-id-mismatch',
          message: `Ref "${ref.id}" points to file with id "${refId}".`,
          refId: ref.id,
          refKind: ref.kind,
          path: ref.path,
        });
      }

      const kindDiagnostics = validateRefKind(ref, value);
      errors.push(...kindDiagnostics.errors);
      warnings.push(...kindDiagnostics.warnings);
      if (kindDiagnostics.errors.length === 0) {
        const path = resolveRepoPath(ref.path);
        resolved.push({ id: ref.id, kind: ref.kind, path });
        documents.push({ id: ref.id, kind: ref.kind, path, value });
      }
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

  return { resolved, documents, errors, warnings };
}
