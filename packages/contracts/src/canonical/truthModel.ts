import { z } from 'zod';
import { IdSchema, VersionSchema } from '../shared/primitives.js';
import {
  CanonicalJsonValueSchema,
  CanonicalObjectBaseSchema,
  CanonicalObjectRefSchema,
  Sha256Schema,
  VersionedArtifactIdentitySchema,
} from './identity.js';

const ClaimRefSchema = CanonicalObjectRefSchema.extend({ kind: z.literal('Claim') });
const EvidenceRefSchema = CanonicalObjectRefSchema.extend({ kind: z.literal('Evidence') });
const SystemElementRefSchema = CanonicalObjectRefSchema.extend({ kind: z.literal('SystemElement') });

export const EvidenceReadinessSchema = z.enum([
  'unsubstantiated',
  'source-backed',
  'computationally-reproduced',
  'physically-tested',
  'independently-reviewed',
  'field-observed',
]);

export const DeploymentReadinessSchema = z.enum([
  'not-assessed',
  'concept-only',
  'controlled-test-ready',
  'pilot-ready',
  'operationally-reviewed',
]);

export const ProfessionalDispositionSchema = z
  .object({
    status: z.enum(['not-assessed', 'not-required', 'required-not-obtained', 'approved']),
    authority: z.string().min(1).optional(),
    evidenceRefs: z.array(EvidenceRefSchema).default([]),
  })
  .superRefine((value, context) => {
    if (value.status === 'approved' && (!value.authority || value.evidenceRefs.length === 0)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Professional approval requires an authority and supporting evidence.',
      });
    }
  });

export const ProofObligationSchema = z.object({
  id: IdSchema,
  description: z.string().min(1),
  requiredEvidenceTypes: z
    .array(
      z.enum([
        'source',
        'calculation',
        'simulation',
        'reproduction',
        'review',
        'physical-test',
        'lab-test',
        'field-observation',
        'operational',
      ]),
    )
    .min(1),
  status: z.enum(['open', 'satisfied', 'waived']),
  evidenceRefs: z.array(EvidenceRefSchema).default([]),
  rationale: z.string().min(1).optional(),
}).superRefine((value, context) => {
  if (value.status === 'satisfied' && value.evidenceRefs.length === 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Satisfied proof obligations require evidence.' });
  }
  if (value.status === 'waived' && !value.rationale) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Waived proof obligations require rationale.' });
  }
});

export const ClaimSchema = CanonicalObjectBaseSchema.extend({
  kind: z.literal('Claim'),
  claimType: z.enum(['descriptive', 'predictive', 'comparative', 'causal', 'performance', 'safety', 'compliance']),
  statement: z.string().min(1),
  subjectRefs: z.array(CanonicalObjectRefSchema).min(1),
  proofObligations: z.array(ProofObligationSchema).min(1),
  evidenceReadiness: EvidenceReadinessSchema,
  deploymentReadiness: DeploymentReadinessSchema,
  professionalDisposition: ProfessionalDispositionSchema,
  status: z.enum(['draft', 'asserted', 'supported', 'contradicted', 'withdrawn', 'superseded']),
});

export const EvidenceArtifactSchema = z.object({
  uri: z.string().min(1),
  mediaType: z.string().min(1),
  contentHash: Sha256Schema,
});

export const EvidenceSchema = CanonicalObjectBaseSchema.extend({
  kind: z.literal('Evidence'),
  evidenceType: z.enum([
    'source',
    'calculation',
    'simulation',
    'reproduction',
    'review',
    'physical-test',
    'lab-test',
    'field-observation',
    'operational',
  ]),
  title: z.string().min(1),
  summary: z.string().min(1),
  supports: z.array(ClaimRefSchema).default([]),
  contradicts: z.array(ClaimRefSchema).default([]),
  artifacts: z.array(EvidenceArtifactSchema).default([]),
  readiness: EvidenceReadinessSchema,
  status: z.enum(['candidate', 'accepted', 'rejected', 'superseded']),
});

export const ReviewSchema = CanonicalObjectBaseSchema.extend({
  kind: z.literal('Review'),
  target: CanonicalObjectRefSchema,
  reviewerType: z.enum(['self', 'peer', 'domain-expert', 'independent', 'authority']),
  outcome: z.enum(['pending', 'accepted', 'changes-required', 'rejected']),
  findings: z.array(z.string().min(1)).default([]),
  evidenceRefs: z.array(EvidenceRefSchema).default([]),
});

export const TestArticleSchema = CanonicalObjectBaseSchema.extend({
  kind: z.literal('TestArticle'),
  name: z.string().min(1),
  systemElementRefs: z.array(SystemElementRefSchema).min(1),
  configurationHash: Sha256Schema,
  configuration: CanonicalJsonValueSchema,
  status: z.enum(['planned', 'assembled', 'tested', 'retired']),
});

export const ComponentReleaseSchema = CanonicalObjectBaseSchema.extend({
  kind: z.literal('ComponentRelease'),
  componentRef: SystemElementRefSchema,
  releaseVersion: VersionSchema,
  releaseStatus: z.enum(['draft', 'candidate', 'released', 'deprecated', 'revoked']),
  artifacts: z.array(VersionedArtifactIdentitySchema).default([]),
  evidenceRefs: z.array(EvidenceRefSchema).default([]),
});

export const OperationalObservationSchema = CanonicalObjectBaseSchema.extend({
  kind: z.literal('OperationalObservation'),
  subject: CanonicalObjectRefSchema,
  observedAt: z.string().datetime({ offset: true }),
  conditions: z.record(CanonicalJsonValueSchema).default({}),
  measurements: z
    .array(
      z.object({
        id: IdSchema,
        value: CanonicalJsonValueSchema,
        unit: z.string().min(1).optional(),
      }),
    )
    .min(1),
  evidenceRefs: z.array(EvidenceRefSchema).default([]),
});

export type Claim = z.infer<typeof ClaimSchema>;
export type Evidence = z.infer<typeof EvidenceSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type TestArticle = z.infer<typeof TestArticleSchema>;
export type ComponentRelease = z.infer<typeof ComponentReleaseSchema>;
export type OperationalObservation = z.infer<typeof OperationalObservationSchema>;
