import fs from 'node:fs';
import path from 'node:path';

const sourcePath = 'artifacts/controls/local-validation/latest.json';
const targetPath = 'artifacts/controls/local-validation/latest.sanitized.json';
const artifact = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

const redact = (value) =>
  String(value)
    .replaceAll(process.cwd(), '<repo>')
    .replace(/[A-Z]:\\[^\s"']+/gi, '<local-path>')
    .replace(/\/(?:Users|home)\/[^\s"']+/g, '<local-path>');

const sanitized = {
  gitSha: artifact.gitSha,
  branch: artifact.branch,
  timestamp: artifact.timestamp,
  runtime: {
    node: artifact.runtime?.node,
    pnpm: artifact.runtime?.pnpm,
  },
  result: artifact.result,
  commands: (artifact.commands ?? []).map((command) => ({
    command: command.command,
    ok: Boolean(command.ok),
    outputSummary: redact(command.output ?? '').split(/\r?\n/).slice(-20).join('\n'),
  })),
};

fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, JSON.stringify(sanitized, null, 2));
console.log(JSON.stringify({ ok: true, path: targetPath, gitSha: sanitized.gitSha }));
