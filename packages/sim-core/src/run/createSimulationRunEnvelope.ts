import { SimulationRunEnvelopeSchema } from '@gosp/contracts';
import { createCleanWaterImpactReport } from '../cleanWater/impactReport.js';
import { stableStringify } from '../hash/stableStringify.js';
import { sha256 } from '../hash/sha256.js';
export function createSimulationRunEnvelope(input: {
  runId: string;
  projectId: string;
  moduleIds: string[];
  modelVersion: string;
  assumptions: Array<{ id: string; description: string; value?: unknown; unit?: string }>;
  output: unknown;
  warnings?: Array<{ code: string; message: string; severity: 'info' | 'warning' | 'blocker' }>;
  unknownInputs?: string[];
  defaultedInputs?: string[];
  confidence?: { level: 'low' | 'medium' | 'high' | 'reviewed'; rationale: string };
  limitations?: Array<{ id: string; description: string }>;
  impacts?: ReturnType<typeof createCleanWaterImpactReport>;
}) {
  const impacts =
    input.impacts ??
    createCleanWaterImpactReport(
      input.output as Parameters<typeof createCleanWaterImpactReport>[0],
    );
  const envelope = {
    kind: 'SimulationRunEnvelope' as const,
    runId: input.runId,
    projectId: input.projectId,
    moduleIds: input.moduleIds,
    inputHash: sha256(
      stableStringify({
        projectId: input.projectId,
        moduleIds: input.moduleIds,
        assumptions: input.assumptions,
      }),
    ),
    outputHash: sha256(stableStringify(input.output)),
    modelVersion: input.modelVersion,
    fidelityLevel: 'level-1-screening' as const,
    assumptions: input.assumptions,
    units: { flow: 'L/min', power: 'W' },
    sourceRefs: [],
    unknownInputs: input.unknownInputs ?? [],
    defaultedInputs: input.defaultedInputs ?? [],
    confidence: input.confidence ?? {
      level: 'medium' as const,
      rationale: 'Foundation deterministic screening model.',
    },
    warnings: input.warnings ?? [],
    limitations: input.limitations ?? [
      {
        id: 'no-potable-claim',
        description: 'This run does not certify potable water or professional use.',
      },
    ],
  };
  return { ...SimulationRunEnvelopeSchema.parse(envelope), impacts };
}
