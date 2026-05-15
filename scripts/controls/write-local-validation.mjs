import fs from 'node:fs';
import { execSync } from 'node:child_process';
const run = (command) => { try { return { command, ok: true, output: execSync(command, { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }).trim() }; } catch (error) { return { command, ok: false, output: String(error.stdout ?? '') + String(error.stderr ?? '') }; } };
const artifact = { gitSha: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(), branch: execSync('git branch --show-current', { encoding: 'utf8' }).trim(), runtime: { node: process.version, pnpm: run('pnpm -v').output }, timestamp: new Date().toISOString(), commands: [run('node scripts/controls/verify-runtime-version.mjs'), run('pnpm lint'), run('pnpm -r build'), run('pnpm -r typecheck'), run('pnpm -r test'), run('pnpm validate:examples'), run('pnpm simulate:clean-water'), run('pnpm estimate:clean-water'), run('pnpm run audit')], result: 'UNKNOWN' };
artifact.result = artifact.commands.every((item) => item.ok) ? 'PASS' : 'FAIL';
fs.mkdirSync('artifacts/controls/local-validation', { recursive: true });
fs.writeFileSync('artifacts/controls/local-validation/latest.json', JSON.stringify(artifact, null, 2));
console.log(JSON.stringify({ ok: artifact.result === 'PASS', path: 'artifacts/controls/local-validation/latest.json', gitSha: artifact.gitSha }));
if (artifact.result !== 'PASS') process.exit(1);
