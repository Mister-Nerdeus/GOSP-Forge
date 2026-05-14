import { estimateFabricationFromProfile } from '@gosp/fabrication';
import { buildBom } from './buildBom.js';
import type { BomBuildResult, BomInputLine } from './bomTypes.js';

type RefDocument = {
  id: string;
  kind: string;
  value: unknown;
};

type ProductBindingLike = {
  kind: 'ProductBinding';
  id: string;
  name: string;
  moduleIds?: string[];
  quantity?: number;
  unit?: string;
};

type ModulePackageLike = {
  kind: 'ModulePackage';
  id: string;
  name: string;
  capabilities?: {
    requiresFabrication?: boolean;
  };
  fabricationProfile?: {
    materials?: Array<{
      id: string;
      name: string;
      unit: string;
      quantity: number;
    }>;
    routes?: Array<{
      process: string;
      machineTimeMinutes?: number;
      laborMinutes?: number;
    }>;
    labor?: {
      setupMinutes?: number;
      assemblyMinutes?: number;
      inspectionMinutes?: number;
    };
  };
  quantity?: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isProductBinding(value: unknown): value is ProductBindingLike {
  return isRecord(value) && value.kind === 'ProductBinding';
}

function isModulePackage(value: unknown): value is ModulePackageLike {
  return isRecord(value) && value.kind === 'ModulePackage';
}

export function buildBomFromProject(input: { refs: RefDocument[] }): BomBuildResult {
  const lines: BomInputLine[] = [];
  const warnings: string[] = [];
  const defaultedQuantityIds = new Set<string>();

  for (const ref of input.refs) {
    if (ref.kind === 'product' && isProductBinding(ref.value)) {
      const quantity = typeof ref.value.quantity === 'number' ? ref.value.quantity : 1;
      if (typeof ref.value.quantity !== 'number') {
        warnings.push(`Missing quantity for product ${ref.value.id}; defaulted to 1 each.`);
        defaultedQuantityIds.add(ref.value.id);
      }
      lines.push({
        id: ref.value.id,
        kind: 'product',
        description: ref.value.name,
        quantity,
        unit: ref.value.unit ?? 'each',
        sourceModuleId: ref.value.moduleIds?.[0],
      });
    }

    if (ref.kind === 'module' && isModulePackage(ref.value) && ref.value.fabricationProfile) {
      const moduleValue = ref.value;
      const fabricationProfile = moduleValue.fabricationProfile;
      if (!fabricationProfile) continue;
      const moduleQuantity = typeof moduleValue.quantity === 'number' ? moduleValue.quantity : 1;
      const fabrication = estimateFabricationFromProfile(fabricationProfile);
      warnings.push(
        ...fabrication.warnings.map((warning) => `${moduleValue.id}: ${warning}`),
      );
      if (moduleValue.capabilities?.requiresFabrication) {
        if (typeof moduleValue.quantity !== 'number') {
          warnings.push(`Missing quantity for fabricated module ${moduleValue.id}; defaulted to 1 each.`);
          defaultedQuantityIds.add(moduleValue.id);
        }
        lines.push({
          id: moduleValue.id,
          kind: 'custom-part',
          description: moduleValue.name,
          quantity: moduleQuantity,
          unit: 'each',
          sourceModuleId: moduleValue.id,
        });
      }

      for (const material of fabrication.materials) {
        lines.push({
          id: `${moduleValue.id}:${material.id}`,
          kind: 'material',
          description: `${moduleValue.name}: ${material.name}`,
          quantity: material.quantity * moduleQuantity,
          unit: material.unit,
          sourceModuleId: moduleValue.id,
        });
      }

      if (fabrication.machineTimeMinutes > 0) {
        lines.push({
          id: `${moduleValue.id}:machine-time`,
          kind: 'process',
          description: `${moduleValue.name}: machine time`,
          quantity: fabrication.machineTimeMinutes * moduleQuantity,
          unit: 'minute',
          sourceModuleId: moduleValue.id,
        });
      }

      if (fabrication.laborMinutes > 0) {
        lines.push({
          id: `${moduleValue.id}:labor`,
          kind: 'labor',
          description: `${moduleValue.name}: labor time`,
          quantity: fabrication.laborMinutes * moduleQuantity,
          unit: 'minute',
          sourceModuleId: moduleValue.id,
        });
      }
    }
  }

  const bom = buildBom(lines);
  return {
    lines: bom.lines.map((line) =>
      defaultedQuantityIds.has(line.id)
        ? {
            ...line,
            confidence: {
              level: 'low' as const,
              rationale: 'Quantity defaulted from manifest ref; explicit quantity missing.',
            },
          }
        : line,
    ),
    warnings: [...warnings, ...bom.warnings],
  };
}
