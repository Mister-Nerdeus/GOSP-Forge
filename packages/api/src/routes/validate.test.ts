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
        projectId: 'api-validated-project',
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
