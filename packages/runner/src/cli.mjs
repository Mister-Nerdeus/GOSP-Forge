#!/usr/bin/env node
import process from 'node:process';
import { evaluateChallenge, readJson, writeJson } from './lib.mjs';

const [challengePath, submissionPath, outputPath] = process.argv.slice(2);

if (!challengePath || !submissionPath) {
  console.error('Usage: node packages/runner/src/cli.mjs <challenge.json> <submission.json> [output.json]');
  process.exit(1);
}

const challenge = readJson(challengePath);
const submission = readJson(submissionPath);
const result = evaluateChallenge(challenge, submission);

if (outputPath) {
  writeJson(outputPath, result);
  console.log(`Wrote deterministic evaluation: ${outputPath}`);
} else {
  console.log(JSON.stringify(result, null, 2));
}

if (result.deterministicResult.valid !== true) process.exitCode = 2;
