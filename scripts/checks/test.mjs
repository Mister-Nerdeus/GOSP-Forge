import { readJson, simulateScenario, validateScenario } from '../lib/house-sim.mjs';

const scenario = readJson('packages/fixtures/house-baseline-28x48.json');
const errors = validateScenario(scenario);

if (errors.length > 0) {
  console.error('Baseline scenario should validate.');
  for (const error of errors) console.error(error);
  process.exit(1);
}

const first = simulateScenario(scenario);
const second = simulateScenario(scenario);

if (JSON.stringify(first) !== JSON.stringify(second)) {
  console.error('Simulation must be deterministic for identical input.');
  process.exit(1);
}

if (first.scorecard.weightedTotal <= 0) {
  console.error('Weighted score must be positive.');
  process.exit(1);
}

console.log('Starter tests passed.');
