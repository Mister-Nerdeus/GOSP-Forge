import { z } from 'zod'; import { IdSchema } from '../shared/primitives.js';
export const ModulePortSchema=z.object({id:IdSchema,kind:z.enum(['resource','power','control','data','process']),direction:z.enum(['input','output','bidirectional']),unit:z.string().optional()});
