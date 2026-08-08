import { z } from 'zod';
import { IdSchema, VersionSchema } from '../shared/primitives.js';
import { SourceRefSchema } from '../shared/sourceRefs.js';

export const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);

export const CanonicalJsonValueSchema: z.ZodType<
  null | boolean | number | string | Array<unknown> | { [key: string]: unknown }
> = z.lazy(() =>
  z.union([
    z.null(),
    z.boolean(),
    z.number().finite(),
    z.string(),
    z.array(CanonicalJsonValueSchema),
    z.record(CanonicalJsonValueSchema),
  ]),
);

export const CanonicalObjectKindSchema = z.enum([
  'EngineeringProgram',
  'Requirement',
  'Constraint',
  'Hazard',
  'SystemElement',
  'Interface',
  'Scenario',
  'Claim',
  'Evidence',
  'Model',
  'Workflow',
  'Challenge',
  'Submission',
  'Evaluation',
  'Review',
  'TestArticle',
  'ComponentRelease',
  'OperationalObservation',
]);

export const CanonicalObjectRefSchema = z.object({
  kind: CanonicalObjectKindSchema,
  id: IdSchema,
  revision: VersionSchema,
  contentHash: Sha256Schema.optional(),
});

export const VersionedArtifactKindSchema = z.enum([
  'runner',
  'solver',
  'schema',
  'contract',
  'dataset',
  'component-data',
]);

export const VersionedArtifactIdentitySchema = z.object({
  kind: VersionedArtifactKindSchema,
  id: IdSchema,
  revision: VersionSchema,
  contentHash: Sha256Schema,
});

export const RunnerIdentitySchema = VersionedArtifactIdentitySchema.extend({
  kind: z.literal('runner'),
});
export const SolverIdentitySchema = VersionedArtifactIdentitySchema.extend({
  kind: z.literal('solver'),
});
export const SchemaIdentitySchema = VersionedArtifactIdentitySchema.extend({
  kind: z.literal('schema'),
});
export const ContractIdentitySchema = VersionedArtifactIdentitySchema.extend({
  kind: z.literal('contract'),
});
export const ContractOrSchemaIdentitySchema = z.union([
  ContractIdentitySchema,
  SchemaIdentitySchema,
]);
export const DatasetIdentitySchema = VersionedArtifactIdentitySchema.extend({
  kind: z.literal('dataset'),
});
export const ComponentDataIdentitySchema = VersionedArtifactIdentitySchema.extend({
  kind: z.literal('component-data'),
});

export const CanonicalRelationshipTypeSchema = z.enum([
  'contains',
  'addresses',
  'requires',
  'constrains',
  'mitigates',
  'connects',
  'applies-to',
  'asserts',
  'supported-by',
  'contradicted-by',
  'uses',
  'produces',
  'submitted-to',
  'evaluates',
  'reviews',
  'tests',
  'releases',
  'observes',
  'compares-with',
  'derived-from',
]);

export const CanonicalRelationshipSchema = z.object({
  type: CanonicalRelationshipTypeSchema,
  target: CanonicalObjectRefSchema,
  description: z.string().min(1).optional(),
});

export const CanonicalProvenanceSchema = z.object({
  sources: z.array(SourceRefSchema).default([]),
  createdBy: z.string().min(1).optional(),
  method: z.enum(['authored', 'imported', 'generated', 'measured', 'derived']).default('authored'),
  notes: z.array(z.string().min(1)).default([]),
});

export const CanonicalObjectBaseSchema = z.object({
  kind: CanonicalObjectKindSchema,
  id: IdSchema,
  revision: VersionSchema,
  provenance: CanonicalProvenanceSchema,
  relationships: z.array(CanonicalRelationshipSchema).default([]),
  createdAt: z.string().datetime({ offset: true }).optional(),
  supersedes: z.array(CanonicalObjectRefSchema).default([]),
});

export type CanonicalObjectKind = z.infer<typeof CanonicalObjectKindSchema>;
export type CanonicalObjectRef = z.infer<typeof CanonicalObjectRefSchema>;
export type VersionedArtifactIdentity = z.infer<typeof VersionedArtifactIdentitySchema>;
