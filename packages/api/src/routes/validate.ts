import { ProjectManifestV2Schema } from '@gosp/contracts';

function schemaErrors(error: { issues: Array<{ path: Array<string | number>; message: string }> }) {
  return error.issues.map((issue) => ({
    code: 'schema-invalid',
    path: issue.path.join('.'),
    message: issue.message,
  }));
}

export function validateProjectBody(body: unknown) {
  const parsed = ProjectManifestV2Schema.safeParse(body);
  if (!parsed.success) {
    return {
      status: 422,
      body: {
        ok: false,
        schema: 'ProjectManifestV2',
        errors: schemaErrors(parsed.error),
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

  return {
    status: 200,
    body: {
      ok: true,
      schema: 'ProjectManifestV2',
      projectId: project.id,
      mode: project.mode,
      refs: {
        declared: declaredRefCount,
      },
      warnings: [],
    },
  };
}
