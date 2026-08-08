import fs from 'node:fs';
import {
  referenceRunnerSourceManifest,
  replayRep,
  sandbox001SolverSourceManifest,
} from '../../packages/sim-core/dist/index.js';
import { simulateCommand } from '../../packages/cli/dist/commands/simulate.js';
import { cleanWaterSolverSourceManifest } from '../../packages/vertical-clean-water/dist/index.js';

const recordPath = 'examples/rep/sandbox-001.replay.json';
const projectPath = 'examples/projects/automated-water-filter.project-v2.json';
const sandbox = replayRep(JSON.parse(fs.readFileSync(recordPath, 'utf8')));
const cleanWater = simulateCommand(projectPath);

if (!sandbox.ok) throw new Error('Recorded sandbox-001 replay did not match expected hashes.');
if (!cleanWater.ok) throw new Error('Clean Water simulation did not complete.');

console.log(
  JSON.stringify({
    sandbox001: {
      record: recordPath,
      materialInputHash: sandbox.materialInputHash,
      materialResultHash: sandbox.materialResultHash,
      inputHashMatches: sandbox.inputHashMatches,
      resultHashMatches: sandbox.resultHashMatches,
    },
    cleanWater: {
      project: projectPath,
      cleanWaterLiters: cleanWater.flow.cleanWaterLiters,
      legacyInputHash: cleanWater.envelope.inputHash,
      legacyOutputHash: cleanWater.envelope.outputHash,
      repMaterialInputHash: cleanWater.repEvaluation.materialInputHash,
      repMaterialResultHash: cleanWater.repEvaluation.materialResultHash,
    },
    sourceImplementationManifests: {
      referenceRunner: referenceRunnerSourceManifest(),
      sandbox001Solver: sandbox001SolverSourceManifest(),
      cleanWaterSolver: cleanWaterSolverSourceManifest(),
    },
  }),
);
