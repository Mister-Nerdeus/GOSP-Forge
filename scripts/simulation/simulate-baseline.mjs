import { readJson, simulateScenario, validateScenario, writeJson } from '../lib/house-sim.mjs';

const scenarioPath = 'packages/fixtures/house-baseline-28x48.json';
const scenario = readJson(scenarioPath);
const errors = validateScenario(scenario);

if (errors.length > 0) {
  console.error(`Baseline fixture is invalid: ${scenarioPath}`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

const result = simulateScenario(scenario);
writeJson('evidence/local-runs/baseline-simulation.json', result);
console.log(`Baseline simulation complete: ${result.scenarioId}`);
console.log(`Weighted score: ${result.scorecard.weightedTotal}`);
console.log('Evidence: evidence/local-runs/baseline-simulation.json');
