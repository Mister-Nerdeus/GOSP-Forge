import { createPanel, list, row } from './ProjectPanel';

export type ModuleSummary = {
  id: string;
  name: string;
  type: string;
  validationStatus?: string;
  capabilities?: {
    capabilities?: string[];
    supportsSimulation?: boolean;
    supportsEstimation?: boolean;
    requiresFabrication?: boolean;
  };
};

export function createModulePanel(modules: ModuleSummary[]) {
  return createPanel(
    'Modules',
    [
      row('Count', String(modules.length)),
      list(
        modules.map((module) => {
          const flags = [
            module.capabilities?.supportsSimulation ? 'simulation' : undefined,
            module.capabilities?.supportsEstimation ? 'estimation' : undefined,
            module.capabilities?.requiresFabrication ? 'fabrication' : undefined,
          ].filter(Boolean);
          return `${module.name} (${module.type}, ${module.validationStatus ?? 'unreviewed'}${
            flags.length ? `, ${flags.join('/')}` : ''
          })`;
        }),
      ),
    ],
    'wide',
  );
}
