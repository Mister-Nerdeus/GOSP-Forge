import { z } from 'zod';

const RevisionedIdentitySchema = z.object({
  id: z.string().min(1),
  revision: z.string().min(1),
});

const CandidateIdentitySchema = z.object({
  submissionId: z.string().min(1),
  submissionRevision: z.string().min(1),
});

export const AdvancedChallengeProjectionSchema = z.object({
  projectionVersion: z.literal('0.1.0'),
  boundary: z.object({
    challenge: RevisionedIdentitySchema,
    scenario: RevisionedIdentitySchema,
    model: RevisionedIdentitySchema,
  }),
  objectives: z.array(z.object({
    id: z.string().min(1),
    statement: z.string().min(1),
    resultPath: z.string().min(1),
    direction: z.enum(['maximize', 'minimize']),
    source: z.literal('evaluator-engineering-definition'),
  })).min(1),
  excludedObjectives: z.array(z.object({
    id: z.string().min(1),
    reason: z.enum(['non-numeric-objective', 'unavailable-across-candidates']),
    explanation: z.string().min(1),
  })),
  excludedCandidates: z.array(z.object({
    submission: RevisionedIdentitySchema,
    reason: z.literal('evaluation-unavailable'),
    explanation: z.string().min(1),
  })),
  candidates: z.array(z.object({
    submission: RevisionedIdentitySchema,
    evaluation: RevisionedIdentitySchema,
    eligibility: z.enum(['eligible', 'failed-gates', 'missing-objective-values']),
    failedGateIds: z.array(z.string().min(1)),
    objectiveOutcomes: z.array(z.object({
      objectiveId: z.string().min(1),
      status: z.enum(['available', 'unavailable']),
      value: z.number().finite().optional(),
    })),
    dominatedBy: z.array(CandidateIdentitySchema),
    paretoStatus: z.enum(['non-dominated', 'dominated', 'ineligible']),
  })).min(1),
  nonDominatedSet: z.array(CandidateIdentitySchema),
  disclosures: z.array(z.string().min(1)).min(4),
}).superRefine((projection, context) => {
  const objectiveIds = projection.objectives.map((objective) => objective.id);
  if (new Set(objectiveIds).size !== objectiveIds.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['objectives'], message: 'Objective identities must be unique.' });
  }

  const candidateKeys = projection.candidates.map((candidate) => `${candidate.submission.id}@${candidate.submission.revision}`);
  if (new Set(candidateKeys).size !== candidateKeys.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['candidates'], message: 'Candidate Submission identities must be unique.' });
  }
  const candidateKeySet = new Set(candidateKeys);

  projection.candidates.forEach((candidate, index) => {
    const outcomeIds = candidate.objectiveOutcomes.map((outcome) => outcome.objectiveId);
    if (outcomeIds.length !== objectiveIds.length || new Set(outcomeIds).size !== objectiveIds.length || objectiveIds.some((id) => !outcomeIds.includes(id))) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['candidates', index, 'objectiveOutcomes'], message: 'Each candidate must report every declared numeric objective exactly once.' });
    }
    candidate.objectiveOutcomes.forEach((outcome, outcomeIndex) => {
      if ((outcome.status === 'available') !== (outcome.value !== undefined)) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ['candidates', index, 'objectiveOutcomes', outcomeIndex], message: 'Available outcomes require a finite value; unavailable outcomes must omit it.' });
      }
    });
    const missing = candidate.objectiveOutcomes.some((outcome) => outcome.status === 'unavailable');
    if (candidate.eligibility === 'eligible' && (candidate.failedGateIds.length > 0 || missing)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['candidates', index, 'eligibility'], message: 'Eligible candidates must pass hard gates and expose every objective value.' });
    }
    if (candidate.eligibility === 'failed-gates' && candidate.failedGateIds.length === 0) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['candidates', index, 'failedGateIds'], message: 'Failed-gates candidates must identify at least one failed gate.' });
    }
    if (candidate.eligibility === 'missing-objective-values' && (!missing || candidate.failedGateIds.length > 0)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['candidates', index, 'eligibility'], message: 'Missing-objective-values applies only when gates pass and a declared value is unavailable.' });
    }
    const expectedStatus = candidate.eligibility !== 'eligible'
      ? 'ineligible'
      : candidate.dominatedBy.length > 0 ? 'dominated' : 'non-dominated';
    if (candidate.paretoStatus !== expectedStatus) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['candidates', index, 'paretoStatus'], message: `Pareto status must be ${expectedStatus} for this candidate state.` });
    }
    const selfKey = candidateKeys[index];
    for (const dominator of candidate.dominatedBy) {
      const key = `${dominator.submissionId}@${dominator.submissionRevision}`;
      if (!candidateKeySet.has(key) || key === selfKey) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ['candidates', index, 'dominatedBy'], message: 'Dominators must reference another projected candidate.' });
      }
    }
  });

  const expectedSet = new Set(projection.candidates
    .filter((candidate) => candidate.paretoStatus === 'non-dominated')
    .map((candidate) => `${candidate.submission.id}@${candidate.submission.revision}`));
  const declaredSet = new Set(projection.nonDominatedSet.map((candidate) => `${candidate.submissionId}@${candidate.submissionRevision}`));
  if (expectedSet.size !== declaredSet.size || [...expectedSet].some((key) => !declaredSet.has(key))) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['nonDominatedSet'], message: 'The non-dominated set must exactly match eligible candidates without a dominator.' });
  }
});

export type AdvancedChallengeProjection = z.infer<typeof AdvancedChallengeProjectionSchema>;
