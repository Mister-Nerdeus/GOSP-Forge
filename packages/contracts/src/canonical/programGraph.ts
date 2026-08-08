import { z } from 'zod';
import { IdSchema } from '../shared/primitives.js';
import { CanonicalObjectBaseSchema, CanonicalObjectRefSchema } from './identity.js';

const LifecycleStatusSchema = z.enum(['draft', 'active', 'superseded', 'retired']);

export const EngineeringProgramSchema = CanonicalObjectBaseSchema.extend({
  kind: z.literal('EngineeringProgram'),
  title: z.string().min(1),
  summary: z.string().min(1),
  status: LifecycleStatusSchema,
  objectiveRefs: z.array(CanonicalObjectRefSchema).default([]),
});

export const RequirementSchema = CanonicalObjectBaseSchema.extend({
  kind: z.literal('Requirement'),
  statement: z.string().min(1),
  obligation: z.enum(['shall', 'should', 'may']),
  status: z.enum(['proposed', 'accepted', 'verified', 'rejected', 'superseded']),
  verificationMethod: z
    .enum(['analysis', 'inspection', 'demonstration', 'test', 'review'])
    .optional(),
});

export const CanonicalConstraintSchema = CanonicalObjectBaseSchema.extend({
  kind: z.literal('Constraint'),
  statement: z.string().min(1),
  constraintType: z.enum(['numeric', 'logical', 'resource', 'schedule', 'policy']),
  parameter: z.string().min(1).optional(),
  operator: z.enum(['eq', 'ne', 'lt', 'lte', 'gt', 'gte', 'in']).optional(),
  value: z.union([z.string(), z.number().finite(), z.boolean(), z.array(z.string())]).optional(),
  unit: z.string().min(1).optional(),
  status: LifecycleStatusSchema,
});

export const HazardSchema = CanonicalObjectBaseSchema.extend({
  kind: z.literal('Hazard'),
  description: z.string().min(1),
  severity: z.enum(['negligible', 'minor', 'serious', 'critical', 'catastrophic']),
  likelihood: z.enum(['rare', 'unlikely', 'possible', 'likely', 'frequent', 'unknown']),
  status: z.enum(['identified', 'mitigating', 'accepted', 'closed', 'superseded']),
  mitigationRefs: z.array(CanonicalObjectRefSchema).default([]),
});

export const SystemElementSchema = CanonicalObjectBaseSchema.extend({
  kind: z.literal('SystemElement'),
  name: z.string().min(1),
  elementType: z.enum(['physical', 'digital', 'logical', 'process', 'service', 'human', 'hybrid']),
  status: LifecycleStatusSchema,
  capabilityIds: z.array(IdSchema).default([]),
});

export const InterfaceSchema = CanonicalObjectBaseSchema.extend({
  kind: z.literal('Interface'),
  name: z.string().min(1),
  interfaceType: z.enum(['resource', 'power', 'data', 'control', 'process', 'physical', 'human']),
  from: CanonicalObjectRefSchema,
  to: CanonicalObjectRefSchema,
  direction: z.enum(['unidirectional', 'bidirectional']),
  unit: z.string().min(1).optional(),
  status: LifecycleStatusSchema,
});

export type EngineeringProgram = z.infer<typeof EngineeringProgramSchema>;
export type Requirement = z.infer<typeof RequirementSchema>;
export type CanonicalConstraint = z.infer<typeof CanonicalConstraintSchema>;
export type Hazard = z.infer<typeof HazardSchema>;
export type SystemElement = z.infer<typeof SystemElementSchema>;
export type Interface = z.infer<typeof InterfaceSchema>;
