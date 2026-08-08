import { z } from 'zod';
import { IdSchema } from '../shared/primitives.js';
import {
  CanonicalJsonValueSchema,
  CanonicalObjectBaseSchema,
  CanonicalObjectRefSchema,
  ComponentDataIdentitySchema,
  ContractOrSchemaIdentitySchema,
  DatasetIdentitySchema,
  RunnerIdentitySchema,
  Sha256Schema,
  SolverIdentitySchema,
} from './identity.js';
import { DeploymentReadinessSchema, EvidenceReadinessSchema } from './truthModel.js';

const refFor = <K extends Parameters<typeof z.literal>[0]>(kind: K) =>
  CanonicalObjectRefSchema.extend({ kind: z.literal(kind) });

const ConstraintRefSchema = refFor('Constraint');
const EvidenceRefSchema = refFor('Evidence');
const HazardRefSchema = refFor('Hazard');
const ModelRefSchema = refFor('Model');
const RequirementRefSchema = refFor('Requirement');
const ScenarioRefSchema = refFor('Scenario');
const SystemElementRefSchema = refFor('SystemElement');
const WorkflowRefSchema = refFor('Workflow');
const ChallengeRefSchema = refFor('Challenge');
const SubmissionRefSchema = refFor('Submission');
const EvaluationRefSchema = refFor('Evaluation');

export const AssumptionRecordSchema = z.object({
  id: IdSchema,
  statement: z.string().min(1),
  value: CanonicalJsonValueSchema.optional(),
  unit: z.string().min(1).optional(),
  sourceRefs: z.array(z.string().min(1)).default([]),
  material: z.boolean().default(true),
});

export const BoundaryConditionSchema = z.object({
  id: IdSchema,
  description: z.string().min(1),
  value: CanonicalJsonValueSchema,
  unit: z.string().min(1).optional(),
});

export const ModelFidelityMetadataSchema = z.object({
  level: z.enum(['conceptual', 'rule-check', 'analytical', 'reduced-order', 'domain-simulator', 'high-resolution']),
  spatialResolution: z.string().min(1).optional(),
  temporalResolution: z.string().min(1).optional(),
  calibrationStatus: z.enum(['not-applicable', 'not-calibrated', 'calibrated', 'independently-checked']),
  limitations: z.array(z.string().min(1)).min(1),
});

export const UncertaintyMetadataSchema = z.object({
  parameterPath: z.string().min(1),
  method: z.enum(['bounds', 'distribution', 'ensemble', 'qualitative']),
  lower: z.number().finite().optional(),
  upper: z.number().finite().optional(),
  distribution: z.string().min(1).optional(),
  unit: z.string().min(1).optional(),
  rationale: z.string().min(1),
});

export const SensitivityMetadataSchema = z.object({
  parameterPath: z.string().min(1),
  resultPath: z.string().min(1),
  method: z.enum(['one-at-a-time', 'local-derivative', 'global', 'qualitative']),
  effect: z.number().finite().optional(),
  rank: z.number().int().positive().optional(),
  interpretation: z.string().min(1),
});

export const ExplainabilitySchema = z.object({
  explanation: z.string().min(1),
  equations: z
    .array(
      z.object({
        id: IdSchema,
        expression: z.string().min(1),
        description: z.string().min(1),
        variables: z.record(z.string().min(1)).default({}),
      }),
    )
    .default([]),
  intermediateValues: z
    .array(
      z.object({
        id: IdSchema,
        value: CanonicalJsonValueSchema,
        unit: z.string().min(1).optional(),
      }),
    )
    .default([]),
  modelInspection: z.object({
    assumptions: z.array(AssumptionRecordSchema).default([]),
    boundaryConditions: z.array(BoundaryConditionSchema).default([]),
    numericalSettings: z.record(CanonicalJsonValueSchema).default({}),
    convergence: z.string().min(1).optional(),
    calibration: z.string().min(1).optional(),
  }),
  evidenceRefs: z.array(EvidenceRefSchema).default([]),
});

export const ScenarioSchema = CanonicalObjectBaseSchema.extend({
  kind: z.literal('Scenario'),
  name: z.string().min(1),
  systemElementRefs: z.array(SystemElementRefSchema).default([]),
  environment: z.record(CanonicalJsonValueSchema).default({}),
  componentData: z.array(ComponentDataIdentitySchema).default([]),
  schedules: z.record(CanonicalJsonValueSchema).default({}),
  operatingConditions: z.record(CanonicalJsonValueSchema).default({}),
  assumptions: z.array(AssumptionRecordSchema).default([]),
  parameters: z.record(CanonicalJsonValueSchema).default({}),
  datasets: z.array(DatasetIdentitySchema).default([]),
  modelRef: ModelRefSchema,
  constraintRefs: z.array(ConstraintRefSchema).default([]),
  status: z.enum(['draft', 'controlled', 'executed', 'superseded']),
});

export const ModelSchema = CanonicalObjectBaseSchema.extend({
  kind: z.literal('Model'),
  name: z.string().min(1),
  modelType: z.enum(['rule-check', 'analytical', 'reduced-order', 'simulation', 'physical-test', 'hybrid']),
  fidelity: ModelFidelityMetadataSchema,
  solver: SolverIdentitySchema,
  contractIdentities: z.array(ContractOrSchemaIdentitySchema).min(1),
  datasetIdentities: z.array(DatasetIdentitySchema).default([]),
  assumptions: z.array(AssumptionRecordSchema).default([]),
  boundaryConditions: z.array(BoundaryConditionSchema).default([]),
  uncertainty: z.array(UncertaintyMetadataSchema).default([]),
  status: z.enum(['draft', 'active', 'deprecated', 'superseded']),
});

export const WorkflowStepSchema = z.object({
  id: IdSchema,
  name: z.string().min(1),
  action: z.enum(['inspect', 'transform', 'execute', 'compare', 'review', 'record']),
  inputRefs: z.array(CanonicalObjectRefSchema).default([]),
  outputKinds: z.array(z.string().min(1)).default([]),
});

export const WorkflowSchema = CanonicalObjectBaseSchema.extend({
  kind: z.literal('Workflow'),
  name: z.string().min(1),
  steps: z.array(WorkflowStepSchema).min(1),
  status: z.enum(['draft', 'active', 'deprecated', 'superseded']),
});

export const ChallengeSchema = CanonicalObjectBaseSchema.extend({
  kind: z.literal('Challenge'),
  title: z.string().min(1),
  problemStatement: z.string().min(1),
  programRef: refFor('EngineeringProgram').optional(),
  requirementRefs: z.array(RequirementRefSchema).default([]),
  constraintRefs: z.array(ConstraintRefSchema).default([]),
  hazardRefs: z.array(HazardRefSchema).default([]),
  permittedScenarioRefs: z.array(ScenarioRefSchema).default([]),
  evaluationModelRef: ModelRefSchema,
  workflowRef: WorkflowRefSchema,
  status: z.enum(['draft', 'open', 'closed', 'superseded']),
});

export const SubmissionSchema = CanonicalObjectBaseSchema.extend({
  kind: z.literal('Submission'),
  challengeRef: ChallengeRefSchema,
  scenarioRef: ScenarioRefSchema,
  materialPayload: CanonicalJsonValueSchema,
  componentData: z.array(ComponentDataIdentitySchema).default([]),
  status: z.enum(['draft', 'submitted', 'withdrawn', 'superseded']),
});

export const EvaluationSchema = CanonicalObjectBaseSchema.extend({
  kind: z.literal('Evaluation'),
  challengeRef: ChallengeRefSchema,
  submissionRef: SubmissionRefSchema,
  scenarioRef: ScenarioRefSchema,
  modelRef: ModelRefSchema,
  workflowRef: WorkflowRefSchema,
  runner: RunnerIdentitySchema,
  contractIdentities: z.array(ContractOrSchemaIdentitySchema).min(1),
  datasetIdentities: z.array(DatasetIdentitySchema).default([]),
  materialInputHash: Sha256Schema,
  materialResultHash: Sha256Schema,
  result: CanonicalJsonValueSchema,
  explainability: ExplainabilitySchema,
  uncertainty: z.array(UncertaintyMetadataSchema).default([]),
  sensitivity: z.array(SensitivityMetadataSchema).default([]),
  evidenceReadiness: EvidenceReadinessSchema,
  deploymentReadiness: DeploymentReadinessSchema,
  evidenceRefs: z.array(EvidenceRefSchema).default([]),
  status: z.enum(['completed', 'failed', 'superseded']),
});

export const ControlledComparisonSchema = z.object({
  baselineEvaluationRef: EvaluationRefSchema,
  candidateEvaluationRef: EvaluationRefSchema,
  fixedInputPaths: z.array(z.string().min(1)).default([]),
  changedInputPaths: z.array(z.string().min(1)).min(1),
  resultDeltas: z
    .array(
      z.object({
        resultPath: z.string().min(1),
        baseline: CanonicalJsonValueSchema,
        candidate: CanonicalJsonValueSchema,
        delta: CanonicalJsonValueSchema.optional(),
        interpretation: z.string().min(1),
      }),
    )
    .min(1),
});

export type Scenario = z.infer<typeof ScenarioSchema>;
export type Model = z.infer<typeof ModelSchema>;
export type Workflow = z.infer<typeof WorkflowSchema>;
export type Challenge = z.infer<typeof ChallengeSchema>;
export type Submission = z.infer<typeof SubmissionSchema>;
export type Evaluation = z.infer<typeof EvaluationSchema>;
