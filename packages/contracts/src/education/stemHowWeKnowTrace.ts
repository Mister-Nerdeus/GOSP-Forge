import { z } from 'zod';
import { CanonicalJsonValueSchema, Sha256Schema } from '../canonical/identity.js';

export const StemTraceNodeCategorySchema = z.enum([
  'result', 'equation', 'model', 'material-input', 'source', 'assumption', 'implementation',
  'execution', 'claim', 'evidence', 'contradiction', 'readiness', 'proof-obligation',
]);

const TraceStatusSchema = z.enum(['resolved', 'unavailable', 'broken', 'not-declared']);

export const StemHowWeKnowTraceSchema = z.object({
  consequentialResult: z.object({
    resultPath: z.string().min(1),
    value: CanonicalJsonValueSchema,
    quantityId: z.string().min(1),
    claimId: z.string().min(1),
  }),
  modelEvidenceLadder: z.object({
    modelRepresentation: z.object({
      modelId: z.string().min(1),
      fidelityLevel: z.string().min(1),
      calibrationStatus: z.string().min(1),
    }),
    evidenceStrength: z.object({
      evidenceReadiness: z.string().min(1),
      acceptedEvidenceCount: z.number().int().nonnegative(),
      contradictionCount: z.number().int().nonnegative(),
    }),
    deploymentReadiness: z.string().min(1),
    professionalDisposition: z.string().min(1),
    independenceDisclosure: z.string().min(1),
  }),
  materialIdentity: z.object({
    inputHash: Sha256Schema,
    resultHash: Sha256Schema,
    contractIdentities: z.array(z.object({ id: z.string().min(1), revision: z.string().min(1), contentHash: Sha256Schema })),
    datasetIdentities: z.array(z.object({ id: z.string().min(1), revision: z.string().min(1), contentHash: Sha256Schema })),
  }),
  executionIdentity: z.object({
    runner: z.object({ id: z.string().min(1), revision: z.string().min(1), contentHash: Sha256Schema }),
    solver: z.object({ id: z.string().min(1), revision: z.string().min(1), contentHash: Sha256Schema }),
    environment: z.object({ os: z.string().min(1), runtime: z.string().min(1) }),
    replayStatus: z.enum(['verified-local-replay', 'failed']),
  }),
  nodes: z.array(z.object({
    id: z.string().min(1),
    category: StemTraceNodeCategorySchema,
    label: z.string().min(1),
    status: TraceStatusSchema,
    detail: z.string().min(1),
  })).min(1),
  edges: z.array(z.object({
    from: z.string().min(1),
    to: z.string().min(1),
    relationship: z.string().min(1),
    status: z.enum(['resolved', 'broken']),
  })),
  disclosures: z.array(z.string().min(1)).min(1),
}).superRefine((trace, context) => {
  const ids = trace.nodes.map((node) => node.id);
  if (new Set(ids).size !== ids.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Trace node IDs must be unique.' });
  }
  const known = new Set(ids);
  trace.edges.forEach((edge, index) => {
    if (!known.has(edge.from) || !known.has(edge.to)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['edges', index], message: 'Trace edge endpoints must exist as explicit nodes.' });
    }
    if (edge.status === 'resolved') {
      const target = trace.nodes.find((node) => node.id === edge.to);
      if (target && target.status === 'broken') {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ['edges', index], message: 'A resolved edge cannot terminate at a broken node.' });
      }
    }
  });
});

export type StemHowWeKnowTrace = z.infer<typeof StemHowWeKnowTraceSchema>;
