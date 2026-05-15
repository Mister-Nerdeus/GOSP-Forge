import {
  detectLegacyRefDuplicates,
  ProjectManifestV2Schema,
  ValidationResultSchema,
} from '@gosp/contracts';
import { readJsonFile } from '../exampleRegistry.js';
import { resolveExampleRefs, resolveProjectRefs } from '../refResolver.js';

export function validateCommand(file: string) {
  const parsed = ProjectManifestV2Schema.safeParse(readJsonFile(file));
  const examples = resolveExampleRefs();
  const projectRefs = parsed.success
    ? resolveProjectRefs(parsed.data)
    : { resolved: [], errors: [], warnings: [] };
  const legacyDuplicates = parsed.success
    ? detectLegacyRefDuplicates(parsed.data)
    : { errors: [], warnings: [] };
  const duplicateErrors = examples.duplicates.map((id) => ({
    code: 'duplicate-id',
    message: `Duplicate example id "${id}".`,
    severity: 'blocker' as const,
    source: 'registry' as const,
    refId: id,
  }));
  const errors = [
    ...duplicateErrors,
    ...legacyDuplicates.errors.map((error) => ({
      ...error,
      severity: 'blocker' as const,
      source: 'refs' as const,
    })),
    ...projectRefs.errors,
    ...(parsed.success
      ? []
      : parsed.error.issues.map((issue) => ({
          code: 'schema-invalid',
          message: issue.message,
          severity: 'blocker' as const,
          source: 'schema' as const,
          path: issue.path.join('.'),
        }))),
  ];
  const warnings = [
    ...legacyDuplicates.warnings.map((warning) => ({
      ...warning,
      severity: 'warning' as const,
      source: 'refs' as const,
    })),
    ...projectRefs.warnings,
  ];

  return ValidationResultSchema.parse({
    ok: parsed.success && errors.length === 0,
    file,
    schema: 'ProjectManifestV2',
    validationMode: 'repo-refs',
    projectId: parsed.success ? parsed.data.id : undefined,
    mode: parsed.success ? parsed.data.mode : undefined,
    refs: {
      declared: parsed.success
        ? (parsed.data.refs?.length ?? 0) +
          (parsed.data.problemRef ? 1 : 0) +
          (parsed.data.refGroups.problem ? 1 : 0) +
          parsed.data.refGroups.modules.length +
          parsed.data.refGroups.products.length +
          parsed.data.refGroups.graphs.length +
          parsed.data.refGroups.estimates.length +
          parsed.data.refGroups.scorecards.length +
          parsed.data.refGroups.education.length +
          parsed.data.refGroups.safety.length
        : 0,
      resolved: projectRefs.resolved.length,
    },
    errors,
    warnings,
  });
}
