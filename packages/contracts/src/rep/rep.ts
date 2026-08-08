import { z } from 'zod';
import {
  CanonicalJsonValueSchema,
  ComponentDataIdentitySchema,
  ContractOrSchemaIdentitySchema,
  DatasetIdentitySchema,
  RunnerIdentitySchema,
  Sha256Schema,
} from '../canonical/identity.js';
import {
  ChallengeSchema,
  EvaluationSchema,
  ModelSchema,
  ScenarioSchema,
  SubmissionSchema,
  WorkflowSchema,
  AssumptionRecordSchema,
} from '../canonical/executionModel.js';

export const RepVersionSchema = z.literal('0.1.0');

const sameRef = (
  ref: { kind: string; id: string; revision: string },
  object: { kind: string; id: string; revision: string },
) => ref.kind === object.kind && ref.id === object.id && ref.revision === object.revision;

const sameIdentity = (
  left: { kind: string; id: string; revision: string; contentHash: string },
  right: { kind: string; id: string; revision: string; contentHash: string },
) =>
  left.kind === right.kind &&
  left.id === right.id &&
  left.revision === right.revision &&
  left.contentHash === right.contentHash;

export const RepMaterialInputSchema = z
  .object({
    repVersion: RepVersionSchema,
    challenge: ChallengeSchema,
    submission: SubmissionSchema,
    compiledScenario: ScenarioSchema,
    model: ModelSchema,
    workflow: WorkflowSchema,
    runner: RunnerIdentitySchema,
    contractIdentities: z.array(ContractOrSchemaIdentitySchema).min(1),
    datasetIdentities: z.array(DatasetIdentitySchema).default([]),
    componentData: z.array(ComponentDataIdentitySchema).default([]),
    materialAssumptions: z.array(AssumptionRecordSchema).default([]),
    materialParameters: z.record(CanonicalJsonValueSchema).default({}),
  })
  .superRefine((value, context) => {
    const requireRef = (
      ref: { kind: string; id: string; revision: string },
      object: { kind: string; id: string; revision: string },
      path: Array<string | number>,
      relationship: string,
    ) => {
      if (!sameRef(ref, object)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path,
          message: `${relationship} must exactly match the supplied canonical object.`,
        });
      }
    };
    const requireIdentities = (
      declared: Array<{ kind: string; id: string; revision: string; contentHash: string }>,
      complete: Array<{ kind: string; id: string; revision: string; contentHash: string }>,
      path: Array<string | number>,
      label: string,
    ) => {
      for (const identity of declared) {
        if (!complete.some((candidate) => sameIdentity(identity, candidate))) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path,
            message: `${label} identity ${identity.id}@${identity.revision} is absent from the REP material boundary.`,
          });
        }
      }
    };

    requireRef(value.submission.challengeRef, value.challenge, ['submission', 'challengeRef'], 'Submission challengeRef');
    requireRef(value.submission.scenarioRef, value.compiledScenario, ['submission', 'scenarioRef'], 'Submission scenarioRef');
    requireRef(value.challenge.evaluationModelRef, value.model, ['challenge', 'evaluationModelRef'], 'Challenge evaluationModelRef');
    requireRef(value.challenge.workflowRef, value.workflow, ['challenge', 'workflowRef'], 'Challenge workflowRef');
    requireRef(value.compiledScenario.modelRef, value.model, ['compiledScenario', 'modelRef'], 'Scenario modelRef');

    if (!value.challenge.permittedScenarioRefs.some((ref) => sameRef(ref, value.compiledScenario))) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['challenge', 'permittedScenarioRefs'],
        message: 'Challenge permittedScenarioRefs must include the supplied compiled Scenario.',
      });
    }

    requireIdentities(value.model.contractIdentities, value.contractIdentities, ['contractIdentities'], 'Model contract');
    requireIdentities(value.model.datasetIdentities, value.datasetIdentities, ['datasetIdentities'], 'Model dataset');
    requireIdentities(value.compiledScenario.datasets, value.datasetIdentities, ['datasetIdentities'], 'Scenario dataset');
    requireIdentities(value.submission.componentData, value.componentData, ['componentData'], 'Submission component-data');
    requireIdentities(value.compiledScenario.componentData, value.componentData, ['componentData'], 'Scenario component-data');
  });

export const RepReplayRecordSchema = z.object({
  kind: z.literal('RepReplayRecord'),
  repVersion: RepVersionSchema,
  materialInput: RepMaterialInputSchema,
  expectedMaterialInputHash: Sha256Schema.optional(),
  expectedMaterialResultHash: Sha256Schema.optional(),
});

export const RepExecutionEvidenceSchema = z.object({
  kind: z.literal('RepExecutionEvidence'),
  evidenceVersion: z.literal('0.1.0'),
  executionId: z.string().min(1),
  materialInputHash: Sha256Schema,
  materialResultHash: Sha256Schema,
  startedAt: z.string().datetime({ offset: true }),
  completedAt: z.string().datetime({ offset: true }),
  command: z.array(z.string()).min(1),
  environment: z.object({
    os: z.string().min(1),
    architecture: z.string().min(1),
    runtime: z.string().min(1),
    packageManager: z.string().min(1).optional(),
    hostname: z.string().min(1).optional(),
    username: z.string().min(1).optional(),
    locale: z.string().min(1).optional(),
    timezone: z.string().min(1).optional(),
    processId: z.number().int().positive().optional(),
    workingDirectory: z.string().min(1).optional(),
  }),
  artifactPaths: z.array(z.string().min(1)).default([]),
  warnings: z.array(z.string().min(1)).default([]),
  exitStatus: z.number().int(),
});

export const RepEvaluationResultSchema = z.object({
  evaluation: EvaluationSchema,
  materialInputHash: Sha256Schema,
  materialResultHash: Sha256Schema,
});

export type RepMaterialInput = z.infer<typeof RepMaterialInputSchema>;
export type RepReplayRecord = z.infer<typeof RepReplayRecordSchema>;
export type RepExecutionEvidence = z.infer<typeof RepExecutionEvidenceSchema>;
export type RepEvaluationResult = z.infer<typeof RepEvaluationResultSchema>;
