import fs from 'node:fs';
import path from 'node:path';
import { compareRepEnvironmentReports } from '../../packages/sim-core/dist/index.js';

const [environmentAPath, environmentBPath, outputPath] = process.argv.slice(2);
if (!environmentAPath || !environmentBPath || !outputPath) {
  console.error(
    'usage: node scripts/phase-0b/compare-reproducibility.mjs <environment-a.json> <environment-b.json> <output.json>',
  );
  process.exit(1);
}

const environmentA = JSON.parse(fs.readFileSync(environmentAPath, 'utf8'));
const environmentB = JSON.parse(fs.readFileSync(environmentBPath, 'utf8'));
const { checks, reproducible } = compareRepEnvironmentReports(environmentA, environmentB);
const report = {
  kind: 'RepReproducibilityComparison',
  reportVersion: '0.1.0',
  comparedAt: new Date().toISOString(),
  environmentA: {
    id: environmentA.environmentId,
    report: environmentAPath,
    environment: environmentA.environment,
    materialInputHash: environmentA.materialInputHash,
    materialResultHash: environmentA.materialResultHash,
  },
  environmentB: {
    id: environmentB.environmentId,
    report: environmentBPath,
    environment: environmentB.environment,
    materialInputHash: environmentB.materialInputHash,
    materialResultHash: environmentB.materialResultHash,
  },
  checks,
  conclusion: reproducible
    ? 'MATCH: the recorded material input and material result hashes are identical across both local environments.'
    : 'MISMATCH: cross-environment reproducibility was not established; inspect the failed checks.',
  reproducible,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ok: reproducible, outputPath, checks }));
if (!reproducible) process.exit(1);
