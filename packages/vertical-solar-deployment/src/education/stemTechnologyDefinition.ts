import { StemTechnologyDefinitionSchema, type StemTechnologyDefinition } from '@gosp/contracts';

const unknownProduct = {
  productProvenanceStatus: 'not-declared' as const,
  productSourceRefs: [],
  availabilityStatus: 'not-checked' as const,
  compatibilityStatus: 'not-checked' as const,
  safetyStatus: 'not-assessed' as const,
};

export function createSolarDeploymentStemTechnologyDefinition(): StemTechnologyDefinition {
  return StemTechnologyDefinitionSchema.parse({
    nodes: [
      {
        id: 'technology.solar.panel', name: 'Synthetic photovoltaic panel role', category: 'power',
        purpose: 'Provide the controlled rated-power context for the screening model.', declarationStatus: 'declared', systemElementId: 'solar-panel',
        purposeLinks: [{ kind: 'model-step', targetId: 'solar.power', explanation: 'Supplies the controlled power-rating term.', declarationStatus: 'declared' }],
        propertyEvidence: [{ property: 'rated power', representedValue: '200 W synthetic input', status: 'assumed', sourceRefs: [] }], ...unknownProduct,
      },
      {
        id: 'technology.solar.retraction', name: 'Retraction actuator role', category: 'actuator',
        purpose: 'Represent the candidate stow-time and roll-radius choices.', declarationStatus: 'declared', systemElementId: 'retraction-mechanism',
        purposeLinks: [{ kind: 'model-step', targetId: 'solar.stow-margin', explanation: 'Supplies the candidate stow duration.', declarationStatus: 'declared' }, { kind: 'model-step', targetId: 'solar.bend-margin', explanation: 'Supplies the candidate core radius.', declarationStatus: 'declared' }],
        propertyEvidence: [{ property: 'stow duration and core radius', representedValue: 'Synthetic candidate inputs', status: 'assumed', sourceRefs: [] }], ...unknownProduct,
      },
      {
        id: 'technology.solar.controller', name: 'Storm-stow controller role', category: 'controller',
        purpose: 'Represent modeled trigger and latency behavior.', declarationStatus: 'declared', systemElementId: 'storm-controller',
        purposeLinks: [{ kind: 'control-action', targetId: 'control.solar.stow', explanation: 'Initiates the modeled stow response.', declarationStatus: 'declared' }],
        propertyEvidence: [{ property: 'latency', representedValue: 'Synthetic input only', status: 'assumed', sourceRefs: [] }], ...unknownProduct,
      },
      {
        id: 'technology.solar.wind-sensor', name: 'Wind sensor role', category: 'sensor',
        purpose: 'Support a future physical trigger observation.', declarationStatus: 'conceptual',
        purposeLinks: [{ kind: 'measurement', targetId: 'measurement.solar.wind', explanation: 'Would measure wind independently of the model.', declarationStatus: 'not-declared' }],
        propertyEvidence: [], ...unknownProduct,
      },
      {
        id: 'technology.solar.power-instrument', name: 'Electrical power instrument role', category: 'instrument',
        purpose: 'Support a future physical power comparison.', declarationStatus: 'conceptual',
        purposeLinks: [{ kind: 'measurement', targetId: 'measurement.solar.power', explanation: 'Would measure physical output rather than reuse the calculation.', declarationStatus: 'not-declared' }],
        propertyEvidence: [], ...unknownProduct,
      },
      {
        id: 'technology.solar.solver', name: 'Solar deployment screening solver', category: 'solver',
        purpose: 'Execute the recorded reduced-order equations.', declarationStatus: 'declared',
        purposeLinks: [{ kind: 'model-step', targetId: 'solar.power', explanation: 'Executes the declared power screen.', declarationStatus: 'declared' }],
        propertyEvidence: [{ property: 'implementation identity', representedValue: 'gosp.vertical.solar-deployment.screening-solver@0.1.0', status: 'authored', sourceRefs: [] }],
        productProvenanceStatus: 'not-applicable', productSourceRefs: [], availabilityStatus: 'not-checked', compatibilityStatus: 'not-checked', safetyStatus: 'not-assessed',
      },
    ],
    disclosures: [
      'No manufacturer, product, availability, compatibility, or safety provenance is declared.',
      'Conceptual sensor and instrument roles are not current system components.',
      'Technology mapping is not endorsement, procurement advice, certification, or physical verification.',
    ],
  });
}
