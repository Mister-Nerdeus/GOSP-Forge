import { z } from 'zod';
import { GraphBaseObjectSchema, validateGraphTopology } from './graphBase.js';

export const ResourceFlowGraphSchema = GraphBaseObjectSchema.extend({
  kind: z.literal('ResourceFlowGraph'),
  resourceType: z.enum(['water', 'air', 'material', 'mixed']),
}).superRefine(validateGraphTopology);
