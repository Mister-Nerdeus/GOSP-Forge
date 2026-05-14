import { z } from 'zod';
export const RepresentationProfileSchema = z.object({
  representations: z
    .array(
      z.enum(['none', 'symbolic', 'node-graph', 'dashboard', 'proxy-3d', 'mesh-3d', 'document']),
    )
    .default(['none']),
  primary: z
    .enum(['none', 'symbolic', 'node-graph', 'dashboard', 'proxy-3d', 'mesh-3d', 'document'])
    .default('none'),
});
