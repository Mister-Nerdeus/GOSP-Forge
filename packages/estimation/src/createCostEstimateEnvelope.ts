import { CostEstimateEnvelopeSchema, type CostEstimateEnvelope } from '@gosp/contracts';

function warningCode(message: string, index: number): string {
  const normalized = message
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
  return normalized || `estimate-warning-${index + 1}`;
}

export function createCostEstimateEnvelope(input: {
  estimate: CostEstimateEnvelope['estimate'];
  warnings?: string[];
}): CostEstimateEnvelope {
  return CostEstimateEnvelopeSchema.parse({
    kind: 'CostEstimateEnvelope',
    estimateClass: 'educational-concept',
    estimate: input.estimate,
    confidence: input.estimate.confidence,
    assumptions: input.estimate.assumptions,
    sourceRefs: input.estimate.sourceRefs,
    warnings: (input.warnings ?? []).map((message, index) => ({
      code: warningCode(message, index),
      message,
      severity: 'warning',
    })),
    limitations: [
      {
        id: 'not-professional-estimate',
        description: 'This estimate is educational and conceptual, not professional review.',
      },
      {
        id: 'not-procurement-or-permit-ready',
        description: 'This estimate is not a quote, procurement instruction, or permit-ready output.',
      },
    ],
  });
}
