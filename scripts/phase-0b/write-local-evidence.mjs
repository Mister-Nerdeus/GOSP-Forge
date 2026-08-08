import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const startedAt = new Date().toISOString();
const pnpmCommand = process.env.npm_execpath ? process.execPath : 'pnpm';
const pnpmPrefix = process.env.npm_execpath ? [process.env.npm_execpath] : [];
const run = (command, args) => {
  const result = spawnSync(command, args, { encoding: 'utf8', shell: false });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  return {
    command: [command, ...args],
    exitStatus: result.status ?? 1,
    outputSha256: createHash('sha256').update(output).digest('hex'),
    outputTail: output.split(/\r?\n/).filter(Boolean).slice(-40),
    output,
  };
};
const git = (...args) => spawnSync('git', args, { encoding: 'utf8', shell: false }).stdout.trim();

const beforeStatus = git('status', '--porcelain=v1');
const verificationRun = run(pnpmCommand, [...pnpmPrefix, 'verify']);
const verification = { ...verificationRun };
delete verification.output;
let materialResults;
let materialResultError;
let materialExtraction;
if (verification.exitStatus === 0) {
  const result = run('node', ['scripts/phase-0b/read-material-results.mjs']);
  const { output, ...record } = result;
  materialExtraction = record;
  if (result.exitStatus === 0) {
    materialResults = JSON.parse(output);
  } else {
    materialResultError = result.outputTail;
  }
}

const completedAt = new Date().toISOString();
const safeTimestamp = completedAt.replace(/[:.]/g, '-');
const directory = path.join('artifacts', 'phase-0b', 'local');
const artifactPath = path.join(directory, `execution-${safeTimestamp}.json`);
const evidence = {
  kind: 'Phase0BLocalVerificationEvidence',
  evidenceVersion: '0.1.0',
  startedAt,
  completedAt,
  git: {
    sha: git('rev-parse', 'HEAD'),
    branch: git('branch', '--show-current'),
    statusBeforeVerification: beforeStatus.split(/\r?\n/).filter(Boolean),
    statusAfterVerification: git('status', '--porcelain=v1').split(/\r?\n/).filter(Boolean),
    statusSnapshotSemantics:
      'statusAfterVerification is captured after verification and material extraction, before this evidence artifact is written.',
  },
  environment: {
    os: `${os.platform()} ${os.release()}`,
    architecture: os.arch(),
    runtime: process.version,
    packageManager: spawnSync(pnpmCommand, [...pnpmPrefix, '--version'], {
      encoding: 'utf8',
      shell: false,
    }).stdout.trim(),
    locale: Intl.DateTimeFormat().resolvedOptions().locale,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    processId: process.pid,
    workingDirectory: process.cwd(),
  },
  verification,
  materialExtraction,
  materialResults,
  materialResultError,
  result: verification.exitStatus === 0 && materialResults ? 'PASS' : 'FAIL',
  provenance: {
    historicalArtifactPreserved: 'artifacts/controls/local-validation/latest.json',
    note: 'This Phase-0B record does not overwrite or relabel the May 16 historical evidence.',
  },
};

fs.mkdirSync(directory, { recursive: true });
fs.writeFileSync(artifactPath, `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify({ ok: evidence.result === 'PASS', artifactPath, result: evidence.result }));
if (evidence.result !== 'PASS') process.exit(1);
