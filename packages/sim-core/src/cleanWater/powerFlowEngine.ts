import { checkPowerCompatibility, type PowerComponent } from './powerCompatibility.js';
export function simulatePowerFlow(source: PowerComponent, loads: PowerComponent[]) {
  const checks = loads.map((load) => ({
    loadId: load.id,
    ...checkPowerCompatibility(source, load),
  }));
  return { checks, compatible: checks.every((c) => c.compatible) };
}
