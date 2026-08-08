import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const toPosix = (value) => value.split(path.sep).join('/');
const discovered = [];

function walk(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.test.ts')) discovered.push(toPosix(path.relative(root, full)));
  }
}

walk(path.join(root, 'apps'));
walk(path.join(root, 'packages'));
discovered.sort();

const manifestPath = path.join(root, 'config', 'intended-tests.json');
const intended = JSON.parse(fs.readFileSync(manifestPath, 'utf8')).slice().sort();
const missing = intended.filter((file) => !discovered.includes(file));
const unlisted = discovered.filter((file) => !intended.includes(file));
const packageErrors = [];

for (const collection of ['apps', 'packages']) {
  const collectionPath = path.join(root, collection);
  for (const entry of fs.readdirSync(collectionPath, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const packagePath = path.join(collectionPath, entry.name);
    const packageJsonPath = path.join(packagePath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) continue;
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const prefix = `${collection}/${entry.name}/`;
    const hasIntendedTests = intended.some((file) => file.startsWith(prefix));
    const hasTestScript = Boolean(packageJson.scripts?.test);
    if (hasIntendedTests !== hasTestScript) {
      packageErrors.push(`${prefix}: intended tests=${hasIntendedTests}, test script=${hasTestScript}`);
    }
  }
}

const ok = missing.length === 0 && unlisted.length === 0 && packageErrors.length === 0;
console.log(
  JSON.stringify(
    { ok, intendedTestFiles: intended.length, discoveredTestFiles: discovered.length, missing, unlisted, packageErrors },
    null,
    2,
  ),
);
if (!ok) process.exit(1);
