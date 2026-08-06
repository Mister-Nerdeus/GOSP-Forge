import os from 'node:os';
import process from 'node:process';
import { evaluateChallenge, hashJson, readJson, writeJson } from '../../packages/runner/src/lib.mjs';

const challenge = readJson('benchmarks/sandbox-001/challenge.json');
const submission = readJson('benchmarks/sandbox-001/baseline-submission.json');
const first = evaluateChallenge(challenge, submission);
const second = evaluateChallenge(challenge, submission);
const firstHash = hashJson(first);
const secondHash = hashJson(second);
const replayPass = firstHash === secondHash;

const evidenceDir = process.env.GOSP_EVIDENCE_DIR ?? 'evidence/ci/local';
writeJson(`${evidenceDir}/result.json`, first);
writeJson(`${evidenceDir}/manifest.json`, {
  evidenceVersion: '0.1',
  benchmark: challenge.id,
  submission: submission.id,
  commit: process.env.GITHUB_SHA ?? 'unknown-local',
  executedAt: new Date().toISOString(),
  runtime: {
    node: process.version,
    platform: process.platform,
    architecture: process.arch,
    osRelease: os.release()
  },
  deterministicReplay: {
    pass: replayPass,
    firstResultSha256: `sha256:${firstHash}`,
    secondResultSha256: `sha256:${secondHash}`
  },
  artifacts: {
    deterministicResult: 'result.json'
  },
  limitations: [
    'This manifest records one execution environment.',
    'Independent cross-environment reproduction is a separate Phase 0 gate.'
  ]
});

console.log(`Wrote execution evidence to ${evidenceDir}`);
if (!replayPass) process.exit(1);
