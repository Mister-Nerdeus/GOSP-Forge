import { InterfaceSchema, SystemElementSchema, type Interface, type SystemElement } from '@gosp/contracts';

const provenance = {
  sources: [], method: 'authored' as const,
  notes: ['Synthetic system declaration owned by the retractable-solar validation adapter.'],
};

export function createSolarDeploymentStemSystemDefinition(revision = '0.1.0'): {
  systemElements: SystemElement[];
  interfaces: Interface[];
} {
  const elementRef = (id: string) => ({ kind: 'SystemElement' as const, id, revision });
  const systemElements = [
    SystemElementSchema.parse({ kind: 'SystemElement', id: 'solar-panel', revision, provenance, name: 'Synthetic flexible photovoltaic panel', elementType: 'physical', status: 'active' }),
    SystemElementSchema.parse({ kind: 'SystemElement', id: 'retraction-mechanism', revision, provenance, name: 'Retractable support and drive concept', elementType: 'physical', status: 'active' }),
    SystemElementSchema.parse({ kind: 'SystemElement', id: 'storm-controller', revision, provenance, name: 'Modeled sensing and stow control', elementType: 'hybrid', status: 'active' }),
  ];
  const interfaces = [
    InterfaceSchema.parse({ kind: 'Interface', id: 'interface.solar.panel-to-deployment', revision, provenance, name: 'Panel mechanical attachment', interfaceType: 'physical', from: elementRef('solar-panel'), to: elementRef('retraction-mechanism'), direction: 'bidirectional', unit: 'm', status: 'active' }),
    InterfaceSchema.parse({ kind: 'Interface', id: 'interface.solar.controller-to-deployment', revision, provenance, name: 'Modeled stow command', interfaceType: 'control', from: elementRef('storm-controller'), to: elementRef('retraction-mechanism'), direction: 'unidirectional', status: 'active' }),
    InterfaceSchema.parse({ kind: 'Interface', id: 'interface.solar.panel-power-output', revision, provenance, name: 'Modeled panel power output', interfaceType: 'power', from: elementRef('solar-panel'), to: elementRef('storm-controller'), direction: 'unidirectional', unit: 'W', status: 'active' }),
  ];
  return { systemElements, interfaces };
}
