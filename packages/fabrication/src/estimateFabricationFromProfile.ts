import { laborEstimate } from './laborEstimate.js';

type FabricationProfileLike = {
  materials?: Array<{
    id: string;
    name: string;
    unit: string;
    quantity: number;
  }>;
  routes?: Array<{
    process: string;
    machineTimeMinutes?: number;
    laborMinutes?: number;
  }>;
  labor?: {
    setupMinutes?: number;
    assemblyMinutes?: number;
    inspectionMinutes?: number;
  };
};

export function estimateFabricationFromProfile(profile: FabricationProfileLike) {
  const warnings: string[] = [];
  const machineTimeMinutes = Number(
    (profile.routes ?? [])
      .reduce((sum, route) => {
        if (route.machineTimeMinutes === undefined && route.process !== 'hand-assembly') {
          warnings.push(`Missing machine time for fabrication route ${route.process}; defaulted to 0.`);
        }
        return sum + (route.machineTimeMinutes ?? 0);
      }, 0)
      .toFixed(2),
  );
  const routeLaborMinutes = laborEstimate(
    ...(profile.routes ?? []).map((route) => route.laborMinutes ?? 0),
  );
  const profileLaborMinutes = laborEstimate(
    profile.labor?.setupMinutes ?? 0,
    profile.labor?.assemblyMinutes ?? 0,
    profile.labor?.inspectionMinutes ?? 0,
  );
  const laborMinutes = Number((routeLaborMinutes + profileLaborMinutes).toFixed(2));

  return {
    materials: profile.materials ?? [],
    machineTimeMinutes,
    routeLaborMinutes,
    profileLaborMinutes,
    laborMinutes,
    confidence: {
      level: warnings.length ? ('low' as const) : ('medium' as const),
      rationale: warnings.length
        ? 'Fabrication profile has missing timing data.'
        : 'Fabrication profile supplied material, machine, and labor data.',
    },
    warnings,
  };
}
