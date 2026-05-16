export type ClassroomPriceEntry = {
  id: string;
  unitCost: number;
  currency: 'USD';
  source: string;
  assumption: string;
};

export const defaultClassroomPricePack = {
  id: 'default-classroom-price-pack',
  version: '0.1.0',
  currency: 'USD' as const,
  entries: [
    {
      id: 'basic-water-quality-sensor',
      unitCost: 12,
      currency: 'USD' as const,
      source: 'foundation-classroom-assumption',
      assumption: 'Generic classroom sensor allowance.',
    },
    {
      id: 'classroom-battery-pack',
      unitCost: 14,
      currency: 'USD' as const,
      source: 'foundation-classroom-assumption',
      assumption: 'Generic protected low-voltage battery pack allowance.',
    },
    {
      id: 'classroom-diaphragm-pump',
      unitCost: 18,
      currency: 'USD' as const,
      source: 'foundation-classroom-assumption',
      assumption: 'Generic classroom pump allowance.',
    },
    {
      id: 'filter-housing',
      unitCost: 0,
      currency: 'USD' as const,
      source: 'foundation-classroom-assumption',
      assumption:
        'Intentional zero-cost fabricated housing parent line; material, machine, and labor are priced separately to avoid double counting.',
    },
    {
      id: 'filter-housing:pla',
      unitCost: 0.03,
      currency: 'USD' as const,
      source: 'foundation-classroom-assumption',
      assumption: 'Approximate PLA material allowance for one classroom housing.',
    },
    {
      id: 'filter-housing:machine-time',
      unitCost: 0.05,
      currency: 'USD' as const,
      source: 'foundation-classroom-assumption',
      assumption: 'Conceptual classroom machine-time allowance per minute.',
    },
    {
      id: 'filter-housing:labor',
      unitCost: 0.25,
      currency: 'USD' as const,
      source: 'foundation-classroom-assumption',
      assumption: 'Conceptual supervised classroom labor allowance per minute.',
    },
    {
      id: 'filter-media-cartridge',
      unitCost: 8,
      currency: 'USD' as const,
      source: 'foundation-classroom-assumption',
      assumption: 'Generic classroom filter media allowance.',
    },
  ] satisfies ClassroomPriceEntry[],
};
