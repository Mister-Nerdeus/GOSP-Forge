import fs from 'node:fs';
import path from 'node:path';
import {
  ControlFlowGraphSchema,
  ModulePackageSchema,
  PowerFlowGraphSchema,
  ProblemDefinitionSchema,
  ProductBindingSchema,
  ResourceFlowGraphSchema,
  type ValidationDiagnostic,
} from '@gosp/contracts';

type ProjectRef = {
  id: string;
  kind: string;
  path?: string;
  required?: boolean;
};

type ProjectWithRefs = {
  problemRef?: ProjectRef;
  refs?: ProjectRef[];
  refGroups: {
    problem?: ProjectRef;
    modules: ProjectRef[];
    products: ProjectRef[];
    graphs: ProjectRef[];
    estimates: ProjectRef[];
    scorecards: ProjectRef[];
    education: ProjectRef[];
    safety: ProjectRef[];
  };
};

function findRepoRoot(start = process.cwd()): string {
  let current = start;
  while (true) {
    const packagePath = path.join(current, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8')) as { name?: string };
      if (packageJson.name === 'gosp-forge') return current;
    }
    const parent = path.dirname(current);
    if (parent === current) return start;
    current = parent;
  }
}

function collectRefs(project: ProjectWithRefs): ProjectRef[] {
  const refs = [
    project.problemRef,
    ...(project.refs ?? []),
    project.refGroups.problem,
    ...project.refGroups.modules,
    ...project.refGroups.products,
    ...project.refGroups.graphs,
    ...project.refGroups.estimates,
    ...project.refGroups.scorecards,
    ...project.refGroups.education,
    ...project.refGroups.safety,
  ].filter((ref): ref is ProjectRef => Boolean(ref));
  const seen = new Set<string>();
  return refs.filter((ref) => {
    const key = [ref.id, ref.kind, ref.path ?? ''].join('\0');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function resolveAllowedPath(refPath: string) {
  const repoRoot = findRepoRoot();
  const normalized = refPath.replaceAll('\\', '/');
  if (path.isAbsolute(refPath) || normalized.includes('../') || normalized.startsWith('..')) {
    throw new Error('Only repository-relative example and education paths are allowed.');
  }
  if (
    !normalized.startsWith('examples/') &&
    !normalized.startsWith('docs/education/clean-water/')
  ) {
    throw new Error('Only known repository example paths may be validated by the API.');
  }
  const resolved = path.resolve(repoRoot, refPath);
  const relative = path.relative(repoRoot, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Resolved ref path escapes the repository root.');
  }
  return resolved;
}

function validateLoadedRef(ref: ProjectRef, value: unknown): ValidationDiagnostic[] {
  if (ref.kind === 'education') return [];
  const schemas =
    ref.kind === 'problem'
      ? [ProblemDefinitionSchema]
      : ref.kind === 'module'
        ? [ModulePackageSchema]
        : ref.kind === 'product'
          ? [ProductBindingSchema]
          : ref.kind === 'graph'
            ? [ResourceFlowGraphSchema, PowerFlowGraphSchema, ControlFlowGraphSchema]
            : [];

  if (schemas.length === 0) {
    return [
      {
        code: 'unknown-ref-kind',
        message: `Ref kind "${ref.kind}" is not supported by API repo-ref validation.`,
        severity: 'blocker',
        source: 'refs',
        refId: ref.id,
        refKind: ref.kind,
        path: ref.path,
      },
    ];
  }
  if (schemas.some((schema) => schema.safeParse(value).success)) return [];
  const actualKind =
    typeof value === 'object' && value && 'kind' in value ? String(value.kind) : 'unknown';
  return [
    {
      code: 'wrong-ref-kind',
      message: `Ref "${ref.id}" declares kind "${ref.kind}" but referenced file has schema kind "${actualKind}".`,
      severity: 'blocker',
      source: 'refs',
      refId: ref.id,
      refKind: ref.kind,
      path: ref.path,
    },
  ];
}

export function validateRepoRefs(project: ProjectWithRefs) {
  const errors: ValidationDiagnostic[] = [];
  const resolved: Array<{ id: string; kind: string; path: string }> = [];

  for (const ref of collectRefs(project)) {
    if (!ref.path) {
      if (ref.required === false) continue;
      errors.push({
        code: 'required-ref-missing-path',
        message: `Ref "${ref.id}" does not declare a path.`,
        severity: 'blocker',
        source: 'refs',
        refId: ref.id,
        refKind: ref.kind,
      });
      continue;
    }

    try {
      const resolvedPath = resolveAllowedPath(ref.path);
      const raw = fs.readFileSync(resolvedPath, 'utf8');
      const value = ref.kind === 'education' ? raw : JSON.parse(raw);
      if (
        typeof value === 'object' &&
        value &&
        'id' in value &&
        String(value.id) !== ref.id
      ) {
        errors.push({
          code: 'ref-id-mismatch',
          message: `Ref "${ref.id}" points to file with id "${String(value.id)}".`,
          severity: 'blocker',
          source: 'refs',
          refId: ref.id,
          refKind: ref.kind,
          path: ref.path,
        });
      }
      errors.push(...validateLoadedRef(ref, value));
      resolved.push({ id: ref.id, kind: ref.kind, path: resolvedPath });
    } catch (error) {
      errors.push({
        code: ref.required === false ? 'optional-ref-missing' : 'required-ref-missing',
        message: `Ref "${ref.id}" could not be loaded: ${
          error instanceof Error ? error.message : String(error)
        }`,
        severity: 'blocker',
        source: 'filesystem',
        refId: ref.id,
        refKind: ref.kind,
        path: ref.path,
      });
    }
  }

  return { resolved, errors, warnings: [] as ValidationDiagnostic[] };
}
