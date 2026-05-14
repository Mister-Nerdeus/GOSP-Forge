import { z } from 'zod';
import { IdSchema, VersionSchema } from '../shared/primitives.js';
import { DesignModeSchema } from '../modes/designMode.js';
import { RefSchema } from '../shared/ref.js';
import { DesignDocumentSchema } from './designDocument.js';

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
    design: DesignDocumentSchema,
  })
  .superRefine((v, c) => {
    const problem = v.refGroups.problem ?? v.problemRef;
    if (v.mode === 'scoring' && !problem)
      c.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Scoring projects require a problem ref',
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
  });
