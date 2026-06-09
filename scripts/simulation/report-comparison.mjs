import { listFixtureFiles, readJson, simulateScenario, validateScenario, writeJson } from '../lib/house-sim.mjs';

const reports = [];
const skipped = [];

for (const file of listFixtureFiles()) {
  const scenario = readJson(file);
  if (scenario.metadata?.fixtureKind === 'negative') {
    skipped.push({ file, reason: 'negative fixture' });
    continue;
  }
  const errors = validateScenario(scenario);
  if (errors.length > 0) {
    console.error(`[FAIL] ${file} is invalid`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }
  reports.push(simulateScenario(scenario));
}

if (reports.length < 2) {
  console.error('Comparison report requires at least two valid scenario fixtures.');
  process.exit(1);
}

const ranked = reports
  .map((report) => ({
    scenarioId: report.scenarioId,
    weightedTotal: report.scorecard.weightedTotal,
    warningsCount: report.warnings.length,
    bestCncWastePercent: Math.min(...report.cncResults.map((item) => item.wastePercent)),
    footprintAreaSqFt: report.quantities.footprintAreaSqFt,
    modelLevel: report.modelLevel
  }))
  .sort((a, b) => b.weightedTotal - a.weightedTotal);

const comparison = {
  generatedAt: new Date(0).toISOString(),
  modelLevel: 'L1 deterministic starter comparison',
  ranked,
  skipped,
  limitations: [
    'Ranking is an inspectable starter score only.',
    'CNC results are proxy estimates, not full nesting.',
    'Energy and cost outputs are not externally validated.'
  ]
};

writeJson('evidence/local-runs/comparison-report.json', comparison);
console.log(`Comparison report complete: ${ranked.length} scenario/s ranked.`);
console.log(`Top scenario: ${ranked[0].scenarioId} (${ranked[0].weightedTotal})`);
console.log('Evidence: evidence/local-runs/comparison-report.json');
