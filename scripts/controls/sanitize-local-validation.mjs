import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const sourcePath = 'artifacts/controls/local-validation/latest.json';
const targetPath = 'artifacts/controls/local-validation/latest.sanitized.json';
const artifact = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const sensitiveAssignmentPattern =
  /\b(?:TOKEN|SECRET|PASSWORD|PASS|API[_-]?KEY|AUTH|CREDENTIAL|PRIVATE[_-]?KEY)=([^\s"']+)/gi;

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
  output = output.replace(sensitiveAssignmentPattern, (match) => match.replace(/=.*/, '=<redacted>'));
  return output;
};

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
