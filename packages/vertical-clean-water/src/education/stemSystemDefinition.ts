import {
  InterfaceSchema,
  SystemElementSchema,
  type Interface,
  type SystemElement,
} from '@gosp/contracts';

const provenance = {
  sources: [],
  method: 'authored' as const,
  notes: ['Synthetic educational system declaration for the local Clean Water adapter.'],
};

const ref = (id: string, revision: string) => ({
  kind: 'SystemElement' as const,
  id,
  revision,
});

export function createCleanWaterStemSystemDefinition(revision = '1.0.0'): {
  systemElements: SystemElement[];
  interfaces: Interface[];
} {
  const systemElements = [
    SystemElementSchema.parse({
      kind: 'SystemElement',
      id: 'source',
      revision,
      provenance,
      name: 'Source reservoir and low-voltage supply',
      elementType: 'hybrid',
      status: 'active',
    }),
    SystemElementSchema.parse({
      kind: 'SystemElement',
      id: 'pump',
      revision,
      provenance,
      name: 'Water pump',
      elementType: 'physical',
      status: 'active',
    }),
    SystemElementSchema.parse({
      kind: 'SystemElement',
      id: 'filter',
      revision,
      provenance,
      name: 'Educational filter stage',
      elementType: 'process',
      status: 'active',
    }),
  ];
  const interfaces = [
    InterfaceSchema.parse({
      kind: 'Interface',
      id: 'interface.clean-water.source-to-pump.water',
      revision,
      provenance,
      name: 'Source water supplied to pump',
      interfaceType: 'resource',
      from: ref('source', revision),
      to: ref('pump', revision),
      direction: 'unidirectional',
      unit: 'L',
      status: 'active',
    }),
    InterfaceSchema.parse({
      kind: 'Interface',
      id: 'interface.clean-water.source-to-pump.power',
      revision,
      provenance,
      name: 'Low-voltage power supplied to pump',
      interfaceType: 'power',
      from: ref('source', revision),
      to: ref('pump', revision),
      direction: 'unidirectional',
      unit: 'V',
      status: 'active',
    }),
    InterfaceSchema.parse({
      kind: 'Interface',
      id: 'interface.clean-water.pump-to-filter.water',
      revision,
      provenance,
      name: 'Pumped water enters educational filter stage',
      interfaceType: 'resource',
      from: ref('pump', revision),
      to: ref('filter', revision),
      direction: 'unidirectional',
      unit: 'L/min',
      status: 'active',
    }),
  ];
  return { systemElements, interfaces };
}
