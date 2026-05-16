import { describe, expect, it } from 'vitest';
import { createGospServer } from '../server.js';
import { validateProjectBody } from './validate.js';

const validProject = {
  kind: 'ProjectManifestV2',
  manifestVersion: '2',
  id: 'api-validated-project',
  version: '0.1.0',
  title: 'API Validated Project',
  mode: 'education',
  design: {
    title: 'API route validation fixture',
    status: 'draft',
  },
};

describe('validate route', () => {
  it('validates ProjectManifestV2 bodies', () => {
    expect(validateProjectBody(validProject)).toMatchObject({
      status: 200,
      body: {
        ok: true,
        schema: 'ProjectManifestV2',
        validationMode: 'schema-only',
        warnings: [
          expect.objectContaining({
            code: 'api-schema-only-no-repo-refs',
            message: 'API validation does not resolve repository refs in this foundation build.',
            severity: 'warning',
            source: 'mode',
          }),
        ],
      },
    });
  });

  it('does not describe unresolved refs as fully validated in schema-only mode', () => {
    const result = validateProjectBody({
      ...validProject,
      refGroups: {
        modules: [
          {
            id: 'missing-module',
            kind: 'module',
            path: 'examples/modules/water/not-present.module.json',
            required: true,
          },
        ],
      },
    });

    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({
      ok: true,
      validationMode: 'schema-only',
      warnings: [expect.objectContaining({ code: 'api-schema-only-no-repo-refs' })],
    });
  });

  it('validates known repo refs only in local repo mode', () => {
    const result = validateProjectBody(
      {
        ...validProject,
        refGroups: {
          modules: [
            {
              id: 'pump',
              kind: 'module',
              path: 'examples/modules/water/pump.module.json',
              required: true,
            },
          ],
        },
      },
      { mode: 'repo' },
    );

    expect(result).toMatchObject({
      status: 200,
      body: {
        ok: true,
        validationMode: 'repo-refs',
        refs: { resolved: 1 },
      },
    });
  });

  it('blocks repo-ref validation in production by default', () => {
    const previousNodeEnv = process.env.NODE_ENV;
    const previousOverride = process.env.GOSP_API_ENABLE_REPO_VALIDATION;
    process.env.NODE_ENV = 'production';
    delete process.env.GOSP_API_ENABLE_REPO_VALIDATION;

    try {
      const result = validateProjectBody(
        {
          ...validProject,
          refGroups: {
            modules: [
              {
                id: 'pump',
                kind: 'module',
                path: 'examples/modules/water/pump.module.json',
                required: true,
              },
            ],
          },
        },
        { mode: 'repo' },
      );

      expect(result).toMatchObject({
        status: 403,
        body: {
          ok: false,
          validationMode: 'repo-refs',
          errors: [expect.objectContaining({ code: 'repo-validation-disabled' })],
        },
      });
    } finally {
      if (previousNodeEnv === undefined) {
        delete process.env.NODE_ENV;
      } else {
        process.env.NODE_ENV = previousNodeEnv;
      }
      if (previousOverride === undefined) {
        delete process.env.GOSP_API_ENABLE_REPO_VALIDATION;
      } else {
        process.env.GOSP_API_ENABLE_REPO_VALIDATION = previousOverride;
      }
    }
  });

  it('allows repo-ref validation in production only with explicit internal override', () => {
    const previousNodeEnv = process.env.NODE_ENV;
    const previousOverride = process.env.GOSP_API_ENABLE_REPO_VALIDATION;
    process.env.NODE_ENV = 'production';
    process.env.GOSP_API_ENABLE_REPO_VALIDATION = '1';

    try {
      const result = validateProjectBody(
        {
          ...validProject,
          refGroups: {
            modules: [
              {
                id: 'pump',
                kind: 'module',
                path: 'examples/modules/water/pump.module.json',
                required: true,
              },
            ],
          },
        },
        { mode: 'repo' },
      );

      expect(result).toMatchObject({
        status: 200,
        body: {
          ok: true,
          validationMode: 'repo-refs',
          refs: { resolved: 1 },
        },
      });
    } finally {
      if (previousNodeEnv === undefined) {
        delete process.env.NODE_ENV;
      } else {
        process.env.NODE_ENV = previousNodeEnv;
      }
      if (previousOverride === undefined) {
        delete process.env.GOSP_API_ENABLE_REPO_VALIDATION;
      } else {
        process.env.GOSP_API_ENABLE_REPO_VALIDATION = previousOverride;
      }
    }
  });

  it('blocks path traversal attempts in repo mode', () => {
    const result = validateProjectBody(
      {
        ...validProject,
        refGroups: {
          modules: [
            {
              id: 'secret',
              kind: 'module',
              path: '../package.json',
              required: true,
            },
          ],
        },
      },
      { mode: 'repo' },
    );

    expect(result.status).toBe(422);
    expect(result.body.errors).toEqual([
      expect.objectContaining({ code: 'required-ref-missing', refId: 'secret' }),
    ]);
  });

  it('keeps optional missing repo refs as warnings', () => {
    const result = validateProjectBody(
      {
        ...validProject,
        refGroups: {
          modules: [
            {
              id: 'optional-missing',
              kind: 'module',
              path: 'examples/modules/water/not-present.module.json',
              required: false,
            },
          ],
        },
      },
      { mode: 'repo' },
    );

    expect(result).toMatchObject({
      status: 200,
      body: {
        ok: true,
        refs: { resolved: 0 },
        errors: [],
        warnings: [expect.objectContaining({ code: 'optional-ref-missing' })],
      },
    });
  });

  it('does not count wrong-kind repo refs as resolved', () => {
    const result = validateProjectBody(
      {
        ...validProject,
        refGroups: {
          products: [
            {
              id: 'pump',
              kind: 'product',
              path: 'examples/modules/water/pump.module.json',
              required: true,
            },
          ],
        },
      },
      { mode: 'repo' },
    );

    expect(result).toMatchObject({
      status: 422,
      body: {
        ok: false,
        refs: { resolved: 0 },
        errors: [expect.objectContaining({ code: 'wrong-ref-kind' })],
      },
    });
  });

  it('returns 422 for invalid project manifests', () => {
    const result = validateProjectBody({ ...validProject, id: '' });

    expect(result).toMatchObject({
      status: 422,
      body: {
        ok: false,
        schema: 'ProjectManifestV2',
      },
    });
    expect(result.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'schema-invalid' })]),
    );
  });

  it('returns HTTP 422 for invalid project manifests', async () => {
    const server = createGospServer();
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Expected TCP listener');

    try {
      const response = await fetch(`http://127.0.0.1:${address.port}/validate`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...validProject, id: '' }),
      });
      const body = await response.json();

      expect(response.status).toBe(422);
      expect(body).toMatchObject({ ok: false, schema: 'ProjectManifestV2' });
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    }
  });
});
