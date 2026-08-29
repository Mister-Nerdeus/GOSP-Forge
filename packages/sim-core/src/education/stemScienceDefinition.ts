import { StemScienceDefinitionSchema } from '@gosp/contracts';

export function createSandboxStemScienceDefinition() {
  return StemScienceDefinitionSchema.parse({
    treatment: 'synthetic-benchmark',
    items: [
      {
        id: 'sandbox.science.weighted-sum-model',
        title: 'Synthetic weighted-sum model relationship',
        classification: 'model-equation',
        statement: 'The benchmark transforms submitted unitless values using a declared deterministic equation.',
        applicability: {
          status: 'applicable',
          description: 'Applicable only to the sandbox protocol fixture and its exact recorded inputs.',
        },
        limitations: ['It is an arithmetic benchmark and is not a representation of a physical system.'],
        sourceStatus: 'model-declared',
        evidenceStatus: 'model-only',
        sourceRefs: [],
        evidenceRefs: [],
        equationIds: ['sandbox-001.weighted-sum'],
        quantityIds: ['sandbox.values', 'sandbox.weights', 'sandbox.offset', 'sandbox.scale', 'sandbox.result'],
      },
      {
        id: 'sandbox.science.binary64-assumption',
        title: 'Finite binary64 arithmetic assumption',
        classification: 'assumption',
        statement: 'Inputs are finite and the recorded calculation uses ECMAScript Number binary64 arithmetic.',
        applicability: {
          status: 'applicable',
          description: 'Applies to this evaluator execution environment.',
        },
        limitations: ['This numerical assumption supplies no physical interpretation.'],
        sourceStatus: 'assumption-declared',
        evidenceStatus: 'assumption-only',
        sourceRefs: [],
        evidenceRefs: [],
        equationIds: ['sandbox-001.weighted-sum'],
        quantityIds: [],
      },
    ],
    disclosures: [
      'Sandbox is a synthetic deterministic benchmark. No natural governing principle, empirical relationship, or physical observation is asserted.',
      'A reproduced arithmetic result is not physical validation.',
    ],
  });
}
