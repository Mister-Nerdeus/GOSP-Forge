import { describe, expect, it } from 'vitest';
import { resolveProjectRefs } from './refResolver.js';

describe('resolveProjectRefs', () => {
  it('fails missing required refs', () => {
    const result = resolveProjectRefs({
      refs: [
        {
          id: 'missing-required-module',
          kind: 'module',
          path: 'examples/modules/missing-required-module.module.json',
          required: true,
        },
      ],
    });

    expect(result.errors).toEqual([
      expect.objectContaining({
        code: 'required-ref-missing',
        refId: 'missing-required-module',
      }),
    ]);
    expect(result.warnings).toEqual([]);
  });

  it('fails refs that point to the wrong schema kind', () => {
    const result = resolveProjectRefs({
      refs: [
        {
          id: 'pump',
          kind: 'product',
          path: 'examples/modules/water/pump.module.json',
          required: true,
        },
      ],
    });

    expect(result.errors).toEqual([
      expect.objectContaining({
        code: 'wrong-ref-kind',
        refId: 'pump',
        refKind: 'product',
      }),
    ]);
  });

  it('warns for missing optional refs without failing', () => {
    const result = resolveProjectRefs({
      refs: [
        {
          id: 'missing-optional-module',
          kind: 'module',
          path: 'examples/modules/missing-optional-module.module.json',
          required: false,
        },
      ],
    });

    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([
      expect.objectContaining({
        code: 'optional-ref-missing',
        refId: 'missing-optional-module',
      }),
    ]);
  });

  it('validates import refs with import schemas', () => {
    const result = resolveProjectRefs({
      refs: [
        {
          id: 'open-know-how-reference-import',
          kind: 'import',
          path: 'examples/imports/open-know-how.example.json',
          required: true,
        },
      ],
    });

    expect(result.errors).toEqual([]);
    expect(result.resolved).toEqual([
      expect.objectContaining({
        id: 'open-know-how-reference-import',
        kind: 'import',
      }),
    ]);
  });

  it('rejects invalid public import records', () => {
    const result = resolveProjectRefs({
      refs: [
        {
          id: 'unlicensed-public-import-invalid',
          kind: 'import',
          path: 'examples/imports/unlicensed.invalid.json',
          required: true,
        },
      ],
    });

    expect(result.errors).toEqual([
      expect.objectContaining({
        code: 'wrong-ref-kind',
        refId: 'unlicensed-public-import-invalid',
        refKind: 'import',
      }),
    ]);
  });
});
