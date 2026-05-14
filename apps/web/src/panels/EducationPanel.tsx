import { createPanel, list, row } from './ProjectPanel';
import type { ProjectSummary } from './ProjectPanel';
import type { ModuleSummary } from './ModulePanel';

export type EducationModuleSummary = ModuleSummary & {
  educationProfile?: {
    gradeBand?: string;
    objectives?: string[];
    estimatedTimeMinutes?: number;
    teacherNotes?: string[];
  };
};

export function createEducationPanel(project: ProjectSummary, modules: EducationModuleSummary[]) {
  const guideRefs = project.refGroups?.education ?? [];
  const objectives = modules
    .flatMap((module) => module.educationProfile?.objectives ?? [])
    .filter((objective, index, all) => all.indexOf(objective) === index)
    .slice(0, 4);

  return createPanel('Education', [
    row('Guide refs', String(guideRefs.length)),
    row('Grade bands', uniqueGradeBands(modules).join(', ')),
    row('Student payment prompts', 'None in bundled foundation guides.'),
    list(objectives),
  ]);
}

function uniqueGradeBands(modules: EducationModuleSummary[]) {
  return modules
    .map((module) => module.educationProfile?.gradeBand)
    .filter((gradeBand): gradeBand is string => Boolean(gradeBand))
    .filter((gradeBand, index, all) => all.indexOf(gradeBand) === index);
}
