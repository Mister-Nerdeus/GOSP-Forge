import { ProductSpecTargetFields } from '@gosp/contracts';

type ProductSpecEffectWarning = {
  code: string;
  message: string;
  severity: 'info' | 'warning' | 'blocker';
};

const allowedTargets = new Set<string>(ProductSpecTargetFields);

export function applyProductSpecEffects(
  specs: Array<{
    id: string;
    value: unknown;
    meaning?: { affects?: string[]; targetField?: string };
  }>,
  target: Record<string, unknown>,
): { target: Record<string, unknown>; warnings: ProductSpecEffectWarning[] } {
  const next = { ...target };
  const warnings: ProductSpecEffectWarning[] = [];
  for (const spec of specs) {
    if (spec.meaning?.affects && !spec.meaning.affects.includes('simulation')) continue;
    if (!spec.meaning?.targetField) continue;
    if (!allowedTargets.has(spec.meaning.targetField)) {
      warnings.push({
        code: 'unknown-product-spec-target',
        message: `Spec "${spec.id}" targets unknown field "${spec.meaning.targetField}".`,
        severity: 'warning',
      });
      continue;
    }
    next[spec.meaning.targetField] = spec.value;
  }
  return { target: next, warnings };
}
