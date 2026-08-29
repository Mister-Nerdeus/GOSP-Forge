import { z } from 'zod';
import { Sha256Schema } from '../canonical/identity.js';

export const StemLearningDepthSchema = z.enum([
  'explore', 'measure', 'model', 'solve', 'verify', 'research-professional',
]);

export const StemLearningSectionSchema = z.enum([
  'system-map', 'math', 'science', 'engineering', 'technology', 'dynamic', 'how-we-know',
]);

const ManifestSchema = z.object({
  depth: StemLearningDepthSchema,
  label: z.string().min(1),
  detailLevel: z.enum(['introductory', 'guided', 'technical', 'verification', 'full']),
  includedSections: z.array(StemLearningSectionSchema),
  redactedSections: z.array(StemLearningSectionSchema),
  disclosure: z.string().min(1),
});

export const StemLearningProjectionSchema = z.object({
  selectedDepth: StemLearningDepthSchema,
  canonicalIdentity: z.object({
    evaluationId: z.string().min(1),
    evaluationRevision: z.string().min(1),
    materialInputHash: Sha256Schema,
    materialResultHash: Sha256Schema,
  }),
  selectedManifest: ManifestSchema,
  availableManifests: z.array(ManifestSchema).length(6),
  identityInvariant: z.literal(true),
  disclosures: z.array(z.string().min(1)).min(1),
}).superRefine((projection, context) => {
  if (projection.selectedManifest.depth !== projection.selectedDepth) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Selected learning manifest must match selected depth.' });
  }
  const depths = projection.availableManifests.map((manifest) => manifest.depth);
  if (new Set(depths).size !== 6) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'All six learning depths must be represented exactly once.' });
  }
  projection.availableManifests.forEach((manifest, index) => {
    const included = new Set(manifest.includedSections);
    if (manifest.redactedSections.some((section) => included.has(section))) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['availableManifests', index], message: 'Included and redacted sections must not overlap.' });
    }
  });
});

export type StemLearningProjection = z.infer<typeof StemLearningProjectionSchema>;
export type StemLearningDepth = z.infer<typeof StemLearningDepthSchema>;
