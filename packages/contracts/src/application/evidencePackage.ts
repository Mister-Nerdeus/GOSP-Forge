import { z } from 'zod';
import { Sha256Schema } from '../canonical/identity.js';
import { EvaluationSchema } from '../canonical/executionModel.js';
import { ClaimSchema, EvidenceSchema } from '../canonical/truthModel.js';
import { RepExecutionEvidenceSchema, RepReplayRecordSchema } from '../rep/rep.js';

export const GospEvidencePackageSchema = z.object({
  kind: z.literal('GospEvidencePackage'),
  packageVersion: z.literal('0.1.0'),
  material: z.object({
    replayRecord: RepReplayRecordSchema,
    evaluation: EvaluationSchema,
    claim: ClaimSchema,
    evidence: z.array(EvidenceSchema).min(1),
    limitations: z.array(z.string().min(1)).min(1),
  }),
  materialPackageHash: Sha256Schema,
  executionEvidence: RepExecutionEvidenceSchema,
});

export const Phase1aWorkspaceArchiveSchema = z.object({
  kind: z.literal('Phase1aWorkspaceArchive'),
  archiveVersion: z.literal('1'),
  createdAt: z.string().datetime({ offset: true }),
  challenges: z.array(z.unknown()),
  submissions: z.array(z.unknown()),
});

export type GospEvidencePackage = z.infer<typeof GospEvidencePackageSchema>;
export type Phase1aWorkspaceArchive = z.infer<typeof Phase1aWorkspaceArchiveSchema>;
