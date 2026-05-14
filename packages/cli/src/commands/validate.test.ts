import { describe, expect, it } from 'vitest';
import { validateCommand } from './validate.js';

describe('validateCommand ref fixtures', () => {
  it('returns stable JSON errors for a missing required ref', () => {
    const result = validateCommand('examples/projects/invalid-missing-required-ref.project-v2.json');

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual([
      expect.objectContaining({
        code: 'required-ref-missing',
        refId: 'missing-required-module',
      }),
    ]);
  });

  it('returns stable JSON errors for a wrong-kind ref', () => {
    const result = validateCommand('examples/projects/invalid-wrong-ref-kind.project-v2.json');

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual([
      expect.objectContaining({
        code: 'wrong-ref-kind',
        refId: 'pump',
        refKind: 'product',
      }),
    ]);
  });

  it('returns warnings, not errors, for a missing optional ref', () => {
    const result = validateCommand('examples/projects/valid-optional-missing-ref.project-v2.json');

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([
      expect.objectContaining({
        code: 'optional-ref-missing',
        refId: 'missing-optional-module',
      }),
    ]);
  });
});
