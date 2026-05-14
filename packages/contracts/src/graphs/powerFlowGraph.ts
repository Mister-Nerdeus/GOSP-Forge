import { z } from 'zod';
import { GraphBaseObjectSchema, validateGraphTopology } from './graphBase.js';

export const PowerFlowGraphSchema = GraphBaseObjectSchema.extend({
  kind: z.literal('PowerFlowGraph'),
  powerType: z.enum(['dc-low-voltage', 'ac-mains', 'manual', 'mixed']),
}).superRefine(validateGraphTopology);
