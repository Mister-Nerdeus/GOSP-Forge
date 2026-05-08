import { z } from 'zod'; export const DesignModeSchema=z.enum(['dream','education','scoring','professional','research']); export type DesignMode=z.infer<typeof DesignModeSchema>;
