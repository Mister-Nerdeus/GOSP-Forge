import { ProjectManifestV2Schema, ValidationResultSchema } from '@gosp/contracts';
import { validateRepoRefs } from './validateRepoRefs.js';

const schemaOnlyWarning =
  'API validation does not resolve repository refs in this foundation build.';

function schemaErrors(error: { issues: Array<{ path: Array<string | number>; message: string }> }) {
  return error.issues.map((issue) => ({
    code: 'schema-invalid',
    path: issue.path.join('.'),
    message: issue.message,
    severity: 'blocker' as const,
    source: 'schema' as const,
  }));
}

function apiRepoValidationAllowed() {
  return process.env.NODE_ENV !== 'production' || process.env.GOSP_API_ENABLE_REPO_VALIDATION === '1';
}

export function validateProjectBody(body: unknown, options: { mode?: 'schema-only' | 'repo' } = {}) {
  const parsed = ProjectManifestV2Schema.safeParse(body);
  if (!parsed.success) {
    return {
      status: 422,
      body: {
        ok: false,
        schema: 'ProjectManifestV2',
        validationMode: 'schema-only',
        errors: schemaErrors(parsed.error),
        warnings: [schemaOnlyWarning],
      },
    };
  }

  const project = parsed.data;
  const declaredRefCount =
    (project.refs?.length ?? 0) +
    (project.problemRef ? 1 : 0) +
    (project.refGroups.problem ? 1 : 0) +
    project.refGroups.modules.length +
    project.refGroups.products.length +
    project.refGroups.graphs.length +
    project.refGroups.estimates.length +
    project.refGroups.scorecards.length +
    project.refGroups.education.length +
    project.refGroups.safety.length;

  if (options.mode === 'repo') {
    if (!apiRepoValidationAllowed()) {
      return {
        status: 403,
        body: ValidationResultSchema.parse({
          ok: false,
          schema: 'ProjectManifestV2',
          validationMode: 'repo-refs',
          projectId: project.id,
          mode: project.mode,
          refs: { declared: declaredRefCount },
          errors: [
            {
              code: 'repo-validation-disabled',
              message: 'API repo-ref validation is available only in local/dev mode.',
              severity: 'blocker',
              source: 'mode',
            },
          ],
          warnings: [],
        }),
      };
    }

    const repoRefs = validateRepoRefs(project);
    return {
      status: repoRefs.errors.length > 0 ? 422 : 200,
      body: ValidationResultSchema.parse({
        ok: repoRefs.errors.length === 0,
        schema: 'ProjectManifestV2',
        validationMode: 'repo-refs',
        projectId: project.id,
        mode: project.mode,
        refs: {
          declared: declaredRefCount,
          resolved: repoRefs.resolved.length,
        },
        errors: repoRefs.errors,
        warnings: repoRefs.warnings,
      }),
    };
  }

  const result = {
    status: 200,
    body: {
      ok: true,
      schema: 'ProjectManifestV2',
      validationMode: 'schema-only',
      projectId: project.id,
      mode: project.mode,
      refs: {
        declared: declaredRefCount,
      },
      errors: [],
      warnings: [schemaOnlyWarning],
    },
  };
  return result;
}
