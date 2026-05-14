import { z } from 'zod';
export const IsoDateTimeSchema = z.string().datetime({ offset: true });
export const TimestampedSchema = z.object({
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema.optional(),
});
