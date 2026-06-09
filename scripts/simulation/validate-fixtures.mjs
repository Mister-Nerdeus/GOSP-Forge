import { listFixtureFiles, readJson, validateScenario } from '../lib/house-sim.mjs';

const files = listFixtureFiles();
let failures = 0;

if (files.length === 0) {
  console.error('No fixture files found in packages/fixtures');
  process.exit(1);
}

for (const file of files) {
  const scenario = readJson(file);
  const errors = validateScenario(scenario);
  const isNegative = scenario.metadata?.fixtureKind === 'negative';

  if (isNegative) {
    if (errors.length === 0) {
      failures += 1;
      console.error(`[FAIL] ${file}: negative fixture unexpectedly passed`);
    } else {
      console.log(`[PASS] ${file}: negative fixture failed as expected (${errors.length} error/s)`);
    }
  } else if (errors.length > 0) {
    failures += 1;
    console.error(`[FAIL] ${file}`);
    for (const error of errors) console.error(`  - ${error}`);
  } else {
    console.log(`[PASS] ${file}`);
  }
}

if (failures > 0) {
  console.error(`Fixture validation failed with ${failures} failure/s.`);
  process.exit(1);
}

console.log(`Fixture validation complete: ${files.length} fixture/s checked.`);
