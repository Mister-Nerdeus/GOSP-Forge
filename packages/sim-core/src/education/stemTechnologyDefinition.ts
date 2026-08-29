import { StemTechnologyDefinitionSchema, type StemTechnologyDefinition } from '@gosp/contracts';

export function createSandboxStemTechnologyDefinition(): StemTechnologyDefinition {
  return StemTechnologyDefinitionSchema.parse({
    nodes: [{
      id: 'technology.sandbox.solver',
      name: 'Sandbox reference solver',
      category: 'solver',
      purpose: 'Execute the recorded deterministic weighted-sum model.',
      declarationStatus: 'declared',
      purposeLinks: [{
        kind: 'model-step',
        targetId: 'sandbox-001.weighted-sum',
        explanation: 'Implements the declared weighted-sum relationship.',
        declarationStatus: 'declared',
      }],
      propertyEvidence: [{
        property: 'implementation identity',
        representedValue: 'solver.sandbox-001@1.0.0',
        status: 'authored',
        sourceRefs: [],
      }],
      productProvenanceStatus: 'not-applicable',
      productSourceRefs: [],
      availabilityStatus: 'not-checked',
      compatibilityStatus: 'not-checked',
      safetyStatus: 'not-assessed',
    }],
    disclosures: [
      'The sandbox solver is software identity for a synthetic benchmark, not a product recommendation.',
      'Listing a technology does not establish availability, compatibility, safety, endorsement, or verification.',
    ],
  });
}
