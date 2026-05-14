export function applyProductSpecEffects(
  specs: Array<{ id: string; value: unknown; meaning?: { targetField: string } }>,
  target: Record<string, unknown>,
): Record<string, unknown> {
  const next = { ...target };
  for (const spec of specs)
    if (spec.meaning?.targetField) next[spec.meaning.targetField] = spec.value;
  return next;
}
