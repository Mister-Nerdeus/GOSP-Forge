import { z } from 'zod';
export const ModerationStatusSchema = z.enum(['pending', 'approved', 'restricted', 'removed']);
