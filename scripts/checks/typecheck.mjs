import fs from 'node:fs';

const requiredFiles = [
  'AGENTS.md',
  'README.md',
  'package.json',
  'scripts/lib/house-sim.mjs'
];

let failures = 0;
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    failures += 1;
    console.error(`[FAIL] Missing required file: ${file}`);
  }
}

if (failures > 0) process.exit(1);
console.log('Starter typecheck passed. No TypeScript packages are present yet.');
