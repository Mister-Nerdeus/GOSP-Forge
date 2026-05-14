import { z } from 'zod';
import { IdSchema } from '../shared/primitives.js';

export const GraphNodeSchema = z.object({
  id: IdSchema,
  label: z.string().min(1).optional(),
  moduleId: IdSchema.optional(),
});

export const GraphEdgeSchema = z.object({
  id: IdSchema,
  from: IdSchema,
  to: IdSchema,
  label: z.string().min(1).optional(),
});

export function validateGraphTopology(
  value: { nodes: Array<{ id: string }>; edges: Array<{ id: string; from: string; to: string }> },
  context: z.RefinementCtx,
) {
  const nodeIds = new Set<string>();
  value.nodes.forEach((node, index) => {
    if (nodeIds.has(node.id)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate graph node id "${node.id}"`,
        path: ['nodes', index, 'id'],
      });
    }
    nodeIds.add(node.id);
  });

  const edgeIds = new Set<string>();
  value.edges.forEach((edge, index) => {
    if (edgeIds.has(edge.id)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate graph edge id "${edge.id}"`,
        path: ['edges', index, 'id'],
      });
    }
    edgeIds.add(edge.id);

    if (!nodeIds.has(edge.from)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Graph edge "${edge.id}" references missing from node "${edge.from}"`,
        path: ['edges', index, 'from'],
      });
    }

    if (!nodeIds.has(edge.to)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Graph edge "${edge.id}" references missing to node "${edge.to}"`,
        path: ['edges', index, 'to'],
      });
    }
  });
}

export const GraphBaseObjectSchema = z.object({
  id: IdSchema,
  projectId: IdSchema,
  nodes: z.array(GraphNodeSchema).min(1),
  edges: z.array(GraphEdgeSchema).default([]),
  notes: z.array(z.string().min(1)).default([]),
});

export const GraphBaseSchema = GraphBaseObjectSchema.superRefine(validateGraphTopology);
