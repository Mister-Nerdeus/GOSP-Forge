import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

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
    outputTail: output.split(/\r?\n/).filter(Boolean).slice(-50),
    output,
  };
};
const git = (...args) => spawnSync('git', args, { encoding: 'utf8', shell: false }).stdout.trim();
const withoutOutput = ({ output: _output, ...record }) => record;
const parseJsonRun = (result) => {
  if (result.exitStatus !== 0) return { error: result.outputTail };
  try {
    return { value: JSON.parse(result.output) };
  } catch (error) {
    return { error: [error instanceof Error ? error.message : String(error)] };
  }
};

const statusBeforeVerification = git('status', '--porcelain=v1');
const verificationRun = run(pnpmCommand, [...pnpmPrefix, 'verify']);
const discoveryRun = run('node', ['scripts/controls/verify-test-discovery.mjs']);
const productLoopRun =
  verificationRun.exitStatus === 0
    ? run('node', ['scripts/phase-1a/read-product-loop-results.mjs'])
    : { command: [], exitStatus: 1, outputSha256: '', outputTail: ['Skipped after verification failure.'], output: '' };
const foundationMaterialRun =
  verificationRun.exitStatus === 0
    ? run('node', ['scripts/phase-0b/read-material-results.mjs'])
    : { command: [], exitStatus: 1, outputSha256: '', outputTail: ['Skipped after verification failure.'], output: '' };

const testDiscovery = parseJsonRun(discoveryRun);
const productLoop = parseJsonRun(productLoopRun);
const foundationMaterialResults = parseJsonRun(foundationMaterialRun);
const completedAt = new Date().toISOString();
const safeTimestamp = completedAt.replace(/[:.]/g, '-');
const directory = path.join('artifacts', 'phase-1a', 'local');
const artifactPath = path.join(directory, `execution-${safeTimestamp}.json`);
const passed =
  verificationRun.exitStatus === 0 &&
  discoveryRun.exitStatus === 0 &&
  productLoopRun.exitStatus === 0 &&
  foundationMaterialRun.exitStatus === 0 &&
  testDiscovery.value?.ok === true &&
  productLoop.value?.comparison?.comparable === true &&
  productLoop.value?.evaluations?.every((evaluation) => evaluation.replay.ok === true);

const evidence = {
  kind: 'Phase1ALocalVerificationEvidence',
  evidenceVersion: '0.1.0',
  startedAt,
  completedAt,
  git: {
    sha: git('rev-parse', 'HEAD'),
    branch: git('branch', '--show-current'),
    statusBeforeVerification: statusBeforeVerification.split(/\r?\n/).filter(Boolean),
    statusAfterVerification: git('status', '--porcelain=v1').split(/\r?\n/).filter(Boolean),
    statusSnapshotSemantics:
      'statusAfterVerification is captured after verification and evidence extraction, before this evidence artifact is written.',
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
  verification: withoutOutput(verificationRun),
  testDiscovery: { run: withoutOutput(discoveryRun), ...testDiscovery },
  productLoop: { run: withoutOutput(productLoopRun), ...productLoop },
  foundationMaterialResults: {
    run: withoutOutput(foundationMaterialRun),
    ...foundationMaterialResults,
  },
  result: passed ? 'PASS' : 'FAIL',
  claims: {
    scope: 'Local Phase-1A application projection and preserved Phase-0B regression boundary only.',
    notEstablished: [
      'independent external reproduction',
      'physical validation',
      'professional approval',
      'certification',
      'regulatory approval',
      'deployment readiness',
      'durable production persistence',
      'business Gate A',
    ],
  },
};

fs.mkdirSync(directory, { recursive: true });
fs.writeFileSync(artifactPath, `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify({ ok: passed, artifactPath, result: evidence.result }));
if (!passed) process.exit(1);
