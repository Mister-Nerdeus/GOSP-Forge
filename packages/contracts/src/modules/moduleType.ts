import { z } from 'zod';
export const ModuleTypeSchema = z.enum([
  'physical',
  'digital',
  'logical',
  'process',
  'service',
  'economic',
  'biological',
  'hybrid',
]);
