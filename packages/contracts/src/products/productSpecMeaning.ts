import { z } from 'zod';
export const ProductSpecTargetFields = [
  'pumpFlowLpm',
  'pumpCurrentA',
  'voltageV',
  'filterCapacityL',
  'filterEfficiency',
  'turbidityRange',
  'replacementIntervalYears',
  'annualMaintenanceCost',
] as const;
export const ProductSpecMeaningSchema = z.object({
  affects: z.array(z.enum(['simulation', 'cost', 'labor', 'safety', 'compatibility'])).min(1),
  explanation: z.string().min(1),
  targetField: z.string().min(1),
});
