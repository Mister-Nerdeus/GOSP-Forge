import {
  CanonicalConstraintSchema,
  ChallengeSchema,
  ClaimSchema,
  ControlledComparisonSchema,
  EvidenceSchema,
  RepExecutionEvidenceSchema,
  RepMaterialInputSchema,
  RequirementSchema,
  SubmissionSchema,
  type Phase1aComparison,
  type Phase1aEvaluationView,
  type Phase1aHardGate,
  type Phase1aWorkspace,
  type RepExecutionEvidence,
  type RepMaterialInput,
  type Submission,
} from '@gosp/contracts';
import {
  canonicalJson,
  createSandbox001MaterialInput,
  replayRep,
  runSandbox001,
} from '@gosp/sim-core';
import type { StorageAdapter } from '../storage/storageAdapter.js';
import { LocalMemoryStorage } from '../storage/localMemoryStorage.js';

const provenance = { sources: [], method: 'authored' as const, notes: [] };
const challengeRef = { kind: 'Challenge' as const, id: 'sandbox-001', revision: '1.0.0' };
const requirementHardGate = RequirementSchema.parse({
  kind: 'Requirement',
  id: 'requirement.sandbox-001.valid-input',
  revision: '1.0.0',
  provenance,
  relationships: [
    { type: 'applies-to', target: challengeRef, description: 'Input validity requirement.' },
  ],
  statement: 'A submission shall provide equal-length finite values and weights.',
  obligation: 'shall',
  status: 'accepted',
  verificationMethod: 'analysis',
});

const requirementObjective = RequirementSchema.parse({
  kind: 'Requirement',
  id: 'requirement.sandbox-001.maximize-result',
  revision: '1.0.0',
  provenance,
  relationships: [
    { type: 'applies-to', target: challengeRef, description: 'Optimization objective.' },
  ],
  statement: 'A candidate should maximize result.value within the controlled scenario.',
  obligation: 'should',
  status: 'accepted',
  verificationMethod: 'analysis',
});

const validationGate = CanonicalConstraintSchema.parse({
  kind: 'Constraint',
  id: 'constraint.sandbox-001.valid-completion',
  revision: '1.0.0',
  provenance,
  relationships: [
    { type: 'applies-to', target: challengeRef, description: 'Canonical validation hard gate.' },
  ],
  statement: 'The Submission must pass canonical REP and sandbox input validation and complete evaluation.',
  constraintType: 'logical',
  parameter: 'evaluation.status',
  operator: 'eq',
  value: 'completed',
  status: 'active',
});

const limitations = [
  'Synthetic deterministic benchmark only; it does not establish physical validity.',
  'Local replay is not independent external reproduction.',
  'No professional approval, product certification, regulatory approval, or deployment readiness is claimed.',
];

const storageKey = (kind: string, id: string, revision: string) =>
  `phase1a:${kind}:${id}@${revision}`;

function exactRef(
  left: { kind: string; id: string; revision: string },
  right: { kind: string; id: string; revision: string },
) {
  return left.kind === right.kind && left.id === right.id && left.revision === right.revision;
}

function formatIssues(error: { issues: Array<{ path: Array<string | number>; message: string }> }) {
  return error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }));
}

function issuesFromUnknown(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'issues' in error &&
    Array.isArray(error.issues)
  ) {
    return formatIssues(error as { issues: Array<{ path: Array<string | number>; message: string }> });
  }
  return [];
}

export class Phase1aValidationError extends Error {
  constructor(
    message: string,
    readonly issues: Array<{ path: string; message: string }> = [],
  ) {
    super(message);
  }
}

type ExecutionOverrides = Partial<RepExecutionEvidence['environment']> & {
  startedAt?: string;
  completedAt?: string;
  executionId?: string;
};

export class Phase1aService {
  private seeded = false;

  constructor(
    private readonly storage: StorageAdapter = new LocalMemoryStorage(),
    private readonly now: () => string = () => new Date().toISOString(),
  ) {}

  private async ensureSeeded() {
    if (this.seeded) return;
    const baseInput = createSandbox001MaterialInput();
    const candidate = SubmissionSchema.parse({
      ...structuredClone(baseInput.submission),
      id: 'submission.sandbox-001.candidate-low',
      materialPayload: { values: [0, 1, 1], weights: [2, 3, 5], offset: 7 },
    });
    await this.storage.set('phase1a:base-material-input', baseInput);
    await this.storage.set(storageKey('Challenge', baseInput.challenge.id, baseInput.challenge.revision), baseInput.challenge);
    await this.storage.set(storageKey('Submission', baseInput.submission.id, baseInput.submission.revision), baseInput.submission);
    await this.storage.set(storageKey('Submission', candidate.id, candidate.revision), candidate);
    await this.storage.set('phase1a:challenge-refs', [
      { kind: 'Challenge', id: baseInput.challenge.id, revision: baseInput.challenge.revision },
    ]);
    await this.storage.set('phase1a:submission-refs', [
      { kind: 'Submission', id: baseInput.submission.id, revision: baseInput.submission.revision },
      { kind: 'Submission', id: candidate.id, revision: candidate.revision },
    ]);
    this.seeded = true;
  }

  private async baseInput() {
    await this.ensureSeeded();
    const value = await this.storage.get('phase1a:base-material-input');
    return RepMaterialInputSchema.parse(value);
  }

  private async refs(kind: 'Challenge' | 'Submission') {
    await this.ensureSeeded();
    return ((await this.storage.get(`phase1a:${kind.toLowerCase()}-refs`)) ?? []) as Array<{
      kind: typeof kind;
      id: string;
      revision: string;
    }>;
  }

  async createChallenge(raw: unknown) {
    const parsed = ChallengeSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Phase1aValidationError('Challenge failed canonical schema validation.', formatIssues(parsed.error));
    }
    const base = await this.baseInput();
    const challenge = parsed.data;
    if (!exactRef(challenge.evaluationModelRef, base.model)) {
      throw new Phase1aValidationError('Challenge evaluationModelRef is not available at the exact declared revision.');
    }
    if (!exactRef(challenge.workflowRef, base.workflow)) {
      throw new Phase1aValidationError('Challenge workflowRef is not available at the exact declared revision.');
    }
    for (const permitted of challenge.permittedScenarioRefs) {
      if (!exactRef(permitted, base.compiledScenario)) {
        throw new Phase1aValidationError('Challenge contains a mistyped or unavailable permitted Scenario reference.');
      }
    }
    const key = storageKey('Challenge', challenge.id, challenge.revision);
    const existing = await this.storage.get(key);
    if (existing && canonicalJson(existing) !== canonicalJson(challenge)) {
      throw new Phase1aValidationError('A different Challenge already uses this identity and revision.');
    }
    await this.storage.set(key, challenge);
    const refs = await this.refs('Challenge');
    if (!refs.some((ref) => exactRef(ref, challenge))) {
      await this.storage.set('phase1a:challenge-refs', [
        ...refs,
        { kind: 'Challenge', id: challenge.id, revision: challenge.revision },
      ]);
    }
    return challenge;
  }

  async createSubmission(raw: unknown) {
    const parsed = SubmissionSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Phase1aValidationError('Submission failed canonical schema validation.', formatIssues(parsed.error));
    }
    const submission = parsed.data;
    const base = await this.baseInput();
    const challenge = await this.storage.get(
      storageKey('Challenge', submission.challengeRef.id, submission.challengeRef.revision),
    );
    if (!challenge) {
      throw new Phase1aValidationError('Submission challengeRef does not resolve to an exact local Challenge revision.');
    }
    if (!exactRef(submission.scenarioRef, base.compiledScenario)) {
      throw new Phase1aValidationError('Submission scenarioRef does not resolve to the controlled Scenario revision.');
    }
    const key = storageKey('Submission', submission.id, submission.revision);
    const existing = await this.storage.get(key);
    if (existing && canonicalJson(existing) !== canonicalJson(submission)) {
      throw new Phase1aValidationError('A different Submission already uses this identity and revision.');
    }
    await this.storage.set(key, submission);
    const refs = await this.refs('Submission');
    if (!refs.some((ref) => exactRef(ref, submission))) {
      await this.storage.set('phase1a:submission-refs', [
        ...refs,
        { kind: 'Submission', id: submission.id, revision: submission.revision },
      ]);
    }
    return submission;
  }

  private async submission(id: string, revision: string) {
    await this.ensureSeeded();
    const submission = await this.storage.get(storageKey('Submission', id, revision));
    if (!submission) throw new Phase1aValidationError(`Unknown Submission ${id}@${revision}.`);
    return SubmissionSchema.parse(submission);
  }

  private async materialInputFor(submission: Submission) {
    const base = await this.baseInput();
    const challenge = await this.storage.get(
      storageKey('Challenge', submission.challengeRef.id, submission.challengeRef.revision),
    );
    if (!challenge) throw new Phase1aValidationError('Submission Challenge is no longer available.');
    if (submission.challengeRef.id !== 'sandbox-001') {
      throw new Phase1aValidationError('Only sandbox-001 has an evaluator in Phase-1A.');
    }
    const parsed = RepMaterialInputSchema.safeParse({ ...base, challenge, submission });
    if (!parsed.success) {
      throw new Phase1aValidationError('Submission and Challenge do not form a valid REP material input.', formatIssues(parsed.error));
    }
    return parsed.data;
  }

  async evaluateSubmission(id: string, revision: string, overrides: ExecutionOverrides = {}) {
    const submission = await this.submission(id, revision);
    const materialInput = await this.materialInputFor(submission);
    const startedAt = overrides.startedAt ?? this.now();
    let result: ReturnType<typeof runSandbox001>;
    try {
      result = runSandbox001(materialInput);
    } catch (error) {
      throw new Phase1aValidationError(
        `REP evaluation rejected the material input${error instanceof Error ? `: ${error.message}` : '.'}`,
        issuesFromUnknown(error),
      );
    }
    const completedAt = overrides.completedAt ?? this.now();
    const executionEvidence = RepExecutionEvidenceSchema.parse({
      kind: 'RepExecutionEvidence',
      evidenceVersion: '0.1.0',
      executionId: overrides.executionId ?? `local.${result.evaluation.id}`,
      materialInputHash: result.materialInputHash,
      materialResultHash: result.materialResultHash,
      startedAt,
      completedAt,
      command: ['phase1a', 'evaluate', `${submission.id}@${submission.revision}`],
      environment: {
        os: overrides.os ?? process.platform,
        architecture: overrides.architecture ?? process.arch,
        runtime: overrides.runtime ?? process.version,
        packageManager: overrides.packageManager ?? 'pnpm 9.x',
        locale: overrides.locale,
        timezone: overrides.timezone,
        workingDirectory: overrides.workingDirectory,
      },
      artifactPaths: [],
      warnings: [],
      exitStatus: 0,
    });
    const view = this.buildEvaluationView(materialInput, result.evaluation, executionEvidence);
    await this.storage.set(storageKey('Evaluation', view.evaluation.id, view.evaluation.revision), view);
    return view;
  }

  private buildEvaluationView(
    materialInput: RepMaterialInput,
    evaluation: Phase1aEvaluationView['evaluation'],
    executionEvidence: RepExecutionEvidence,
  ): Phase1aEvaluationView {
    const evaluationRef = {
      kind: 'Evaluation' as const,
      id: evaluation.id,
      revision: evaluation.revision,
    };
    const calculationRef = {
      kind: 'Evidence' as const,
      id: `evidence.${evaluation.id}.calculation`,
      revision: '1.0.0',
    };
    const replayRef = {
      kind: 'Evidence' as const,
      id: `evidence.${evaluation.id}.local-replay`,
      revision: '1.0.0',
    };
    const claimRef = {
      kind: 'Claim' as const,
      id: `claim.${evaluation.id}.computed-result`,
      revision: '1.0.0',
    };
    const replayRecord = {
      kind: 'RepReplayRecord' as const,
      repVersion: '0.1.0' as const,
      materialInput,
      expectedMaterialInputHash: evaluation.materialInputHash,
      expectedMaterialResultHash: evaluation.materialResultHash,
    };
    const replayed = replayRep(replayRecord);
    const evidence = [
      EvidenceSchema.parse({
        kind: 'Evidence',
        id: calculationRef.id,
        revision: calculationRef.revision,
        provenance: { sources: [], method: 'generated', notes: ['Produced by the REP reference runner.'] },
        relationships: [],
        evidenceType: 'calculation',
        title: 'REP material evaluation record',
        summary: 'The canonical material input produced the recorded deterministic result.',
        supports: [claimRef],
        artifacts: [
          {
            uri: `rep://evaluation/${evaluation.id}`,
            mediaType: 'application/vnd.gosp.rep-evaluation+json',
            contentHash: evaluation.materialResultHash,
          },
        ],
        readiness: 'source-backed',
        status: 'accepted',
      }),
      EvidenceSchema.parse({
        kind: 'Evidence',
        id: replayRef.id,
        revision: replayRef.revision,
        provenance: { sources: [], method: 'generated', notes: ['Same-process local replay; not independent reproduction.'] },
        relationships: [],
        evidenceType: 'reproduction',
        title: 'Verified local REP replay',
        summary: replayed.ok
          ? 'Recorded material input and result hashes matched during local replay.'
          : 'Local replay did not match the recorded hashes.',
        supports: replayed.ok ? [claimRef] : [],
        contradicts: replayed.ok ? [] : [claimRef],
        artifacts: [
          {
            uri: `rep://replay/${evaluation.id}`,
            mediaType: 'application/vnd.gosp.rep-replay+json',
            contentHash: evaluation.materialResultHash,
          },
        ],
        readiness: replayed.ok ? 'computationally-reproduced' : 'unsubstantiated',
        status: replayed.ok ? 'accepted' : 'rejected',
      }),
    ];
    const claim = ClaimSchema.parse({
      kind: 'Claim',
      id: claimRef.id,
      revision: claimRef.revision,
      provenance: { sources: [], method: 'derived', notes: ['Limited to the synthetic REP result.'] },
      relationships: evidence.map((record) => ({
        type: 'supported-by' as const,
        target: { kind: 'Evidence' as const, id: record.id, revision: record.revision },
      })),
      claimType: 'performance',
      statement: `Under the recorded synthetic inputs, result.value is ${(evaluation.result as { value: number }).value}.`,
      subjectRefs: [evaluationRef],
      proofObligations: [
        {
          id: 'proof.calculation',
          description: 'Preserve the deterministic calculation record.',
          requiredEvidenceTypes: ['calculation'],
          status: 'satisfied',
          evidenceRefs: [calculationRef],
        },
        {
          id: 'proof.local-replay',
          description: 'Replay the recorded REP package locally.',
          requiredEvidenceTypes: ['reproduction'],
          status: replayed.ok ? 'satisfied' : 'open',
          evidenceRefs: replayed.ok ? [replayRef] : [],
        },
        {
          id: 'proof.independent-reproduction',
          description: 'Obtain reproduction by an independent external party before claiming independent reproducibility.',
          requiredEvidenceTypes: ['reproduction', 'review'],
          status: 'open',
          evidenceRefs: [],
        },
        {
          id: 'proof.physical-validation',
          description: 'Physical validation would be required for any real-world engineering claim.',
          requiredEvidenceTypes: ['physical-test'],
          status: 'open',
          evidenceRefs: [],
        },
      ],
      evidenceReadiness: replayed.ok ? 'computationally-reproduced' : 'source-backed',
      deploymentReadiness: 'concept-only',
      professionalDisposition: { status: 'not-assessed', evidenceRefs: [] },
      status: replayed.ok ? 'supported' : 'contradicted',
    });
    const hardGates = [this.evaluateGate(validationGate, evaluation)];
    return {
      evaluation,
      materialInput,
      executionEvidence,
      claim,
      evidence,
      hardGates,
      replayRecord,
      replay: {
        ok: replayed.ok,
        inputHashMatches: replayed.inputHashMatches,
        resultHashMatches: replayed.resultHashMatches,
        reproductionStatus: replayed.ok ? 'verified-local-replay' : 'failed',
      },
      contradictions: replayed.ok ? [] : [evidence[1]!],
      limitations,
    };
  }

  private evaluateGate(
    constraint: typeof validationGate,
    evaluation: Phase1aEvaluationView['evaluation'],
  ): Phase1aHardGate {
    const actual = evaluation.status;
    if (constraint.operator !== 'eq' || typeof constraint.value !== 'string') {
      throw new Error('Phase-1A sandbox hard gate must be an exact evaluation-status constraint.');
    }
    return { constraint, resultPath: 'evaluation.status', actual, passed: actual === constraint.value };
  }

  async compare(baseline: Phase1aEvaluationView, candidate: Phase1aEvaluationView) {
    return comparePhase1aEvaluations(baseline, candidate);
  }

  async getWorkspace(): Promise<Phase1aWorkspace> {
    const base = await this.baseInput();
    const challengeRefs = await this.refs('Challenge');
    const availableChallenges = await Promise.all(
      challengeRefs.map(async (ref) =>
        ChallengeSchema.parse(await this.storage.get(storageKey('Challenge', ref.id, ref.revision))),
      ),
    );
    const submissionRefs = await this.refs('Submission');
    const submissions = await Promise.all(
      submissionRefs.map((ref) => this.submission(ref.id, ref.revision)),
    );
    const evaluations = await Promise.all(
      submissions.slice(0, 2).map((submission) => this.evaluateSubmission(submission.id, submission.revision)),
    );
    return {
      milestone: 'Phase-1A — Minimal Challenge-Facing Product Loop',
      persistence: {
        kind: 'process-local-memory',
        durable: false,
        disclosure: 'Records exist only in this local API process and reset when it restarts.',
      },
      challenge: {
        record: base.challenge,
        availableChallenges,
        requirements: [
          { record: requirementHardGate, role: 'hard-gate' },
          { record: requirementObjective, role: 'objective' },
        ],
        constraints: [validationGate],
        assumptions: base.materialAssumptions,
        model: base.model,
        scenario: base.compiledScenario,
        workflow: base.workflow,
      },
      submissions,
      evaluations,
      comparison: comparePhase1aEvaluations(evaluations[0]!, evaluations[1]!),
    };
  }
}

function flatten(value: unknown, path = '', output = new Map<string, unknown>()) {
  if (value === null || typeof value !== 'object') {
    output.set(path, value);
    return output;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) output.set(path, []);
    value.forEach((item, index) => flatten(item, `${path}[${index}]`, output));
    return output;
  }
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) output.set(path, {});
  for (const [key, item] of entries) flatten(item, path ? `${path}.${key}` : key, output);
  return output;
}

function comparableIdentity(input: RepMaterialInput) {
  return {
    repVersion: input.repVersion,
    challenge: { kind: input.challenge.kind, id: input.challenge.id, revision: input.challenge.revision },
    scenario: { kind: input.compiledScenario.kind, id: input.compiledScenario.id, revision: input.compiledScenario.revision },
    model: { kind: input.model.kind, id: input.model.id, revision: input.model.revision },
    workflow: { kind: input.workflow.kind, id: input.workflow.id, revision: input.workflow.revision },
    runner: input.runner,
    solver: input.model.solver,
    contracts: input.contractIdentities,
    datasets: input.datasetIdentities,
  };
}

function sameFlattenedValue(
  left: Map<string, unknown>,
  right: Map<string, unknown>,
  path: string,
) {
  if (left.has(path) !== right.has(path)) return false;
  return canonicalJson(left.get(path)) === canonicalJson(right.get(path));
}

export function comparePhase1aEvaluations(
  baseline: Phase1aEvaluationView,
  candidate: Phase1aEvaluationView,
): Phase1aComparison {
  if (canonicalJson(comparableIdentity(baseline.materialInput)) !== canonicalJson(comparableIdentity(candidate.materialInput))) {
    throw new Phase1aValidationError('Evaluations are not comparable across their Challenge, Scenario, Model, solver, runner, contract, or dataset boundaries.');
  }
  const baselineInput = flatten(baseline.materialInput);
  const candidateInput = flatten(candidate.materialInput);
  const paths = [...new Set([...baselineInput.keys(), ...candidateInput.keys()])].sort();
  const changedInputs = paths
    .filter((path) => !sameFlattenedValue(baselineInput, candidateInput, path))
    .map((path) => ({ path, baseline: baselineInput.get(path), candidate: candidateInput.get(path) }));
  const fixedInputPaths = paths.filter((path) => sameFlattenedValue(baselineInput, candidateInput, path));
  const baselineResult = flatten(baseline.evaluation.result, 'result');
  const candidateResult = flatten(candidate.evaluation.result, 'result');
  const resultDeltas = [...new Set([...baselineResult.keys(), ...candidateResult.keys()])]
    .sort()
    .filter(
      (path) => typeof baselineResult.get(path) === 'number' && typeof candidateResult.get(path) === 'number',
    )
    .map((resultPath) => {
      const baselineValue = baselineResult.get(resultPath) as number;
      const candidateValue = candidateResult.get(resultPath) as number;
      const delta = candidateValue - baselineValue;
      return {
        resultPath,
        baseline: baselineValue,
        candidate: candidateValue,
        delta,
        interpretation: `${resultPath} changed by ${delta}.`,
      };
    });
  if (changedInputs.length === 0 || resultDeltas.length === 0) {
    throw new Phase1aValidationError('A comparison requires at least one changed material input and a numeric result metric.');
  }
  const controlled = ControlledComparisonSchema.parse({
    baselineEvaluationRef: {
      kind: 'Evaluation',
      id: baseline.evaluation.id,
      revision: baseline.evaluation.revision,
    },
    candidateEvaluationRef: {
      kind: 'Evaluation',
      id: candidate.evaluation.id,
      revision: candidate.evaluation.revision,
    },
    fixedInputPaths,
    changedInputPaths: changedInputs.map((change) => change.path),
    resultDeltas,
  });
  const objectiveDelta = resultDeltas.find((delta) => delta.resultPath === 'result.value')!;
  const better = objectiveDelta.delta > 0 ? 'candidate' : objectiveDelta.delta < 0 ? 'baseline' : 'neither';
  return {
    ...controlled,
    comparable: true,
    changedInputs,
    resultDeltas,
    hardGateChanges: baseline.hardGates.map((gate, index) => ({
      constraintId: gate.constraint.id,
      baselinePassed: gate.passed,
      candidatePassed: candidate.hardGates[index]?.passed ?? false,
      changed: gate.passed !== (candidate.hardGates[index]?.passed ?? false),
    })),
    readinessDifferences: {
      evidenceReadiness: {
        baseline: baseline.claim.evidenceReadiness,
        candidate: candidate.claim.evidenceReadiness,
        changed: baseline.claim.evidenceReadiness !== candidate.claim.evidenceReadiness,
      },
      deploymentReadiness: {
        baseline: baseline.claim.deploymentReadiness,
        candidate: candidate.claim.deploymentReadiness,
        changed: baseline.claim.deploymentReadiness !== candidate.claim.deploymentReadiness,
      },
    },
    unresolvedProofObligations: {
      baseline: baseline.claim.proofObligations.filter((item) => item.status === 'open'),
      candidate: candidate.claim.proofObligations.filter((item) => item.status === 'open'),
    },
    explanation: {
      summary: `${better === 'neither' ? 'Neither candidate' : `The ${better}`} performed better on result.value; the candidate delta is ${objectiveDelta.delta}.`,
      primaryReasons: changedInputs
        .filter((change) => change.path.startsWith('submission.materialPayload'))
        .map((change) => `${change.path} changed from ${String(change.baseline)} to ${String(change.candidate)}.`),
      limitations,
    },
  };
}
