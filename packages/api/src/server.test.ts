import { describe, expect, it } from 'vitest';
import { createGospServer } from './server.js';

async function withServer<T>(run: (baseUrl: string) => Promise<T>) {
  const server = createGospServer();
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Expected TCP listener');

  try {
    return await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}

describe('createGospServer', () => {
  it('rejects wrong validate content type', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/validate`, {
        method: 'POST',
        headers: { 'content-type': 'text/plain' },
        body: '{}',
      });

      expect(response.status).toBe(415);
      await expect(response.json()).resolves.toMatchObject({ error: expect.any(String) });
    });
  });

  it('rejects invalid validate JSON', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/validate`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{',
      });

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toMatchObject({ error: expect.any(String) });
    });
  });
});
