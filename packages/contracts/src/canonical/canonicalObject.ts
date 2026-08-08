import { z } from 'zod';
import {
  CanonicalConstraintSchema,
  EngineeringProgramSchema,
  HazardSchema,
  InterfaceSchema,
  RequirementSchema,
  SystemElementSchema,
} from './programGraph.js';
import {
  ClaimSchema,
  ComponentReleaseSchema,
  EvidenceSchema,
  OperationalObservationSchema,
  ReviewSchema,
  TestArticleSchema,
} from './truthModel.js';
import {
  ChallengeSchema,
  EvaluationSchema,
  ModelSchema,
  ScenarioSchema,
  SubmissionSchema,
  WorkflowSchema,
} from './executionModel.js';

export const CanonicalObjectSchema = z.discriminatedUnion('kind', [
  EngineeringProgramSchema,
  RequirementSchema,
  CanonicalConstraintSchema,
  HazardSchema,
  SystemElementSchema,
  InterfaceSchema,
  ScenarioSchema,
  ClaimSchema,
  EvidenceSchema,
  ModelSchema,
  WorkflowSchema,
  ChallengeSchema,
  SubmissionSchema,
  EvaluationSchema,
  ReviewSchema,
  TestArticleSchema,
  ComponentReleaseSchema,
  OperationalObservationSchema,
]);

export type CanonicalObject = z.infer<typeof CanonicalObjectSchema>;
