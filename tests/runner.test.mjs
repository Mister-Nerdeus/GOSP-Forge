import assert from 'node:assert/strict';
import test from 'node:test';
import { canonicalJson, evaluateChallenge, hashJson, readJson } from '../packages/runner/src/lib.mjs';

const challenge = readJson('benchmarks/sandbox-001/challenge.json');
const baseline = readJson('benchmarks/sandbox-001/baseline-submission.json');
const invalid = readJson('benchmarks/sandbox-001/invalid-submission.json');

test('canonical JSON is independent of object key insertion order', () => {
  assert.equal(canonicalJson({ b: 2, a: 1 }), canonicalJson({ a: 1, b: 2 }));
  assert.equal(hashJson({ b: 2, a: 1 }), hashJson({ a: 1, b: 2 }));
});

test('same challenge and submission produce identical deterministic records', () => {
  const first = evaluateChallenge(challenge, baseline);
  const second = evaluateChallenge(challenge, baseline);

  assert.deepEqual(first, second);
  assert.equal(first.deterministicResult.valid, true);
  assert.deepEqual(first.deterministicResult.metrics, {
    elapsedTime: 72,
    toolSwitches: 4,
    stepCount: 6
  });
});

test('precedence violation is rejected deterministically', () => {
  const first = evaluateChallenge(challenge, invalid);
  const second = evaluateChallenge(challenge, invalid);

  assert.deepEqual(first, second);
  assert.equal(first.deterministicResult.valid, false);
  assert.ok(first.deterministicResult.errors.includes('Precedence violated: A must occur before C.'));
  assert.ok(first.deterministicResult.errors.includes('Precedence violated: B must occur before C.'));
});
