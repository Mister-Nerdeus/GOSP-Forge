import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';

const outputDir = 'artifacts/ci';

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const redactKnownPath = (value, absolutePath, replacement) => {
  if (!absolutePath) return value;
  let output = value.replace(new RegExp(escapeRegExp(absolutePath), 'gi'), replacement);
  if (absolutePath.includes('\\')) {
    output = output.replace(new RegExp(escapeRegExp(absolutePath.replaceAll('\\', '/')), 'gi'), replacement);
  }
  return output;
};

const redact = (value) => {
  let output = String(value);
  output = redactKnownPath(output, process.cwd(), '<repo>');
  output = redactKnownPath(output, os.homedir(), '<home>');
  output = output.replace(/[A-Z]:\\(?:Users|Documents and Settings)\\[^\r\n"']+/gi, '<home>');
  output = output.replace(/[A-Z]:\\[^\r\n"']+/gi, '<local-path>');
  output = output.replace(/[A-Z]:\/(?:Users|Documents and Settings)\/[^\r\n"']+/gi, '<home>');
  output = output.replace(/[A-Z]:\/[^\r\n"']+/gi, '<local-path>');
  output = output.replace(/\/(?:Users|home)\/[^\r\n"']+/g, '<home>');
  output = output.replace(
    /\b(?:TOKEN|SECRET|PASSWORD|PASS|API[_-]?KEY|AUTH|CREDENTIAL|PRIVATE[_-]?KEY)=([^\s"']+)/gi,
    (match) => match.replace(/=.*/, '=<redacted>'),
  );
  return output;
};

const writeJson = (fileName, value) => {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, fileName), JSON.stringify(value, null, 2));
};

const run = (command) => {
  try {
    return {
      command,
      ok: true,
      output: execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }),
    };
  } catch (error) {
    return {
      command,
      ok: false,
      output: `${error.stdout ?? ''}${error.stderr ?? ''}`,
    };
  }
};

const parseJsonPayload = (output) => {
  const match = output.match(/^\{/m);
  if (!match || match.index === undefined) return undefined;
  try {
    return JSON.parse(output.slice(match.index));
  } catch {
    return undefined;
  }
};

const commandRecord = (result) => {
  const redacted = redact(result.output);
  return {
    command: result.command,
    ok: result.ok,
    parsed: parseJsonPayload(redacted),
    outputSummary: redacted.trim().split(/\r?\n/).slice(-30).join('\n'),
  };
};

const gitSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
const branch =
  process.env.GITHUB_REF_NAME ?? execSync('git branch --show-current', { encoding: 'utf8' }).trim();

const runtimeProof = commandRecord(run('node scripts/controls/verify-runtime-version.mjs'));
const validation = commandRecord(run('pnpm validate:examples'));
const simulation = commandRecord(run('pnpm simulate:clean-water'));
const estimate = commandRecord(run('pnpm estimate:clean-water'));
const audit = commandRecord(run('pnpm run audit'));

const simulationSummary = {
  command: simulation.command,
  ok: simulation.ok,
  projectId: simulation.parsed?.input?.projectId,
  defaultedInputs: simulation.parsed?.input?.defaultedInputs ?? [],
  unknownInputs: simulation.parsed?.input?.unknownInputs ?? [],
  warnings: simulation.parsed?.input?.warnings ?? [],
  confidenceSummary: simulation.parsed?.envelope?.confidenceSummary,
  limitations: simulation.parsed?.envelope?.limitations,
};

const estimateQualityReport = {
  command: estimate.command,
  ok: estimate.ok,
  qualityReport: estimate.parsed?.qualityReport,
  modeGate: estimate.parsed?.modeGate,
  warnings: estimate.parsed?.warnings ?? [],
  limitations: estimate.parsed?.envelope?.limitations,
};

const summary = {
  gitSha,
  branch,
  generatedAt: new Date().toISOString(),
  runtime: {
    node: process.version,
    pnpm: run('pnpm -v').output.trim(),
    platform: process.platform,
    arch: process.arch,
  },
  result:
    runtimeProof.ok && validation.ok && simulation.ok && estimate.ok && audit.ok ? 'PASS' : 'FAIL',
  commands: [runtimeProof, validation, simulation, estimate, audit].map(({ command, ok }) => ({
    command,
    ok,
  })),
  nonClaims: [
    'CI evidence is non-secret workflow proof only.',
    'No production, professional, potable-water, manufacturing, storage, hosting, marketplace, leaderboard, or release-approval claim.',
  ],
};

writeJson('runtime-proof.json', runtimeProof);
writeJson('validation-output.json', validation);
writeJson('simulate-output-summary.json', simulationSummary);
writeJson('estimate-quality-report.json', estimateQualityReport);
writeJson('audit-output.json', audit);
writeJson('ci-evidence-summary.json', summary);

console.log(JSON.stringify({ ok: summary.result === 'PASS', path: outputDir, gitSha, result: summary.result }));

if (summary.result !== 'PASS') process.exit(1);
