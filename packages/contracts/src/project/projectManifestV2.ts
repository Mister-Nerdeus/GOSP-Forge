import { z } from 'zod';
import { IdSchema, VersionSchema } from '../shared/primitives.js';
import { DesignModeSchema } from '../modes/designMode.js';
import { RefSchema } from '../shared/ref.js';
import { DesignDocumentSchema } from './designDocument.js';
import { ProjectScenarioSettingsSchema } from './projectScenarioSettings.js';

type ProjectRef = {
  id: string;
  kind: string;
  path?: string;
  required?: boolean;
};

const TypedProjectRefsSchema = z
  .object({
    problem: RefSchema.optional(),
    modules: z.array(RefSchema).default([]),
    products: z.array(RefSchema).default([]),
    graphs: z.array(RefSchema).default([]),
    estimates: z.array(RefSchema).default([]),
    scorecards: z.array(RefSchema).default([]),
    education: z.array(RefSchema).default([]),
    safety: z.array(RefSchema).default([]),
  })
  .default({});

function sameRef(a: ProjectRef, b: ProjectRef) {
  return (
    a.id === b.id &&
    a.kind === b.kind &&
    (a.path ?? '') === (b.path ?? '') &&
    (a.required ?? true) === (b.required ?? true)
  );
}

function collectGroupedRefs(project: {
  refGroups: Partial<z.infer<typeof TypedProjectRefsSchema>>;
}): ProjectRef[] {
  const refs = [
    project.refGroups.problem,
    ...(project.refGroups.modules ?? []),
    ...(project.refGroups.products ?? []),
    ...(project.refGroups.graphs ?? []),
    ...(project.refGroups.estimates ?? []),
    ...(project.refGroups.scorecards ?? []),
    ...(project.refGroups.education ?? []),
    ...(project.refGroups.safety ?? []),
  ];
  return refs.filter(Boolean).map((ref) => ref as ProjectRef);
}

export function detectLegacyRefDuplicates(project: {
  problemRef?: ProjectRef;
  refs?: ProjectRef[];
  refGroups: Partial<z.infer<typeof TypedProjectRefsSchema>>;
}) {
  const legacyRefs = [project.problemRef, ...(project.refs ?? [])].filter(
    (ref): ref is ProjectRef => Boolean(ref),
  );
  const groupedRefs = collectGroupedRefs(project);
  const warnings: Array<{ code: string; message: string; refId: string; refKind: string }> = [];
  const errors: Array<{ code: string; message: string; refId: string; refKind: string }> = [];

  for (const legacy of legacyRefs) {
    const grouped = groupedRefs.find((ref) => ref.id === legacy.id);
    if (!grouped) continue;
    if (sameRef(legacy, grouped)) {
      warnings.push({
        code: 'legacy-ref-duplicate',
        message: `Ref "${legacy.id}" appears in legacy refs and canonical refGroups.`,
        refId: legacy.id,
        refKind: legacy.kind,
      });
    } else {
      errors.push({
        code: 'legacy-ref-mismatch',
        message: `Ref "${legacy.id}" differs between legacy refs and canonical refGroups.`,
        refId: legacy.id,
        refKind: legacy.kind,
      });
    }
  }

  return { warnings, errors };
}

export const ProjectManifestV2Schema = z
  .object({
    kind: z.literal('ProjectManifestV2'),
    manifestVersion: z.literal('2'),
    id: IdSchema,
    version: VersionSchema,
    title: z.string().min(1),
    mode: DesignModeSchema,
    problemRef: RefSchema.optional(),
    refs: z.array(RefSchema).default([]),
    refGroups: TypedProjectRefsSchema,
    scenarioSettings: ProjectScenarioSettingsSchema.optional(),
    design: DesignDocumentSchema,
  })
  .superRefine((v, c) => {
    const problem = v.refGroups.problem ?? v.problemRef;
    if (v.mode === 'scoring' && !problem)
      c.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Scoring projects require a problem ref',
      });
    if (v.mode === 'scoring' && !v.scenarioSettings?.cleanWater)
      c.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Scoring projects require explicit clean-water scenario settings',
        path: ['scenarioSettings', 'cleanWater'],
      });

    const groupKinds: Array<[string, string, Array<{ kind: string; id: string }>]> = [
      ['modules', 'module', v.refGroups.modules],
      ['products', 'product', v.refGroups.products],
      ['graphs', 'graph', v.refGroups.graphs],
      ['estimates', 'estimate', v.refGroups.estimates],
      ['scorecards', 'scorecard', v.refGroups.scorecards],
      ['education', 'education', v.refGroups.education],
    ];

    if (v.refGroups.problem && v.refGroups.problem.kind !== 'problem') {
      c.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'refGroups.problem must contain a problem ref',
        path: ['refGroups', 'problem'],
      });
    }

    for (const [group, kind, refs] of groupKinds) {
      refs.forEach((ref, index) => {
        if (ref.kind !== kind) {
          c.addIssue({
            code: z.ZodIssueCode.custom,
            message: `refGroups.${group} entries must contain ${kind} refs`,
            path: ['refGroups', group, index],
          });
        }
      });
    }

    for (const error of detectLegacyRefDuplicates(v).errors) {
      c.addIssue({
        code: z.ZodIssueCode.custom,
        message: error.message,
        path: ['refs'],
      });
    }
  });
