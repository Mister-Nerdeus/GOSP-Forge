import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const prohibitedTerms = [
  ['clean', 'water'].join(''),
  ['clean', '-', 'water'].join(''),
  'potable',
  'turbidity',
  ['house', 'sim'].join(''),
  'bedroom',
  ['heat', 'pump'].join(''),
  ['pump', 'flow', 'lpm'].join(''),
  ['filter', 'capacity', 'l'].join(''),
  ['filter', 'efficiency'].join(''),
  ['turbidity', 'range'].join(''),
  ['is', 'water', 'module'].join(''),
  'photovoltaic',
  ['solar', 'deployment'].join(''),
  ['solar', '-', 'deployment'].join(''),
  'irradiancewm2',
  'minimumbendradiusm',
  'windstowtriggermps',
];

function sourceFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    if (!entry.name.endsWith('.ts') || entry.name.endsWith('.test.ts')) return [];
    return [full];
  });
}

describe('generic core boundary', () => {
  it('contains no vertical-specific terminology or imports across declared core packages', () => {
    const coreSources = [path.resolve('src'), path.resolve('../contracts/src')];
    const findings = coreSources.flatMap(sourceFiles).flatMap((file) => {
      const text = fs.readFileSync(file, 'utf8').toLowerCase();
      return prohibitedTerms
        .filter((term) => text.includes(term))
        .map((term) => `${path.relative(process.cwd(), file)}: ${term}`);
    });
    expect(findings).toEqual([]);
  });
});
