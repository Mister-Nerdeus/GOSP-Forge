export function replacementCount(
  horizonYears: number,
  intervalYears?: number,
): { count: number; warning?: string } {
  if (!intervalYears)
    return { count: 0, warning: 'Missing replacement interval lowers confidence.' };
  return { count: Math.floor(horizonYears / intervalYears) };
}
