import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const RUNNER_ID = 'gosp-reference-runner';
export const RUNNER_VERSION = '0.1.0';

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalize(value[key])])
    );
  }
  return value;
}

export function canonicalJson(value) {
  return JSON.stringify(canonicalize(value));
}

export function hashJson(value) {
  return crypto.createHash('sha256').update(canonicalJson(value)).digest('hex');
}

export function evaluateChallenge(challenge, submission) {
  const challengeHash = hashJson(challenge);
  const submissionHash = hashJson(submission);

  if (submission.challengeId !== challenge.id) {
    return buildRecord(challenge, submission, challengeHash, submissionHash, {
      valid: false,
      errors: [`Submission challengeId ${submission.challengeId} does not match ${challenge.id}.`],
      metrics: null
    });
  }

  switch (challenge.evaluation.kind) {
    case 'assembly-sequence-v0.1':
      return buildRecord(
        challenge,
        submission,
        challengeHash,
        submissionHash,
        evaluateAssemblySequence(challenge.evaluation.parameters, submission.payload)
      );
    default:
      throw new Error(`Unsupported evaluation kind: ${challenge.evaluation.kind}`);
  }
}

function buildRecord(challenge, submission, challengeHash, submissionHash, deterministicResult) {
  const identitySeed = {
    challengeHash,
    submissionHash,
    runner: `${RUNNER_ID}@${RUNNER_VERSION}`
  };

  return {
    evaluationId: `evaluation:${hashJson(identitySeed).slice(0, 24)}`,
    challengeId: challenge.id,
    submissionId: submission.id,
    evaluator: {
      kind: RUNNER_ID,
      version: RUNNER_VERSION
    },
    inputHashes: {
      challengeSha256: `sha256:${challengeHash}`,
      submissionSha256: `sha256:${submissionHash}`
    },
    deterministicResult,
    limitations: [
      'Synthetic Phase 0 benchmark only.',
      'No physical validation or deployment claim is created by this evaluation.'
    ]
  };
}

function evaluateAssemblySequence(parameters, payload) {
  const components = parameters.components;
  const precedence = parameters.precedence;
  const toolAssignments = parameters.toolAssignments;
  const baseStepTime = parameters.baseStepTime;
  const toolSwitchPenalty = parameters.toolSwitchPenalty;
  const sequence = payload.sequence;
  const errors = [];

  if (!Array.isArray(sequence)) {
    return {
      valid: false,
      errors: ['payload.sequence must be an array.'],
      metrics: null
    };
  }

  const expected = new Set(components);
  const seen = new Set();
  const duplicates = new Set();

  for (const component of sequence) {
    if (seen.has(component)) duplicates.add(component);
    seen.add(component);
    if (!expected.has(component)) errors.push(`Unexpected component: ${component}.`);
  }

  for (const component of components) {
    if (!seen.has(component)) errors.push(`Missing component: ${component}.`);
  }

  for (const component of [...duplicates].sort()) {
    errors.push(`Duplicate component: ${component}.`);
  }

  if (sequence.length !== components.length) {
    errors.push(`Sequence length ${sequence.length} does not match required component count ${components.length}.`);
  }

  const positions = new Map(sequence.map((component, index) => [component, index]));
  for (const [before, after] of precedence) {
    if (positions.has(before) && positions.has(after) && positions.get(before) >= positions.get(after)) {
      errors.push(`Precedence violated: ${before} must occur before ${after}.`);
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: [...new Set(errors)].sort(),
      metrics: null
    };
  }

  let toolSwitches = 0;
  for (let index = 1; index < sequence.length; index += 1) {
    const priorTool = toolAssignments[sequence[index - 1]];
    const currentTool = toolAssignments[sequence[index]];
    if (priorTool !== currentTool) toolSwitches += 1;
  }

  const elapsedTime = sequence.length * baseStepTime + toolSwitches * toolSwitchPenalty;

  return {
    valid: true,
    errors: [],
    metrics: {
      elapsedTime,
      toolSwitches,
      stepCount: sequence.length
    }
  };
}
