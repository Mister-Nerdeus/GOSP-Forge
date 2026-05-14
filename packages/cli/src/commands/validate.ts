import { ProjectManifestV2Schema } from '@gosp/contracts';
import { readJsonFile } from '../exampleRegistry.js';
import { resolveExampleRefs, resolveProjectRefs } from '../refResolver.js';

export function validateCommand(file: string) {
  const parsed = ProjectManifestV2Schema.safeParse(readJsonFile(file));
  const examples = resolveExampleRefs();
  const projectRefs = parsed.success
    ? resolveProjectRefs(parsed.data)
    : { resolved: [], errors: [], warnings: [] };
  const duplicateErrors = examples.duplicates.map((id) => ({
    code: 'duplicate-id',
    message: `Duplicate example id "${id}".`,
    refId: id,
  }));
  const errors = [
    ...duplicateErrors,
    ...projectRefs.errors,
    ...(parsed.success
      ? []
      : parsed.error.issues.map((issue) => ({
          code: 'schema-invalid',
          message: issue.message,
          path: issue.path.join('.'),
        }))),
  ];

  return {
    ok: parsed.success && errors.length === 0,
    file,
    schema: parsed.success ? 'ProjectManifestV2' : 'invalid',
    refs: {
      examples,
      project: projectRefs,
    },
    errors,
    warnings: projectRefs.warnings,
  };
}
