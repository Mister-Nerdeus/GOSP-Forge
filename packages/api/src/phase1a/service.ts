import {
  ChallengeSchema,
  ClaimSchema,
  ControlledComparisonSchema,
  EvidenceSchema,
  GospEvidencePackageSchema,
  Phase1aWorkspaceArchiveSchema,
  RepExecutionEvidenceSchema,
  RepMaterialInputSchema,
  SubmissionSchema,
  type GospEvidencePackage,
  type Phase1aComparison,
  type Phase1aEvaluationView,
  type Phase1aHardGate,
  type Phase1aWorkspaceArchive,
  type Phase1aWorkspace,
  type Phase1aWorkspaceSelection,
  type RepExecutionEvidence,
  type RepMaterialInput,
  type Submission,
} from '@gosp/contracts';
import { canonicalJson, sha256 } from '@gosp/sim-core';
import type { StorageAdapter } from '../storage/storageAdapter.js';
import { LocalMemoryStorage } from '../storage/localMemoryStorage.js';
import {
  Phase1aEvaluatorRegistry,
  type Phase1aEvaluatorDefinition,
} from './evaluatorRegistry.js';
import { buildStemSystemProjection } from './stemSystemProjection.js';

const storageKey = (kind: string, id: string, revision: string) =>
  `phase1a:${kind}:${id}@${revision}`;

const templateKey = (id: string, revision: string) =>
  `phase1a:material-template:${id}@${revision}`;

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
    private readonly evaluators = new Phase1aEvaluatorRegistry(),
  ) {}

  private async ensureSeeded() {
    if (this.seeded) return;
    const schemaVersion = await this.storage.get('phase1a:schema-version');
    if (schemaVersion === '1') {
      this.seeded = true;
      return;
    }
    if (schemaVersion !== undefined) {
      throw new Error(`Unsupported Phase-1A storage schema ${String(schemaVersion)}.`);
    }
    const challengeRefs: Array<{ kind: 'Challenge'; id: string; revision: string }> = [];
    const submissionRefs: Array<{ kind: 'Submission'; id: string; revision: string }> = [];
    for (const definition of this.evaluators.definitions) {
      const baseInput = definition.template;
      await this.storage.set(
        templateKey(baseInput.challenge.id, baseInput.challenge.revision),
        baseInput,
      );
      await this.storage.set(
        storageKey('Challenge', baseInput.challenge.id, baseInput.challenge.revision),
        baseInput.challenge,
      );
      challengeRefs.push({
        kind: 'Challenge',
        id: baseInput.challenge.id,
        revision: baseInput.challenge.revision,
      });
      for (const submission of definition.seedSubmissions) {
        await this.storage.set(
          storageKey('Submission', submission.id, submission.revision),
          submission,
        );
        submissionRefs.push({
          kind: 'Submission',
          id: submission.id,
          revision: submission.revision,
        });
      }
    }
    await this.storage.set('phase1a:challenge-refs', challengeRefs);
    await this.storage.set('phase1a:submission-refs', submissionRefs);
    await this.storage.set('phase1a:schema-version', '1');
    this.seeded = true;
  }

  private async materialTemplate(challengeId: string, revision: string) {
    await this.ensureSeeded();
    const value = await this.storage.get(templateKey(challengeId, revision));
    if (!value) {
      throw new Phase1aValidationError(
        `No material template is available for Challenge ${challengeId}@${revision}.`,
      );
    }
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
    await this.ensureSeeded();
    const parsed = ChallengeSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Phase1aValidationError('Challenge failed canonical schema validation.', formatIssues(parsed.error));
    }
    const challenge = parsed.data;
    let definition: Phase1aEvaluatorDefinition;
    try {
      definition = this.evaluators.forChallenge(challenge);
    } catch (error) {
      throw new Phase1aValidationError(
        `Challenge evaluationModelRef is not available: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    const base = definition.template;
    if (challenge.id !== base.challenge.id) {
      throw new Phase1aValidationError(
        `Registered evaluator ${definition.id} accepts revisions of Challenge ${base.challenge.id}; it does not define a new logical Challenge ID.`,
      );
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
    const template = RepMaterialInputSchema.parse({
      ...base,
      challenge,
      submission: {
        ...base.submission,
        challengeRef: { kind: 'Challenge', id: challenge.id, revision: challenge.revision },
      },
    });
    await this.storage.set(templateKey(challenge.id, challenge.revision), template);
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
    await this.ensureSeeded();
    const parsed = SubmissionSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Phase1aValidationError('Submission failed canonical schema validation.', formatIssues(parsed.error));
    }
    const submission = parsed.data;
    const rawChallenge = await this.storage.get(
      storageKey('Challenge', submission.challengeRef.id, submission.challengeRef.revision),
    );
    if (!rawChallenge) {
      throw new Phase1aValidationError('Submission challengeRef does not resolve to an exact local Challenge revision.');
    }
    const challenge = ChallengeSchema.parse(rawChallenge);
    const base = await this.materialTemplate(challenge.id, challenge.revision);
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
    const base = await this.materialTemplate(
      submission.challengeRef.id,
      submission.challengeRef.revision,
    );
    const challenge = await this.storage.get(
      storageKey('Challenge', submission.challengeRef.id, submission.challengeRef.revision),
    );
    if (!challenge) throw new Phase1aValidationError('Submission Challenge is no longer available.');
    const parsed = RepMaterialInputSchema.safeParse({ ...base, challenge, submission });
    if (!parsed.success) {
      throw new Phase1aValidationError('Submission and Challenge do not form a valid REP material input.', formatIssues(parsed.error));
    }
    return parsed.data;
  }

  async evaluateSubmission(id: string, revision: string, overrides: ExecutionOverrides = {}) {
    const submission = await this.submission(id, revision);
    const materialInput = await this.materialInputFor(submission);
    const definition = this.evaluators.forMaterialInput(materialInput);
    const startedAt = overrides.startedAt ?? this.now();
    let result: ReturnType<Phase1aEvaluatorDefinition['evaluate']>;
    try {
      result = definition.evaluate(materialInput);
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
    const view = this.buildEvaluationView(
      materialInput,
      result.evaluation,
      executionEvidence,
      definition,
    );
    await this.storage.set(storageKey('Evaluation', view.evaluation.id, view.evaluation.revision), view);
    return view;
  }

  private buildEvaluationView(
    materialInput: RepMaterialInput,
    evaluation: Phase1aEvaluationView['evaluation'],
    executionEvidence: RepExecutionEvidence,
    definition: Phase1aEvaluatorDefinition,
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
    const replayEvaluation = definition.evaluate(replayRecord.materialInput);
    const replayed = {
      ok:
        replayRecord.expectedMaterialInputHash === replayEvaluation.materialInputHash &&
        replayRecord.expectedMaterialResultHash === replayEvaluation.materialResultHash,
      inputHashMatches:
        replayRecord.expectedMaterialInputHash === replayEvaluation.materialInputHash,
      resultHashMatches:
        replayRecord.expectedMaterialResultHash === replayEvaluation.materialResultHash,
    };
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
      provenance: {
        sources: [],
        method: 'derived',
        notes: ['Limited to the registered evaluator and recorded material boundary.'],
      },
      relationships: evidence.map((record) => ({
        type: 'supported-by' as const,
        target: { kind: 'Evidence' as const, id: record.id, revision: record.revision },
      })),
      claimType: 'performance',
      statement: definition.claimStatement(evaluation),
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
    const hardGates = this.evaluators
      .constraintsFor(materialInput.challenge)
      .map((constraint) => this.evaluateGate(constraint, evaluation));
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
      limitations: definition.limitations,
    };
  }

  private evaluateGate(
    constraint: Phase1aHardGate['constraint'],
    evaluation: Phase1aEvaluationView['evaluation'],
  ): Phase1aHardGate {
    const actual = evaluation.status;
    if (constraint.operator !== 'eq' || typeof constraint.value !== 'string') {
      throw new Error('Phase-1A completion hard gate must be an exact evaluation-status constraint.');
    }
    return { constraint, resultPath: 'evaluation.status', actual, passed: actual === constraint.value };
  }

  async compare(baseline: Phase1aEvaluationView, candidate: Phase1aEvaluationView) {
    const definition = this.evaluators.forMaterialInput(baseline.materialInput);
    return comparePhase1aEvaluations(
      baseline,
      candidate,
      definition.objectiveResultPath,
      definition.limitations,
    );
  }

  async getWorkspace(
    selection?: Phase1aWorkspaceSelection,
    challengeIdentity?: { id: string; revision: string },
  ): Promise<Phase1aWorkspace> {
    await this.ensureSeeded();
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
    const requestedChallenge = challengeIdentity
      ? availableChallenges.find(
          (challenge) =>
            challenge.id === challengeIdentity.id && challenge.revision === challengeIdentity.revision,
        )
      : undefined;
    if (challengeIdentity && !requestedChallenge) {
      throw new Phase1aValidationError(
        `Unknown Challenge ${challengeIdentity.id}@${challengeIdentity.revision}.`,
      );
    }
    const challengeSubmissions = requestedChallenge
      ? submissions.filter((submission) => exactRef(submission.challengeRef, requestedChallenge))
      : submissions;
    if (!selection && challengeSubmissions.length < 2) {
      throw new Phase1aValidationError('The selected Challenge requires at least two Submissions.');
    }
    const selected = selection ?? {
      baseline: {
        id: challengeSubmissions[0]!.id,
        revision: challengeSubmissions[0]!.revision,
      },
      candidate: {
        id: challengeSubmissions[1]!.id,
        revision: challengeSubmissions[1]!.revision,
      },
    };
    if (
      selected.baseline.id === selected.candidate.id &&
      selected.baseline.revision === selected.candidate.revision
    ) {
      throw new Phase1aValidationError('Select two different Submission identities for comparison.');
    }
    const selectedSubmissions = await Promise.all([
      this.submission(selected.baseline.id, selected.baseline.revision),
      this.submission(selected.candidate.id, selected.candidate.revision),
    ]);
    if (!exactRef(selectedSubmissions[0]!.challengeRef, selectedSubmissions[1]!.challengeRef)) {
      throw new Phase1aValidationError(
        'Selected Submissions must reference the same exact Challenge revision.',
      );
    }
    const challenge = ChallengeSchema.parse(
      await this.storage.get(
        storageKey(
          'Challenge',
          selectedSubmissions[0]!.challengeRef.id,
          selectedSubmissions[0]!.challengeRef.revision,
        ),
      ),
    );
    const base = await this.materialTemplate(challenge.id, challenge.revision);
    const definition = this.evaluators.forMaterialInput(base);
    const visibleSubmissions = submissions.filter((submission) =>
      exactRef(submission.challengeRef, challenge),
    );
    const evaluations = await Promise.all(
      selectedSubmissions.map((submission) =>
        this.evaluateSubmission(submission.id, submission.revision),
      ),
    );
    const requirements = this.evaluators.requirementsFor(challenge, definition);
    const constraints = this.evaluators.constraintsFor(challenge);
    const comparison = comparePhase1aEvaluations(
      evaluations[0]!,
      evaluations[1]!,
      definition.objectiveResultPath,
      definition.limitations,
    );
    const stemSystem = buildStemSystemProjection({
      challenge,
      scenario: base.compiledScenario,
      model: base.model,
      workflow: base.workflow,
      requirements,
      constraints,
      systemElements: definition.systemElements,
      interfaces: definition.interfaces,
      referenceEvaluation: evaluations[0]!,
      comparison,
      mathDefinition: definition.mathDefinition,
    });
    return {
      milestone: 'Phase-1A — Minimal Challenge-Facing Product Loop',
      selection: {
        baseline: {
          id: selectedSubmissions[0]!.id,
          revision: selectedSubmissions[0]!.revision,
        },
        candidate: {
          id: selectedSubmissions[1]!.id,
          revision: selectedSubmissions[1]!.revision,
        },
      },
      persistence: this.storage.describe(),
      evaluator: this.evaluatorSummary(definition),
      availableEvaluators: this.evaluators.definitions.map((item) => this.evaluatorSummary(item)),
      stemSystem,
      challenge: {
        record: challenge,
        availableChallenges,
        requirements,
        constraints,
        systemElements: definition.systemElements,
        interfaces: definition.interfaces,
        assumptions: base.materialAssumptions,
        model: base.model,
        scenario: base.compiledScenario,
        workflow: base.workflow,
      },
      submissions: visibleSubmissions,
      evaluations,
      comparison,
    };
  }

  private evaluatorSummary(definition: Phase1aEvaluatorDefinition) {
    return {
      id: definition.id,
      title: definition.title,
      description: definition.description,
      challengeRef: {
        kind: 'Challenge' as const,
        id: definition.template.challenge.id,
        revision: definition.template.challenge.revision,
      },
      modelRef: {
        kind: 'Model' as const,
        id: definition.template.model.id,
        revision: definition.template.model.revision,
      },
      defaultSelection: {
        baseline: {
          id: definition.seedSubmissions[0]!.id,
          revision: definition.seedSubmissions[0]!.revision,
        },
        candidate: {
          id: definition.seedSubmissions[1]!.id,
          revision: definition.seedSubmissions[1]!.revision,
        },
      },
    };
  }

  async exportWorkspaceArchive(): Promise<Phase1aWorkspaceArchive> {
    const challengeRefs = await this.refs('Challenge');
    const submissionRefs = await this.refs('Submission');
    const challenges = await Promise.all(
      challengeRefs.map((ref) =>
        this.storage.get(storageKey('Challenge', ref.id, ref.revision)),
      ),
    );
    const submissions = await Promise.all(
      submissionRefs.map((ref) => this.submission(ref.id, ref.revision)),
    );
    return Phase1aWorkspaceArchiveSchema.parse({
      kind: 'Phase1aWorkspaceArchive',
      archiveVersion: '1',
      createdAt: this.now(),
      challenges,
      submissions,
    });
  }

  async importWorkspaceArchive(raw: unknown) {
    const archive = Phase1aWorkspaceArchiveSchema.parse(raw);
    const parsedChallenges = archive.challenges.map((challenge) => ChallengeSchema.parse(challenge));
    const parsedSubmissions = archive.submissions.map((submission) =>
      SubmissionSchema.parse(submission),
    );
    const challenges = [];
    for (const challenge of parsedChallenges) challenges.push(await this.createChallenge(challenge));
    const submissions = [];
    for (const submission of parsedSubmissions) submissions.push(await this.createSubmission(submission));
    return { challenges: challenges.length, submissions: submissions.length };
  }

  async exportEvidencePackage(id: string, revision: string): Promise<GospEvidencePackage> {
    const view = await this.evaluateSubmission(id, revision);
    const material = {
      replayRecord: view.replayRecord,
      evaluation: view.evaluation,
      claim: view.claim,
      evidence: view.evidence,
      limitations: view.limitations,
    };
    return GospEvidencePackageSchema.parse({
      kind: 'GospEvidencePackage',
      packageVersion: '0.1.0',
      material,
      materialPackageHash: sha256(canonicalJson(material)),
      executionEvidence: view.executionEvidence,
    });
  }

  async validateEvidencePackage(raw: unknown) {
    const evidencePackage = GospEvidencePackageSchema.parse(raw);
    const materialPackageHashMatches =
      evidencePackage.materialPackageHash === sha256(canonicalJson(evidencePackage.material));
    const definition = this.evaluators.forMaterialInput(
      evidencePackage.material.replayRecord.materialInput,
    );
    const replayed = definition.evaluate(evidencePackage.material.replayRecord.materialInput);
    const inputHashMatches =
      replayed.materialInputHash ===
      evidencePackage.material.replayRecord.expectedMaterialInputHash;
    const resultHashMatches =
      replayed.materialResultHash ===
        evidencePackage.material.replayRecord.expectedMaterialResultHash &&
      replayed.materialResultHash === evidencePackage.material.evaluation.materialResultHash;
    return {
      ok: materialPackageHashMatches && inputHashMatches && resultHashMatches,
      evaluatorId: definition.id,
      materialPackageHashMatches,
      inputHashMatches,
      resultHashMatches,
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
  objectiveResultPath = 'result.value',
  comparisonLimitations = [
    'Synthetic deterministic benchmark only; it does not establish physical validity.',
    'Local replay is not independent external reproduction.',
  ],
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
  const objectiveDelta =
    resultDeltas.find((delta) => delta.resultPath === objectiveResultPath) ?? resultDeltas[0]!;
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
      summary: `${better === 'neither' ? 'Neither candidate' : `The ${better}`} performed better on ${objectiveDelta.resultPath}; the candidate delta is ${objectiveDelta.delta}.`,
      primaryReasons: changedInputs
        .filter((change) => change.path.startsWith('submission.materialPayload'))
        .map((change) => `${change.path} changed from ${String(change.baseline)} to ${String(change.candidate)}.`),
      limitations: comparisonLimitations,
    },
  };
}
