import { describe, expect, it } from 'vitest';
import { estimateFabricationFromProfile, estimateFdm, manufacturingRouteEstimate } from './index.js';
describe('fabrication foundation', () => {
  it('separates machine and labor time and warns on missing print rate', () => {
    const out = estimateFdm({ grams: 100 });
    expect(out.machineTimeMinutes).toBe(300);
    expect(out.laborMinutes).toBe(15);
    expect(out.warnings.length).toBe(1);
  });
  it('creates deterministic route estimates', () => {
    expect(manufacturingRouteEstimate()).toEqual(manufacturingRouteEstimate());
  });
  it('estimates fabrication profiles with separate machine and labor time', () => {
    const result = estimateFabricationFromProfile({
      materials: [{ id: 'pla', name: 'PLA', unit: 'g', quantity: 120 }],
      routes: [{ process: 'fdm-print', machineTimeMinutes: 300, laborMinutes: 20 }],
      labor: { setupMinutes: 15, assemblyMinutes: 20, inspectionMinutes: 10 },
    });

    expect(result.machineTimeMinutes).toBe(300);
    expect(result.routeLaborMinutes).toBe(20);
    expect(result.profileLaborMinutes).toBe(45);
    expect(result.laborMinutes).toBe(65);
    expect(result.materials[0].quantity).toBe(120);
  });
});
