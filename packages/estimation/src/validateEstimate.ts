import { CostEstimateSchema } from '@gosp/contracts';
export function validateEstimate(value: unknown) {
  return CostEstimateSchema.safeParse(value);
}
