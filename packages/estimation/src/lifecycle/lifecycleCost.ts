import { maintenanceEstimate } from './maintenanceEstimate.js';
import { replacementCount } from './replacementSchedule.js';
export function lifecycleCost(input: {
  horizonYears: number;
  annualMaintenance: number;
  replacementCost: number;
  replacementIntervalYears?: number;
}) {
  const replacements = replacementCount(input.horizonYears, input.replacementIntervalYears);
  const maintenanceCost = maintenanceEstimate(input.horizonYears, input.annualMaintenance);
  const replacementReserve = replacements.count * input.replacementCost;
  return {
    horizonYears: input.horizonYears,
    maintenanceCost,
    replacementReserve,
    total: Number((maintenanceCost + replacementReserve).toFixed(2)),
    warnings: replacements.warning ? [replacements.warning] : [],
  };
}
