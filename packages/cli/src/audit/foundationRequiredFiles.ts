export type FoundationRequiredFile = {
  file: string;
  required: boolean;
  note?: string;
  placeholder?: boolean;
};

export const FoundationRequiredFiles: FoundationRequiredFile[] = [
  { file: 'README.md', required: true },
  { file: 'package.json', required: true },
  { file: 'pnpm-workspace.yaml', required: true },
  { file: '.github/workflows/ci.yml', required: true },
  { file: 'docs/cli/VALIDATION.md', required: true },
  { file: 'docs/gates/CI_GATE_POLICY.md', required: true },
  { file: 'docs/gates/TRUTH_GATE_LOCAL_VALIDATION.md', required: true },
  { file: 'docs/audits/GOSP_FORGE_FOUNDATION_AUDIT.md', required: true },
  { file: 'packages/contracts/package.json', required: true },
  { file: 'packages/cli/package.json', required: true },
  { file: 'packages/sim-core/package.json', required: true },
  { file: 'packages/estimation/package.json', required: true },
  { file: 'packages/fabrication/package.json', required: true },
  { file: 'packages/api/package.json', required: true },
  { file: 'packages/contracts/src/index.ts', required: true },
  { file: 'packages/cli/src/main.ts', required: true },
  { file: 'examples/projects/automated-water-filter.project-v2.json', required: true },
  { file: 'examples/problems/clean-water.problem.json', required: true },
  { file: 'scripts/controls/verify-runtime-version.mjs', required: true },
  { file: 'scripts/controls/write-local-validation.mjs', required: true },
  { file: 'scripts/controls/verify-local-validation-current.mjs', required: true },
  {
    file: 'packages/api/src/server.ts',
    required: true,
    note: 'API validation is foundation-local behavior only and must not be treated as production hosting, identity, or storage.',
  },
  {
    file: 'apps/web/package.json',
    required: false,
    note: 'Builder UI is a read-only foundation shell only; no CAD editor, persistence, potable-water, professional, or production-manufacturing claim.',
  },
];
