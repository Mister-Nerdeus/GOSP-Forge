import fs from 'node:fs';
import { execSync } from 'node:child_process';
const artifact = JSON.parse(fs.readFileSync('artifacts/controls/local-validation/latest.json', 'utf8'));
const head = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
if (artifact.gitSha !== head) { console.error(JSON.stringify({ ok: false, artifactSha: artifact.gitSha, head })); process.exit(1); }
console.log(JSON.stringify({ ok: true, head, artifactResult: artifact.result }));
