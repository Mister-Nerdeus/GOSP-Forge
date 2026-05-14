import { z } from 'zod';
import { IdSchema } from '../shared/primitives.js';
import { ExternalSourceRecordSchema } from './externalSourceRecord.js';
export const ImportRecordSchema = z
  .object({
    id: IdSchema,
    source: ExternalSourceRecordSchema,
    targetModuleId: IdSchema,
    obligations: z.array(z.string()).default([]),
  })
  .superRefine((v, c) => {
    if (!v.source.license.publicImportAllowed)
      c.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Unlicensed external content cannot be imported publicly',
      });
  });
