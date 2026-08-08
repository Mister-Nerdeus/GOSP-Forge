import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  referenceRunnerSourceManifest,
  replayRep,
  sandbox001SolverSourceManifest,
} from '../../packages/sim-core/dist/index.js';

const [environmentId, outputPath] = process.argv.slice(2);
if (!environmentId || !outputPath) {
  console.error('usage: node scripts/phase-0b/rep-environment-report.mjs <environment-id> <output.json>');
  process.exit(1);
}

const startedAt = new Date().toISOString();
const recordPath = 'examples/rep/sandbox-001.replay.json';
const record = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
const replay = replayRep(record);
const completedAt = new Date().toISOString();
const report = {
  kind: 'RepEnvironmentReport',
  reportVersion: '0.1.0',
  environmentId,
  recordPath,
  expectedMaterialInputHash: record.expectedMaterialInputHash,
  expectedMaterialResultHash: record.expectedMaterialResultHash,
  materialInputHash: replay.materialInputHash,
  materialResultHash: replay.materialResultHash,
  sourceImplementationManifests: {
    referenceRunner: referenceRunnerSourceManifest(),
    sandbox001Solver: sandbox001SolverSourceManifest(),
  },
  inputHashMatches: replay.inputHashMatches,
  resultHashMatches: replay.resultHashMatches,
  startedAt,
  completedAt,
  environment: {
    os: `${os.platform()} ${os.release()}`,
    architecture: os.arch(),
    runtime: process.version,
    locale: Intl.DateTimeFormat().resolvedOptions().locale,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    processId: process.pid,
    workingDirectory: process.cwd(),
  },
  exitStatus: replay.ok ? 0 : 1,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ok: replay.ok, outputPath, materialResultHash: replay.materialResultHash }));
if (!replay.ok) process.exit(1);
