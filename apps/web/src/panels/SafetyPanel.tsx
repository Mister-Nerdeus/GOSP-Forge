import { createPanel, list, row } from './ProjectPanel';
import type { ModuleSummary } from './ModulePanel';

export type SafetyModuleSummary = ModuleSummary & {
  safetyProfile?: {
    category?: string;
    notes?: string[];
    realWorldUseLimit?: string;
  };
};

export function createSafetyPanel(modules: SafetyModuleSummary[]) {
  const modulesWithSafety = modules.filter((module) => module.safetyProfile);

  return createPanel(
    'Safety',
    [
      row('Profiles', `${modulesWithSafety.length} of ${modules.length}`),
      row('Boundary', 'Education mode only; no potable-water or professional approval.'),
      list(
        modulesWithSafety.map((module) => {
          const limit = module.safetyProfile?.realWorldUseLimit ?? 'Limit not declared.';
          return `${module.name}: ${module.safetyProfile?.category ?? 'unknown'} - ${limit}`;
        }),
      ),
    ],
    'wide',
  );
}
