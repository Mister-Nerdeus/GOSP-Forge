import { z } from 'zod'; export const ModuleTrustLevelSchema=z.enum(['draft','simulated','fabricated','tested','reviewed','field-used','restricted','deprecated','removed']);
