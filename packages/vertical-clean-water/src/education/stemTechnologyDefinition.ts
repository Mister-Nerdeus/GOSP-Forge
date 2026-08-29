import { StemTechnologyDefinitionSchema, type StemTechnologyDefinition } from '@gosp/contracts';

const noProduct = {
  productProvenanceStatus: 'not-declared' as const,
  productSourceRefs: [],
  availabilityStatus: 'not-checked' as const,
  compatibilityStatus: 'not-checked' as const,
  safetyStatus: 'not-assessed' as const,
};

const conceptual = (id: string, name: string, category: 'sensor' | 'controller' | 'software' | 'communication' | 'instrument', purpose: string, kind: 'measurement' | 'control-action' | 'test-purpose', targetId: string) => ({
  id, name, category, purpose,
  declarationStatus: 'conceptual' as const,
  purposeLinks: [{ kind, targetId, explanation: purpose, declarationStatus: 'not-declared' as const }],
  propertyEvidence: [],
  ...noProduct,
});

export function createCleanWaterStemTechnologyDefinition(): StemTechnologyDefinition {
  return StemTechnologyDefinitionSchema.parse({
    nodes: [
      {
        id: 'technology.clean-water.source-power', name: 'Low-voltage source role', category: 'power',
        purpose: 'Supply the modeled electrical boundary.', declarationStatus: 'declared', systemElementId: 'source',
        purposeLinks: [{ kind: 'requirement', targetId: 'requirement.challenge.clean-water-local-demo.valid-input', explanation: 'Supports the declared valid-input boundary.', declarationStatus: 'declared' }],
        propertyEvidence: [{ property: 'voltage', representedValue: '12 V synthetic input', status: 'assumed', sourceRefs: [] }], ...noProduct,
      },
      {
        id: 'technology.clean-water.pump', name: 'Pump actuator role', category: 'actuator',
        purpose: 'Move modeled source volume toward the filter stage.', declarationStatus: 'declared', systemElementId: 'pump',
        purposeLinks: [{ kind: 'model-step', targetId: 'clean-water.flow-screen', explanation: 'Supplies the modeled pump-flow term.', declarationStatus: 'declared' }],
        propertyEvidence: [{ property: 'flow rate', representedValue: '8 L/min synthetic input', status: 'assumed', sourceRefs: [] }], ...noProduct,
      },
      {
        id: 'technology.clean-water.filter-fabrication', name: 'Educational filter-stage fabrication role', category: 'fabrication',
        purpose: 'Represent the physical stage associated with the assumed efficiency term.', declarationStatus: 'declared', systemElementId: 'filter',
        purposeLinks: [{ kind: 'model-step', targetId: 'clean-water.flow-screen', explanation: 'Provides the context for the modeled efficiency term.', declarationStatus: 'declared' }],
        propertyEvidence: [{ property: 'filter efficiency', representedValue: '0.8 baseline / 0.9 candidate', status: 'assumed', sourceRefs: [] }], ...noProduct,
      },
      conceptual('technology.clean-water.sensor', 'Water-quality sensor role', 'sensor', 'Measure a future physical observation rather than reuse calculated output.', 'measurement', 'measurement.clean-water.quality'),
      conceptual('technology.clean-water.controller', 'Controller role', 'controller', 'Apply a future declared control action.', 'control-action', 'control.clean-water.pump'),
      conceptual('technology.clean-water.software', 'Monitoring software role', 'software', 'Present future recorded measurements and control state.', 'test-purpose', 'test.clean-water.monitoring'),
      conceptual('technology.clean-water.communication', 'Communication role', 'communication', 'Carry future recorded sensor data to monitoring software.', 'test-purpose', 'test.clean-water.data-path'),
      conceptual('technology.clean-water.instrument', 'Reference instrument role', 'instrument', 'Support a future physical comparison measurement.', 'measurement', 'measurement.clean-water.reference-volume'),
      {
        id: 'technology.clean-water.solver', name: 'Clean Water screening solver', category: 'solver',
        purpose: 'Execute the recorded level-1 screening equations.', declarationStatus: 'declared',
        purposeLinks: [{ kind: 'model-step', targetId: 'clean-water.flow-screen', explanation: 'Evaluates the declared flow relationship.', declarationStatus: 'declared' }],
        propertyEvidence: [{ property: 'implementation identity', representedValue: 'gosp.vertical.clean-water.screening-solver@0.1.0', status: 'authored', sourceRefs: [] }],
        productProvenanceStatus: 'not-applicable', productSourceRefs: [], availabilityStatus: 'not-checked', compatibilityStatus: 'not-checked', safetyStatus: 'not-assessed',
      },
    ],
    disclosures: [
      'Conceptual technology roles are not declarations that a component exists in the current system.',
      'No manufacturer or product provenance is declared for this synthetic local demonstrator.',
      'Listing a component is not endorsement, availability, compatibility, safety approval, or verification.',
    ],
  });
}
