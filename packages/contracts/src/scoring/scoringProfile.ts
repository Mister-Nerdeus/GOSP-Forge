import { z } from 'zod';
import { IdSchema, VersionSchema } from '../shared/primitives.js';
import { findSponsorScoringInfluence } from '../sponsorship/sponsorInfluenceCheck.js';
import { ScoringComponentSchema } from './scoringComponent.js';
export const ScoringProfileSchema = z
  .object({
    kind: z.literal('ScoringProfile').default('ScoringProfile'),
    id: IdSchema,
    version: VersionSchema,
    components: z.array(ScoringComponentSchema).min(1),
    sponsorNeutral: z.literal(true),
  })
  .superRefine((v, c) => {
    for (const diagnostic of findSponsorScoringInfluence(v)) {
      c.addIssue({
        code: z.ZodIssueCode.custom,
        message: diagnostic.message,
        path: ['components', diagnostic.componentId, diagnostic.field],
      });
    }
  });
