import { z } from 'zod';
import { GraphBaseObjectSchema, validateGraphTopology } from './graphBase.js';

export const ControlFlowGraphSchema = GraphBaseObjectSchema.extend({
  kind: z.literal('ControlFlowGraph'),
  controlType: z.enum(['manual', 'logic', 'sensor-feedback', 'mixed']),
}).superRefine(validateGraphTopology);
